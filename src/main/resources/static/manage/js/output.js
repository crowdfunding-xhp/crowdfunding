$(init);

function init () {
	deliver();
	output();
	deliveryModify();
	book();
}

function output(){
	$("#Js-outputItems").click(function(event) {
		var ids = [];
		$(".Js-order-checkbox").each(function(){
			if($(this).is(":checked"))
				ids.push($(this).val());
		});
		if(ids.length)
			$(this).attr('href','/corp-download/order_ids-'+ids.join());
		else
			wx.alert("请选择要导出的订单");
	});

	$("#Js-outputAll").click(function(event) {
		var search = $("#Js-search").serialize();
		$(this).attr('href','/corp-downloadall?'+search);
	});
}

function deliver(){
	$('.Js-deliver').click(modifyPop);
}

function modifyPop(){
	var type = $(this).data('type');
	wx.pop(wx.tpl(type=='0'?'#Js-deliverTpl':'#Js-deliverVirtualTpl',{id:$(this).data("id"),did:$(this).data("delivery_id"),data:$(this).data()}),{y:'10px'});
}

function delivery(data){
	if(data.status){
		if(data.download)
			wx.alert("已成功上传"+data.succ_cnt+"条，上传失败<span style='color:red;'>"+data.error_cnt+"</span>条，<a style='color:red;text-decoration: underline;' target='_blank' href='"+data.download+"'>下载失败列表</a>",function(){location.href= location.href+'-show-1#list';});
		else
			location.href= location.href+'-show-1#list';
	}
	else
		wx.alert(data.info);
}

function deliveryModify(){
	$(".Js-deliveryInfo").hover(function() {
		$(this).find("a").show();
	}, function() {
		$(this).find("a").hide();
	}).find("a").click(modifyPop);
}

function searchForm_before($form){
	var param=[],value=wx.stringToJson($form.serialize());
	for(var key in value){
		if(!value[key]) continue;
		param.push(key+'-'+value[key]);
	}
	location.href="/corp-search/"+param.join('-');
}

function book(){
	$(".Js-book").click(function(event) {
		wx.pop(wx.tpl('#Js-bookTpl',{id:$(this).data("id"),name:$(this).data("name")}),{y:'-90px',shown:function(){
			$("#Js-shadeLayer").width($(window).width());
		}});
	});
}
