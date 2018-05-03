<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title title>众筹网-个人中心</title>
	<meta charset="utf-8" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="keywords" content="" />
	<meta name="description" content="" />
	<meta name="renderer" content="webkit" />
	<meta http-equiv="X-UA-Compatible" content="IE=11">
	<!--<link rel="shortcut icon"  type="image/png" href="http://zcs8.ncfstatic.com/v3/static/images/icon/title.png?v=" />-->
	<link rel="stylesheet" type="text/css" href="../css/reset.css" >
	<script type="text/javascript" src="../js/common.js" ></script>
	<meta property="qc:admins" content="255367746162076730756375" />
	<script type="text/javascript" src="../js/sso-lib.js"></script>
	<script type="text/javascript">
		$(function(){
			var pageSize =5;    //每页显示的记录条数
            var curPage=1;        //当前页
            var lastPage=1;        //最后页
            var direct=0;        //方向
            var len;            //总行数
            var page;            //总页数
            var begin;
            var end;
            
            $(".scbtn").click(function(){
           	 var pname=$(".scinput").val();
           	 
           		 $.post("fuzzySearchProject.do",{pname:$(".scinput").val()},function(data){
           			 
           			 $("#proTable").html("<colgroup><col width='5%'><col width='5%'><col width='5%'><col width='5%'><col width='5%'><col width='5%'><col width='5%'><col width='5%'><col width='5%'><col width='5%'><col width='10%'></colgroup><thead><tr class='bg-tr'><td class=\"wp6\">项目编号</td><td class=\"wp14\">项目名称</td><td class=\"wp6\">类别编号</td><td class=\"wp6\">项目日期</td><td class=\"wp6\">目标资金</td><td class=\"wp6\">当前资金</td><td class=\"wp6\">发起人</td><td class=\"wp10\">操作</td></tr>");
           			 $.each($.parseJSON(data),function(idx,value){
           				 var html="<tr>";
           				  html+=" 	<td >"+value.pid+"</td>";
           				  html+="    <td>"+value.pname+"</td>";
           				  html+="    <td >"+value.ptags+"</td>";
           				  html+="    <td >"+value.pdate+"</td>";
           				  html+=" 	<td >"+value.ptargetMoney+"</td>";
           				  html+=" 	<td >"+value.ppresentMoney+"</td>";
           				  html+=" 	<td >"+value.paccountName+"</td>";
           				  html+="    <td><a href='deleteProject.do?Pid="+value.Pid+"'>删除</a>&nbsp&nbsp<a href='scanProject.do?Pid="+value.Pid+"'>查看</a></td>";
           				  html+="</tr>";
           			$("#proTable").append(html);  
           		});
           			 
           			 len =$("#proTable tr").length-1;    // 求这个表的总行数，剔除第一行介绍
           			
 	                page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数	               
 	                curPage=1;    // 设置当前为第一页
 	                displayPage(1);//显示第一页	                
 	                document.getElementById("btn0").innerHTML=curPage + "/" + page ;    // 显示当前多少页
 	                document.getElementById("sjzl").innerHTML=len + "";        // 显示数据量	        
           	}); 
       	});
            
			$.post("listProject.do",function(data){		
				$.each($.parseJSON(data),function(idx,value){
					var html="<tr>";
					  html+=" 	<td >"+value.pid+"</td>";
					  html+="    <td>"+value.pname+"</td>";
					  html+="    <td >"+value.ptags+"</td>";
					  html+="    <td >"+value.pdate+"</td>";
					  html+=" 	<td >"+value.ptargetMoney+"</td>";
					  html+=" 	<td >"+value.ppresentMoney+"</td>";
					  html+=" 	<td >"+value.paccountName+"</td>";
					  html+="    <td><a href='deleteProject.do?Pid="+value.pid+"'>删除</a>&nbsp&nbsp<a href='scanProject.do?Pid="+value.pid+"'>查看</a></td>";
					  html+="</tr>";
				$("#proTable").append(html);
			});
				
	
				    len =$("#proTable tr").length-1;    // 求这个表的总行数，剔除第一行介绍
	                page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数	               
	                curPage=1;    // 设置当前为第一页
	                displayPage(1);//显示第一页	                
	                document.getElementById("btn0").innerHTML=curPage + "/" + page ;    // 显示当前多少页
	                document.getElementById("sjzl").innerHTML=len + "";        // 显示数据量	          
	                            
	                $("#pageSizeSet").click(function setPageSize(){    // 设置每页显示多少条记录
	                    pageSize = document.getElementById("pageSize").value;    //每页显示的记录条数
	                    if (!/^[1-9]\d*$/.test(pageSize)) {
	                        alert("请输入正整数");
	                        return ;
	                    }
	                    len =$("#proTable tr").length - 1;
	                    page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数
	                    curPage=1;        //当前页
	                    direct=0;        //方向
	                    displayPage();
	                });

	               
	            });
		
			 $("#btn1").click(function shouPage(){	                	
                 curPage=1;
                 direct = 0;
                 displayPage();	                    
             });	               	                
             $("#btn2").click(function frontPage(){    // 上一页
                 direct=-1;
                 displayPage();
             });
             $("#btn3").click(function nextPage(){    // 下一页
                 direct=1;
                 displayPage();
             });
             $("#btn4").click(function lastPage(){    // 尾页
                 curPage=page;	                
                 direct = 0;
                 displayPage();
             });
             $("#btn5").click(function changePage(){    // 转页
                 curPage=document.getElementById("changePage").value * 1;
                 if (!/^[1-9]\d*$/.test(curPage)) {
                     alert("请输入正整数");
                     return ;
                 }
                 if (curPage > page) {
                     alert("超出数据页面");
                     return ;
                 }
                 direct = 0;
                 displayPage();
             });	   
			
			
			
			
		    function displayPage(){
                if(curPage <=1 && direct==-1){
                    direct=0;
                    alert("已经是第一页了");
                    return;
                } else if (curPage >= page && direct==1) {
                    direct=0;
                    alert("已经是最后一页了");
                    return ;
                }
                if(direct==1){curPage+=1;}
       		 if(direct==-1){curPage-=1;}
                document.getElementById("btn0").innerHTML=curPage + "/" + page ;        // 显示当前多少页
                begin=(curPage-1)*pageSize + 1;// 起始记录号
                end = begin + 1*pageSize - 1;    // 末尾记录号              
                if(end > len ) end=len;
                $("#proTable tr").hide();    // 首先，设置这行隐藏
                $("#proTable tr").each(function(i){    // 然后，通过条件判断决定本行是否恢复显示
                    if((i>=begin && i<=end) || i==0 )//显示begin<=x<=end的记录
                        $(this).show();
               
                });
             }
		}); 
		
		
