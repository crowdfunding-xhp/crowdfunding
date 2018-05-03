$(window).ready(function () {
    layui.use(['layer', 'laypage'], function () {
        // var laypage = layui.laypage;
        var layer = layui.layer;
        var laypage = layui.laypage;

        //获取url中的参数
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }

        var whichChoose = getUrlParam("Pcid");
        if (!whichChoose) {
            whichChoose = 0;
        }
        $(".siteIlB_box").find('.Pcid' + whichChoose + '').addClass("cur").siblings().removeClass("cur");

        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        /*页面  异步加载*/
        $.ajax({
            type: "post",
            url: "showList.do?pcid=" + whichChoose + "",
            dataType: "json",
            async: false,
            success: function (data) {
                var arr = [];
                var len = data.length;
                /*分页  开始*/
                //执行一个laypage实例
                laypage.render({
                    elem: 'sitePages' //注意，这里的 test1 是 ID，不用加 # 号
                    , count: len //数据总数，从服务端得到
                    , limit: 12//每页显示几条
                    , jump: function (obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                        console.log(obj.limit); //得到每页显示的条数
                        //第一页：1页0-9，第二页：2页10-19 第三页：3 20-29  总页数 len
                        $(".mainInnerBox .sousuoListBox").html("");

                        for (var i = (obj.curr - 1) * obj.limit; i < obj.curr * obj.limit; i++) {
                            //如果遍历到最大值，则gg
                            if (i > len - 1) {
                                break;
                            }
                            //获取数据
                            var item = data[i];
                            /*遍历页面*/
                            //获得对应数据的自定义标签
                            var tags = "";
                            $.each(item.ptags.split(" "), function (idx, val) {
                                tags += '<a href="javascript:void(0);" class="site_ALink siteIlB_item" target="_blank">' + val + '</a>';
                            });
                            //拼接
                            $(".mainInnerBox .sousuoListBox").append(
                                '<div class="ssCardItem">' +
                                '<a href="contents.html?Pid=' + item.pid + '" class="siteCardItemImgA souSuo" target="_blank">' +
                                '<img src="' + item.pimage + '" />' +
                                '</a>' +
                                '<div class="ssCardICBox siteCardICBox">' +
                                '<div class="ssCardICText">' +
                                '<h3>' +
                                '<a href="contents.html?Pid=' + item.pid + '" class="siteCardICH3" title="" target="_blank">【' + item.pname + '】' + item.pdescripTitle + '</a>' +
                                '</h3>' +
                                '<p class="siteCardIC_p souSuo">' + item.pdescripCont.substring(0, 15) + '</p>' +
                                '</div>' +
                                '<div class="siteCardFBox">' +
                                '<div class="siteCardFLabelBox siteIlB_box">' +
                                '<a href="javascript:void(0);" class="site_ALink siteIlB_item" target="_blank">' + item.ploc.split(",")[1] + '</a>' +
                                '<a href="javascript:void(0);" class="site_ALink siteIlB_item" target="_blank">' + item.ploc.split(",")[2] + '</a>' +
                                '' + tags + '' +
                                '</div>' +
                                '<div class="siteCardRatio">' +
                                '<div class="siteCardRatioInner" style="width: ' + Math.ceil(item.ppresentMoney * 100 / item.ptargetMoney) + '%;"></div>' +
                                '</div>' +
                                '<div class="siteCardFData">' +
                                '<div class="ftDiv">' +
                                '<p class="ftP">￥' + Math.ceil(item.ppresentMoney) + '</p>' +
                                '<p class="scP">已筹款</p>' +
                                '</div>' +
                                '<div class="scDiv">' +
                                /*'<p class="ftP">784</p>' +
                                '<p class="scP">支持数</p>' +*/
                                '</div>' +
                                '<div class="thDiv">' +
                                '<p class="ftP">' + Math.ceil(item.ppresentMoney * 100 / item.ptargetMoney) + '%</p>' +
                                '<p class="scP">筹款进度</p>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            );
                        }
                        layer.close(index);
                        //首次不执行
                        if (!first) {
                            //do something
                        }
                    }
                });
                /*分页  结束*/
            },
            error: function (data) {
                layer.close(index);
                //墨绿深蓝风
                layer.alert('页面加载失败，请刷新重试！', {
                    skin: 'layui-layer-molv', //样式类名
                    title: '提示',
                    closeBtn: 0,
                    icon: 2

                });
            }
        });
    });
});