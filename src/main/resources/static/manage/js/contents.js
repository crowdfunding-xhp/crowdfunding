$(window).ready(function() {

		var userInfo = $.cookie("userInfo");
		if(userInfo) {
			userInfo = eval("(" + userInfo + ")");
			$("input[name=Uid]").val(userInfo.Uid);
		$("input[name=Uname]").val(userInfo.Uname);
		$("input[name=Uphone]").val(userInfo.Uphone);
		$("input[name=Unickname]").val(userInfo.Unickname);
		$("[name=Uimage]").attr("src", userInfo.Uimage);
		$(".Uid").text(userInfo.Uid);
		$(".Uname").text(userInfo.Uname);
		$(".Uphone").text(userInfo.Uphone);
		$(".Unickname").text(userInfo.Unickname);
		$("#Uid").text(userInfo.Uid);
		$("#Uname").text(userInfo.Uname);
		$("#Uphone").text(userInfo.Uphone);
		$("#Unickname").text(userInfo.Unickname);
		} 
		
	programListById();
})

function programListById() {
	var Uid = $('#Uid').val();
	var Pid = $('#Pid').val();
	var tbody = window.document.getElementById("tbody-result");

	$.ajax({
		type: "post",
		dataType: "json",
		url: "scanProjectById.do",
		data: {
			"Pid": getUrlParam("Pid")
		},
		success: function(msg) {
			//msg = eval("("+msg+")");
			console.log(msg);
			console.log(msg.pimage);
			var ts = (new Date()) - new Date(msg.pdate).getTime();
			var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);
			$("input[name=pid]").val(msg.pid);
			$("#pid").text(msg.pid);
			$("#paccountName").text(msg.paccountName);
			$("#pidentify").text(msg.pidentify);
			$("#paccountTel").text(msg.paccountTel);
			$("#ploc").text(msg.ploc);
			$("#pname").text(msg.pname);
			$("#pcontent").text(msg.pcontent);
			$("#pdate").text(msg.pdate);
			$("#timeDifference").text(msg.praiseDays - dd);
			$("#ptargetMoney").text(msg.ptargetMoney);
			$("#praiseDays").text(msg.praiseDays);
			$("#ppresentMoney").text(msg.ppresentMoney);
			$("#ptags").text(msg.ptags);
			$("#pdescripTitle").text(msg.pdescripTitle);
			$("#pdescripCont").text(msg.pdescripCont);
			$("#pcid").text(msg.pcid);
			$("#uid").text(msg.uid);
			$("#pimage").attr("src", msg.pimage);
			$(".pid").text(msg.pid);
			$(".paccountName").text(msg.paccountName);
			$(".pidentify").text(msg.pidentify);
			$(".paccountTel").text(msg.paccountTel);
			$(".ploc").text(msg.ploc);
			$(".pname").text(msg.pname);
			$(".pcontent").text(msg.pcontent);
			$(".pdate").text(msg.pdate);
			$(".timeDifference").text(msg.praiseDays - dd);
			$(".ptargetMoney").text(msg.ptargetMoney);
			$(".percent").text(msg.ppresentMoney * 100 / msg.ptargetMoney + "%");
			document.getElementById("percent").style.width = msg.ppresentMoney * 100 / msg.ptargetMoney + "%";
			$(".praiseDays").text(msg.praiseDays);
			$(".ppresentMoney").text(msg.ppresentMoney);
			$(".ptags").text(msg.ptags);
			$(".pdescripTitle").text(msg.pdescripTitle);
			$(".pdescripCont").text(msg.pdescripCont);
			$(".pcid").text(msg.pcid);
			$(".uid").text(msg.uid);
			$(".pimage").attr("src", msg.pimage);
			$.ajax({
				type: "post",
				dataType: "json",
				url: "listUserById.do",
				//							contentType: "charset=utf-8",
				data: {
					"Uid": msg.uid
				},
				success: function(message) {
					//msg = eval("("+msg+")");
					console.log(message);
					$("input[name=uid]").val(message.Uid);
					$("input[name=unickname]").val(message.Unickname);
					$("input[name=upassword]").val(message.Upassword);
					$("input[name=uname]").val(message.Uname);
					$("input[name=usex]").val(message.Usex);
					$("input[name=uidNumber]").val(message.UidNumber);
					$("input[name=uphone]").val(message.Uphone);
					$("input[name=uimage]").val(message.Uimage);
					$("input[name=uemail]").val(message.Uemail);
					$("#uid").text(message.Uid);
					$("#unickname").text(message.Unickname);
					$("#upassword").text(message.Upassword);
					$("#uname").text(message.Uname);
					$("#usex").text(message.Usex);
					$("#uidNumber").text(message.UidNumber);
					$("#uphone").text(message.Uphone);
					$("#uimage").text(message.Uimage);
					$("#uemail").text(message.Uemail);
					$(".uid").text(message.Uid);
					$(".unickname").text(message.Unickname);
					$(".upassword").text(message.Upassword);
					$(".uname").text(message.Uname);
					$(".usex").text(message.Usex);
					$(".uidNumber").text(message.UidNumber);
					$(".uphone").text(message.Uphone);
					$(".uimage").text(message.Uimage);
					$(".uemail").text(message.Uemail);

				},
				error: function() {
					alert("查询用户失败")
				}
			});
		},
		error: function() {
			alert("查询项目失败")
		}
	});
}

