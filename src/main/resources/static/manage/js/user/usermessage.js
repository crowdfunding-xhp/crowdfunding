function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
window.onload=function()
{
    var str=getCookie(name);//定义变量
    var oText=document.getElementsByClassName("grzxInput sitePHInput ng-isolate-scope ng-pristine ng-valid ng-valid-required");
    oText.value=str;//给文本框赋值并显示
}