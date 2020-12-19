define(['jcookie'], () => {
    return {
        init: function() {

            let $sid = location.search.substring(1).split('=')[1];

            if (!$sid) {
                $sid = 1;
            }


            $.ajax({
                url: 'http://10.31.161.57:8083/youlewang/php/detail.php',
                data: {
                    sid: $sid
                },
                dataType: 'json'
            }).done(function(data) {

                $('#smallpic').attr('src', data.url);
                $('.loadtitle').html(data.title);
                $('.loadpcp').html(data.price);
                $('#bpic').attr('src', data.url);


                let $picurl = data.urls.split(',');
                let $strhtml = '<ul>';
                const $list = $('#list');
                $.each($picurl, function(index, value) {
                    $strhtml += `<li><img src="${value}"/></li>`;
                });
                $strhtml += '<ul>';
                $list.html($strhtml);
            });


            const $spic = $('#spic');
            const $bpic = $('#bpic');
            const $sf = $('#sf'); //小放
            const $bf = $('#bf'); //大放
            const $left = $('#left'); //左箭头
            const $right = $('#right'); //右箭头
            const $list = $('#list'); //小图列表
            //$spic 小图   $bpic 大图  


            $sf.width($spic.width() * $bf.width() / $bpic.width());
            $sf.height($spic.height() * $bf.height() / $bpic.height());
            let $bili = $bpic.width() / $spic.width();
            $spic.hover(function() {
                $sf.css('visibility', 'visible');
                $bf.css('visibility', 'visible');
                $(this).on('mousemove', function(ev) {
                    let $leftvalue = ev.pageX - $('.goodsinfo').offset().left - $sf.width() / 2;
                    let $topvalue = ev.pageY - $('.goodsinfo').offset().top - $sf.height() / 2;
                    if ($leftvalue < 0) {
                        $leftvalue = 0;
                    } else if ($leftvalue >= $spic.width() - $sf.width()) {
                        $leftvalue = $spic.width() - $sf.width()
                    }

                    if ($topvalue < 0) {
                        $topvalue = 0;
                    } else if ($topvalue >= $spic.height() - $sf.height()) {
                        $topvalue = $spic.height() - $sf.height()
                    }

                    $sf.css({
                        left: $leftvalue,
                        top: $topvalue
                    });

                    $bpic.css({
                        left: -$leftvalue * $bili,
                        top: -$topvalue * $bili
                    });

                });
            }, function() {
                $sf.css('visibility', 'hidden');
                $bf.css('visibility', 'hidden');
            });

            //小图切换 
            $('#list').on('click', 'li', function() { //事件委托
                let imgurl = $(this).find('img').attr('src');
                $('#smallpic').attr('src', imgurl);
                $('#bpic').attr('src', imgurl);
            });


            //左右箭头事件
            let $num = 6;
            $right.on('click', function() {
                let $lists = $('#list ul li');
                if ($lists.size() > $num) {
                    $num++;
                    $left.css('color', '#333');
                    if ($lists.size() == $num) {
                        $right.css('color', '#fff');
                    }

                    //列表运动
                    $('#list ul').animate({
                        left: -($num - 6) * $lists.eq(0).outerWidth(true)
                    });
                }
            });
            $left.on('click', function() {
                let $lists = $('#list ul li');
                if ($num > 6) {
                    $num--;
                    $right.css('color', '#333');
                    if ($num <= 6) {
                        $left.css('color', '#fff');
                    }
                    $('#list ul').animate({
                        left: -($num - 6) * $lists.eq(0).outerWidth(true)
                    });
                }
            });


            //4.购物车：(商品sid、商品数量)

            let arrsid = []; //sid
            let arrnum = []; //数量


            function getcookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    arrsid = $.cookie('cookiesid').split(',');
                    arrnum = $.cookie('cookienum').split(',');
                } else {
                    arrsid = [];
                    arrnum = [];
                }
            }


            $('.p-btn a').on('click', function() {
                getcookietoarray();
                if ($.inArray($sid, arrsid) === -1) {
                    arrsid.push($sid);
                    $.cookie('cookiesid', arrsid, { expires: 10, path: '/' });
                    arrnum.push($('#count').val());
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                } else {

                    let $index = $.inArray($sid, arrsid);

                    arrnum[$index] = parseInt(arrnum[$index]) + parseInt($('#count').val());
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                }
                alert('按钮被点击了');
            });
        }
    }
});