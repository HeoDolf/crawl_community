const DATE = new Date();
const TODAY = `${DATE.getFullYear()}-${DATE.getMonth()+1}-${DATE.getDate()}`;
const bcrypt = require('bcryptjs');

module.exports = {
    'ygosu': {
        loginOption: function( user ){
            return {
                url: 'http://www.ygosu.com/login/login.yg',
                method: 'post',
                form: {
                    login_id: user.username,
                    login_pwd: user.password // Hash
                },
                errorMsg: 'login_error'
            }
        },
        getContent:( $, baseTime )=>{
            const host = "http://www.ygosu.com";
            const $list = $('table.bd_list tbody > tr:not(.notice, .notice + tr)');
            let contents = [];
            let checkNextPage = true;

            for(let i = 0; i < $list.length; i++){
                const $item = $list.eq(i);
                const cntDate = $item.children('.date').text().trim();

                let date_arr;
                if( cntDate.split(':').length > 0 ){
                    // Time
                    date_arr = [
                        TODAY,
                        cntDate
                    ]
                } else {
                    // Date
                    date_arr = [
                        cntDate.replace('.','-'),
                        "00:00:00"  // Unkwon Time
                    ]
                }
                const date = new Date(date_arr.join(' '));
                
                if( baseTime >= date.getTime() ){ 
                    checkNextPage = false;
                    break; 
                }

                contents.push({
                    no: $item.children('.no').text().trim(),
                    title: $item.find('.tit > a').text().replace(/(\t\d?|\n\d?)/g, '').trim(),
                    writer: $item.children('.name').text().replace(/(\t\d?|\n\d?)/g, '').trim(),
                    url: host + $item.find('.tit > a').first().attr('href'),
                    date: date,
                    date_arr: date_arr
                });
            }
            return {
                checkNextPage: checkNextPage,
                contents: contents
            };
        }
    },
    'gezip': {
        loginOption: function( user ){
            return {
                url: 'http://gezip.net/bbs/login_check.php',
                method: 'post',
                form: {
                    mb_id: user.username,
                    mb_password: user.password // Hash
                },
                errorMsg: 'validation_check'
            }
        },
        getContent: ( $, baseTime )=>{
            const $list = $('#list-body .list-item:not(.bg-light)');
            let contents = [];
            let checkNextPage = true;

            for(let i = 0; i < $list.length; i++){
                const $item = $list.eq(i);
                const cntDate = $item.children('.wr-date').text().trim();

                let date_arr;
                if( cntDate.split(':').length > 0 ){
                    // Time
                    // HH:MM ex) 14:30
                    date_arr = [
                        TODAY,
                        cntDate
                    ]
                } else {
                    // Date
                    // MM:DD ex) 03.12
                    date_arr = [
                        `${new Date().getFullYear()}-${cntDate.replace('.', '-')}`,
                        '00:00:00'  // Unkown Time
                    ]
                }

                const date = new Date(date_arr.join(' '));

                if( baseTime >= date.getTime() ){ 
                    checkNextPage = false;
                    break; 
                }

                contents.push({
                    no: $item.children('.wr-num').text().trim(),
                    title: $item.find('.wr-subject > a.item-subject').text().replace(/(\t\d?|\n\d?)/g, '').trim(),
                    writer: $item.find('.wr-name').text().trim(),
                    url: $item.find('.wr-subject > a.item-subject').attr('href'),
                    date: date,
                    date_arr: date_arr
                });
            }
            return {
                checkNextPage: checkNextPage,
                contents: contents
            };
        }
    },
    // TODO: Update
    'humoruniv': {
        getContent: ( $, baseTime )=>{
            const $list = $('#cnts_list_new > div:first-child > table:not(.list_hd2) > tbody > tr[id]');
            let contents = [];
            let checkNextPage = true;
        
            for(let i = 0; i < $list.length; i++){
                const $item = $list.eq(i);
                const date_arr = [ 
                    $item.find('.li_date > .w_date').text(), 
                    $item.find('.li_date > .w_time').text()
                ];
                const date = new Date(date_arr.join(' '));
        
                if( baseTime >= date.getTime() ){ 
                    checkNextPage = false;
                    break; 
                }
        
                contents.push({
                    no: $item.attr('id').split('-')[1],
                    title: $item.find('.li_sbj > a').text().split('\n')[0],
                    writer: $item.find('.li_icn .hu_nick_txt').text().trim(),
                    url: "http://web.humoruniv.com/board/humor/" + $item.find('.li_sbj > a[href]').first().attr('href'),
                    date: date,
                    date_arr: date_arr
                });
            }
            return {
                checkNextPage: checkNextPage,
                contents: contents
            };
        }
    },
    // Need To Update
    'dotax': {
        getContent: ( $, baseTime )=>{
            const $list = $('table.bbsList tr[class]');
            let contents = [];
            let checkNextPage = true;
        
            for(let i = 0; i < $list.length; i++){
                const $item = $list.eq(i);
                const uploadTime = $item.children('.date').text().trim();
                const date = [ TODAY, uploadTime ];
        
                if( uploadTime.split(':').length == 1 
                    || baseTime >= new Date(date.join(' ')).getTime() ){ 
                        checkNextPage = false;
                        break; 
                }
        
                contents.push({
                    no: $item.children('.num').text().trim(),
                    title: $item.find('.subject > a').text().replace(/(\t\d?|\n\d?)/g, '').trim(),
                    writer: $item.find('.nick').text().trim(),
                    url: host.dotax + $item.find('.subject > a:first-child').attr('href'),
                    date: date
                });
            }
            return {
                checkNextPage: checkNextPage,
                contents: contents
            };
        }
    }
}