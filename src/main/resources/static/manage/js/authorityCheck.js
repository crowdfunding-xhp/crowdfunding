$(window).ready(function() {
	layui.use('layer', function() {
		var layer = layui.layer;

		var userInfo = $.cookie("userInfo");
		if(userInfo) {
			userInfo = eval("(" + userInfo + ")");
			//设置头像等信息
			$(".index-avatar img").attr("src", userInfo.Uimage);
			$(".nickname").text(userInfo.Unickname);
			$("input[name=Uid]").val(userInfo.Uid);

		} else {
			layer.open({
				title: "登录提示",
				content: '请登录后再来试试吧！',
				skin: "layer-ext-dialog"
			});
			window.location.href = "index.html";
		}
	});
})