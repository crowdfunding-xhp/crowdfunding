<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
<link href="../css/style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="../js/jquery-1.7.2.min.js"></script>
<style type="text/css">
.tip{width:400px; height:310px; position:absolute;top:10%; left:30%;background:#fcfdfd;box-shadow:1px 8px 10px 1px #9b9b9b;border-radius:1px;behavior:url(js/pie.htc); display:none; z-index:111111;}
.tiptop{height:40px; line-height:40px;  background:#2b88d1 repeat-x; cursor:pointer;}
.tiptop span{font-size:14px; font-weight:bold; color:#fff;float:left; text-indent:20px;}
.tipinfo{padding-top:30px;height:150px;text-align:center;}
.tipinfo span{width:95px; height:95px;}
.tipright{margin-top:15px;width:360px;text-align:center;}
.tipright span{font-size:14px; font-weight:bold; }
.tipright cite{color:#858686;}
.tipbtn{margin-top:50px; margin:0 auto;text-align:center;}
.sure ,.cancel{width:96px; height:35px; line-height:35px; color:#fff; background:#1f90e9 repeat-x; font-size:14px; font-weight:bold;border-radius: 3px; cursor:pointer;}
</style>

<script type="text/javascript">
var index=${index};

$(document).ready(function(){
	
  if(index==1){

	  $(".tip").fadeIn(200);
  }
  $(".click").click(function(){
  $(".tip").fadeIn(200);
  });
  
  $(".tiptop a").click(function(){
  $(".tip").fadeOut(200);

});

  $(".sure").click(function(){
  $(".tip").fadeOut(100);
});


});
</script>


<script type="text/javascript">
$(function(){
	var pageSize=5;
	var curPage=1;
	var direct=0;
	var page;
	var len;
	var begin;
	var end;
	$.post("listUser.do",function(data){

		$.each($.parseJSON(data),function(idx,value){
			var html="<tr>";
			  html+=" 	<td >"+value.Uid+"</td>";
			  html+="    <td>"+value.Unickname+"</td>";
			  html+="    <td >"+value.Uname+"</td>";
			  html+=" 	<td >"+value.Usex+"</td>";
			  html+="    <td >"+value.UidNumber+"</td>";
			  html+="    <td >"+value.Uphone+"</td>";
			  html+="    <td >"+value.Uemail+"</td>";
			  html+="    <td><a href='delete.do?Uid="+value.Uid+"'>删除</a>&nbsp<a href='toUserUp.do?Uid="+value.Uid+"'>修改</a>&nbsp<a href='scan.do?Uid="+value.Uid+"'>查看</a></td>";
			  html+="</tr>";
		$("#userTable").append(html);
	});
	len=$("#userTable tr").length-1;
	page=len%pageSize==0?len/pageSize:Math.floor(len/pageSize)+1;
	displayPage();
	document.getElementById("btn0").innerHTML=curPage + "/" + page ; 
	document.getElementById("sjzl").innerHTML=len+"";
	$("#btn1").click(function showPage(){
		curPage=1;
		direct=0;
		displayPage();
	});
	$("#btn2").click(function showPage(){
		direct=-1;
		displayPage();
	});
	$("#btn3").click(function showPage(){
		direct=1;
		displayPage();
	});
	$("#btn4").click(function showPage(){
		curPage=page;
		direct=0;
		displayPage();
	});
	$("#btn5").click(function changePage(){
		
		curPage=document.getElementById("changePage").value*1;
	
		if(!/^[1-9]\d*$/.test(curPage)){
			alert("请输入正整数");
			return;
		}
		if(curPage>page){
			alert("超出数据页面");
			return ;
		}
		direct=0;
		displayPage();
	});
	$("#pageSizeSet").click(function setPageSize(){    // 设置每页显示多少条记录
        pageSize = document.getElementById("pageSize").value;    //每页显示的记录条数
        if (!/^[1-9]\d*$/.test(pageSize)) {
            alert("请输入正整数");
            return ;
        }
        len =$("#userTable tr").length - 1;
      
        page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数
        curPage=1;        //当前页
        direct=0;        //方向
        displayPage();
    });
});
	function displayPage(){
		
		 if(curPage<=1&&direct==-1){
			 direct=0;
			 alert("已经是第一页了");
			 return;
		 }
		 
		 if(curPage>=page&&direct==1){
			 direct=0;
			 alert("已经是最后一页了");
			 return;
		 }
		 
		 if(direct==1){curPage+=1;}
		 if(direct==-1){curPage-=1;}
		
		 document.getElementById("btn0").innerHTML=curPage+"/"+page;
		 
		 begin=(curPage-1)*pageSize+1;
		 end=begin+1*pageSize-1;
			
		 
		 
		 $("#userTable tr").hide();

		 $("#userTable tr").each(function(i){
			 if((i>=begin&&i<=end)||i==0){
				 $(this).show();
			 }
		 });
	 }
});



</script>

</head>


<body>


	<div class="place">
    <span>位置：</span>
    <ul class="placeul">
    <li><a href="#">管理菜单</a></li>
    <li><a href="#">用户列表</a></li>
    </ul>
    </div>
    
    <div class="rightinfo">
    
    
    
    
    <table class="tablelist" id="userTable">
    	<thead>
    	<tr>
        
        <th>用户编号<i class="sort"><img src="../images/manager/px.gif" /></i></th>
        <th>用户昵称</th>
        <th>用户名称</th>
        <th>用户性别</th>
        <th>用户身份证</th>
        <th>用户电话</th>
        <th>电子邮箱</th>
        <th>操作</th>
        </tr>
        </thead>
        <tbody>
       
        
        
        </tbody>
    </table>
    
     <div align="center" style="margin-top:15px">
					 共<a class="blue" id="sjzl"></a>条记录&nbsp;&nbsp;当前<a class="blue" id="btn0"></a>页&nbsp;&nbsp;&nbsp;
						<a id="btn0"></a>
						<a  href="#" name="ss" id="btn1">首页</a>
						<a  href="#" id="btn2">上一页</a>
						<a  href="#" id="btn3">下一页</a>
						<a  href="#" id="btn4">尾页</a> &nbsp;&nbsp;
						
						  转到第<input type="text" id="changePage" size="1" maxlength="4" style=" width:30px; text-align:center; border:1px solid #ccc;"/>页
						  <input type="button" id="btn5" value="跳转"/>
						 每页显示<input type="text" id="pageSize" size="1" maxlength="4" style=" width:30px; text-align:center; border:1px solid #ccc;"/>条记录
						  <input type="button" id="pageSizeSet" value="设置"/>
					</div>


    <div class="tip">
    	<div class="tiptop"><span>查看信息</span><a></a></div>
        <div class="tipinfo">
        <img src="../${user.uimage}" width="150px" height="150px"/>
        </div>
        <div class="tipright">
               <span>密码:${user.upassword}</span>
        </div>
        <div class="tipbtn">
            <input name="" type="button"  class="sure" value="确定" />
        </div>
    </div>



</body>
</html>