$(function() {
	// 页面加载时初始化
	/* 页面加载时，初始化输入框文字颜色 */
	$("input[data-valid=valid]").css("color", "#999");
	/* 页面加载时，初始化三级联动中的隐藏值 */
	$("input[name=ploc]").val(",");
	// $("input[name=jungle1]").val("--");

	/* 初始化项目类型的值 */
	$("input[name=pcid]").val($(".pro-type .cur").attr("data-val"));
	/* 选择项目类型时该变选取值 */
	$(".pro-type").children().click(function() {
		$(this).addClass("cur").siblings().removeClass("cur");
		$("input[name=pcid]").val($(this).attr("data-val"));
	});

	/* 选择回报类型时该变选取值 */
	// $("input[name=PrepayType]").val(2);
	/*
	 * $(".service-list").children().click(function() { alert(0)
	 * $(this).find("i").addClass("cur");
	 * $(this).siblings().find("i").removeClass("cur");
	 * $("input[name=PrepayType]").val($(this).val());
	 * alert($("input[name=PrepayType]").val()); });
	 */

	/* 获得焦点时，改变文字颜色，并清空默认值 */

	$("input[data-valid=valid]").focus(function() {
		$(this).css("color", "#333");
		var iptVal = $(this).val();
		if(iptVal == this.defaultValue) {
			$(this).val("");
		}
	});
	/* 失去焦点时，如果没有输入任何内容，则变为默认值 */
	$("input[data-valid=valid]").blur(function() {
		var iptVal = $(this).val();
		if(iptVal == "") {
			$(this).css("color", "#999");
			$(this).val(this.defaultValue);
		}
	});

	/* 省市县三级联动，省初始化 start */
	var html_province = "<option value=''>省份（市）</option>";
	var html_city = "<option value=''>市（区）</option>";
	var html_area = "<option value=''>县、镇</option>";

	$.each(pdata, function(idx, item) {
		if(parseInt(item.level) == 0) {
			html_province += "<option value='" + item.names + "' exid='" +
				item.code + "'>" + item.names + "</option>";
		}
	});
	$(".input_province").append(html_province);
	$(".input_city").append(html_city);
	$(".input_area").append(html_area);
	/* 省市县三级联动，省初始化 end */

	/* layui开始 */
	layui.use(['form', 'upload', 'layer', 'laydate'], function() {
		// 变量存 加载的模块
		var layer = layui.layer,
			form = layui.form,
			upload = layui.upload,
			laydate = layui.laydate;

		// 配置
		layer.config({
			extend: 'myskin/style.css', // 加载您的扩展样式
		});

		/* 其他需要的操作 */

		// 执行一个laydate实例  时间插件
		laydate.render({
			elem: '#pdate' // 指定元素
		});

		/* 省市联动公共函数 */
		var province_city = function(data) {
			/*
			 * console.log(data.elem); //得到select原始DOM对象
			 * console.log(data.value); //得到被选中的值
			 * console.log(data.othis); //得到美化后的DOM对象
			 */
			var elem = $(data.elem);

			// 当前city对象
			var elem_city = elem.closest(".pro_city_area")
				.find(".input_city");
			// 当前area对象
			var elem_area = elem.closest(".pro_city_area")
				.find(".input_area");
			// 当前city option对象
			var elem_city_option = elem.closest(
					".pro_city_area")
				.find(".input_city option");
			// 当前area option对象
			var elem_area_option = elem.closest(
					".pro_city_area")
				.find(".input_area option");

			$(elem_city_option).remove();
			$(elem_area_option).remove();

			if(data.value == '') {
				$(elem_city).append(html_city);
				$(elem_area).append(html_area);
				form.render('select'); // 这个很重要
				return;
			}
			var code = $(data.elem).find("option:selected")
				.attr("exid");
			code = code.substring(0, 2);
			var html = html_city;
			$(elem_area).append(html_area);
			$.each(pdata, function(idx, item) {
				if(parseInt(item.level) == 1 &&
					code == item.code.substring(0, 2)) {
					html += "<option value='" + item.names +
						"' exid='" + item.code + "'>" +
						item.names + "</option>";
				}
			});
			$(elem_city).append(html);

			form.render('select'); // 这个很重要,刷新select选择框
		};
		/* 市县联动公共函数 */
		var city_area = function(data) {
			var elem = $(data.elem);
			// 当前area对象
			var elem_area = elem.closest(".pro_city_area")
				.find(".input_area");
			// 当前area option对象
			var elem_area_option = elem.closest(
					".pro_city_area")
				.find(".input_area option");

			$(elem_area_option).remove();
			if(data.value == "") {
				$(elem_area).append(html_area);
				form.render('select'); // 这个很重要
				return;
			}

			var code = $(data.elem).find("option:selected")
				.attr("exid");
			code = code.substring(0, 4);
			var html = "";
			$(elem_area).append(html_area);
			$.each(pdata, function(idx, item) {
				if(parseInt(item.level) == 2 &&
					code == item.code.substring(0, 4)) {
					html += "<option value='" + item.names +
						"' exid='" + item.code + "'>" +
						item.names + "</option>";
				}
			});
			$(elem_area).append(html);

			form.render('select'); // 这个很重要
		};

		var pro0 = '',
			city0 = '',
			area0 = '';
		var pro1 = '',
			city1 = '',
			area1 = '';

		// 省市联动
		form.on('select(input_province)', function(data) {
			pro0 = data.value;
			province_city(data);
		});

		/* 市县联动 */
		form.on('select(input_city)', function(data) {
			city0 = data.value;
			city_area(data);
		});
		/* 刷新县1 */
		form.on('select(input_area)', function(data) {
			area0 = data.value;
			form.render('select');
		});

		// 省市联动2
		form.on('select(input_province1)', function(data) {
			pro1 = data.value;
			province_city(data);
		});

		/* 市县联动2 */
		form.on('select(input_city1)', function(data) {
			city1 = data.value;
			city_area(data);
		});
		/* 刷新县2 */
		form.on('select(input_area1)', function(data) {
			area1 = data.value;
			form.render('select');
		});

		// 金额验证
		$(".money").keyup(function() {
			var reg = $(this).val().match(/\d+\.?\d{0,2}/);
			var txt = '';
			if(reg != null) {
				txt = reg[0];
			}
			$(this).val(txt);
		}).change(function() {
			$(this).keypress();
			var v = $(this).val();
			if(/\.$/.test(v)) {
				$(this).val(v.substr(0, v.length - 1));
			}
		});
		$("#raise_submit").click(function() {
			$(".pro_city_area input[name = ploc]").val(pro0 + "," + city0 + "," + area0);
			validate();
		});
	});
	/* layui 结束 */
	/*验证  开始*/
	function validate() {
			return $("#fromVal").validate({
				onkeyup: null,
				submitHandler: function(form) {
					var loading;
					var isLogin = getUserCookie();
					/*使用jquery.form.js  进行表单上传  解决文件上传问题*/
					$("#fromVal").ajaxSubmit({
						type: "post",
						url: "raiseProject.do",
						data: {
							"uid": isLogin.Uid
						},
						timeout: 3000,
						//	beforeSubmit: raiseValidates,
						beforeSubmit: function() {
							loading = layer.load({
								time: 10 * 1000
							});
						},
						success: function(data) {
							if(data) {
								layer.close(loading);
								//墨绿深蓝风
								layer.alert('提交成功，请等待审核！', {
									skin: 'layui-layer-molv', //样式类名
									title: '提示',
									closeBtn: 0,
									icon: 1
								}, function() {
									window.location.href = "projManage.html";
								});
							} else {
								//墨绿深蓝风
								layer.alert('申请失败，请检查后重试！', {
									skin: 'layui-layer-molv', //样式类名
									title: '错误',
									closeBtn: 0,
									icon: 2
								});
							}
						}
					});
					return false;
				},
				rules: {
					paccountName: {
						isDefault: true,
						required: true,
						rangelength: [2, 5]
					},
					pidentify: {
						isDefault: true,
						required: true,
						idCardNo: true
					},
					paccountTel: {
						isDefault: true,
						required: true,
						mobile: true
					},
					ploc: {
						isDefault: true,
						required: true
					},
					jungle1: {
						isDefault: true,
						required: true
					},
					file: {
						required: true
					},
					pname: {
						required: true,
						isDefault: true,
						// chcharacter: true,
						rangelength: [2, 40]
					},
					pcontent: {
						required: true,
						isDefault: true,
						rangelength: [1, 1000]
					},
					ptargetMoney: {
						required: true,
						isDefault: true
					},
					praiseDays: {
						required: true,
						isDefault: true,
						digits: true
					},
					pdescripTitle: {
						required: true,
						isDefault: true,
						rangelength: [1, 20]
					},
					pdescripCont: {
						required: true,
						isDefault: true,
						rangelength: [1, 1000]
					},
					supportMoney: {
						required: true,
						isDefault: true
					},
					prepayTitle: {
						required: true,
						isDefault: true,
						rangelength: [1, 50]
					},
					prepayCont: {
						required: true,
						isDefault: true,
						rangelength: [1, 1000]
					},
					pimage: {
						required: true,
						isDefault: true
					},
					pdate: {
						required: true,
						isDefault: true
					}
				},
				messages: {
					paccountName: {
						isDefault: "请输入用户名",
						required: "请输入用户名",
						rangelength: $.validator.format("用户名长度必须在：{0}-{1}之间")
					},
					pidentify: {
						isDefault: "请输入二代身份证号码",
						required: "请输入二代身份证号码"
					},
					paccountTel: {
						isDefault: "请输入手机号码",
						required: "请输入手机号码"
					},
					ploc: {
						isDefault: "必须",
						required: "必须"
					},
					jungle1: {
						isDefault: "请选择城市",
						required: "请选择城市"
					},
					pname: {
						required: "请输入项目标题",
						isDefault: '请输入项目标题',
						chcharacter: "请输入中文",
						rangelength: $.validator.format("长度必须在：{0}-{1}之间")
					},
					pcontent: {
						required: "请输入筹资目的",
						isDefault: '请输入筹资目的',
						rangelength: $.validator.format("长度必须在：{0}-{1}之间")
					},
					ptargetMoney: {
						required: "请输入筹资金额",
						isDefault: "请输入筹资金额"
					},
					praiseDays: {
						required: "请输入筹资天数",
						isDefault: "请输入筹资天数",
						digits: "格式不正确，请输入数字"
					},
					pdescripTitle: {
						required: "请输入标题",
						isDefault: "请输入标题",
						rangelength: $.validator.format("长度必须在：{0}-{1}之间")
					},
					pdescripCont: {
						required: "请输入详细描述",
						isDefault: "请输入详细描述",
						rangelength: $.validator.format("长度必须在：{0}-{1}之间")
					},
					supportMoney: {
						required: "请输入支持金额",
						isDefault: "请输入支持金额"
					},
					prepayTitle: {
						required: "请输入回报标题",
						isDefault: "请输入回报标题",
						rangelength: $.validator.format("长度必须在：{0}-{1}之间")
					},
					prepayCont: {
						required: "请输入回报内容",
						isDefault: "请输入回报内容",
						rangelength: $.validator.format("长度必须在：{0}-{1}之间")
					},
					pimage: {
						required: "请上传封面",
						isDefault: "请上传封面"
					},
					pdate: {
						required: "请选择筹款开始时间",
						isDefault: "请选择筹款开始时间"
					}
				},
				errorPlacement: function(error, element) { // 错误提示信息放置的位置
					$(element).parents(".layui-form-item").find(".tips").append(error);
				},
				errorElement: "span"
			});
		}
});

// 上传图片预览
function preview(file) {
	var prevDiv = document.getElementById('preview');
	if(file.files && file.files[0]) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			prevDiv.innerHTML = '<img id="pic" src="' + evt.target.result +
				'" />';
		}
		reader.readAsDataURL(file.files[0]);
	} else {
		prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' +
			file.value + '\'"></div>';
	}
}