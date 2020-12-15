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
$result = $conn->query("select * from taobaogoods"); //获取数据的结果集(记录集)

$num = $result->num_rows; //记录集的总条数  40

$pagesize = 10; //单个页面展示的数据条数 10

$pagenum = ceil($num / $pagesize); //获取页数，一定选择向上取整。 3页


//获取前端的传来的页码，根据页码查询对应的数据，返回给前端。
if (isset($_GET['page'])) {//判断前端传入的页码是否存在，
    $pagevalue = $_GET['page'];//如果存在，获取页码
} else {
    $pagevalue = 1;//默认为1
}


//根据传入的页码，计算起始的偏移值。获取对应的数据
//limit:第一个值起始的偏移值，从0开始。 第二个值表示条数

$page = ($pagevalue - 1) * $pagesize; //计算开始偏移值

$res = $conn->query("select * from taobaogoods limit $page,$pagesize");


//通过二维数组输出
// $result->num_rows; //记录集的条数
// $result->fetch_assoc(); //逐条获取记录集的值，结果是数组。
$arr = array();
for ($i = 0; $i < $res->num_rows; $i++) {
    $arr[$i] = $res->fetch_assoc();
}

//输出一个对象的接口，接口里面包含总的页数和接口数据
//$arr:当前的接口数据。
//$pagenum:总的页数。

class listdata{

}

$list = new listdata();//$list实例对象

$list->pagedata = $arr;//将接口数据给$list实例对象当做属性值
$list->pageno = $pagenum;//将页数给$list实例对象当做属性值

echo json_encode($list);


