define([], function() {
    return {
        init: function() {

            let $form = $('#form1');
            let $username = $('[name=username]');
            let $nextpass = $('[name=nextpass]');
            let $password = $('[name=password]');
            let $tel = $('[name=tel]');
            let $span = $('#form1 span');

            $userflag = true;
            $passflag = true;
            $nextpassflag = true;
            $telflag = true;
            $checkflag = true;
            //用户名检测
            $username.on('focus', function() {
                $span.eq(0).html('中英文均可，最长14个英文或7个汉字').css('color', '#333');
            });

            $username.on('blur', function() {
                let $value = $(this).val();
                if ($value !== '') {
                    let $strLen = $value.replace(/[\u4e00-\u9fa5]/g, '**').length; //中文当做两个字符
                    if ($strLen > 0 && $strLen <= 14) {
                        let $reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                        if ($reg.test($value)) {
                            $span.eq(0).html('√').css('color', 'green');
                            $userflag = true;

                            $.ajax({
                                type: 'post',
                                url: 'http://10.31.161.57:8083/youlewang/php/reg.php',
                                data: {
                                    username: $username.val()
                                }
                            }).done(function(data) {
                                if (!data) {
                                    $span.eq(0).html('√').css('color', 'green');
                                } else {
                                    $span.eq(0).html('该用户名已存在').css('color', 'red');
                                    $userflag = false;
                                }
                            });


                        } else {
                            $span.eq(0).html('用户名格式有误').css('color', 'red');
                            $userflag = false;
                        }
                    } else {
                        $span.eq(0).html('用户名长度有误').css('color', 'red');
                        $userflag = false;
                    }
                } else {
                    $span.eq(0).html('用户名不能为空').css('color', 'red');
                }
            });


            $tel.on('focus', function() {
                $span.eq(1).html('请输入11位正确的手机号码').css('color', '#333');
            });

            $tel.on('blur', function() {
                let $value = $(this).val();
                if ($value !== '') {
                    let $reg = /^1[3|5|8]\d{9}$/;
                    if ($reg.test($value)) {
                        $span.eq(1).html('√').css('color', 'green');
                        $telflag = true;
                    } else {
                        $span.eq(1).html('手机号码格式有误').css('color', 'red');
                        $telflag = false;
                    }
                } else {
                    $span.eq(1).html('手机号码不能为空').css('color', 'red');
                    $telflag = false;
                }
            });


            $password.on('focus', function() {
                $span.eq(2).html('6-20个字符,数字，字母或符号').css('color', 'red');
            })
            $password.on('input', function() {
                if ($(this).val().length >= 8 && $(this).val().length <= 14) {
                    let num = /[0-9]+/;
                    let zimu = /[A-Za-z]+/;
                    let ts = /[\W_]+/;
                    let count = 0;
                    if (num.test($(this).val())) {
                        count++;
                    }
                    if (zimu.test($(this).val())) {
                        count++;
                    }
                    if (ts.test($(this).val())) {
                        count++;
                    }
                    switch (count) {
                        case 1:
                            $span.eq(2).html('有被盗风险').css('color', 'red');
                            $passflag = false;
                            break;
                        case 2:
                            $span.eq(2).html('安全强度适中').css('color', 'red');
                            $passflag = true;
                            break;
                        case 3:
                            $span.eq(2).html('你的密码很安全').css('color', 'green');
                            $passflag = true;
                            break;
                    }
                } else {
                    $span.eq(2).html('密码长度不对').css('color', 'red');
                    $passflag = false;
                }
            })
            $password.on('blur', function() {
                if ($(this).val() !== '') {
                    if ($passflag) {
                        $span.eq(2).html('√').css('color', 'green');
                        $passflag = true;

                    }

                } else {
                    $span.eq(2).html('请输入密码').css('color', 'red');
                    $passflag = false;

                }
            })
            $nextpass.on('blur', function() {
                    $val = $(this).val();
                    if ($password.val() === $(this).val()) {
                        $span.eq(3).html('√').css('color', 'green');
                        $nextpassflag = true;


                    } else {
                        $span.eq(3).html('两次密码不一样').css('color', 'red');
                        $nextpassflag = false;

                    }
                })
                // let $check = $('.check');



            //阻止表单的直接跳转。
            $form.on('submit', function() {
                // if (!$check.is(":checked")) {
                //     alert('请勾选');
                //     $checkflag = false;
                // }
                if ($username.val() === '') {
                    $span.eq(0).html('用户名不能为空').css('color', 'red');
                    $userflag = false;
                }
                if ($tel.val() === '') {
                    $span.eq(1).html('手机号码不能为空').css('color', 'red');
                    $telflag = false;
                }
                if ($password.val() === '') {
                    $span.eq(2).html('密码不能为空').css('color', 'red');
                    $passflag = false;
                }
                if ($nextpass.val() === '') {
                    $span.eq(3).html('确认密码不能为空').css('color', 'red');
                    $nextpassflag = false;
                }
                if (!$userflag || !$telflag || !$passflag || !$nextpassflag) {
                    return false;
                }
            });



        }
    }
});