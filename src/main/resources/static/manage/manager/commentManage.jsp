<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
<link href="../css/style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="../js/jquery-1.7.2.min.js"></script>

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
	 var pageSize=10;
	 var curPage=1;
	 var lastPage=1;
	 var direct=0;
	 var totalPage;
	  var len;
	  var begin;
	  var end;
	 $.post("listComment.do",function(data){
		$.each($.parseJSON(data),function(idx,value){
			 var html="";
			html+=" <tr onMouseOut=\"this.style.backgroundColor='#ffffff'\" onMouseOver=\"this.style.backgroundColor='#edf5ff'\">";
			html+=" <td align='center' valign='middle' class='borderright borderbottom' height=50px>"+value.Cid+"</td>";
			html+=" <td align='center' valign='middle' class='borderright borderbottom'>"+value.CreplyId+"</td>";
			html+="<td align='center' valign='middle' class='borderright borderbottom'>"+value.Ccontext+"</td>";
			html+="<td align='center' valign='middle' class='borderright borderbottom'>"+value.Uid+"</td>";
			html+="<td align='center' valign='middle' class='borderright borderbottom'>"+value.Pid+"</td>";
			html+="<td align='center' valign='middle' class='borderbottom'><a href='deleteComment.do?Cid="+value.Cid+"' >删除</a></td>";
			html+="</tr>";
			$("#main-tab").append(html); 
		});
		len=$("#main-tab tr").length-1;
		
		totalPage=len%pageSize==0?len/pageSize:Math.floor(len/pageSize)+1;
		displayPage();
		document.getElementById("btn0").innetHTML=curPage+"/"+totalPage;
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
			curPage=totalPage;
			
			direct=0;
			displayPage();
		});
		$("#btn5").click(function changePage(){
			curPage=document.getElementById("changePage").value*1;
			if(!/^[1-9]\d*$/.test(curPage)){
				alert("请输入正整数");
				return;
			}
			if(curPage>totalPage){
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
            len =$("#main-tab tr").length - 1;
            totalPage=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数
            curPage=1;        //当前页
            direct=0;        //方向
            displayPage();
        });
	}); 
	 function displayPage(){
		
		 if(curPage<=1&&direct==-1){
			 alert("已经是第一页了");
			 return;
		 }
		 
		 if(curPage>=totalPage&&direct==1){
			 alert("已经是最后一页了");
			 return;
		 }
		 
		 if(direct==1){curPage+=1;}
		 if(direct==-1){curPage-=1;}
		
		 document.getElementById("btn0").innerHTML=curPage+"/"+totalPage;
		 
		 begin=(curPage-1)*pageSize+1;
		 end=begin+1*pageSize-1;

		 $("#main-tab tr").hide();
		 
		 $("#main-tab tr").each(function(i){
			 if((i>=begin&&i<=end)||i==0){
				 $(this).show();
			 }
		 });
	 }
}); 
</script>

<style type="text/css">
.tablelist th{background:url(../images/tab_bg.png) repeat-x; height:30px; line-height:30px; border-bottom:solid 1px #b7d5df; text-indent:11px; text-align:center;}
.tablelist td{line-height:10px;  border-right: dotted 1px #b7d5df;}
</style>

</head>


<body>


	<div class="place">
    <span>位置：</span>
    <ul class="placeul">
    <li><a href="#">管理菜单</a></li>
    <li><a href="#">评论列表</a></li>
    </ul>
    </div>
    
    <div class="rightinfo">
    
    
    
    
    <table class="tablelist" id="main-tab">
    	<thead>
    	<tr>
        
        <th>评论编号<i class="sort"><img src="../images/manager/px.gif" /></i></th>
        <th>评论回复编号</th>
        <th>评论内容</th>
        <th>用户编号</th>
        <th>项目编号</th>
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
  
</body>
</html>