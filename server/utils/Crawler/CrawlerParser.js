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
                const uploadTime = $item.children('.date').text().trim();
                const date = [ TODAY, uploadTime ];
                
                if( uploadTime.split(':').length == 1 
                    || baseTime >= new Date(date.join(' ')).getTime() ){ 
                        checkNextPage = false;
                        break; 
                }

                contents.push({
                    no: $item.children('.no').text().trim(),
                    title: $item.find('.tit > a').text().replace(/(\t\d?|\n\d?)/g, '').trim(),
                    writer: $item.children('.name').text().replace(/(\t\d?|\n\d?)/g, '').trim(),
                    url: host + $item.find('.tit > a').first().attr('href'),
                    date: date
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
                const uploadTime = $item.children('.wr-date').text().trim();
                const date = [ TODAY, uploadTime ];

                if( uploadTime.split(':').length == 1 
                    || baseTime >= new Date(date.join(' ')).getTime() ){ 
                        checkNextPage = false;
                        break; 
                }

                contents.push({
                    no: $item.children('.wr-num').text().trim(),
                    title: $item.find('.wr-subject > a.item-subject').text().replace(/(\t\d?|\n\d?)/g, '').trim(),
                    writer: $item.find('.wr-name').text().trim(),
                    url: $item.find('.wr-subject > a.item-subject').attr('href'),
                    date: date
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
        getList: ($)=>{return $('#cnts_list_new > div:first-child > table:not(.list_hd2) > tbody > tr[id]')},
        getItem: function( $contents ){
            let $wrDate = $contents.children('.li_date');
            const regDate = ( $wrDate.children('.w_date').text() + " " + $wrDate.children('.w_time').text()).replace(/\r?\n$/,'');
            
            let cnt = {}
            cnt.no = $contents.attr('id').replace('li_chk_pds-','');
            if( cnt.no > this.state.content_id ){
                cnt.title = $contents.children('.li_sbj').text();
                cnt.writer = $contents.find('.li_icn .hu_nick_txt').text();
                cnt.regDate = regDate;
                cnt.url = $contents.find('.li_sbj > a[href]').first().attr('href');
                return cnt;
            }
            return false;
        }
    },
}