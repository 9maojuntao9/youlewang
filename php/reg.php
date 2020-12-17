<?php
//1.连接数据库
header('Access-Control-Allow-Origin:*');  //允许任意的域名访问
header('Access-Control-Allow-Method:POST,GET'); //允许请求方式是get和post

//1.连接数据库
header('content-type:text/html;charset=utf-8');
define('HOST','localhost');//主机名
define('USERNAME','root');//用户名
define('PASSWORD','root');//密码
define('DBNAME','test');//数据库名
$conn = @new mysqli(HOST,USERNAME,PASSWORD,DBNAME);

if($conn->connect_error){
    die('连接数据库错误,'.$conn->connect_error);//die():退出程序并返回括号里面的值。
}
//3.获取前端传入的用户名做唯一值的检测。
if(isset($_POST['username'])){
    $name = $_POST['username'];
    $result=$conn->query("select * from registry where username='$name'");
    //如果存在结果，表示该用户名已经存在，否则不存在。
    if($result->fetch_assoc()){//存在 php里面的true返回1
        echo true;
    }else{//不存在,php里面的false返回空隙。
        echo false;
    }
}

//2.获取前端表单传入的值。
if(isset($_POST['submit'])){//前端点击了submit提交按钮，后端开始接收值。
    $user = $_POST['username'];
    $tel = $_POST['tel'];
    $pass = sha1($_POST['password']);
    $nextpass = $_POST['nextpass'];
    $conn->query("insert registry values(null,'$user','$tel','$pass','$nextpass',NOW())");//将数据传递给数据库。
    //一旦数据提交成功，回到前端的登录页面
    header('location:http://10.31.161.57:8083/youlewang/src/login.html');
}


