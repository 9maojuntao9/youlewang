define(['jcookie'], () => {
    return {
        init: function() {
            //1.获取cookie
            function getcookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    let $arrsid = $.cookie('cookiesid').split(','); //[1,3,5]
                    let $arrnum = $.cookie('cookienum').split(','); //[10,33,50]
                    $.each($arrsid, function(index, value) {
                        rendergoods($arrsid[index], $arrnum[index]); //index:数组的索引
                    });
                }
            }
            getcookietoarray();
            //2.渲染商品列表
            function rendergoods(sid, num) { //sid:商品的编号    num:商品的数量
                //获取所有的接口数据
                $.ajax({
                    url: 'http://10.31.161.57:8083/youlewang/php/alldata.php',
                    dataType: 'json'
                }).done(function(data) {
                    $.each(data, function(index, value) {
                        if (sid === value.sid) { //通过sid的对比找到对应的数据。
                            let $clonebox = $('.goods-item:hidden').clone(true, true); //克隆
                            $clonebox.find('.goods-pic img').attr('src', value.url);
                            $clonebox.find('.goods-d-info a').html(value.title);
                            $clonebox.find('.b-price strong').html(value.price);
                            $clonebox.find('.quantity-form input').val(num);
                            $clonebox.find('.b-sum strong').html((value.price * num).toFixed(2));
                            $clonebox.css('display', 'block'); //显示
                            $('.item-list').append($clonebox); //追加
                            calcprice();
                        }
                    });
                });
            }

            //3.计算总价--使用次数很多--函数封装
            function calcprice() {
                let $sum = 0; //商品的件数
                let $count = 0; //商品的总价
                $('.goods-item:visible').each(function(index, ele) {
                    if ($(ele).find('.cart-checkbox input').prop('checked')) { //复选框勾选
                        $sum += parseInt($(ele).find('.quantity-form input').val());
                        $count += parseFloat($(ele).find('.b-sum strong').html());
                    }
                });
                $('.amount-sum').find('em').html($sum);
                $('.totalprice').html($count.toFixed(2));
            }

            //4.全选
            $('.allsel').on('change', function() {
                $('.goods-item:visible').find(':checkbox').prop('checked', $(this).prop('checked'));
                $('.allsel').prop('checked', $(this).prop('checked'));
                calcprice(); //计算总价
            });
            let $inputs = $('.goods-item:visible').find(':checkbox');
            $('.item-list').on('change', $inputs, function() {
                //$(this):被委托的元素，checkbox
                if ($('.goods-item:visible').find(':checkbox').length === $('.goods-item:visible').find('input:checked').size()) {
                    $('.allsel').prop('checked', true);
                } else {
                    $('.allsel').prop('checked', false);
                }
                calcprice(); //计算总价
            });

            //5.数量的改变
            $('.quantity-add').on('click', function() {
                let $num = $(this).parents('.goods-item').find('.quantity-form input').val();
                $num++;
                $(this).parents('.goods-item').find('.quantity-form input').val($num);

                $(this).parents('.goods-item').find('.b-sum strong').html(calcsingleprice($(this)));
                calcprice(); //计算总价
                setcookie($(this));
            });


            $('.quantity-down').on('click', function() {
                let $num = $(this).parents('.goods-item').find('.quantity-form input').val();
                $num--;
                if ($num < 1) {
                    $num = 1;
                }
                $(this).parents('.goods-item').find('.quantity-form input').val($num);
                $(this).parents('.goods-item').find('.b-sum strong').html(calcsingleprice($(this)));
                calcprice(); //计算总价
                setcookie($(this));
            });


            $('.quantity-form input').on('input', function() {
                let $reg = /^\d+$/g; //只能输入数字
                let $value = $(this).val();
                if (!$reg.test($value)) { //不是数字
                    $(this).val(1);
                }
                $(this).parents('.goods-item').find('.b-sum strong').html(calcsingleprice($(this)));
                calcprice(); //计算总价
                setcookie($(this));
            });

            //计算单价
            function calcsingleprice(obj) { //obj元素对象
                let $dj = parseFloat(obj.parents('.goods-item').find('.b-price strong').html());
                let $num = parseInt(obj.parents('.goods-item').find('.quantity-form input').val());
                return ($dj * $num).toFixed(2)
            }


            //将改变后的数量存放到cookie中
            let arrsid = []; //存储商品的编号。
            let arrnum = []; //存储商品的数量。
            function cookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    arrsid = $.cookie('cookiesid').split(','); //获取cookie 同时转换成数组。[1,2,3,4]
                    arrnum = $.cookie('cookienum').split(','); //获取cookie 同时转换成数组。[12,13,14,15]
                } else {
                    arrsid = [];
                    arrnum = [];
                }
            }

            function setcookie(obj) {
                cookietoarray();
                let $sid = obj.parents('.goods-item').find('img').attr('sid');
                arrnum[$.inArray($sid, arrsid)] = obj.parents('.goods-item').find('.quantity-form input').val();
                $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
            }


            //6.删除
            function delcookie(sid, arrsid) { //sid:当前删除的sid  arrsid:存放sid的数组[3,5,6,7]
                let $index = -1; //删除的索引位置
                $.each(arrsid, function(index, value) {
                    if (sid === value) {
                        $index = index;
                    }
                });
                arrsid.splice($index, 1);
                arrnum.splice($index, 1);

                $.cookie('cookiesid', arrsid, { expires: -1, path: '/' });
                $.cookie('cookienum', arrnum, { expires: -1, path: '/' });
            }
            $('.b-action a').on('click', function() {
                cookietoarray();
                if (window.confirm('你确定要删除吗?')) {
                    $(this).parents('.goods-item').remove();
                    delcookie($(this).parents('.goods-item').find('img').attr('sid'), arrsid);
                    calcprice(); //计算总价
                }
            });

            $('.operation a').on('click', function() {
                cookietoarray();
                if (window.confirm('你确定要全部删除吗?')) {
                    $('.goods-item:visible').each(function() {
                        if ($(this).find(':checkbox').is(':checked')) { //判断复选框是否选中
                            $(this).remove();
                            delcookie($(this).find('img').attr('sid'), arrsid);
                        }
                    });
                    calcprice(); //计算总价
                }
            });

        }
    }
});