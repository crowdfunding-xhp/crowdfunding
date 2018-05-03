<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link href="../css/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div id="top">
           <div class="top_up">
             <div class="top_up_left"><img src="../images/logoo.png" width="200" height="47" /></div>
              
                  <div class="user">
                    <i>用户</i>
                   <span>${Mname }</span>
                    </div>    
                <div class="top_up_right edit">
                          <span><a href="../index.html" target="_top" title="返回主页" class="button01"><strong>返回主页</strong></a></span>
					   
                          <span><a href="login.jsp" target="_top" title="退出按钮" class="button03"><strong>退出按钮</strong></a></span>
			      <div class="clear"></div>
                </div>          
           </div>  
      </div>
</body>
</html>