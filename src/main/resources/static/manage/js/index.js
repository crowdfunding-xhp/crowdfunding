$(window).ready(function () {
    // 首页加载项目 start
    layui.use('layer', function () {
        var layer = layui.layer;
        /*加载层画面*/
        var index = layer.load(0, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        // 思路：请求服务器数据ajax
        // ，得到项目所有信息（每一类请求前6项），
        // 根据PCid进行分类，if (pcid==1/2/3/4){拼接页面}
        // 点击链接：href=coments.html?Pid=?
        $.ajax({
            type: "post",
            url: "showIndex.do",
            dataType: "json",
            scriptCharset: 'utf-8',
            success: function (data) {
                console.log(data);
                // 从json中取数据
                $.each(data, function (i, val) {
                    var a = val.ploc;
                    if (a) {
                        console.log(a.split(","));
                    } else {
                        a = "未知,未知";
                    }
                    $(".pcid" + val.pcid + " .indCardListWrap").append(
                        '<div class="indCardItem">' +
                        '<a href="contents.html?Pid=' + val.pid + '" class="siteCardItemImgA ind" target="_blank"> ' +
                        '<img src="' + val.pimage + '" alt="" /> <span class="siteCardStatus"></span>' +
                        '</a>' +
                        '<div class="indCardICBox siteCardICBox">' +
                        '<div class="indCardICText">' +
                        '<a href="contents.html?Pid=' + val.pid + '" class="siteCardICH3" target="_blank">' + val.pdescripTitle + '</a>' +
                        '<p class="siteCardIC_p ind">' + val.pdescripCont + '</p>' +
                        '</div>' +
                        '<div class="siteCardFBox">' +
                        '<div class="siteCardFLabelBox siteIlB_box">' +
                        '<a href="javascript:void(0);" class="site_ALink siteIlB_item" target="_blank">' + val.ploc.split(",")[0] + '</a>' +
                        '<a href="javascript:void(0);" class="site_ALink siteIlB_item" target="_blank">' + val.ploc.split(",")[1] + '</a>' +
                        '<a href="javascript:void(0);" class="site_ALink siteIlB_item" target="_blank">' + val.pname + '</a>' +
                        '<a href="javascript:void(0);" class="site_ALink siteIlB_item" target="_blank">' + val.pcid + '</a>' +
                        '</div>' +
                        '<div class="siteCardRatio">' +
                        '<div class="siteCardRatioInner" style="width: ' + Math.ceil(val.ppresentMoney * 100 / val.ptargetMoney) + '%;"></div>' +
                        '</div>' +
                        '<div class="siteCardFData">' +
                        '<div class="ftDiv">' +
                        '<p class="ftP">￥' + val.ppresentMoney + '</p>' +
                        '<p class="scP">已筹款</p>' +
                        '</div>' +
                        '<div class="scDiv">' +
                        /* '<p class="ftP">22</p>' +
                         '<p class="scP">支持数</p>' +*/
                        '</div>' +
                        '<div class="thDiv">' +
                        '<p class="ftP">' + Math.ceil(val.ppresentMoney * 100 / val.ptargetMoney) + '%</p>' +

                        '<p class="scP">筹款进度</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );
                });
                layer.close(index);
            },
            error: function () {
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
    // 首页加载项目end
});