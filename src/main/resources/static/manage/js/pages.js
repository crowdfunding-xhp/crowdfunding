function getOriginPic(src) {
    return src ? $.trim(src).replace(/_(crop|thumb)_[^.]*/, '') : '';
}
/**
 *
 * @desc 分页面板渲染通用函数
 * @param {Object} pageBox 分页外盒子
 * @param {Number} pageNum 总分页数
 * @param {Number} pageIndex 分页编码号
 */
function pagePanelFn(pageBox,pageNum,pageIndex){
    var newAItem=null;//新建normal A标签
    var curInit=pageIndex%5==0?pageIndex-4:pageIndex-pageIndex%5+1;
    var preIndex=pageIndex<=1?1:pageIndex-1;
    var nextIndex=pageIndex>=pageNum?pageNum:pageIndex+1;
    if(pageNum<=1){
        pageBox.parent().hide();
        return;
    }
    pageBox.empty();
    //pageBox.append($('<a href="javascript:;" class="ftLtPage" data-pagenum="1">首页</a>'));
    pageBox.append($('<a href="javascript:;" class="normalPage" data-pagenum='+preIndex+'>上一页</a>'));
    if(curInit>1){
        pageBox.append($('<a href="javascript:;" class="normalPage dot" data-pagenum='+(curInit-1)+'>...</a>'));
    }
    for(var i=curInit;i<=pageNum && i<=curInit+4;i++){
        newAItem=$('<a href="javascript:;" class="normalPage" data-pagenum='+i+'>'+i+'</a>');
        if(i==pageIndex){
            newAItem.addClass('cur');
        }
        pageBox.append(newAItem);
    }
    if(curInit+5<=pageNum){
        pageBox.append($('<a href="javascript:;" class="normalPage dot" data-pagenum='+(curInit+5)+'>...</a>'));
    }
    pageBox.append($('<a href="javascript:;" class="normalPage" data-pagenum='+nextIndex+'>下一页</a>'));
    //pageBox.append($('<a href="javascript:;" class="ftLtPage" data-pagenum='+pageNum+'>尾页</a>'));
}

/**
 * @desc 图片上传重用函数
 * @param {Number} dealID 项目加密ID
 * @param {Number} type 上传类型
 * @param {Function} sucCallBk (file, returnVal, response) 成功回调函数
 * @param {Function} faiCallBk (file, errorCode, errorMsg, errorString) 失败回调函数
 */
function uploadFn(dealID,type,sucCallBk,faiCallBk,picWrap){
    var obj = {
        formData: {
            dealID: dealID,
            type: type
        },
        fileObjName: 'images',
        swf: '/static/v3/static/uploadify/uploadify.swf?v=201',
        uploader: '/uploadimg',
        onUploadStart: function(file) {
            var formData = this.wrapper.uploadify('settings', 'formData');
            var session_name = $('#session_name').val();
            formData[session_name] = wx.cookie(session_name);
            this.wrapper.uploadify('settings', 'formData', formData);
        },
        onUploadSuccess: function (file, data, response) {
            sucCallBk(file, data, response,picWrap);
        },
        onUploadError: function (file, errorCode, errorMsg, errorString) {
            faiCallBk(file, errorCode, errorMsg, errorString);
        }
    }
    return obj;
}
/**
 *
 * @param {Object} wrap 图片列表外盒子
 * @param {String} imgSrc 图片地址
 * @return {Boolean} true表示已经满5张，false表示没有满5张
 */