</script>

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


<style type="text/css">
.tip{width:550px; height:400px; position:absolute;top:10%; left:30%;background:#fcfdfd;box-shadow:1px 8px 10px 1px #9b9b9b;border-radius:1px;behavior:url(js/pie.htc); display:none; z-index:111111;}
.tiptop{height:40px; line-height:40px;  background:#2b88d1 repeat-x; cursor:pointer;}
.tiptop span{font-size:14px; font-weight:bold; color:#fff;float:left; text-indent:20px;}
.tipleft{padding-top:0px;margin-left:0px; height:250px;width:200px;float:left;}
.tipright{padding-top:15px; padding-left:30px;text-align:center;height:250px;width:300px;float:left;}
.tipright span{font-size:14px; font-weight:bold; line-height:35px;}
.tipright cite{color:#858686;}
.tipbtn{ margin-top:300px;text-align:center;}
.sure ,.cancel{width:96px; height:35px; line-height:35px; color:#fff; background:#1f90e9 repeat-x; font-size:14px; font-weight:bold;border-radius: 3px; cursor:pointer;}


.seachform{ height:42px;}
.seachform li{float:left; margin-right:15px;}
.seachform li label{padding-right:10px; float:left; line-height:32px;}
.scinput{width:150px; height:32px; line-height:32px; border-top:solid 1px #a7b5bc; border-left:solid 1px #a7b5bc; border-right:solid 1px #ced9df; border-bottom:solid 1px #ced9df; background:url(../images/inputbg.gif) repeat-x; text-indent:10px;}
.scbtn{width:85px; height:30px; background:#1f90e9 no-repeat center; font-size:14px; font-weight:bold; color:#fff; cursor:pointer; border-radius:3px; behavior:url(js/pie.htc);}


</style>
</head>
<body>


<link rel="stylesheet" type="text/css" href="../css/detail.css" >
<div class="backstage-wrap wrap1120 clearfix">


      <ul class="seachform">
    
    <li><label>名称查询</label><input name="" type="text" class="scinput" /></li>
    <li><label>&nbsp;</label><input name="" type="button" class="scbtn" value="查询" /></li>
    
    </ul>


		
	<div class="personal-center-right" >
		<div class="m-ulitem">
			<div class="m-location">

				<table id=proTable>
					<colgroup>
						<col width='5%'>
						<col width='5%'>
						<col width='5%'>
						<col width='5%'>
						<col width='5%'>
						<col width='5%'>
						<col width='5%'>
						<col width='5%'>
						<col width='5%'>
						<col width='5%'>
						<col width='10%'>
					</colgroup>
					<thead>
					<tr class='bg-tr'>

						<td class="wp6">项目编号</td>
						<td class="wp14">项目名称</td>
						<td class="wp6">类别编号</td>
						<td class="wp6">项目日期</td>
						<td class="wp6">目标资金</td>
						<td class="wp6">当前资金</td>
						<td class="wp6">发起人</td>
						<td class="wp10">操作</td>

						
					</tr>
					</thead>


				</table>

					 <div align="center" style="margin-top:15px">
					 共<a class="blue" id="sjzl"></a>条记录&nbsp;&nbsp;当前<a class="blue" id="btn0"></a>页&nbsp;&nbsp;&nbsp;
						
						<a  href="#" name="ss" id="btn1">首页</a>
						<a  href="#" id="btn2">上一页</a>
						<a  href="#" id="btn3">下一页</a>
						<a  href="#" id="btn4">尾页</a> &nbsp;&nbsp;
						
						  转到第<input type="text" id="changePage" size="1" maxlength="4" style=" width:30px; text-align:center; border:1px solid #ccc;"/>页
						  <input type="button" id="btn5" value="跳转"/>
						  每页显示<input type="text" id="pageSize" size="1" maxlength="4" style=" width:30px; text-align:center; border:1px solid #ccc;"/>条记录
						  <input type="button" id="pageSizeSet" value="设置"/>
					</div>
		
			</div>
		</div>
	</div>
	
	
	
	
</div>
    <div class="tip">
    	<div class="tiptop"><span>查看信息</span><a></a></div>
        <div class="tipleft">
        	<img src="../${project.pimage}" width=100% height=100%/>
        </div>
        <div class="tipright">
                <span>内容：${project.pcontent}</span>
        </div>
        <div class="tipbtn">
            <input name="" type="button"  class="sure" value="确定" />
        </div>
    </div>
</body>
</html>
<script type="text/javascript" >
 			


</script>
