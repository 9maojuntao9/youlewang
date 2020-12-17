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

if(isset($_POST['user']) && isset($_POST['pass'])){
    $user = $_POST['user'];
    $pass = sha1($_POST['pass']);//加密和加密进行匹配
    $result=$conn->query("select * from registry where username='$user' and password='$pass'");
    if($result->fetch_assoc()){
        echo true;//用户名和密码匹配成功
    }else{
        echo false;//用户名和密码匹配失败
    }
}