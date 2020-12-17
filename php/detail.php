<?php
//cors解决跨越:所有的用户都可以访问。
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
//2.获取前端出入的sid
if(isset($_GET['sid'])){
    $sid = $_GET['sid'];
    //查询这条数据返回给前端。
    $result=$conn->query("select * from womanlist where sid = $sid");//获取一条数据。
    echo json_encode($result->fetch_assoc());
}