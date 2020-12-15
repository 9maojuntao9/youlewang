define(['pagination', 'jlazyload'], function() {
    return {
        init: function() {
            const $list = $('.list ul');
            let $array_default = [];
            let $array = [];
            let $prev = [];
            let $next = [];
            const $i7 = $('.i7');
            $i7.on('click', function() {
                $('html').stop().animate({
                    scrollTop: 0,
                })
            })
            $.ajax({
                url: 'http://10.31.161.57:8083/youlewang/php/list.php',
                dataType: 'json'
            }).done(function(datalist) {
                data = datalist.pagedata;
                let $strhtml = '';
                $.each(data, function(index, value) {
                    $strhtml += `
                        <li>
                            <a href="detail.html?sid=${value.sid}">
                                <img class="lazy" data-original="${value.url}" width="200" height="200"/>
                                <p>${value.title}</p>
                                <span>￥${value.price}</span>
                            </a>
                        </li>
                    `;
                });
                $list.html($strhtml);
                $("img.lazy").lazyload({ effect: "fadeIn" });

                $('.list li').each(function(index, element) {
                    $array_default[index] = $(this);
                    $array[index] = $(this);
                });
                $('.page').pagination({
                    pageCount: datalist.pageno,
                    jump: true,
                    prevContent: '上一页',
                    nextContent: '下一页',
                    callback: function(api) {
                        console.log(api.getCurrent());
                        $.ajax({
                            url: 'http://10.31.161.57:8083/youlewang/php/list.php',
                            data: {
                                page: api.getCurrent()
                            },
                            dataType: 'json'
                        }).done(function(datalist) {
                            data = datalist.pagedata;
                            let $strhtml = '';
                            $.each(data, function(index, value) {
                                $strhtml += `
                                        <li>
                                            <a href="detail.html?sid=${value.sid}">
                                                <img class="lazy" data-original="${value.url}" width="200" height="200"/>
                                                <p>${value.title}</p>
                                                <span>￥${value.price}</span>
                                            </a>
                                        </li>
                                    `;
                            });
                            $list.html($strhtml);
                            $("img.lazy").lazyload({ effect: "fadeIn" });
                            $('.list li').each(function(index, element) {
                                $array_default[index] = $(this);
                                $array[index] = $(this);
                            });
                            console.log($array_default);
                        });
                    }
                });

                $('.span').eq(0).on('click', function() {
                    $.each($array_default, function(index, value) {
                        $list.append(value);
                    });
                });
                $('.span').eq(1).on('click', function() {
                    for (let i = 0; i < $array.length - 1; i++) {
                        for (let j = 0; j < $array.length - i - 1; j++) {
                            $prev = parseFloat($array[j].find('span').html().substring(1));
                            $next = parseFloat($array[j + 1].find('span').html().substring(1));
                            if ($prev > $next) {
                                let temp = $array[j];
                                $array[j] = $array[j + 1];
                                $array[j + 1] = temp;
                            }
                        }
                    }
                    $.each($array, function(index, value) {
                        $list.append(value);
                    });
                });

                $('.span').eq(2).on('click', function() {
                    for (let i = 0; i < $array.length - 1; i++) {
                        for (let j = 0; j < $array.length - i - 1; j++) {
                            $prev = parseFloat($array[j].find('span').html().substring(1));
                            $next = parseFloat($array[j + 1].find('span').html().substring(1));
                            if ($prev < $next) {
                                let temp = $array[j];
                                $array[j] = $array[j + 1];
                                $array[j + 1] = temp;
                            }
                        }
                    }
                    $.each($array, function(index, value) {
                        $list.append(value);
                    });
                });


            });
            $header = $('.header2');
            $(window).on('scroll', function() {
                var $scrolltop = $(window).scrollTop();
                if (200 < $scrolltop) {
                    $header.stop().animate({
                        top: 0
                    })
                } else {
                    $header.stop().animate({
                        top: -999
                    })
                }
            })
        }
    }
});