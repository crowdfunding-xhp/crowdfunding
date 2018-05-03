<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<script type="text/javascript" src="../js/jquery-1.7.2.min.js"></script>
<link href="../css/style.css" rel="stylesheet" type="text/css" />
<script language="javascript">
function check(){
document.form1.action="toUserUp.do?Uid="+${user.uid }+"";
}
</script>
<script type="text/javascript">
$(function(){
		// 上传图片
		$("#fileUpload").change(function() {
			var formData = new FormData($("#myImage")[0]);
			$.ajax({
				url : 'uploadImage.do',
				type : 'POST',
				data : formData,
				async : false,
				cache : false,
				contentType : false,
				processData : false,
				success : function(returndata) {
					// 将返回的路径写到隐藏域
					$("#Uimage").val(returndata);
					// 显示图片
					$("#showImg").attr("src", "../"+returndata);
					
				},
				error : function(returndata) {
					alert("false");
					alert(returndata);
				}
			});
		});
	});

</script>
<style type="text/css">
.forminfo li label{width:86px;line-height:34px; display:block; float:left;}
</style>
</head>
<body>
	<div class="formbody">
		<div class="formtitle">
			<span>基本信息</span>
		</div>
		<form id="myImage" enctype="multipart/form-data" action="uploadImg.do" method="post">
			<ul class="forminfo">
			<li><label>图片</label>	<input type="file" name="fileUpload" id="fileUpload" /></li>
				</ul>
		</form>
	<img alt="" src="${user.uimage }" id="showImg" width="150px" height="150px"/>
		<form id="addForm" action="UserUp.do">
			<ul class="forminfo">
				<li><label></label><input type="hidden"  id="Uid" name="Uid"   value="${user.uid }"
					class="dfinput" /></li>
				<li><label>用户昵称</label><input type="text"  id="Unickname" name="Unickname"  value="${user.unickname }"
					class="dfinput" /></li>
				<li><label>用户密码</label><cite><input type="password" id="Upassword"  value="${user.upassword }"  name="Upassword"  class="dfinput" /></cite></li>
				<li><label>用户名称</label><input type="text"  id="Uname" name="Uname" value="${user.uname }"
					class="dfinput" /></li>
				<li><label>用户性别</label><input type="text" id="Usex" name="Usex"
	value="${user.usex }"				class="dfinput" /></li>
				<li><label>用户身份证</label><input type="text" name="UidNumber"
	value="${user.uidNumber }"				class="dfinput" /></li>
				<li><label>用户电话</label><input type="text" name="Uphone"
	value="${user.uphone }"				class="dfinput" /></li>
				<li><label>电子邮箱</label><input type="text" name="Uemail"
	value="${user.uemail }"				class="dfinput" /></li>
				<li><label></label><input type="hidden" name="Uimage" id="Uimage"
	value="${user.uimage }"				class="dfinput" /></li>
				<li><label>&nbsp;</label><input id="btn" type="submit" name="btn" value="添加" class="btn"
					/></li>
			</ul>
		</form>
	</div>
	<div style="display: none">
	</div>
</body>
</html>