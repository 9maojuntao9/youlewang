define(['pagination', 'jlazyload'], function() {
    return {
        init: function() {
            const $img = $('.banner-lunbo ul li'); //图片
            const $quan = $(' ol li'); //圈圈
            let $num = 0;
            let $timer = null;
            let time2 = null;
            $quan.on('mouseover', function() {
                $num = $(this).index();
                tabswitch()
            });
            $quan.on('mouseout', function() { //清除定时器的累加
                clearTimeout($timer);
            });

            function tabswitch() { //封装函数
                $quan.eq($num).addClass('active').siblings().removeClass('active');
                $img.eq($num).stop(true).animate({
                    opacity: 1
                }).siblings().stop(true).animate({
                    opacity: 0
                });
            }
            $timer2 = setInterval(function() { //自动播放
                $num++;
                if ($num > $img.length - 1) {
                    $num = 0;
                }
                tabswitch();
            }, 5000);

            $img.hover(function() { //暂停定时器
                clearInterval($timer2);
            }, function() {
                $timer2 = setInterval(function() {
                    $num++;
                    if ($num > $img.length - 1) {
                        $num = 0;
                    }
                    tabswitch();
                }, 5000)
            })

            // 数据渲染
            $ul = $('.main-look ul');
            $.ajax({
                url: 'http://10.31.161.57:8083/youlewang/php/xuanran.php',
                dataType: 'json',
            }).done(function(data) {
                var $html = '';
                $.each(data, function(index, value) {
                    $html += `
                    <li>
                    
                    <a href="">
               <img class="lazy" data-original="${value.url}" width="200" height="200"/>
                     </a>
                    <p>${value.title}</p>
                    <span>￥${value.price}</span>
                   
                    </li>
                    `;
                })
                $ul.html($html);
                $("img.lazy").lazyload({ effect: "fadeIn" });

            });



            const $float = $('.float');
            const $span = $('.float span').not('.fj');
            const $louceng = $('.louceng');
            const $fj = $('.fj');
            const $i7 = $('.i7');

            //封装函数
            function fn() {
                var $scrolltop = $(window).scrollTop();
                if ($scrolltop >= 800) {
                    $float.show();
                } else {
                    $float.hide();
                }
                $louceng.each(function(index, value) {
                    var $top = $(value).offset().top; //每个楼层的高度
                    if ($scrolltop <= $top) {
                        $span.removeClass('active');
                        $span.eq(index).addClass('active');
                        return false;
                    }
                })
            }
            fn();
            $(window).on('scroll', function() {
                fn();

            })

            $span.on('click', function() {
                var $loucengtop = $louceng.eq($(this).index()).offset().top;
                $(this).addClass('active').siblings('.active').removeClass('active');
                $('html').stop().animate({
                    scrollTop: $loucengtop,
                })
            })
            $fj.on('click', function() {
                $('html').stop().animate({
                    scrollTop: 0,
                })
            })
            $i7.on('click', function() {
                $('html').stop().animate({
                    scrollTop: 0,
                })
            })

            //二级菜单
            const $list = $('.banner-menu li');
            const $cartlist = $('.cartlist');
            const $items = $('.item');
            $list.hover(function() {
                $cartlist.show();
                $(this).addClass('active').siblings('li').removeClass('active');
                $items.eq($(this).index()).show().siblings('.item').hide();
            })
            $cartlist.hover(function() {
                $(this).show();
            }, function() {
                $(this).hide();
            });
            $list.hover(function() {
                $cartlist.show();
            }, function() {
                $cartlist.hide();
            });


            //顶部悬浮
            $header = $('.header2');
            $(window).on('scroll', function() {
                var $scrolltop = $(window).scrollTop();
                if (670 < $scrolltop) {
                    $header.stop().animate({
                        top: 0
                    })
                } else {
                    $header.stop().animate({
                        top: -999
                    })
                }
            })

            if (localStorage.getItem('loginname')) {
                $('.admin').show();
                $('.login').hide();
                $('.admin span').html(localStorage.getItem('loginname'));
            }

            //退出登录 - 删除本地存储
            $('.admin a').on('click', function() {
                $('.admin').hide();
                $('.login').show();
                localStorage.removeItem('loginname');
            });
        }
    }
})