$(function() {
	layui.use('layer', function() {
		var layer = layui.layer;
		layer.config({
			extend: 'myskin/style.css', //加载您的扩展样式
		});
		$("#support").click(function(check) {
			var userInfo = $.cookie("userInfo");
			$("#cd-support .cdd-form").validate({
				//debug: true,
				onkeyup: null,
				rules: {
					donateMoney: {
						required: true,
						digits: true,
						range: [1, 10000]
					}
				},
				messages: {
					donateMoney: {
						required: "请输入支持数",
						digits: $.validator.format("请输入整数"),
						range: $.validator.format("输入1-10000")
					}
				},
				errorPlacement: function(error, element) { //错误信息位置设置方法
					error.appendTo(element.parent().next()); //这里的element是录入数据的对象
				},
				submitHandler: function(form) { //用其他方式替代默认的 SUBMIT
					if(userInfo) {
						userInfo = eval("(" + userInfo + ")");
						//设置头像等信息
						$(".index-avatar img").attr("src", userInfo.Uimage);
						$(".nickname").text(userInfo.Unickname);

						layer.msg("正在支持···");
						//获取表单数据
						var donateMoney = $("#cd-support .cdd-form input[name=donateMoney]").val();
						var pid = $("#cd-support .cdd-form input[name=pid]").val();
						var Uid = $("input[name=Uid]").val();

						if(donateMoney != "") {
							$.ajax({
								type: "post",
								url: "addMoney.do",
								data: {
									"pid": getUrlParam("Pid"),
									"donateMoney": donateMoney
								},
								success: function(msg) {
									if(msg != null) {
										//登录成功
										$.ajax({
											type: "post",
											url: "isCreateOrder.do",
											data: {
												"pid": getUrlParam("Pid"),
												"Omoney": donateMoney,
												"Uid": Uid
											},
											success: function(msg) {

											},
											error: function(data) {
												layer.msg("订单出错，请重试！！！");
												$(".login_red").html("订单出错，请重试！！！");
											}

										});
										$(".login_red").html("");
										layer.msg("支持成功");
										setTimeout(
											function() {
												$.ajax({
													type: "post",
													dataType: "json",
													url: "scanProjectById.do",
													data: {
														"Pid": pid,
														"donateMoney": donateMoney
													},
													success: function(msg) {
														$("#ppresentMoney").text(msg.ppresentMoney);
														$(".ppresentMoney").text(msg.ppresentMoney);
													}
												});
											}, 1000);

									} else {
										//支持错误
										layer.msg("支持错误");
										$(".login_red").html("支持错误");
									}
								},
								error: function(data) {
									layer.msg("支持出错，请重试！！！");
									$(".login_red").html("支持出错，请重试！！！");
								}

							});
						}
					} else {
						layer.open({
							title: "登录提示",
							content: '请登录后再来试试吧！',
							skin: "layer-ext-dialog"
						});
					}
					return false;
				}

			});
		});
	});
})