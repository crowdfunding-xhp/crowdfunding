var getUserCookie = function getUserInfo() {
    //判断登录的状态
    var isLogin = $.cookie("userInfo");
    if (isLogin) {
        isLogin = eval("(" + isLogin + ")");
    }
    return isLogin;
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

$(function () {
    $("#notice_wrap").hide();
    var isLogin = getUserCookie();
    //	console.log(isLogin);
    if (isLogin) {
        $("#isLogin .index-avatar img").attr("src", isLogin.Uimage);
        $("#isLogin .siteHCountInner .nickname").text(isLogin.Unickname);
        $("#notLogin").css("display", "none");
        $("#isLogin").css("display", "block");

        $(".glzc").css("display", "block");
        $(".siteMSearch").css("right", "180px");
    } else {
        $("#notLogin").css("display", "block");
        $("#isLogin").css("display", "none");

        $(".glzc").css("display", "none");
        $(".siteMSearch").css("right", "70px");
    }

    //读取保存的密码
    var signin = $.cookie("signinData");
    if (signin) {
        signin = eval("(" + signin + ")");
        $("#cd-login .cd-form input[name=signin_username]").val(signin.Uname);
        $("#cd-login .cd-form input[name=signin_password]").val(signin.Upass);
    }

    //layui
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.config({
            extend: 'myskin/style.css', //加载您的扩展样式
        });

        //点击  发起众筹  检测是否有登录
        $(".js-checkLogin").click(function () {
            var checkLogin = getUserCookie();
            if (!checkLogin) {
                layer.open({
                    title: "登录提示",
                    content: '请登录后重试！',
                    skin: "layer-ext-dialog"
                });
            } else {
                window.location.href = "raise.html";
            }
        });
        /*登录  开始*/
        $("#loginBtn").click(function (check) {

            $("#cd-login .cd-form").validate({
                //debug: true,
                onkeyup: null,
                rules: {
                    signin_username: {
                        required: true,
                        rangelength: [4, 12]
                    },
                    signin_password: {
                        required: true,
                        rangelength: [5, 15]
                    }
                },
                messages: {
                    signin_username: {
                        required: "请输入用户名",
                        rangelength: $.validator.format("用户名长度必须在：{0}-{1}之间")
                    },
                    signin_password: {
                        required: "请输入密码",
                        rangelength: $.validator.format("密码长度必须在：{0}-{1}之间")
                    }
                },
                submitHandler: function (form) { //用其他方式替代默认的 SUBMIT
                    var index = layer.load(1, {
                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                    });
                    //获取表单数据
                    var signin_username = $("#cd-login .cd-form input[name=signin_username]").val();
                    var signin_password = $("#cd-login .cd-form input[name=signin_password]").val();

                    if (signin_username != "" && signin_password != "") {
                        $.ajax({
                            type: "post",
                            url: "login.do",
                            data: {
                                "signin_username": signin_username,
                                "signin_password": signin_password
                            },
                            success: function (data) {
                                if (data == 1) {
                                    //登录成功
                                    $(".login_red").html("");
                                    layer.close(index);
                                    layer.msg("登录成功");
                                    //保存用户数据
                                    //如果勾选了保存密码
                                    if ($("#remember_me").is(':checked')) {
                                        var Uname = $("#cd-login .cd-form input[name=signin_username]").val();
                                        var Upass = $("#cd-login .cd-form input[name=signin_password]").val();
                                        var signinData = "{Uname:'" + Uname + "'," + "Upass:'" + Upass + "'}";
                                        $.cookie("signinData", signinData);

                                    } else {
                                        // alert(2)
                                        $.cookie("signinData", "");
                                    }
                                    ;
                                    setTimeout('window.location.reload();', 1000);
                                } else {
                                    //登录失败
                                    layer.msg("用户名或密码错误");
                                    $(".login_red").html("用户名或密码错误");
                                }
                            },
                            error: function (data) {
                                layer.close(index);
                                layer.msg("登录失败，请重试！！！");
                                $(".login_red").html("登录失败，请重试！！！");
                            }
                        });
                    }
                    layer.close(index);
                },
                errorPlacement: function (error, element) { //错误提示信息放置的位置
                    $(element)
                        .closest("form")
                        .find("label[for='" + element.attr("id") + "']").siblings(".tip")
                        .append(error);
                },
                errorElement: "p"
            });

        });
        /*登录  结束*/
        /*注册 开始*/
        $("#signupBtn").click(function () {

            $("#cd-signup .cd-form").validate({
                onkeyup: null,
                rules: {
                    signup_username: {
                        required: true,
                        rangelength: [4, 12],
                        remote: {
                            url: "signUpUserNameCheck.do",
                            type: "post",
                            data: {
                                "signUpUserName": function () {
                                    return $("#signup-username").val()
                                }
                            }
                        }
                    },
                    signup_email: {
                        required: true,
                        email: true
                    },
                    signup_password: {
                        required: true,
                        rangelength: [5, 15]
                    },
                    signup_repassword: {
                        required: true,
                        equalTo: '#signup-password'
                    },
                    accept_terms: {
                        required: true,
                    }
                },
                messages: {
                    signup_username: {
                        required: "请输入用户名",
                        rangelength: $.validator.format("用户名长度必须在：{0}-{1}之间"),
                        remote: "该用户名已被注册!"
                    },
                    signup_email: {
                        required: "请输入邮箱",
                        email: "邮箱格式不正确"
                    },
                    signup_password: {
                        required: "请输入密码",
                        rangelength: $.validator.format("密码长度必须在：{0}-{1}之间")
                    },
                    signup_repassword: {
                        required: "请再次输入密码",
                        equalTo: "两次密码不一致"
                    },
                    accept_terms: {
                        required: "必选",
                    }
                },
                submitHandler: function (form) { //用其他方式替代默认的 SUBMIT
                    var index = layer.load(1, {
                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                    });
                    $.ajax({
                        type: "post",
                        url: "signUpUser.do",
                        async: true,
                        data: $("#cd-signup .cd-form").serialize(),
                        success: function (data) {
                            if (data) {
                                layer.close(index);
                                layer.msg("注册成功···");
                                setTimeout('window.location.reload();', 1000)
                            } else {
                                layer.close(index);
                                layer.msg("注册失败，请检查信息是否正确！");
                            }
                        },
                        error: function (data) {
                            layer.close(index);
                            layer.msg("注册失败，请检查信息是否正确！");
                        }
                    });
                },
                errorPlacement: function (error, element) { //错误提示信息放置的位置
                    $(element)
                        .closest("form")
                        .find("label[for='" + element.attr("id") + "']").siblings(".tip")
                        .append(error);
                },
                errorElement: "p"

            });
        });
        /*注册 结束*/
        /*退出 开始*/
        $(".quit").click(function () {
            layer.msg("退出成功");
            $.cookie("userInfo", "");
            window.location.reload();
        });
        /*退出 结束*/

    });

})