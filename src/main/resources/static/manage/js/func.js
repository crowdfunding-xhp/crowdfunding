/**
 * Created by YL Huang on 2015/8/7.
 */
(function($) {
    var httpGet = function(url,data,callback){
        $.ajax({
            type: "get",
            url: url,
            data: data,
            success: callback
        });
    };
    var httpPost = function(url,data,callback){
        $.ajax({
            type: "post",
            url: url,
            data: data,
            success: callback
        });
    };
    var timeFormat = function (dateStr) {
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        function getDateTimeStamp(dateStr){
            return Date.parse(dateStr.replace(/-/gi,"/"));
        }

        function getDateDiff(dateTimeStamp) {
            var now = new Date().getTime();
            var diffValue = now - dateTimeStamp;
            if (diffValue < 0) {
                //若日期不符则弹出窗口告之
                //alert("结束日期不能小于开始日期！");
            }
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            var result = '';
            if (monthC >= 1) {
                //result = parseInt(monthC) + "个月前";
                result = '';
            }
            else if (weekC >= 1) {
                //result = parseInt(weekC) + "周前";
                result = '';
            }
            else if (dayC >= 1) {
                result = parseInt(dayC) + "天前";
            }
            else if (hourC >= 1) {
                result = parseInt(hourC) + "小时前";
            }
            else if (minC >= 1) {
                result = parseInt(minC) + "分钟前";
            } else if (minC < 1) {
                result = "刚刚";
            }
            return result;
        }

        var result = getDateDiff(getDateTimeStamp(dateStr));
        if(result==''){
            result = moment(dateStr).format('YYYY-MM-DD');
            if(result == 'Invalid date'){
                return '';
            }
        }
        return result;
    };
    var afterBuildUpload = function(id){
        setTimeout(function(){
            $('#'+id).removeClass('uploadify').css({
                width:86,
                height:36
            });
            $('.swfupload').css('z-index','999');
            $('#'+id).find('object').width(86).height(36);
            $('#'+id).hover(function(){
                $('#'+id+'-button').css({
                    'background-color': '#afc5e2',
                    'border-color':'#9eb7d8'
                });
            },function(){
                $('#'+id+'-button').removeAttr('style');
            });
            $('#'+id+'-button').addClass('zxjz_picA').removeClass('uploadify-button').html('选择图片');
            $('#'+id+'-queue').hide();
        },1000);
    };
    $.fn.progress = function(options) {
        var defaults = {
            dealId : '',
            dealCode : '',
            isOwner : false,
            uLink :'',
            uAvatar : ''
        };
        var opts = $.extend({}, defaults, options);
        var currentPage = 1;
        var pageSize = 10;
        var imgArr = [];
        var _this = $(this);
        var buildUpload = function(opts,btn,imgBox,id){
            btn.uploadify({
                queueSizeLimit:1,
                multi:false,
                height        : 36,
                width         : 86,
                swf           : '/static/v3/static/uploadify/uploadify.swf?v=201',
                uploader      : "/uploadimg",
                fileTypeDesc : 'Image Files',
                fileTypeExts : '*.gif;*.jpeg;*.jpg;*.png',
                fileObjName  : "images",
                formData     : {dealID: opts.dealCode,type: 7},
				onUploadStart: function(file) {
					var formData = this.wrapper.uploadify('settings', 'formData');
					var session_name = $('#session_name').val();
					formData[session_name] = wx.cookie(session_name);
					this.wrapper.uploadify('settings', 'formData', formData);
				},
                onUploadProgress : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                    var obj = $('<div id="progress_upload_progress_panel"></div>');
                    if($('#progress_upload_progress_panel').length > 0){
                        $("#progress_upload_progress_panel").remove();
                    }
                    $('#zxjzBox .zxjz_inputOuterBox').append(obj);
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
                },
                onUploadSuccess: function(file, data, response){
                    $("#progress_upload_progress_panel").remove();
                    var result= $.parseJSON(data);
                    if(result.error==0){
                        if(imgArr.length<5){
                            imgArr.push(result.data.image_data[0].image);
                            var front = result.data.image_data[0].image.substring(0,result.data.image_data[0].image.lastIndexOf('.'));
                            var end = result.data.image_data[0].image.substring(result.data.image_data[0].image.lastIndexOf('.'));
                            var showImg =  result.data.static_url + front+'_crop_75x55'+end;
                            imgBox.append('<div class="zxjz_picItem siteImgBox"><a index="'+imgArr.length+'" href="javascript:;"class="closeA"></a><img src="'+showImg+'"/></div>');
                            imgBox.find('.closeA').unbind('click').click(function(){
                                var index = imgArr.length - 1 - imgBox.find('.closeA').index(this);
                                imgArr.splice(index,1);
                                $(this).parent().remove();
                            });
                        }
                    }else{
                        wx.alert(result.error);
                    }
                }
            });
            afterBuildUpload(id);
        };
        var pagination = function(total,elem,callback){
            elem.parent().hide();
            if(total > pageSize){
                var pages = 0;
                if (total % pageSize > 0) {
                    pages = parseInt(total / pageSize,10) + 1;
                }else{
                    pages = parseInt(total / pageSize,10);
                }
                create(currentPage,elem,pages);
                elem.parent().show();
            }

            function create(page,elem,pages){
                var str_prv='<a class="prev normalPage">上一页</a>',
                    str_next='<a class="next normalPage">下一页</a>',
                    str_begin ='<div class="pager">',
                    str_end ='<div style="clear: both;"></div></div>',
                    str = '';
                var init = function(){
                    $(elem).html('');
                    if(currentPage != page){
                        currentPage = page;
                    }else{
                        currentPage = page;
                    }
                };
                var loop = function(begin,end){
                    for(var i=begin;i<=end;i++){
                        if(currentPage == i){
                            str += '<a class="cur normalPage">'+i+'</a>';
                        }else{
                            str += '<a class="normalPage">'+i+'</a>';
                        }
                    }
                };
                var addEndPage = function(){
                    str += '<a class="normalPage">'+(pages-1)+'</a>';
                    str += '<a class="normalPage">'+(pages)+'</a>';
                };
                var buildOther = function(){
                    str += '<a class="normalPage">1</a>';
                    str += '<a class="normalPage">2</a>';
                    if(currentPage>=7 && pages>10){
                        str += '<a class="normalPage" page="'+(currentPage-3)+'">...</a>';
                    }
                    if(pages-currentPage>5){
                        var begin = currentPage - 2;
                        var end = currentPage + 2;
                        if(end > pages){
                            end = pages;
                            begin = end - 4;
                            if(currentPage - begin < 2){
                                begin = begin-1;
                            }
                        }else if(end + 1 == pages){
                            end = pages-2;
                        }
                        loop(begin,end);
                        if(end != pages && pages-currentPage>3){
                            str += '<a class="normalPage" page="'+(currentPage+3)+'">...</a>';
                        }
                        if(currentPage<pages-2){
                            addEndPage();
                        }
                    }else{
                        loop(pages-6,pages);
                    }
                };
                var doPage = function(){
                    if(pages <= 8){
                        loop(1,pages);
                    }else{
                        if(currentPage <= 6){
                            loop(1,7);
                            if(pages>10){
                                str += '<a class="normalPage" page="8">...</a>';
                            }
                            addEndPage();
                        }
                        else{
                            buildOther();
                        }
                    }
                };
                var createElement = function(){
                    $(elem).html(str_begin + str_prv + str + str_next +str_end);
                    $(elem).find('a').click(function(){
                        if($(this).attr('class').indexOf('prev')>-1){
                            if(currentPage == 1){
                                return
                            };
                            create(page-1);
                            callback(page-1);
                            return;
                        }
                        if($(this).attr('class').indexOf('next')>-1){
                            if(currentPage == pages){
                                return
                            }
                            create(page+1);
                            callback(page+1);
                            return;
                        }
                        if($(this).attr('page')){
                            create(parseInt($(this).attr('page'),10));
                            callback(parseInt($(this).attr('page'),10));
                            return;
                        }
                        var val = parseInt($(this).text(),10);
                        create(val);
                        callback(val);
                    });
                };
                if(pages>1){
                    init();
                    doPage();
                    createElement();
                }else{
                    $(elem).html('');
                }
                $(elem).find('a').css('cursor','pointer');
            };
        };
        var addDeleteProgressEvent = function(){
            _this.find('#progressList a[delete-progress]').click(function(){
                var id = $(this).attr('delete-progress');
                wx.confirm('您确定要删除该条进展吗？',function(){
                    httpGet('/deal-delete_march',{id:id},function(data){
                        data = $.parseJSON(data);
                        wx.alert(data.info);
                        if(data.status == 1){
                            loadProgress(currentPage,pageSize);
                        }
                    });
                });
            });
        };
        var addSubmitProgressEvent = function(textElement,btnElement){
            textElement.on('keyup',function(){
               if($.trim($(this).val()).length>0){
                   btnElement.next().html('');
               }
                if($.trim($(this).val()).length>300){
                    btnElement.next().html('项目进展不能超过300字符');
                }
            });
            btnElement.click(function(){
                if(!$(this).attr('submitting')){
                    if($.trim(textElement.val()).length == 0){
                        $(this).next().html('请输入内容');
                    }
                    else if($.trim(textElement.val()).length > 300){
                        $(this).next().html('项目进展不能超过300字符');
                    }
                    else{
                       btnElement.attr('submitting','true').text('发布中...');
                        httpPost('/deal-add_march',{
                            id: opts.dealId,
                            content: $.trim(textElement.val()),
                            image_url:imgArr,
                            ajax:1
                        },function(data){
                            btnElement.removeAttr('submitting').text('发布');
                            data = $.parseJSON(data);
                            if(data.status == 1){
                                wx.alert('发布成功！');
                                imgArr=[];
                                $('#zxjz_picList').html('');
                                loadProgress(currentPage,pageSize);
                                textElement.val('');
                            }
                        });
                    }
                }
            });
        };
        var loadProgress = function(page,pageSize){
            httpGet('/deal-march_list',{
                id:opts.dealId,
                offset:(page-1)*pageSize,
                page_size:pageSize
            },function(respose){
                respose = $.parseJSON(respose);
                if(respose.status == 1){
                    _this.find('#progressList').html('');
                    var html = '';
                    if(respose.data.count>0 && respose.data.march_list.length ==0){
                        currentPage = page-1;
                        loadProgress(currentPage,pageSize);
                        return;
                    }
                    $.each(respose.data.march_list,function(i,item){
                        html+=buildProgressItem(item,respose.data.march_list,i);
                    });
                    _this.find('#progressList').html(html);
                    addDeleteProgressEvent();
                    $('[data-scrollto="zxjzBox"]').html('项目更新（<b>'+respose.data.count+'</b>）');
                    pagination(respose.data.count,$('#progressPagination'),function(page){
                        currentPage = page;
                        loadProgress(currentPage,pageSize);
                        $("html,body").animate({scrollTop:$("#zxjzBox").offset().top-70},300);
                    });
                }
            });
        };
        var buildProgressItem = function(item,list,i){
            var selfHtml = '',
                imageHtml = '',
                deleteHtml = '',
                lastInner = '';
            if(item.user_id > 0){
                //selfHtml = '<h3 class="zxjz_navItem_h3"><a href="'+opts.uLink+'" class="colorALink">'+$('.countA').text()+'</a>发起人</h3>';
                selfHtml = '<h3 class="zxjz_navItem_h3"><a href="javascript:void(0);" onClick="siXin('+item.user_id+',\''+item.user_name+'\');sitePop.showSixin('+item.user_id+');" class="colorALink">'+item.user_name+'</a>发起人</h3>';
            }
            if(item.is_self==1 && opts.isOwner){
                deleteHtml = '<a href="javascript:;" delete-progress="'+item.id+'" class="delA hoUdLink">删除</a>';
            }

            if(item.image.length >0){
                imageHtml+='<div class="picListBox clearfix">';
                $.each(item.image,function(j,image){
                    var front = image.substring(0,image.lastIndexOf('.'));
                    var end = image.substring(image.lastIndexOf('.'));
                    var showImg =  front+'_crop_75x55'+end;
                    imageHtml += '<div class="picItem siteImgBox"><img src="'+showImg+'"/></div>';
                });
                imageHtml+='</div>';
            }
            if(i==list.length-1){
                lastInner = '<div class="lastInner"></div>';
            }
            return '\
               <div class="zxjz_NavItem">\
                    <div class="zxjz_navItemInner">\
                        '+selfHtml+'\
                        <p class="textP">'+item.log_info+'</p>\
                        ' + imageHtml + lastInner + '\
                        <div class="zxjzILBox">\
                            <p class="timeP">'+timeFormat(item.create_time)+'</p>\
                            '+deleteHtml+'\
                            <i class="statusIcon '+(item.user_id>0?'gr':'xt')+'"></i>\
                        </div>\
                    </div>\
                </div>';
        };
        return this.each(function() {
            var headerHtml = '<div class="xqLeftTitleBox">\
                    <p class="xqLeftTitle_p"></p>\
                    <div class="xqLeftTitleInner">\
                        <h2>项目更新</h2>\
                    </div>\
                </div>';
            var listTmpl = '<div class="zxjz_NavOuterBox"><div class="zxjz_NavBox" id="progressList"></div></div><div class="zxjz_pageBox"><div id="progressPagination" class="sitePageBox"></div>';
            var loginTag = '<div class="click-update">多多更新项目发展状况，将更有利于大家支持你。<a  id="hrefUpdate">点此更新</a></div>';
            $(this).append(headerHtml);
            var isSelfDeal = $('#is-self-deal').attr('data-name');
            var dealId = $('#jlxqOuterBox').attr('data-dealid');
            var dealHref = '/crowdfund-dynamic_add?deal_id='+dealId;
            var dealHrefUpdate = $('#jlxqOuterBox').attr('data-hrefUpdate');

            if(isSelfDeal ==1 ) {
                $(this).append(loginTag);
                if(dealHrefUpdate==1){
                    $('#hrefUpdate').attr('href', dealHref);
                }
                else{
                    $('#hrefUpdate').hide();
                }
            }

            if(opts.isOwner){
                var boxTmpl = $('<div class="zxjz_inputOuterBox">\
                    <div class="zxjz_countBox siteCircleBox">\
                        '+opts.uAvatar+'\
                    </div>\
                    <div class="zxjzTextBox sitePHBox">\
                        <span>\
                        <textarea class="zxjzTextArea sitePHInput" placeholder="将你为此项目努力的进展和成果发布在此处，加油吧~最多300字"></textarea>\
                        <span class="sitePHTip">将你为此项目努力的进展和成果发布在此处，加油吧~最多300字</span>\
                    </span>\
                    </div>\
                    <div class="zxjz_btnBox">\
                        <div class="zxjz_btnLeft siteIlB_box">\
                            <input type="file" id="zxjz_picFile" />\
                            <span>最多5张</span>\
                        </div>\
                        <a href="javascript:;" class="zxjz_publishA btn_ALink" data-fname="zxjz">发布</a>\
                        <p class="errorP"></p>\
                    </div>\
                    <div class="zxjz_picList clearfix" id="zxjz_picList"></div>\
                </div>');
                $(this).append(boxTmpl);
                boxTmpl.find('.sitePHTip').setPhTip();
                buildUpload(opts,$('#zxjz_picFile'),$('#zxjz_picList'),'zxjz_picFile');
                afterBuildUpload();
                addSubmitProgressEvent(boxTmpl.find('.zxjzTextArea'),boxTmpl.find('.zxjz_publishA'),imgArr);
            };
            loadProgress(currentPage,pageSize);
            $(this).append(listTmpl);
            //$(this).append('<div class="zxjz_pageBox"></div>');
        });
    };

    $.fn.comment = function(options) {
        var defaults = {
            dealCode:'',
            dealId : '',
            dealUserId:0,
            currentUser : null
        };
        var currentPage = 1;
        var pageSize = 10;
        var opts = $.extend({}, defaults, options);
        var _this = $(this);
        var imgArr = [];
        var pagination = function(total,elem,callback){
            elem.parent().hide();
            if(total > pageSize){
                var pages = 0;
                if (total % pageSize > 0) {
                    pages = parseInt(total / pageSize,10) + 1;
                }else{
                    pages = parseInt(total / pageSize,10);
                }
                create(currentPage,elem,pages);
                elem.parent().show();
            }

            function create(page,elem,pages){
                var str_prv='<a class="prev normalPage">上一页</a>',
                    str_next='<a class="next normalPage">下一页</a>',
                    str_begin ='<div class="pager">',
                    str_end ='<div style="clear: both;"></div></div>',
                    str = '';
                var init = function(){
                    $(elem).html('');
                    if(currentPage != page){
                        currentPage = page;
                    }else{
                        currentPage = page;
                    }
                };
                var loop = function(begin,end){
                    for(var i=begin;i<=end;i++){
                        if(currentPage == i){
                            str += '<a class="cur normalPage">'+i+'</a>';
                        }else{
                            str += '<a class="normalPage">'+i+'</a>';
                        }
                    }
                };
                var addEndPage = function(){
                    str += '<a class="normalPage">'+(pages-1)+'</a>';
                    str += '<a class="normalPage">'+(pages)+'</a>';
                };
                var buildOther = function(){
                    str += '<a class="normalPage">1</a>';
                    str += '<a class="normalPage">2</a>';
                    if(currentPage>=7 && pages>10){
                        str += '<a class="normalPage" page="'+(currentPage-3)+'">...</a>';
                    }
                    if(pages-currentPage>5){
                        var begin = currentPage - 2;
                        var end = currentPage + 2;
                        if(end > pages){
                            end = pages;
                            begin = end - 4;
                            if(currentPage - begin < 2){
                                begin = begin-1;
                            }
                        }else if(end + 1 == pages){
                            end = pages-2;
                        }
                        loop(begin,end);
                        if(end != pages && pages-currentPage>3){
                            str += '<a class="normalPage" page="'+(currentPage+3)+'">...</a>';
                        }
                        if(currentPage<pages-2){
                            addEndPage();
                        }
                    }else{
                        loop(pages-6,pages);
                    }
                };
                var doPage = function(){
                    if(pages <= 8){
                        loop(1,pages);
                    }else{
                        if(currentPage <= 6){
                            loop(1,7);
                            if(pages>10){
                                str += '<a class="normalPage" page="8">...</a>';
                            }
                            addEndPage();
                        }
                        else{
                            buildOther();
                        }
                    }
                };
                var createElement = function(){
                    $(elem).html(str_begin + str_prv + str + str_next +str_end);
                    $(elem).find('a').click(function(){
                        if($(this).attr('class').indexOf('prev')>-1){
                            if(currentPage == 1){
                                return
                            };
                            create(page-1);
                            callback(page-1);
                            return;
                        }
                        if($(this).attr('class').indexOf('next')>-1){
                            if(currentPage == pages){
                                return
                            }
                            create(page+1);
                            callback(page+1);
                            return;
                        }
                        if($(this).attr('page')){
                            create(parseInt($(this).attr('page'),10));
                            callback(parseInt($(this).attr('page'),10));
                            return;
                        }
                        var val = parseInt($(this).text(),10);
                        create(val);
                        callback(val);
                    });
                };
                if(pages>1){
                    init();
                    doPage();
                    createElement();
                }else{
                    $(elem).html('');
                }
                $(elem).find('a').css('cursor','pointer');
            };
        };
        var buildUpload = function(opts,btn,imgBox,id){
            btn.uploadify({
                queueSizeLimit:1,
                multi:false,
                height        : 36,
                width         : 86,
                swf           : '/static/v3/static/uploadify/uploadify.swf?v=201',
                uploader      : "/uploadimg",
                fileTypeDesc : 'Image Files',
                fileTypeExts : '*.gif;*.jpeg;*.jpg;*.png',
                fileObjName  : "images",
                formData     : {dealID: opts.dealCode,type: 1},
				onUploadStart: function(file) {
					var formData = this.wrapper.uploadify('settings', 'formData');
					var session_name = $('#session_name').val();
					formData[session_name] = wx.cookie(session_name);
					this.wrapper.uploadify('settings', 'formData', formData);
				},
                onUploadProgress : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                    var obj = $('<div id="comment_upload_progress_panel"></div>');
                    if($('#comment_upload_progress_panel').length > 0){
                        $("#comment_upload_progress_panel").remove();
                    }
                    $('#plOuterBox .zxjz_inputOuterBox').append(obj);
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
                },
                onUploadSuccess: function(file, data, response){
                    $("#comment_upload_progress_panel").remove();
                    var result= $.parseJSON(data);
                    if(result.errno==0){
                        if(imgArr.length<5){
                            imgArr.push(result.data.image_data[0].image);
                            var front = result.data.image_data[0].image.substring(0,result.data.image_data[0].image.lastIndexOf('.'));
                            var end = result.data.image_data[0].image.substring(result.data.image_data[0].image.lastIndexOf('.'));
                            var showImg =  result.data.static_url + front+'_crop_75x55'+end;
                            imgBox.append('<div class="zxjz_picItem siteImgBox"><a index="'+imgArr.length+'" href="javascript:;"class="closeA"></a><img src="'+showImg+'"/></div>');
                            imgBox.find('.closeA').unbind('click').click(function(){
                                var index = imgArr.length - 1 - imgBox.find('.closeA').index(this);
                                imgArr.splice(index,1);
                                $(this).parent().remove();
                            });
                        }
                    }else{
                        wx.alert(result.error);
                    }
                }
            });
            afterBuildUpload(id);
        };
        var addSubmitTopicEvent = function(textElement,btnElement){
            textElement.focus(function(){
                if(!isLogin){
                    $('.Js-showLogin').trigger('click');
                }
            });
            textElement.on('keyup',function(){
                if($.trim($(this).val()).length>0){
                    btnElement.next().html('');
                }
                if($.trim($(this).val()).length>300){
                    btnElement.next().html('评论内容不能超过300字符');
                }
            });

            btnElement.click(function(){
                if(!isLogin){
                    $('.Js-showLogin').trigger('click');
                    return false;
                }
                if(!$(this).attr('submitting')){
                    if($.trim(textElement.val()).length == 0){
                        $(this).next().html('请输入内容');
                    }
                    else if($.trim(textElement.val()).length > 300){
                        $(this).next().html('评论内容不能超过300字符');
                    }
                    else{
                        $('.verifyLayer,#layerBg').fadeIn();
                        $('#m_code').attr('src','/verify.php?'+Math.random());
                        $('.actClose').click(function(){
                            $('.verifyLayer,#layerBg').fadeOut();
                        })
                        // $('#code-submit').unbind();
                        $('#code-submit').unbind('click').bind('click', function (){

                        // });
                        //
                        // $('#code-submit').click(function(){

                            var strCode = $('#v_code').val();
                            var strLen = strCode.length;
                            if( strLen != 4 || strCode == '') {
                                $('.error-text-code').html('请输入正确的验证码');
                            }
                            else  {
                                httpPost('/deal-add_topic',{
                                        id: opts.dealId,
                                        content: $.trim(textElement.val()),
                                        csrf_token_topic: $('#csrf_token_topic').val(),
                                        image_url:imgArr,
                                        ajax:1,
                                        code:strCode
                                    },function(data){
                                      $('.verifyLayer,#layerBg').fadeOut();
                                        btnElement.removeAttr('submitting').text('发布');
                                        data = $.parseJSON(data);
                                        wx.alert(data.info);
                                        if(data.status == 1){
                                            imgArr=[];
                                            $('#commentImageList').html('');
                                            loadCommentList(currentPage,pageSize);
                                            textElement.val('');
                                            $('#csrf_token_topic').val(data.csrf_token_topic);

                                        }
                                        $('#m_code').click();
                                        $('#v_code').val('');
                                        $('.error-text-code').html('');
                                    });
                            }
                        })
                        // btnElement.attr('submitting','true').text('发布中...');
                        // httpPost('/deal-add_topic',{
                        //     id: opts.dealId,
                        //     content: $.trim(textElement.val()),
                        //     csrf_token_topic: $('#csrf_token_topic').val(),
                        //     image_url:imgArr,
                        //     ajax:1
                        // },function(data){
                        //     btnElement.removeAttr('submitting').text('发布');
                        //     data = $.parseJSON(data);
                        //     wx.alert(data.info);
                        //     if(data.status == 1){
                        //         imgArr=[];
                        //         $('#commentImageList').html('');
                        //         loadCommentList(currentPage,pageSize);
                        //         textElement.val('');
                        //         $('#csrf_token_topic').val(data.csrf_token_topic);
                        //     }
                        // });
                    }
                }
            });
        };
        var addMoreCommentEvent = function(){
            $('#commentList a[operate="moreComment"]').toggle(function(){
                $(this).attr('expendText',$(this).text()).text('收起');
                var hideCommentList = $('#commentList .hide');
                var i = 0 ;
                var interval= setInterval(function(){
                    $(hideCommentList[i]).removeClass('hide').addClass('show');
                    i++;
                    if(i==hideCommentList.length){
                        clearInterval(interval);
                    }
                },10);
            },function(){
                $(this).text($(this).attr('expendText'));
                var hideCommentList = $('#commentList .show');
                var i = hideCommentList.length ;
                var interval= setInterval(function(){
                    $(hideCommentList[i]).removeClass('show').addClass('hide');
                    i--;
                    if(i<0){
                        clearInterval(interval);
                    }
                },10);
            });
        };
        var addReplyCommentEvent=function(){
            $('#commentList a[operate="replyComment"]').toggle(function(){
                if(!isLogin){
                    $('.Js-showLogin').trigger('click');
                    return false;
                }
                var obj = $('\
                    <div class="plDiscBox">\
                        <div class="zxjzTextBox sitePHBox">\
                            <span>\
                                <textarea class="zxjzTextArea sitePHInput w553" placeholder="'+opts.currentUser.username+'，写点什么吧~"></textarea>\
                                <span class="sitePHTip">'+opts.currentUser.username+'，写点什么吧~</span>\
                            </span>\
                        </div>\
                        <div class="clearfix">\
                            <a href="javascript:;" operate="sendComment"  class="plDisFootBtn btn_ALink">发送</a>\
                            <p error-box style="display: block;float: right;color: #f00;padding-top: 20px;padding-right: 5px;"></p>\
                        </div>\
                    </div>');
                $(this).parent().after(obj);
                obj.find('.sitePHTip').setPhTip();
                obj.find('textarea').on('keyup',function(){
                    if($.trim($(this).val()).length>0){
                        obj.find('[error-box]').text('');
                    }
                    if($.trim($(this).val()).length>300){
                        obj.find('[error-box]').text('回复内容不能超过300字符');
                    }
                });
                var topicId = $(this).attr('topicId');
                var commentId = $(this).attr('commentId');
                obj.find('a[operate="sendComment"]').click(function(){
                    var val = $.trim(obj.find('textarea').val());
                    var errorBox = $(this).next();
                    if(val.length== 0){
                        errorBox.text('请输入内容');
                        return false;
                    }
                    if(val.length > 300){
                        errorBox.text('回复内容不能超过300字符');
                        return false;
                    }
                    var postData = {
                        content:val,
                        topic_id:topicId,
                        deal_id:opts.dealId,
                        comment_pid:commentId,
                        csrf_token_comment: $('#csrf_token_comment').val()
                    };

                    httpPost('/deal-add_comment',postData,function(data){
                        var result = $.parseJSON(data);
                        if(result.status == 1){
                        	$('#csrf_token_comment').val(result.csrf_token_comment);
                            loadCommentList(currentPage,pageSize);
                        }else {
                            errorBox.html(result.info);
                        }
                    });
                });
            },function(){
                if(!isLogin){
                    $('.Js-showLogin').trigger('click');
                    return false;
                }
                $(this).parent().next().remove();
            });
        };
        var addDeleteCommentEvent=function(){
            $('#commentList a[operate="deleteComment"]').click(function(){
                var topicId = $(this).attr('topicId');
                var commentId = $(this).attr('commentId');
                wx.confirm('您确定要删除该回复吗？',function(){
                    var postData = {
                        topic_id:topicId,
                        deal_id:opts.dealId,
                        commentID:commentId
                    };
                    httpGet('/deal-del_comment',postData,function(data){
                        var result = $.parseJSON(data);
                        wx.alert(result.info);
                        if(result.status == 1){
                            loadCommentList(currentPage,pageSize);
                        }
                    });
                });
            });
        };
        var addDeleteTopicEvent=function(){
            $('#commentList a[operate="deleteTopic"]').click(function(){
                var topicId = $(this).attr('topicId');
                wx.confirm('您确定要删除该评论吗？',function() {
                    var postData = {
                        topic_id: topicId,
                        deal_id: opts.dealId
                    };
                    httpGet('/deal-del_topic', postData, function (data) {
                        var result = $.parseJSON(data);
                        wx.alert(result.info);
                        if (result.status == 1) {
                            loadCommentList(currentPage, pageSize);
                        }
                    });
                });
            });
        };
        var addReplyTopicEvent = function(){
            $('#commentList a[operate="replyTopic"]').click(function(){
                if(!isLogin){
                    $('.Js-showLogin').trigger('click');
                    return false;
                }
                if($(this).attr('openReply')=='false'){
                    $(this).attr('openReply','true');
                    var replyBox = $('\
                        <div class="plDiscBox">\
                            <div class="zxjzTextBox sitePHBox">\
                                <span>\
                                    <textarea class="zxjzTextArea sitePHInput w593" placeholder="'+opts.currentUser.username+'，写点什么吧~"></textarea>\
                                    <span class="sitePHTip">'+opts.currentUser.username+'，写点什么吧~</span>\
                                </span>\
                            </div>\
                            <div class="clearfix">\
                                <a href="javascript:;" operate="replayComment" class="plDisFootBtn btn_ALink">发布</a>\
                                <p error-box style="display: block;float: right;color: #f00;padding-top: 20px;padding-right: 5px;"></p>\
                            </div>\
                        </div>\
                    ');
                    $(this).parent().after(replyBox);
                    replyBox.find('.sitePHTip').setPhTip();
                    var to = $(this).attr('to');
                    var topicId = $(this).attr('topicId');
                    replyBox.find('textarea').on('keyup',function(){
                        if($.trim($(this).val()).length >0){
                            replyBox.find('[error-box]').html('');
                        }
                        if($.trim($(this).val()).length > 300){
                            replyBox.find('[error-box]').html('回复内容不能超过300字符');
                        }
                    });
                    replyBox.find('[operate="replayComment"]').click(function(){
                        if($.trim(replyBox.find('textarea').val()).length == 0){
                            $(this).next().html('请输入内容');
                        }
                        else if($.trim(replyBox.find('textarea').val()).length > 300){
                            $(this).next().html('回复内容不能超过300字符');
                        }
                        else{
                            var postData = {
                                content:$.trim(replyBox.find('textarea').val()),
                                topic_id:topicId,
                                deal_id:opts.dealId,
                                comment_pid:0,
                                csrf_token_comment: $('#csrf_token_comment').val()
                            };
                            var errorBox = $(this).next();
                            httpPost('/deal-add_comment',postData,function(data){
                                var result = $.parseJSON(data);
                                if(result.status == 1){
                                	$('#csrf_token_comment').val(result.csrf_token_comment);
                                    loadCommentList(currentPage,pageSize);
                                }else {
                                    errorBox.html(result.info);
                                }
                            });
                        }
                    });
                }else{
                    $(this).attr('openReply','false');
                    $(this).parent().next().remove();
                }
            });
        };
        var buildCommentItem = function(topic_list){
            var html ='';
            $.each(topic_list,function(i,item){
                var imgHtml = '';
                $.each(item.image,function(j,img){
                    var front = img.substring(0,img.lastIndexOf('.'));
                    var end = img.substring(img.lastIndexOf('.'));
                    var showImg =  front+'_crop_75x55'+end;
                    imgHtml += '<div class="plItemPicItem siteImgBox"><img src="'+showImg+'"></div>';
                });
                var replyHtml = '';
                $.each(item.comment_list,function(j,comment){
                    var toStr = '';
                    if(comment.to.name && $.trim(comment.to.name)!=''){
                        toStr =' 回复了 <a href="javascript:void(0);" onClick="siXin('+comment.to.userID+',\''+comment.to.name+'\');sitePop.showSixin('+comment.to.userID+');" class="colorALink">'+comment.to.name+'</a>'
                    }
                    var operateStr = '<a href="javascript:;" topicId="'+item.log_id+'" commentId="'+comment.commentID+'" operate="replyComment" class="plReplayA hoUdLink">回复</a>';
                    if(isLogin){
                        if(opts.currentUser.userId == comment.owner.userID){
                            operateStr = '<a href="javascript:;" topicId="'+item.log_id+'" commentId="'+comment.commentID+'" operate="deleteComment" class="plReplayA hoUdLink">删除</a>';
                        }
                    }
                    replyHtml += '<div class="pl_replayItem clearfix '+(j>=5?'hide':'')+'">\
                        <div class="replayItemInner clearfix">\
                            <div class="plReplayLeft">\
                                <a href="javascript:void(0);" onClick="siXin('+comment.owner.userID+',\''+comment.owner.name+'\');sitePop.showSixin('+comment.owner.userID+');" class="colorALink">'+comment.owner.name+'</a> '+(comment.owner.userID==opts.dealUserId?'发起人':'')+toStr+'：'+comment.content+'\
                                <span class="timeSpan">'+timeFormat(comment.create_time)+'</span>\
                            </div>\
                            '+operateStr+'\
                        </div>\
                    </div>';
                });
                if(item.comment_list.length>0){
                    var more ='';
                    if(item.comment_list.length>5){
                        more = '<a href="javascript:;" operate="moreComment" class="plReplay_moreA btn_ALink">查看更多评论（'+(item.comment_list.length-5)+'）</a>';
                    }
                    replyHtml ='<div class="pl_replayBox"><i class="pointTop"></i><div class="pl_replayWrap">'+ replyHtml + more +'</div></div>';
                }
                var operateStr = '<a href="javascript:;" topicId="'+item.log_id+'" to="'+item.user_id+'" operate="replyTopic" openReply="false" class="plA hoUdLink">评论('+item.comment_count+')</a>';
                if(isLogin){
                    if(opts.currentUser.userId == item.user_id){
                        operateStr = '<a href="javascript:;" topicId="'+item.log_id+'" operate="deleteTopic" class="plReplayA hoUdLink">删除</a>';
                    }
                }
                html+='\
                    <div class="plListItem">\
                        <div class="plItemCountBox siteCircleBox">\
                            <a href="javascript:void(0);" onClick="siXin('+item.user_id+',\''+item.user_name+'\');sitePop.showSixin('+item.user_id+');">\
                                <img src="'+item.avatar+'"/>\
                            </a>\
                        </div>\
                        <a href="javascript:void(0);" onClick="siXin('+item.user_id+',\''+item.user_name+'\');sitePop.showSixin('+item.user_id+');" class="plItem_countA colorALink">'+item.user_name+'</a> '+(item.user_id==opts.dealUserId?'发起人':'')+'\
                        <p class="plItem_textP">'+item.log_info+'</p>\
                        <div class="plItemPicBox clearfix">'+imgHtml+'</div>\
                        <div class="plItemFooter">\
                            <span class="timeSpan">'+timeFormat(item.create_time)+'</span>\
                            '+operateStr+'\
                        </div>\
                        '+replyHtml+'\
                    </div>';
            });
            return html;
        };
        var loadCommentList  = function(page,pageSize){
            httpGet('/deal-topic_list', {
                id: opts.dealId,
                offset: (page - 1) * pageSize,
                page_size: pageSize
            },function(data){
                var result = $.parseJSON(data);
                if(result.status == 1){
                    if(result.data.topic_list){
                        var html = buildCommentItem(result.data.topic_list);
                        $('#commentList').html(html);
                        addReplyTopicEvent();
                        $('[data-scrollto="plOuterBox"]').html('评论（<b>'+result.data.all_count +'</b>）');
                        pagination(result.data.count,$('#topicPagination'),function(page){
                            currentPage = page;
                            loadCommentList(currentPage,pageSize);
                            $("html,body").animate({scrollTop:$("#plOuterBox").offset().top-70},300);
                        });
                        addMoreCommentEvent();
                        addReplyCommentEvent();
                        addDeleteCommentEvent();
                        addDeleteTopicEvent();
                    }
                }
            });
        };
        var buildCommentList = function(){
            var html = $('<div class="plListBox" style="min-height:30px;" id="commentList"></div><div class="pl_pageBox"><div id="topicPagination" class="sitePageBox"></div></div>');
            _this.append(html);
            loadCommentList(currentPage,pageSize);
        };
        var buildHeader = function (){
            var headerHtml = '<div class="xqLeftTitleBox">\
                    <p class="xqLeftTitle_p"></p>\
                    <div class="xqLeftTitleInner">\
                        <h2>评论</h2>\
                    </div>\
                </div>';
            _this.append(headerHtml);
        };
        var buildSendBox = function(){
            var userAvatarHtml = '<a href="javascript:;"><img src="http://istatic.yuanshihui.com/angelpc/v3/static/images/common/defult_sys_avatar_s.png"></a>';
            var placeholder = '您必须登录后才可发表评论，点此登录。';
            if(isLogin) {
                userAvatarHtml = '<a href="javascript:void(0);" onClick="siXin('+opts.currentUser.userId+',\''+opts.currentUser.username+'\');sitePop.showSixin('+opts.currentUser.userId+');"><img src="'+opts.currentUser.avatar+'"></a>';
                placeholder = opts.currentUser.username +'，说点什么吧~~';
            }
            var boxHtml = $('<div class="zxjz_inputOuterBox">\
                    <div class="zxjz_countBox siteCircleBox">'+ userAvatarHtml +'</div>\
                    <div class="zxjzTextBox sitePHBox">\
                        <span>\
                            <textarea class="zxjzTextArea sitePHInput" placeholder="'+placeholder+'"></textarea>\
                            <span class="sitePHTip">'+placeholder+'</span>\
                        </span>\
                    </div>\
                    <div class="zxjz_btnBox siteIlB_box">\
                        <input type="file" id="uploadCommentImageBtn" />\
                        <span>最多5张</span>\
                        <a href="javascript:;" id="submitCommentBtn" class="zxjz_publishA btn_ALink" data-fname="pl">发布</a>\
                        <p class="errorP"></p>\
                    </div>\
                    <div class="zxjz_picList clearfix" id="commentImageList"></div>\
                </div>');

            _this.append(boxHtml);
            if(!isLogin){
                boxHtml.find('textarea').focus(function(){
                    $(this).blur();
                }).css({
                    cursor:'pointer'
                })
            }
            addSubmitTopicEvent(boxHtml.find('textarea'),boxHtml.find('#submitCommentBtn'));
            boxHtml.find('.sitePHTip').setPhTip();
        };
        return this.each(function() {
            $(this).html('');
            buildHeader();
            buildSendBox();
            buildUpload(opts,$('#uploadCommentImageBtn'),$('#commentImageList'),'uploadCommentImageBtn');
            buildCommentList();
        });
    };

    $.fn.equityProgress = function(options) {
        var defaults = {
            dealId : '',
            dealCode : '',
            isOwner : false,
            uLink :'',
            uAvatar : ''
        };
        var opts = $.extend({}, defaults, options);
        var currentPage = 1;
        var pageSize = 10;
        var imgArr = [];
        var _this = $(this);
        var pagination = function(total,elem,callback){
            elem.parent().hide();
            if(total > pageSize){
                var pages = 0;
                if (total % pageSize > 0) {
                    pages = parseInt(total / pageSize,10) + 1;
                }else{
                    pages = parseInt(total / pageSize,10);
                }
                create(currentPage,elem,pages);
                elem.parent().show();
            }

            function create(page,elem,pages){
                var str_prv='<a class="prev normalPage">上一页</a>',
                    str_next='<a class="next normalPage">下一页</a>',
                    str_begin ='<div class="pager">',
                    str_end ='<div style="clear: both;"></div></div>',
                    str = '';
                var init = function(){
                    $(elem).html('');
                    if(currentPage != page){
                        currentPage = page;
                    }else{
                        currentPage = page;
                    }
                };
                var loop = function(begin,end){
                    for(var i=begin;i<=end;i++){
                        if(currentPage == i){
                            str += '<a class="cur normalPage">'+i+'</a>';
                        }else{
                            str += '<a class="normalPage">'+i+'</a>';
                        }
                    }
                };
                var addEndPage = function(){
                    str += '<a class="normalPage">'+(pages-1)+'</a>';
                    str += '<a class="normalPage">'+(pages)+'</a>';
                };
                var buildOther = function(){
                    str += '<a class="normalPage">1</a>';
                    str += '<a class="normalPage">2</a>';
                    if(currentPage>=7 && pages>10){
                        str += '<a class="normalPage" page="'+(currentPage-3)+'">...</a>';
                    }
                    if(pages-currentPage>5){
                        var begin = currentPage - 2;
                        var end = currentPage + 2;
                        if(end > pages){
                            end = pages;
                            begin = end - 4;
                            if(currentPage - begin < 2){
                                begin = begin-1;
                            }
                        }else if(end + 1 == pages){
                            end = pages-2;
                        }
                        loop(begin,end);
                        if(end != pages && pages-currentPage>3){
                            str += '<a class="normalPage" page="'+(currentPage+3)+'">...</a>';
                        }
                        if(currentPage<pages-2){
                            addEndPage();
                        }
                    }else{
                        loop(pages-6,pages);
                    }
                };
                var doPage = function(){
                    if(pages <= 8){
                        loop(1,pages);
                    }else{
                        if(currentPage <= 6){
                            loop(1,7);
                            if(pages>10){
                                str += '<a class="normalPage" page="8">...</a>';
                            }
                            addEndPage();
                        }
                        else{
                            buildOther();
                        }
                    }
                };
                var createElement = function(){
                    $(elem).html(str_begin + str_prv + str + str_next +str_end);
                    $(elem).find('a').click(function(){
                        if($(this).attr('class').indexOf('prev')>-1){
                            if(currentPage == 1){
                                return
                            };
                            create(page-1);
                            callback(page-1);
                            return;
                        }
                        if($(this).attr('class').indexOf('next')>-1){
                            if(currentPage == pages){
                                return
                            }
                            create(page+1);
                            callback(page+1);
                            return;
                        }
                        if($(this).attr('page')){
                            create(parseInt($(this).attr('page'),10));
                            callback(parseInt($(this).attr('page'),10));
                            return;
                        }
                        var val = parseInt($(this).text(),10);
                        create(val);
                        callback(val);
                    });
                };
                if(pages>1){
                    init();
                    doPage();
                    createElement();
                }else{
                    $(elem).html('');
                }
                $(elem).find('a').css('cursor','pointer');
            };
        };
        var addSubmitProgressEvent = function(textElement,btnElement){
            textElement.on('keyup',function(){
                if($.trim($(this).val()).length>0){
                    btnElement.next().html('');
                }
                if($.trim($(this).val()).length>300){
                    btnElement.next().html('提问内容不能超过300字符');
                }
            });
            btnElement.click(function(){
                if(!$(this).attr('submitting')){
                    if($.trim(textElement.val()).length == 0){
                        $(this).next().html('请输入内容');
                    }
                    else if($.trim($(textElement).val()).length>300){
                        btnElement.next().html('提问内容不能超过300字符');
                    }
                    else{
                        btnElement.attr('submitting','true').text('发布中...');
                        httpPost('/deal-growth_add',{
                            deal_id: opts.dealId,
                            content: $.trim(textElement.val()),
                            cover:imgArr.join(',')
                        },function(data){
                            btnElement.removeAttr('submitting').text('发布');
                            data = $.parseJSON(data);
                            if(data.status == 1){
                                imgArr=[];
                                $('#zxjz_picList').html('');
                                loadProgress(currentPage,pageSize);
                                textElement.val('');
                            }else{
                                wx.alert(data.info);
                            }
                        });
                    }
                }
            });
        };
        var loadProgress = function(page,pageSize){
            httpGet('/stock-growth_list',{
                id:opts.dealId,
                page:page,
                page_size:pageSize
            },function(respose){
                respose = $.parseJSON(respose);
                if(respose.status == 1){
                    _this.find('#progressList').html('');
                    var html = '';
                    $.each(respose.data.growth_list,function(i,item){
                        html+=buildProgressItem(item,respose.data.growth_list,i);
                    });
                    _this.find('#progressList').html(html);
                    pagination(respose.data.count,$('#progressPagination'),function(page){
                        currentPage = page;
                        loadProgress(currentPage,pageSize);
                        $("html,body").animate({scrollTop:$("#progressBox").offset().top-70},300);
                    });
                }
            });
        };
        var buildProgressItem = function(item,list,i){
            var selfHtml = '<h3 class="zxjz_navItem_h3"><a href="javascript:void(0);" onClick="siXin('+opts.dealUser.userId+',\''+opts.dealUser.username+'\');sitePop.showSixin('+opts.dealUser.userId+');" class="colorALink">'+opts.dealUser.username+'</a>发起人</h3>',
                imageHtml = '',
                lastInner = '';
            if(item.cover.length >0){
                imageHtml+='<div class="picListBox clearfix">';
                $.each(item.cover,function(j,image){
                    var front = image.substring(0,image.lastIndexOf('.'));
                    var end = image.substring(image.lastIndexOf('.'));
                    var showImg =  front+'_crop_75x55'+end;
                    imageHtml += '<div class="picItem siteImgBox"><img src="'+showImg+'"/></div>';
                });
                imageHtml+='</div>';
            }
            if(i==list.length-1){
                lastInner = '<div class="lastInner"></div>';
            }
            return '\
               <div class="zxjz_NavItem">\
                    <div class="zxjz_navItemInner">\
                        '+selfHtml+'\
                        <p class="textP">'+item.content+'</p>\
                        ' + imageHtml + lastInner + '\
                        <div class="zxjzILBox">\
                            <p class="timeP">'+timeFormat(item.ctime)+'</p>\
                            <i class="statusIcon xt"></i>\
                        </div>\
                    </div>\
                </div>';
        };
        var buildUpload = function(opts,btn,imgBox,id){
            btn.uploadify({
                queueSizeLimit:1,
                multi:false,
                height        : 36,
                width         : 86,
                swf           : '/static/v3/static/uploadify/uploadify.swf?v=201',
                uploader      : "/uploadimg",
                fileTypeDesc : 'Image Files',
                fileTypeExts : '*.gif;*.jpeg;*.jpg;*.png',
                fileObjName  : "images",
                formData     : {dealID: opts.dealCode,type: 12},
				onUploadStart: function(file) {
					var formData = this.wrapper.uploadify('settings', 'formData');
					var session_name = $('#session_name').val();
					formData[session_name] = wx.cookie(session_name);
					this.wrapper.uploadify('settings', 'formData', formData);
				},
                onUploadProgress : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                    var obj = $('<div id="upload_progress_panel"></div>');
                    if($('#upload_progress_panel').length > 0){
                        $("#upload_progress_panel").remove();
                    }
                    $('#equity_progress_sendbox').append(obj);
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
                },
                onUploadSuccess: function(file, data, response){
                    $("#upload_progress_panel").remove();
                    var result= $.parseJSON(data);
                    if(result.error==0){
                        if(imgArr.length<5){
                            imgArr.push(result.data.image_data[0].image);
                            var front = result.data.image_data[0].image.substring(0,result.data.image_data[0].image.lastIndexOf('.'));
                            var end = result.data.image_data[0].image.substring(result.data.image_data[0].image.lastIndexOf('.'));
                            var showImg = result.data.static_url + front+'_crop_75x55'+end;
                            imgBox.append('<div class="zxjz_picItem siteImgBox"><a index="'+imgArr.length+'" href="javascript:;"class="closeA"></a><img src="'+showImg+'"/></div>');
                            imgBox.find('.closeA').unbind('click').click(function(){
                                var index = imgArr.length - 1 - imgBox.find('.closeA').index(this);
                                imgArr.splice(index,1);
                                $(this).parent().remove();
                            });
                        }
                    }else{
                        wx.alert(result.error);
                    }
                }
            });
            afterBuildUpload(id);
        };
        return this.each(function() {
            var headerHtml = '<div class="xqLeftTitleBox">\
                    <p class="xqLeftTitle_p"></p>\
                    <div class="xqLeftTitleInner">\
                        <h2>项目更新</h2>\
                    </div\
                </div>';
            var listTmpl = '<div class="zxjz_NavOuterBox"><div class="zxjz_NavBox" id="progressList"></div></div><div class="zxjz_pageBox"><div id="progressPagination" class="sitePageBox"></div>';
            $(this).append(headerHtml);
            if(opts.isOwner){
                var boxTmpl = $('<div id="equity_progress_sendbox" class="zxjz_inputOuterBox">\
                    <div class="zxjz_countBox siteCircleBox">\
                        '+opts.uAvatar+'\
                    </div>\
                    <div class="zxjzTextBox sitePHBox">\
                        <span>\
                        <textarea class="zxjzTextArea sitePHInput" placeholder="填写项目里程碑动态，可以更好的吸引大家来支持你的项目，加油吧~ 最多300字"></textarea>\
                        <span class="sitePHTip">填写项目里程碑动态，可以更好的吸引大家来支持你的项目，加油吧~ 最多300字</span>\
                    </span>\
                    </div>\
                    <div class="zxjz_btnBox">\
                        <div class="zxjz_btnLeft siteIlB_box">\
                            <input type="file" id="zxjz_picFile" />\
                            <span>最多5张</span>\
                        </div>\
                        <a href="javascript:;" class="zxjz_publishA btn_ALink" data-fname="zxjz">发布</a>\
                        <p class="errorP"></p>\
                    </div>\
                    <div class="zxjz_picList clearfix" id="zxjz_picList"></div>\
                </div>');
                $(this).append(boxTmpl);
                boxTmpl.find('.sitePHTip').setPhTip();
                buildUpload(opts,$('#zxjz_picFile'),$('#zxjz_picList'),'zxjz_picFile');
                afterBuildUpload();
                addSubmitProgressEvent(boxTmpl.find('.zxjzTextArea'),boxTmpl.find('.zxjz_publishA'),imgArr);
            };
            loadProgress(currentPage,pageSize);
            $(this).append(listTmpl);
        });
    };

    $.fn.equityComment = function(options) {
        var defaults = {
            dealCode:'',
            dealId : '',
            uid : 0
        };
        var currentPage = 1;
        var pageSize = 10;
        var opts = $.extend({}, defaults, options);
        var _this = $(this);
        var pagination = function(total,elem,callback){
            elem.parent().hide();
            if(total > pageSize){
                var pages = 0;
                if (total % pageSize > 0) {
                    pages = parseInt(total / pageSize,10) + 1;
                }else{
                    pages = parseInt(total / pageSize,10);
                }
                create(currentPage,elem,pages);
                elem.parent().show();
            }

            function create(page,elem,pages){
                var str_prv='<a class="prev normalPage">上一页</a>',
                    str_next='<a class="next normalPage">下一页</a>',
                    str_begin ='<div class="pager">',
                    str_end ='<div style="clear: both;"></div></div>',
                    str = '';
                var init = function(){
                    $(elem).html('');
                    if(currentPage != page){
                        currentPage = page;
                    }else{
                        currentPage = page;
                    }
                };
                var loop = function(begin,end){
                    for(var i=begin;i<=end;i++){
                        if(currentPage == i){
                            str += '<a class="cur normalPage">'+i+'</a>';
                        }else{
                            str += '<a class="normalPage">'+i+'</a>';
                        }
                    }
                };
                var addEndPage = function(){
                    str += '<a class="normalPage">'+(pages-1)+'</a>';
                    str += '<a class="normalPage">'+(pages)+'</a>';
                };
                var buildOther = function(){
                    str += '<a class="normalPage">1</a>';
                    str += '<a class="normalPage">2</a>';
                    if(currentPage>=7 && pages>10){
                        str += '<a class="normalPage" page="'+(currentPage-3)+'">...</a>';
                    }
                    if(pages-currentPage>5){
                        var begin = currentPage - 2;
                        var end = currentPage + 2;
                        if(end > pages){
                            end = pages;
                            begin = end - 4;
                            if(currentPage - begin < 2){
                                begin = begin-1;
                            }
                        }else if(end + 1 == pages){
                            end = pages-2;
                        }
                        loop(begin,end);
                        if(end != pages && pages-currentPage>3){
                            str += '<a class="normalPage" page="'+(currentPage+3)+'">...</a>';
                        }
                        if(currentPage<pages-2){
                            addEndPage();
                        }
                    }else{
                        loop(pages-6,pages);
                    }
                };
                var doPage = function(){
                    if(pages <= 8){
                        loop(1,pages);
                    }else{
                        if(currentPage <= 6){
                            loop(1,7);
                            if(pages>10){
                                str += '<a class="normalPage" page="8">...</a>';
                            }
                            addEndPage();
                        }
                        else{
                            buildOther();
                        }
                    }
                };
                var createElement = function(){
                    $(elem).html(str_begin + str_prv + str + str_next +str_end);
                    $(elem).find('a').click(function(){
                        if($(this).attr('class').indexOf('prev')>-1){
                            if(currentPage == 1){
                                return
                            };
                            create(page-1);
                            callback(page-1);
                            return;
                        }
                        if($(this).attr('class').indexOf('next')>-1){
                            if(currentPage == pages){
                                return
                            }
                            create(page+1);
                            callback(page+1);
                            return;
                        }
                        if($(this).attr('page')){
                            create(parseInt($(this).attr('page'),10));
                            callback(parseInt($(this).attr('page'),10));
                            return;
                        }
                        var val = parseInt($(this).text(),10);
                        create(val);
                        callback(val);
                    });
                };
                if(pages>1){
                    init();
                    doPage();
                    createElement();
                }else{
                    $(elem).html('');
                }
                $(elem).find('a').css('cursor','pointer');
            };
        };
        var addSubmitQuestionEvent = function(textElement,btnElement){
            textElement.focus(function(){
                if(!isLogin){
                    $('.Js-showLogin').trigger('click');
                }
            });
            textElement.on('keyup',function(){
                if($.trim($(this).val()).length>0){
                    btnElement.next().html('');
                }
                if($.trim($(this).val()).length>300){
                    btnElement.next().html('提问内容不能超过300字符');
                }
            });
            btnElement.click(function(){
                if(!isLogin){
                    $('.Js-showLogin').trigger('click');
                    return false;
                }
                if($.trim($(textElement).val()).length>300){
                    btnElement.next().html('提问内容不能超过300字符');
                }
                if(!$(this).attr('submitting')){
                    if($.trim(textElement.val()).length == 0){
                        $(this).next().html('提问内容不能为空');
                    }else if($.trim(textElement.val()).length > 300){
                        $(this).next().html('提问内容不能超过300字符');
                    }else{
                        btnElement.attr('submitting','true').text('发布中...');
                        var errorBox = $(this).next();
                        httpPost('/deal-comment_add',{
                            deal_id:opts.dealId,
                            content:$.trim(textElement.val()),
                            csrf_token_stock: $('#csrf_token_stock').val(),
                            pid:0,
                            id:0
                        },function(data){
                            btnElement.removeAttr('submitting').text('发布');
                            data = $.parseJSON(data);
                            if(data.status == 1){
                            	$('#csrf_token_stock').val(data.csrf_token_stock);
                                wx.alert('提问成功！');
                                loadQuestionList(currentPage,pageSize);
                                textElement.val('');
                            }else{
                                errorBox.html(data.info);
                            }
                        });
                    }
                }
            });
        };
        var addReplyQuestionEvent = function(){
            $('#commentList a[operate="replyComment"]').click(function(){
                if($(this).attr('isReply')=='1'){
                    wx.alert('您已经回复过该提问了！');
                    return;
                }
                if($(this).attr('openReply')=='false'){
                    $(this).attr('openReply','true');
                    var replyBox = $('\
                        <div class="plDiscBox">\
                            <div class="zxjzTextBox sitePHBox">\
                                <span>\
                                    <textarea class="zxjzTextArea sitePHInput w593" placeholder="'+opts.currentUser.username+'，写点什么吧~"></textarea>\
                                    <span class="sitePHTip">'+opts.currentUser.username+'，写点什么吧~</span>\
                                </span>\
                            </div>\
                            <div class="plDiscBtnBox clearfix">\
                                <a href="javascript:;" operate="reply" class="plDisFootBtn btn_ALink">回复</a>\
                                <p error-box style="display: block;float: right;color: #f00;padding-top: 10px;padding-right: 5px;"></p>\
                            </div>\
                        </div>\
                    ');
                    $(this).parent().after(replyBox);
                    replyBox.find('.sitePHTip').setPhTip();
                    replyBox.show();
                    var to = $(this).attr('to');
                    var questionId = $(this).attr('questionId');
                    replyBox.find('textarea').on('keyup',function(){
                        if($.trim($(this).val()).length >0){
                            replyBox.find('[error-box]').html('');
                        }
                        if($.trim($(this).val()).length>300){
                            replyBox.find('[error-box]').html('提问内容不能超过300字符');
                        }
                    });
                    replyBox.find('[operate="reply"]').click(function(){
                        if($.trim(replyBox.find('textarea').val()).length == 0){
                            $(this).next().html('回复内容不能为空');
                        }else if($.trim(replyBox.find('textarea').val()).length > 300){
                            $(this).next().html('提问内容不能超过300字符');
                        }else{
                            var postData = {
                                content:$.trim(replyBox.find('textarea').val()),
                                deal_id:opts.dealId,
                                csrf_token_stock: $('#csrf_token_stock').val(),
                                pid:questionId,
                                id:0
                            };
                            var errorBox = $(this).next();
                            httpPost('/deal-comment_add',postData,function(data){
                                var result = $.parseJSON(data);
                                if(result.status == 1){
                                	$('#csrf_token_stock').val(result.csrf_token_stock);
                                    wx.alert('回复成功！');
                                    loadQuestionList(currentPage,pageSize);
                                }else {
                                    errorBox.html(result.info);
                                }
                            });
                        }
                    });
                }else{
                    $(this).attr('openReply','false');
                    $(this).parent().next().remove();
                }
            });
        };
        var buildQuestionItem = function(comment_list){
            var html ='';
            $.each(comment_list,function(i,item){
                var replyHtml = '';
                $.each(item.answer,function(j,answer){
                    replyHtml += '<div class="pl_replayWrap">\
                            <div class="pl_replayItem">\
                                <div class="replayItemInner clearfix">\
                                    <div class="plReplayLeft">\
                                        <span style="color: #50abf2;">'+answer.user_name+'</span>：'+answer.content+'\
                                        <span class="timeSpan">'+timeFormat(answer.create_time)+'</span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>';
                });
                var operateStr = '';
                if(opts.isOwner){
                    operateStr = '<a href="javascript:;" questionId="'+item.id+'" to="'+item.user_id+'" isReply="'+item.is_replay+'" operate="replyComment" openReply="false" class="plReplayA hoUdLink">回复</a>';
                }
                html+='\
                    <div class="plListItem">\
                        <div class="plItemCountBox siteCircleBox">\
                            <a href="javascript:void(0);" onClick="siXin('+item.user_id+',\''+item.user_name+'\');sitePop.showSixin('+item.user_id+');">\
                                <img src="'+item.avatar+'"/>\
                            </a>\
                        </div>\
                        <a href="javascript:void(0);" onClick="siXin('+item.user_id+',\''+item.user_name+'\');sitePop.showSixin('+item.user_id+');" class="plItem_countA colorALink">'+item.user_name+'</a>\
                        <p class="plItem_textP">'+item.content+'</p>\
                        <div class="plItemFooter">\
                            <span class="timeSpan">'+timeFormat(item.create_time)+'</span>\
                             '+operateStr+'\
                        </div>\
                        <div class="pl_replayBox">\
                            '+(item.answer.length>0?'<i class="pointTop"></i>':'')+'\
                            '+replyHtml+'\
                        </div>\
                    </div>';
            });
            return html;
        };
        var loadQuestionList  = function(page,pageSize){
            httpGet('/stock-comment_list', {
                id: opts.dealId,
                page: page,
                page_size: pageSize
            },function(data){
                var result = $.parseJSON(data);
                if(result.status == 1){
                    if(result.data.comment_list){
                        var html = buildQuestionItem(result.data.comment_list);
                        $('#commentList').html(html);
                        addReplyQuestionEvent();
                        if(result.data.count>0){
                            $('#questionCount').text("用户讨论（"+result.data.count+"）");
                            $('[data-scrollto="yhtlBox"]').text('讨论('+result.data.count+')');
                        }
                        pagination(result.data.count,$('#commentPagination'),function(page){
                            currentPage = page;
                            loadQuestionList(currentPage,pageSize);
                            $("html,body").animate({scrollTop:$("#commentBox").offset().top-70},300);
                        });
                    }
                }
            });
        };
        var buildQuestionList = function(){
            var html = $('<div class="plListBox" style="min-height:30px;" id="commentList"></div><div class="pl_pageBox"><div id="commentPagination" class="sitePageBox"></div></div>');
            _this.append(html);
            loadQuestionList(1,pageSize);
        };
        var buildHeader = function (){
            var headerHtml = '<div class="xqLeftTitleBox">\
                    <p class="xqLeftTitle_p"></p>\
                    <div class="xqLeftTitleInner">\
                        <h2 id="questionCount">用户讨论</h2>\
                    </div>\
                </div>';
            _this.append(headerHtml);
        };
        var buildSendBox = function(){
            var userAvatarHtml = '<a href="javascript:;"><img src="http://istatic.yuanshihui.com/angelpc/v3/static/images/common/defult_sys_avatar_s.png"></a>';
            var placeholder = '您必须登录后才可以提问，点此登录。';
            if(isLogin) {
                userAvatarHtml = '<a href="javascript:void(0);" onClick="siXin('+opts.currentUser.userId+',\''+opts.currentUser.username+'\');sitePop.showSixin('+opts.currentUser.userId+');"><img src="'+opts.currentUser.avatar+'"></a>';
                placeholder = opts.currentUser.username +'，说点什么吧~~';
            }
            var boxHtml = $('<div class="zxjz_inputOuterBox">\
                    <div class="zxjz_countBox siteCircleBox">'+ userAvatarHtml +'</div>\
                    <div class="zxjzTextBox sitePHBox">\
                        <span>\
                            <textarea class="zxjzTextArea sitePHInput" placeholder="'+placeholder+'"></textarea>\
                            <span class="sitePHTip">'+placeholder+'</span>\
                        </span>\
                    </div>\
                    <div class="zxjz_btnBox siteIlB_box">\
                        <a href="javascript:;" id="submitCommentBtn" class="zxjz_publishA btn_ALink" data-fname="pl">提问</a>\
                        <p class="errorP"></p>\
                    </div>\
                </div>');

            _this.append(boxHtml);
            if(!isLogin){
                boxHtml.find('textarea').focus(function(){
                    $(this).blur();
                }).css({
                    cursor:'pointer'
                })
            }
            addSubmitQuestionEvent(boxHtml.find('textarea'),boxHtml.find('#submitCommentBtn'));
            boxHtml.find('.sitePHTip').setPhTip();
        };
        return this.each(function() {
            $(this).html('');
            buildHeader();
            buildSendBox();
            buildQuestionList();
        });
    };

})(jQuery);
//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(+config._d);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
            module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = typeof regex === 'function' ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                    a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                        a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                                    a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                                        -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true,
            msgWithStack = msg + '\n' + (new Error()).stack;

        return extend(function () {
            if (firstTime) {
                warn(msgWithStack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYY', 'YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = createUTCDate(year, 0, 1).getUTCDay();
        var daysToAdd;
        var dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year      : dayOfYear > 0 ? year      : year - 1,
            dayOfYear : dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
            config._a[HOUR] <= 12 &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        res = new Moment(checkOverflow(config));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other < this ? this : other;
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
        return model._isUTC ? local__createLocal(input).zone(model._offset || 0) : local__createLocal(input).local();
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!input) {
            input = 0;
        }
        else {
            input = local__createLocal(input).utcOffset();
        }

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (this._a) {
            var other = this._isUTC ? create_utc__createUTC(this._a) : local__createLocal(this._a);
            return this.isValid() && compareArrays(this._a, other.toArray()) > 0;
        }

        return false;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
        // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                        diff < 1 ? 'sameDay' :
                            diff < 2 ? 'nextDay' :
                                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                    units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                        units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
            /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
            /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
            /* falls through */
            case 'hour':
                this.minutes(0);
            /* falls through */
            case 'minute':
                this.seconds(0);
            /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    function millisecond__milliseconds (token) {
        addFormatToken(0, [token, 3], 0, 'millisecond');
    }

    millisecond__milliseconds('SSS');
    millisecond__milliseconds('SSSS');

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);
    addRegexToken('SSSS', matchUnsigned);
    addParseToken(['S', 'SS', 'SSS', 'SSSS'], function (input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    });

    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY LT',
        LLLL : 'dddd, MMMM D, YYYY LT'
    };

    function longDateFormat (key) {
        var output = this._longDateFormat[key];
        if (!output && this._longDateFormat[key.toUpperCase()]) {
            output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                return val.slice(1);
            });
            this._longDateFormat[key] = output;
        }
        return output;
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                    (b === 1) ? 'st' :
                        (b === 2) ? 'nd' :
                            (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years = 0;

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // Accurately convert days to years, assume start from year 0.
        years = absFloor(daysToYears(days));
        days -= absFloor(yearsToDays(years));

        // 30 days to a month
        // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
        months += absFloor(days / 30);
        days   %= 30;

        // 12 months -> 1 year
        years  += absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absFloor(years / 4) -
        //     absFloor(years / 100) + absFloor(years / 400);
        return years * 146097 / 400;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToYears(days) * 12;
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(yearsToDays(this._months / 12));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var duration_get__milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
            minutes === 1          && ['m']           ||
            minutes < thresholds.m && ['mm', minutes] ||
            hours   === 1          && ['h']           ||
            hours   < thresholds.h && ['hh', hours]   ||
            days    === 1          && ['d']           ||
            days    < thresholds.d && ['dd', days]    ||
            months  === 1          && ['M']           ||
            months  < thresholds.M && ['MM', months]  ||
            years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = iso_string__abs(this.years());
        var M = iso_string__abs(this.months());
        var D = iso_string__abs(this.days());
        var h = iso_string__abs(this.hours());
        var m = iso_string__abs(this.minutes());
        var s = iso_string__abs(this.seconds() + this.milliseconds() / 1000);
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = duration_get__milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.3';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your main values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest main at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an main go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