function appendImg(wrap,imgSrc){
    var newDiv=$('<div class="zxjz_picItem siteImgBox"><a href="javascript:;"class="closeA"></a><img src=""/></div>');
    newDiv.find('img').attr('src',imgSrc);
    wrap.append(newDiv);
    if(wrap.find('.zxjz_picItem').size()>=5){
        return true;
    }else{
        return false;
    }
}
$(function(){

    var xqTabScrollFn;
    //项目ID
    var dealId=$('#jlxqOuterBox').data('dealid');
    var owner =$('#jlxqOuterBox').data('owner');
    var dealCode =$('#jlxqOuterBox').data('dealcode');
    var current =$('#jlxqOuterBox').data('current').split('|');
    var dealUserId =$('#jlxqOuterBox').data('userid');
    $('#zxjzBox').progress({
        dealId : dealId,
        dealCode : dealCode,
        isOwner : owner==0 ? false:true,
        uLink : $('.fqrCount a').attr('href'),
        uAvatar : $('.fqrCount').html()
    });
    $('#plOuterBox').comment({
        dealCode : dealCode,
        dealId : dealId,
        dealUserId :dealUserId,
        currentUser : {
            userId : current[0],
            username :  current[1],
            avatar :  current[2]
        }
    });
    var encryptDealId;//加密的项目ID
    (function(){
        var xqTabOBox=$('#xqTabOBox');
        var xqTabHeader=$('#xqTabHeader');
        var xqNavUl=$('#xqTabNav_ul');       
        var xqMainRightBox=$('.xqMainRightBox');
        var xqNavLis=xqNavUl.children();
        var xqTabHeight=xqTabOBox.height();
        var extraTop=16;
        var projectInfo = {
            'fqrInforBox': 'projectDetails', //项目详情
            'zxjzBox': 'projectStatus', //项目更新
            'plOuterBox': 'comment', //评论
            'zczOuterBox': 'record' //支持记录
        };
        xqNavUl.on('click','li',function(){
            $(this).parent().children().removeAttr('scroll-from-click');
            $(this).parent().children().removeClass('cur');
            $(this).addClass('cur').attr('scroll-from-click','scroll-from-click');
            var tarName=$(this).data('scrollto');
            gaTrack('project', projectInfo[tarName]); //项目详情
            var tarTop=$('#'+tarName).offset().top;
            $(window).scrollTop(tarTop-xqTabHeight-extraTop);
            var _this = $(this);
            setTimeout(function(){
                _this.removeAttr('scroll-from-click');
            },100);
        });
        var idArr=function(){
            var idArr=[];
            xqNavLis.each(function(){
                idArr.push($(this).data('scrollto'));
            });
            return idArr;
        }();
        //TODO 详情选项卡页面滑动时触发函数
        var leftheight=$(window).height()-83;
        var oleftheight=$(window).height()-83-xqTabOBox.offset().top;
        if(oleftheight<0){
            oleftheight=0;
        } 
        $('.rightfix-ch').css('height',oleftheight+'px');
        xqTabScrollFn=function(){
             var aleftheight=$(window).height()-83-(xqTabOBox.offset().top-$(document).scrollTop());
            var curObj = null;
            var classFlag = false;
            if ($(document).scrollTop()>xqTabOBox.offset().top) {
                xqTabHeader.addClass('fixLayout');
                 // xqMainRightBox.addClass('rightfix');
                 $('.switch').show();
                 $('.rightfix-ch').css('height',leftheight+'px');
            } else {
                xqTabHeader.removeClass('fixLayout');
                // xqMainRightBox.removeClass('rightfix');
                $('.rightfix-ch').css('height',aleftheight+'px');
                $('.switch').hide();
            }
            var oheight=$('.jlxqBox').height();
            var otop=$('.jlxqBox').offset().top;
            var obottom=oheight+otop-$(window).height();
            var btom=$(window).height()-(otop+oheight-$(document).scrollTop());
            function change () {
                if($(document).scrollTop()>=obottom){
                    xqMainRightBox.removeClass('rightfix');
                 $('.rightabs-ch').addClass('rightabs-ch1');
                }if($(document).scrollTop()<=obottom){
                    $('.rightabs-ch').removeClass('rightabs-ch1');
                }
                if($(document).scrollTop()>xqTabOBox.offset().top){
                     $('.rightfix-ch').css('height',leftheight+'px')
                 }
                 if($(document).scrollTop()<xqTabOBox.offset().top&&$(document).scrollTop()<obottom){
                     $('.rightfix-ch').css('height',aleftheight+'px');
                 }
            }
            change();
              $(window).resize(function(){
               change();
            }); 
            if($('[scroll-from-click]').length == 0) {
                xqNavLis.removeClass('cur');
                for (var i = idArr.length - 1; i >= 0; i--) {
                    curObj = $('#' + idArr[i]);
                    if (winTopFn() >= curObj.offset().top - xqTabHeight - 50) {
                        xqNavLis.eq(i).addClass('cur');
                        classFlag = true;
                        break;
                    }
                }
                if (!classFlag) {
                    xqNavLis.eq(0).addClass('cur');
                }
            }
        }
        //  // 右侧计算left值
        function w(){
            var ow=($(window).width()-1024)/2;
            var oleft=ow+717;
            $('.xqMainRightBox').css("left",oleft+'px');
        }
        w();
        $(window).resize(function(){
               w();
            });
        // 自定义滚动条
        // var oBox=document.getElementById('rightfix-ch');
        // var olist=document.getElementById('rightfix-ch1');
        // var gdr=document.getElementById('gdr');
        // if(olist.offsetHeight<oBox.offsetHeight)
        // {
        //     gdr.style.display='none';
        //     return;
        // }
        // if(olist.offsetHeight>oBox.offsetHeight){
        //     $('#rightfix-ch').hover(function() {
        //        $('#gdr').show();
        //     }, function() {
        //         $('#gdr').hide();
        //     });
        // }
    //     gdr.onmousedown=function(ev)
    // {
    //     var oEvent=ev||event;
    //     var x=oEvent.clientY-gdr.offsetTop;
    //
    //     var y=olist.offsetHeight;
    //     var oTop=olist.offsetTop;
    //     document.onmousemove=function(ev)
    //     {
    //         var oEvent=ev||event;
    //         var l=oEvent.clientY-x;
    //         if(l<0)
    //             {
    //                 l=0;
    //             }else if(l>oBox.offsetHeight-gdr.offsetHeight)
    //             {
    //                 l=oBox.offsetHeight-gdr.offsetHeight;
    //             };
    //             gdr.style.top=l+'px';
    //         var scale=l/(oBox.offsetHeight-gdr.offsetHeight);
    //         if(y-oBox.offsetHeight<0)
    //             {olist.style.top=0+'px'}
    //         else{
    //             olist.style.top=-scale*(y-oBox.offsetHeight)+'px';
    //             }
    //     };
    //     document.onmouseup=function()
    //     {
    //         document.onmousemove=null;
    //         document.onmouseup=null;
    //     };
    //     return false;
    // };
    //     oBox.onmousewheel=fnWheel;
    //     if(oBox.addEventListener)
    //     {
    //         oBox.addEventListener('DOMMouseScroll', fnWheel, false);
    //     }
    //      function fnWheel(ev)
    //     {
    //         var oEvent=ev||event;
    //         var bDown=true;
    //         var scale=oBox.offsetHeight-gdr.offsetHeight;
    //         var l=gdr.offsetTop;
    //         var y=olist.offsetHeight;
    //         if(oEvent.wheelDelta)
    //         {
    //             bDown=oEvent.wheelDelta<0;
    //         }
    //         else
    //         {
    //             bDown=oEvent.detail>0;
    //         }
    //
    //         var t=olist.offsetTop;
    //         if(bDown)
    //         {
    //             t=olist.offsetTop-50;
    //             if(t<-(olist.offsetHeight-oBox.offsetHeight))
    //             {
    //                 t=-(olist.offsetHeight-oBox.offsetHeight);
    //             }
    //              gdr.style.top=-scale*t/(y-oBox.offsetHeight)+'px';
    //         }
    //         else
    //         {
    //             t=olist.offsetTop+50;
    //
    //             if(t>0)t=0;
    //         }
    //         gdr.style.top=-scale*t/(y-oBox.offsetHeight)+'px';
    //
    //         olist.style.top=t+'px';
    //         if(oEvent.preventDefault)
    //         {
    //             oEvent.preventDefault();
    //         }
    //
    //         return false;
    //     };
    })();

    ////TODO 回复的发布按钮
    //$('.plDisFootBtn').click(function(){
    //    var curErrorP=$(this).next('.errorP');
    //    var curDisBox=$(this).parents('.plDiscBox:first');
    //    var curText=curDisBox.find('.zxjzTextArea');
    //    curErrorP.text("");
    //    if(emptyReg.test(curText.val())){
    //        curErrorP.text('内容不能为空!');
    //    }else{
    //        alert('发布成功！');
    //        curDisBox.hide();
    //    }
    //});
    ////TODO 回复和评论按钮,冒泡委托
    //$('#plListBox').on('click','.plReplayA,.plA',function(){
    //    var curDisBox=$(this).parent().next('.plDiscBox');
    //    if(curDisBox.css('display')=="none"){
    //        curDisBox.find('.errorP').text('');
    //        curDisBox.show();
    //        curDisBox.find('.zxjzTextArea').val('').focus();
    //    }else{
    //        curDisBox.hide();
    //    }
    //});
    ////TODO 发布“最新进展”&&“评论”
    ////$('.zxjz_publishA').click(function(){
    ////    debugger;
    ////    var curOuter=$(this).parents('.zxjz_inputOuterBox:first');
    ////    var curText=curOuter.find('.zxjzTextArea');
    ////    var curErrorP=$(this).next('.errorP');
    ////    var fname=$(this).data('fname');
    ////    var curPicWrap=$(this).parent().next('.zxjz_picList');
    ////    var imgArrs=function(){
    ////        var imgArrs=[];
    ////        curPicWrap.find('img').each(function(){
    ////            imgArrs.push($(this).attr('src'));
    ////        });
    ////    }
    ////    curErrorP.text("");
    ////    if(emptyReg.test(curText.val())){
    ////        curErrorP.text('内容不能为空!');
    ////    }else{
    ////        if(fname=="pl"){
    ////            alert('评论发布成功！');
    ////        }else if(fname=="zxjz"){
    ////            //alert('最新进展发布成功！');
    ////            debugger;
    ////            $.ajax({
    ////                type: "post",
    ////                url: "/deal-add_march",
    ////                data: {"id":dealId,"content":curText.val(),"image_url":imgArrs,"ajax":1},
    ////                dataType: "json",
    ////                success: function(returnVal){
    ////                    if(returnVal.status==1){
    ////                        $.ajax({
    ////                            type: "post",
    ////                            url: "/deal-add_march",
    ////                            data: {"id":dealId,"content":curText.val(),"image_url":imgArrs,"ajax":1},
    ////                            dataType: "json",
    ////                            success: function(returnVal){
    ////                                if(returnVal.status==1){
    ////
    ////                                }
    ////                            }
    ////                        });
    ////                    }
    ////                }
    ////            });
    ////        }
    ////        curText.val('');
    ////        curErrorP.text('');
    ////    }
    ////});
    //$('.pl_replayWrap').each(function(){
    //    var itemS=$(this).find('.pl_replayItem');
    //    if(itemS.size()>5){
    //        itemS.filter(':gt(4)').hide();
    //        $(this).next('.plReplay_moreA').css('display','block');
    //    }
    //});
    //$('#plListBox').on('click','.plReplay_moreA',function(){
    //    var curText=$(this).text();
    //    var itemS=$(this).prev('.pl_replayWrap').find('.pl_replayItem');
    //    if(/查看/.test(curText)){
    //        itemS.show();
    //        $(this).text(curText.replace('查看','收起'));
    //    }else if(/收起/.test(curText)){
    //        itemS.filter(':gt(4)').hide();
    //        $(this).text(curText.replace('收起','查看'));
    //    }
    //});
    //TODO 关注
    $('.deal_detail_like').on('click',function(){
        if(!isLogin){
            zc.show_login();
            return;
        }
        var curText=$(this).attr("title"),
            is_right = $(this).attr("is_right");
        var curNum=parseInt(curText.match(/\d+/)[0]);
        if(curText.indexOf('已关注')==-1){
            $.ajax({
                type: "GET",
                url: "/newproject-like",
                data: {"id":dealId},
                dataType: "json",
                success: function(data){
                    if(data.status==1){
                        $('.is_right').addClass('crt');
                        $(".is_right").text(curNum+1);
                        $(".deal_detail_like").attr('title','已关注('+(curNum+1)+')');
                    }else if(data.status==0){
                        alert('已经关注');
                    }
                }
            });
        }
    });
    //TODO 最新进展的图片上传功能
    //var zxjzUploadObj=uploadFn('b050992cdb3c632628d96ba6','7',function(file, returnVal, response,picWrap){
    //    var imgSrc="";
    //    returnVal= $.parseJSON(returnVal);
    //    var data=returnVal.data;
    //    if(returnVal.errno==0){
    //        imgSrc=data.image_data[0].image;
    //        //alert(imgSrc);
    //        if(appendImg(picWrap,imgSrc)){
    //            var curLeftBox=picWrap.prev().find('.zxjz_btnLeft');
    //            curLeftBox.hide();
    //        }
    //    }else{
    //        alert(returnVal.error);
    //    }
    //},function(){
    //    alert('上传操作出错！');
    //},$('#zxjz_picList'));
    //$('#zxjz_picFile').uploadify(zxjzUploadObj);

    //TODO 支持者列表
    (function(){
        var pageSize=10;
        var curLoading=$('#zczloading');
        var zczTable=$('#zczTable');
        var zczTbody=zczTable.find('tbody');
        var zczPageBox=$('#zczPageBox');
        zczPageBox.on('click','a',function(){
            drawPanel($(this).data('pagenum'));
        });
        function tablePanelFn(returnVal){
            zczTbody.empty();
            var data=returnVal.data;
            var count=data.count;
            var offset=data.offset;
            var supList=data.support_list;
            var len=supList.length;
            var newTr=null;
            var counter=0;//计数器
            var curItem=null;
            var payTime;
            //没有支持者记录时
            if(len==0){
                zczTbody.append('<tr><td colspan="5">没有支持者记录</td></tr>');
                return;
            }
            for(var i= 0,max=supList.length;i<max;i++){
                curItem=supList[i];
                payTime=curItem.pay_time.split(/\s+/);
                newTr=$('<tr></tr>');
                //debugger;
                $('<td>').addClass('numBold').text(count-offset-counter).appendTo(newTr);
                $('<td>').addClass('numBold').html('<a href="javascript:void(0);" onClick="siXin('+curItem.user_id+',\''+curItem.user_name+'\');sitePop.showSixin('+curItem.user_id+');">'+curItem.user_name+'</a>').appendTo(newTr);
                if(curItem.return_type==3){
                    $('<td>').addClass('numBold').html('<p class="yelBold">¥'+curItem.deal_price+'</p><p class="grayColor">无私支持</p>').appendTo(newTr);
                }else{
                    $('<td>').addClass('numBold').html('<p class="yelBold">¥'+curItem.deal_price+'</p>').appendTo(newTr);
                }
                $('<td>').addClass('numBig').text(curItem.deal_num).appendTo(newTr);
                $('<td>').addClass('numBig').html('<p>'+payTime[0]+'</p><p>'+payTime[1]+'</p>').appendTo(newTr);
                zczTbody.append(newTr);
                counter++;
            }
        }

        function drawPanel(pageIndex){
            var obj = $('<div id="supporter_list_loading_panel"></div>');
            if($('#supporter_list_loading_panel').length > 0){
                $("#supporter_list_loading_panel").remove();
            }
            $('#zczLoadWrap').append(obj);
            obj.css({
                'z-index':10001,
                position:'absolute',
                top:0,
                left:0,
                width:'100%',
                height:'100%',
                background:'url(/static/v3/static/images/loading.gif) #fff center no-repeat',
                opacity: 0.5,
                filter: 'Alpha(opacity=50)'
            });
            $.ajax({
                type: "GET",
                url: "/deal-support_list",
                data: {"id":dealId,'page_size':pageSize,'offset':(pageIndex-1)*10},
                dataType: "json",
                success: function(returnVal){
                    $("#supporter_list_loading_panel").remove();
                    if(returnVal.status!=1){
                        return;
                    }
                    var data=returnVal.data;
                    var supList=data.support_list;
                    var supLen=supList.length;//当前支持记录条数
                    var pageNum=Math.ceil(data.count/data.page_size);//分页数目
                    tablePanelFn(returnVal);
                    pagePanelFn(zczPageBox,pageNum,pageIndex);
                }
            });
        }
        drawPanel(1);
    })();
    //TODO 新手红包
    (function(){
        var xsHbPop=$('#xsHongBaoPop');
        var hongbaoBtn=$('#hongbaoBtn');
        var submitBtn=$('#hbSubmitBtn');
        var hbInput=$('#hongbaoInput');
        var hbCode=$('#xshbCodeInput');
        var statusSpan=xsHbPop.find('.statusSpan');
        var xshbLoginBox=xsHbPop.find('.xshbLoginBox');//填写手机号盒子
        var xshbValBox=xsHbPop.find('.xshbValBox');//获取红包内容盒子
        var codeBox=xshbLoginBox.find('.xshbCodeImg').parent();
        /**
         * 红包面板渲染函数
         * @param {JSON} returnVal ajax请求返回值
         */
        function hbPanelFn(returnVal){
            xshbLoginBox.add(xshbValBox).hide();
            var data=returnVal.data;
            //returnVal.status=0;
            if(returnVal.status==1){
                //手机号不为空，显示中奖金额页面
                if(!emptyReg.test(data.mobile)){
                    if(data.haved_hongbao==1){
                        statusSpan.addClass('show');
                    }else{
                        statusSpan.removeClass('show');
                    }
                    gaTrack('hongbao', 'getRedRnvelopeSuccess'); //成功领取红包
                    xshbValBox.find('.zj_p').html(parseInt(data.money)+'<b>元</b>');
                    xshbValBox.find('.accountTip_p').text('已存入'+data.mobile+'的账户');
                    if(data.haved_login==0){
                        xshbValBox.find('.xsHbBtn').val('马上登录领取').off('click').on('click',function(){
                            $(this).addClass('Js-showLogin');
                            xsHbPop.add(sitefixedMask).hide();
                        });
                    }else if(data.haved_login==1){
                        xshbValBox.find('.xsHbBtn').val('立即使用').off('click').on('click',function(){
                            $(this).removeClass('Js-showLogin');
                            xsHbPop.add(sitefixedMask).hide();
                        });
                    }

                    xshbValBox.show();
                //手机号为空时，显示要输入手机号的界面
                }else{
                    //debugger;
                    //hbInput.add(hbCode).val('');
                    xshbLoginBox.show();
                    switch (data.is_verify){
                        case 0:{
                            codeBox.hide();
                            break;
                        }
                        case 1:{
                            codeBox.show();
                            break;
                        }
                        case 2:{
                            alert('验证码不能为空！');
                            break;
                        }
                        case 3:{
                            alert('验证码输入错误！')
                            break;
                        }
                    }

                }
                xsHbPop.add(sitefixedMask).show();
            }else if(returnVal.status==0){
                //alert(returnVal.info);
                xsHbPop.hide();
                sitePop.conformPop('提示',returnVal.info);
            }
        }
        submitBtn.click(function(){
            var inputVal=hbInput.val();
            var codeVal=hbCode.val();
            var codeReg=/^[A-Za-z0-9]{4}$/;
            if(!phoneReg.test(inputVal)){
               alert('请填写正确的手机号!');
                return;
            }
            if(codeBox.css('display')!="none"){
                if(!codeReg.test(codeVal)){
                    alert('请填写正确的验证码！');
                    return;
                }
            }
            gaTrack('hongbao', 'getImmediate');//立即领取
            $.ajax({
               type: "GET",
               url: "/hongbao-first",
               data:{'mobile':inputVal,'code':codeVal},
               dataType: "json",
               success: function(returnVal) {
                   hbPanelFn(returnVal);
               }
            });
       });
        hongbaoBtn.click(function(){
            gaTrack('hongbao', 'getRedRnvelope');//领取新人红包
            $.ajax({
                type: "GET",
                url: "/hongbao-first",
                dataType: "json",
                success: function(returnVal){
                    hbPanelFn(returnVal);
                }
            });
        });
    })();
    //TODO 邀请朋友支持
    (function(){
        var inviteFriends=$('.support.btn_ALink');
        inviteFriends.click(function(e){
            gaTrack('inviteFriends', 'inviteFriends'); //邀请朋友支持
        })
    })();
    //TODO 支付按钮
    (function(){
        $('.xqDetail_supA.1.btn_ALink,.wszc_submitBtn.1,.zczFoot.1').on('click', function(e){
            gaTrack('pay', 'immediateOffers');//立即支持
        });
    })();
    //TODO 联系我按钮
    (function(){
        $('.lianxi').click(function(e){
            gaTrack('connectToMe', 'connectToMe');//联系我
        })
    })();
    //TODO 私信
    (function(){
        $('a.sixin').click(function(e){
            gaTrack('personalLetter', 'personalLetter');//私信
        })
    })();
    //TODO 关注按钮
    (function(){
        $('.jlxqr.gznow.deal_detail_like').click(function(e){
            gaTrack('followMe', 'followMe');//关注
        })
    })();

    //TODO 分享
    (function(){
        $('.share-box').click(function(e){
            gaTrack('share', 'share');//分享
        })
    })();
    //TODO 右侧浮动按钮关注我
    (function(){
        $('.scbtn.deal_detail_like').click(function(e){
            gaTrack('followMe', 'followMeFromRight');//关注我
        })
    })();
    //TODO 右侧浮动按钮分享
    (function(){
        $('a.fxbtn').click(function(e){
            gaTrack('share', 'shareFromRight');//分享
        })
    })();

    //TODO 右侧浮动按钮意见反馈
    (function(){
        $('#RS_yjfkBox_right').click(function(e){
            gaTrack('advice', 'advice');//意见反馈
        })
    })();
    //TODO 右侧浮动按钮置顶
    (function(){
        $('a.gotop').click(function(e){
            gaTrack('goTop', 'goTop');//置顶
        })
    })();
    //TODO 点击投资认证
    (function(){
        $('#tzrrz_loginBtn').click(function(e){
            gaTrack('invest', 'authenticationFromButtom');//点击投资认证按钮
        })
    })();

    //TODO 页面滚动触发的js逻辑
    $(window).scroll(function(){
        try{
            xqTabScrollFn();
        }catch (ex){

        }
    });
    $('body').on('click','.xqMainLeftBox .picItem img',function(){
        var imgList= $(this).parents('.picListBox:first').find('img');
        var listLen=imgList.length;
        var curIndex=$(this).parent('.picItem:first').index();
        var curImgObj=$(this);
        if(listLen>=2){
            sitePop.oriPic(curImgObj.attr('src').replace(/_crop_.*\./,'.'),'pop',function(direction){
                var srcStr="";
                var tarIndex;
                if(direction=="pre"){
                    if(curIndex<=0){
                        tarIndex=listLen-1;
                    }else{
                        tarIndex=curIndex-1;
                    }
                }else if(direction=="next"){
                    if(curIndex>=listLen-1){
                        tarIndex=0;
                    }else{
                        tarIndex=curIndex+1;
                    }
                }
                srcStr=imgList.eq(tarIndex).attr('src')
                curImgObj=imgList.eq(tarIndex);
                curIndex=tarIndex
                return srcStr.replace(/_crop_.*\./,'.');
            });
        }else{
            sitePop.oriPic(curImgObj.attr('src').replace(/_crop_.*\./,'.'),'pop');
        }
    });
    $('body').on('click','.xqMainLeftBox .plItemPicItem img',function(){
        var imgList= $(this).parents('.plItemPicBox:first').find('img');
        var listLen=imgList.length;
        var curIndex=$(this).parent('.plItemPicItem:first').index();
        var curImgObj=$(this);
        if(listLen>=2){
            sitePop.oriPic(curImgObj.attr('src').replace(/_crop_.*\./,'.'),'pop',function(direction){
                var srcStr="";
                var tarIndex;
                if(direction=="pre"){
                    if(curIndex<=0){
                        tarIndex=listLen-1;
                    }else{
                        tarIndex=curIndex-1;
                    }
                }else if(direction=="next"){
                    if(curIndex>=listLen-1){
                        tarIndex=0;
                    }else{
                        tarIndex=curIndex+1;
                    }
                }
                srcStr=imgList.eq(tarIndex).attr('src')
                curImgObj=imgList.eq(tarIndex);
                curIndex=tarIndex
                return srcStr.replace(/_crop_.*\./,'.');
            });
        }else{
            sitePop.oriPic(curImgObj.attr('src').replace(/_crop_.*\./,'.'),'pop');
        }
    });
    $('body').on('click','.xqMainRightBox .picItem img',function(){
        var imgList= $(this).parents('.zcjePicList:first').find('img');
        var listLen=imgList.length;
        var curIndex=$(this).parent('.picItem:first').index();
        var curImgObj=$(this);
        if(listLen>=2){
            sitePop.oriPic(getOriginPic(curImgObj.attr('src')),'pop',function(direction){
                var srcStr="";
                var tarIndex;
                if(direction=="pre"){
                    if(curIndex<=0){
                        tarIndex=listLen-1;
                    }else{
                        tarIndex=curIndex-1;
                    }
                }else if(direction=="next"){
                    if(curIndex>=listLen-1){
                        tarIndex=0;
                    }else{
                        tarIndex=curIndex+1;
                    }
                }
                srcStr=imgList.eq(tarIndex).attr('src')
                curImgObj=imgList.eq(tarIndex);
                curIndex=tarIndex
                return getOriginPic(srcStr);
            });
        }else{
            sitePop.oriPic(getOriginPic(curImgObj.attr('src')));
        }
    });
    //TODO 无私支持
    (function(){
        var aS=$('#wszcWrap').find('a');
        var curIndex=0;
        var wrap=$('#wszcWrap');
        var input=$('#wszc_input');
        wrap.on('click','a',function(){
            aS.removeClass('cur');
            $(this).addClass('cur');
            curIndex=$(this).index();
        });
        input.on({
            'focus':function(){
                aS.removeClass('cur');
                if(emptyReg.test(input.val())){
                    input.val('');
                }
            },
            'blur':function(){
                if(emptyReg.test(input.val())){
                    aS.eq(curIndex).addClass('cur');
                }
            }
        });
        $('#wszc_Btn').click(function(){
            //debugger;
            var val;
            var tarUrl=$(this).data('tarurl');
            if($(this).hasClass('disabled')){
                return;
            }
            if(aS.hasClass('cur')){
                val=aS.filter('.cur').text().replace(/\D*/g,'');
            }else{
                if(/^\s*\d+\s*$/g.test(input.val())){
                    val= $.trim(input.val());
                }else{
                    alert('请输入正确的其他金额');
                    return;
                }
            }
            location.assign(tarUrl+val);
        });
    })();

    // 点击回报项或详情页的立即支持button，没有登录的直接弹出登录窗口(无私支持除外），登录或注册成功后直接进入下单页
    if( $('#siteHTopBox').data('status') == 'off' ){
        $('.zcje_ItemBox .newMaskBox a').hide();



        //$('.xqDetailBtnBox .xqDetail_supA ,.xqMainRightBox .xqMainRight_btn').attr('href','javascript:;');

        $('.xqDetailBtnBox .xqDetail_supA ,.xqMainRightBox .xqMainRight_btn ,.zcjeOuterBox .zcje_ItemBox .js-linkTaget').each(function(i,ele){
            var href = $(this).attr('href');
            $(this).attr('_href',href).attr('href','javascript:;')
        });


    }
    $('body').on('click','.zcjeOuterBox .zcje_ItemBox ,.xqDetailBtnBox .xqDetail_supA ,.xqMainRightBox .xqMainRight_btn',function(){
        if( $('#siteHTopBox').data('status') == 'off' ){
            if( $(this).hasClass('js-linkTaget') ){
                var href = $(this).attr('_href');
            }else{
                var href = $(this).find('.js-linkTaget').attr('_href');
            }

            zc.show_login(function(){
                location.href = href;
            })
        }
    });


    $(window).resize(function(){
      $('.pop-bg').css('height',$(window).height()+'px');
    }); 
    $('.pop-bg').css('height',$(window).height()+'px');
    $('.close').click(function() {
       $('.pop-bg,.project-lead').hide();
    });
     // 右侧悬浮固定
    $(window).scroll(function() {
        $('.xqgotop').css('display','block');
        if($(window).scrollTop()==0){
           $('.xqgotop').hide();
        }
    });
    $('.xqgotop .gotop').click(function() {
       $('body,html').animate({scrollTop: 0}, 400);
    });
     // 计算定位位置
    function gotop(){
     // var oright=($(window).width()-1024)/2-60;
     var oright=($(window).width()-1024)/2-140;
     $('.xqgotop').css('right',oright+'px')
    }
    $(window).resize(function() {
       gotop();
    });
gotop();
// 标题移动
    var omove=document.getElementById('move');
    var owidth=$('.jlxqh3_wai').width();
    var timer=null;
    var oleft=-($('#move').width()-owidth);
    var speed=-1;
    if($('.jlxqTitle_h3').width()>owidth){
        $('.jlxqh3_wai').hover(function() {
            timer=setInterval(function(){
            if(omove.offsetLeft>=0){
                speed=-1;
                }
            if(omove.offsetLeft<=oleft){
                speed=1;    
            }
                omove.style.left=omove.offsetLeft+speed+'px';
        },30);
        }, function() {
            clearInterval(timer);
            omove.style.left=0;
        });
    }
    // 关注添加效果
    $('.gznow,.scbtn').click(function() {
        if(isLogin){
            $('.guanzhu,.scbtn').addClass('now');
        }
    });
    var oTage = document.getElementById('tage');
    var s = oTage.offsetTop;  //自己距离顶部的高度offsetH
    $(window).scroll(function(){
        var oRight = document.getElementById('right');
        var oLeft = document.getElementById('left');
        var oLeftH = oLeft.scrollHeight;
        var oLeftOffsetTop  = oLeft.offsetTop;

        var winH = document.documentElement.clientHeight || document.body.clientHeight;//可视区域高度
        var winW = document.documentElement.clientWidth || document.body.clientWidth ;//可视区域宽度
        // 自己距离顶部的高度offsetH
        // 自己的高度ownH
        // 屏幕高度winH
        // 滚动条scrollH
        // 当winH  scrollH >ofsetH+ownH  这个时候就是底部对齐的
        // 因为这一阵子 右边的内容已经看到底了
        // 当 offetH < scrollH 回到原来的状态


        //右侧内容低于左侧内容时
        //左侧内容过短时

        var oRightH = oRight.scrollHeight;    //自己的高度
        var oRightOffsetTop = oRight.offsetTop;  //自己距离顶部的高度offsetH
        var oRightOffsetL = oRight.offsetLeft;  //自己距离左侧的宽度
        var distance = (winW -1024)/2+717; //右侧距离
        var scrollH = document.body.scrollTop || document.documentElement.scrollTop; //滚动条
        // 当右侧高度大于可视屏幕高度时 右侧走完时
        if(oRightH > winH) {
            if ((winH + scrollH) > (oRightOffsetTop + oRightH) || ( scrollH - winH) < (oRightH + oRightOffsetTop)) {
                oRight.style.position = 'fixed';
                oRight.style.bottom = 0;
                // oRight.style.marginTop = 0;
                oRight.style.left = distance + 'px';
            }
            //当左侧内容滚完的时候
            if ((winH + scrollH) > (oLeftH + s)) {
                oRight.style.position = 'absolute';
                oRight.style.bottom = 20 + 'px';
                // oRight.style.marginTop = 30 + 'px';
                oRight.style.left = 690 + 'px';
            }
            if (scrollH < winH || (scrollH -winH) < (oRightH-winH)) 
            {
                oRight.style.position = '';
                oRight.style.bottom = '';
                // oRight.style.marginTop = 30+'px';
                // oRight.style.right = '';
            }
        }
        else{
            var space = winH - oRightH;
            if ((winH + scrollH) > (oRightOffsetTop + oRightH) )
            {
                oRight.style.position = 'fixed';
                oRight.style.marginTop = 0;
                oRight.style.left = distance +'px';
                oRight.style.bottom = space +'px' ;
            }
            //当左侧内容滚完的时候
            if ((winH + scrollH-space) > (oLeftH + s))
            {
                oRight.style.position = 'absolute';
                oRight.style.bottom = 20+'px';
                // oRight.style.marginTop = 30 + 'px';
                oRight.style.left = 690 +'px';
            }
            if(scrollH < winH)
            {
                oRight.style.position = '';
                oRight.style.bottom = '';
            }
        }
    });
});
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
