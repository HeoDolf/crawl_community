// Default
const moment = require('moment');
const db = require('./../server/config/database');
const { Community, Board, Content } = require('./../server/models');
const Crawler = require('./../server/utils/Crawler');
// Socket
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')( server );
server.listen(3001, ()=>console.log("[socket-connection]"));

io.on('connection', (client)=>{
    client.emit('connected');

    client.on('join the room', (room)=>{
        console.log('[join the room]', room);
        
        client.currentRoom = room;
        client.join(room);
    });
    client.on('leave the room', ()=>{
        console.log('[leave the room]', client.currentRoom );
        
        client.leave( client.currentRoom );
    });
    client.on('change the room', ( newRoom )=>{
        console.log('[room change', client.currentRoom,'to',newRoom,']');

        client.leave( client.currentRoom );
        client.currentRoom = newRoom;
        client.join( newRoom );
    });

    client.on('disconnect', (reason)=>{
        console.log("[disconnect]", reason);
        client.emit('disconnected');
    });
});

/**
 * 여기서 어떻게 보내줄 것인가..r
 */
const DELAY = 10 * 1000;
const communityInfo = new Promise((resolve, reject)=>{
    Community.find(
        // { name: 'gezip' }
        null
    , {
        _id: 0, name: 1, board: 1
    }).populate({
        path: "board",
        select: 'name -_id'
    }).exec(function(error, communities){
        if( error ) return reject({
            errorCode: 500,
            error: error,
            msg: "Community Find Error For Crawler"
        });
        try {
            let data = [], community, board;
            for(let i = 0; i < communities.length; i++){
                community = communities[i];
                for(let j = 0; j < community.board.length; j++){
                    board = community.board[j];
                    data.push({
                        community: community.name,
                        board: board.name,
                        nsp: io.of(`/${community.name}/${board.name}`)
                    });
                }
            }
            resolve( data );
        } catch ( error ) {
            return reject({
                errorCode: 401,
                error: error,
                msg: "Communities Loop Error"
            });
        }
    });
}).then(( data )=>{
    try {
        // // Handle Crawler: loop
        for(let index=0; index < data.length; index++){
            // const index = 0;
            const community = data[index].community
            const board = data[index].board;

            Crawler( community, board, 0, handleCrawler );
        }
    } catch (error){
        return Promise.reject( error );
    }
}).catch((error)=>{
    // Handle Error
    console.error( error );
    process.exit();
});

function handleCrawler( error, result, info ){
    if( error ) return console.error( error );
    if( result.contents.length === 0 ){
        // Re-call: crawler
        // console.log( "No New Contents", info);
        return Crawler(info.community, info.board, DELAY, handleCrawler);
    }
    const contents = result.contents.map((el, index)=>{
        return {
            community: info.community,
            board: info.board,
            content: el,
            regDate: new Date() // ISO로 저장되며, 540분이 차이가 남
        }
    });
    try {
        Content.collection.insert(contents, (error)=>{
            if( error ) return console.error( error );
            Board.update({
                name: info.board,
                "community.name": info.community
            },{
                $set: { 
                    // (1) 2018-03-12 13:13:00  ->  (2) 2018-03-12T04:13:00Z
                    // (1) 형식의 날자 데이터는 ISO 형식으로 바뀌면서 540분이 차이가 남.
                    lastUpdate:  contents[0].content.date // + ( 540 * 60 * 1000 ); // isSeoulTime
                }
            }, function(error, updated){
                if( error ) return console.error( error );
                
                const roomName = `${info.community}_${info.board}`; 
                console.log(`[update ${roomName}]`, contents.length );

                io.to(roomName).emit( 'update content', info );
                
                return Crawler(info.community, info.board, DELAY, handleCrawler);
            });
        });
    } catch (error) {
        process.exit();
    }
}