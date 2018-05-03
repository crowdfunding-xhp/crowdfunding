<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
<link href="css/style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/jquery.js"></script>

<script type="text/javascript">
$(document).ready(function(){
  $(".click").click(function(){
  $(".tip").fadeIn(200);
  });
  
  $(".tiptop a").click(function(){
  $(".tip").fadeOut(200);
});

  $(".sure").click(function(){
  $(".tip").fadeOut(100);
});

  $(".cancel").click(function(){
  $(".tip").fadeOut(100);
});

});
</script>


<script type="text/javascript">
$(function(){
	$.post("listUser.do",function(data){
		$.each($.parseJSON(data),function(idx,value){
			var html="<tr>";
			  html+=" 	<td >"+value.Uid+"</td>";
			  html+="    <td>"+value.Unickname+"</td>";
			  html+="    <td >"+value.Uname+"</td>";
			  html+=" 	<td >"+value.Usex+"</td>";
			  html+="    <td >"+value.UidNumber+"</td>";
			  html+="    <td >"+value.Uphone+"</td>";
			  html+="    <td><a href='delete.do?Uid="+value.Uid+"'>删除</a>&nbsp<a href='toUserUp.do?Uid="+value.Uid+"'>修改</a>&nbsp<a href='scan.do?Uid="+value.Uid+"'>查看</a></td>";
			  html+="</tr>";
		$("#userTable").append(html);
	});
	});
});



</script>

</head>


<body>




	<div class="place">
    <span>位置：</span>
    <ul class="placeul">
    <li><a href="#">管理菜单</a></li>
    <li><a href="#">用户管理</a></li>
    <li><a href="#">用户列表</a></li>
    </ul>
    </div>
    
    <div class="rightinfo">
    
    <div class="tools">
    
    	<ul class="toolbar">
        <li class="click"><span><img src="images/t01.png" /></span>添加</li>
        <li class="click"><span><img src="images/t02.png" /></span>修改</li>
        <li><span><img src="images/t03.png" /></span>删除</li>
        <li><span><img src="images/t04.png" /></span>统计</li>
        </ul>
        
        
        <ul class="toolbar1">
        <li><span><img src="images/t05.png" width="16px" height="16px" /></span>设置</li>
        </ul>
    
    </div>
    
    
    <table class="tablelist" id="userTable">
    	<thead>
    	<tr>
        
        <th>用户编号<i class="sort"><img src="images/px.gif" /></i></th>
        <th>用户昵称</th>
        <th>用户名称</th>
        <th>用户性别</th>
        <th>用户身份证</th>
        <th>用户电话</th>
        <th>操作</th>
        </tr>
        </thead>
        <tbody>
       
        
        
        </tbody>
    </table>
    
   
    <div class="pagin">
    	<div class="message">共<i class="blue">1256</i>条记录，当前显示第&nbsp;<i class="blue">2&nbsp;</i>页</div>
        <ul class="paginList">
        <li class="paginItem"><a href="javascript:;"><span class="pagepre"></span></a></li>
        <li class="paginItem"><a href="javascript:;">1</a></li>
        <li class="paginItem current"><a href="javascript:;">2</a></li>
        <li class="paginItem"><a href="javascript:;">3</a></li>
        <li class="paginItem"><a href="javascript:;">4</a></li>
        <li class="paginItem"><a href="javascript:;">5</a></li>
        <li class="paginItem more"><a href="javascript:;">...</a></li>
        <li class="paginItem"><a href="javascript:;">10</a></li>
        <li class="paginItem"><a href="javascript:;"><span class="pagenxt"></span></a></li>
        </ul>
    </div>
    
    
    <div class="tip">
    	<div class="tiptop"><span>提示信息</span><a></a></div>
        
      <div class="tipinfo">
        <span><img src="images/ticon.png" /></span>
        <div class="tipright">
        <img src={$user.Uimage} />
                密码:{$user.Upassword}
        </div>
        </div>
        
        <div class="tipbtn">
        <input name="" type="button"  class="sure" value="确定" />
        <input name="" type="button"  class="cancel" value="取消" />
        </div>
    
    </div>
    
    </div>
    
    <script type="text/javascript">
	$('.tablelist tbody tr:odd').addClass('odd');
	</script>
</body>
</html>