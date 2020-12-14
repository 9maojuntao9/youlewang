! function($) {
    // 轮播图
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
        url: 'http://localhost:8083/youlewang/php/xuanran.php',
        dataType: 'json',
    }).done(function(data) {
        var $html = '';
        $.each(data, function(index, value) {
            $html += `
            <li>
            <a href="">
            <img src='${value.url}'>
             </a>
            <p>${value.title}</p>
            <span>￥${value.price}</span>
           
            </li>
            `;
        })
        $ul.html($html);
    })


    // 楼梯效果
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

}(jQuery)