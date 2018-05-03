<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>后端登陆界面</title>
<link href="../css/alogin.css" rel="stylesheet" type="text/css" />
</head>
<body>

<form id="form1" runat="server" action="managerLogin.do" method="post">
    <div class="Main">
        <ul>
            <li class="top"></li>
            <li class="top2"></li>
            <li class="topA"></li>
            <li class="topB"><span><img src="../images/managerLogin/logo.gif" alt="" style="" width="100%" height="100%"/></span></li>
            <li class="topC"></li>
            <li class="topD">
                <ul class="login">
                ${message}
                    <li><span class="left login-text">用户名：</span> <span style="left">
                        <input id="Text1" type="text" class="txt" name="Mname"/>  
                     
                    </span></li>
                    <li><span class="left login-text">密码：</span> <span style="left">
                       <input id="Text2" type="password" class="txt" name="Mpassword" />  
                    </span></li>
					<li>${message}</li>
                </ul>
            </li>
            <li class="topE"></li>
            <li class="middle_A"></li>
            <li class="middle_B"></li>
            <li class="middle_C"><span class="btn"><input name="" type="image" src="../images/managerLogin/btnlogin.gif" /></span></li>
            
            <li class="middle_D"></li>
            <li class="bottom_A"></li>
            <li class="bottom_B">众筹网后台管理系统</li>
        </ul>
    </div>
    </form>
</body>
</html>