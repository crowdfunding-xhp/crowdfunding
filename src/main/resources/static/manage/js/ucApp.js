;/**
 * Created by YL Huang on 2015/7/7.
 */

(function (window, angular,$) {
    'use strict';
    window.onload = function () {
        var elem = document.getElementById('ng-app');
        angular.bootstrap(elem, ['ucApp']);
    };
    var module;
    if($.browser.msie&& parseInt($.browser.version,10)==7){
        module= angular.module('ucApp', ['ui.router','ie7-support']);
    }else{
        module= angular.module('ucApp', ['ui.router']);
    }

    module.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("auth", {
                url: "/auth",
                controller: 'authCtrl',
                templateUrl: uc.siteTmplUrl("../views/auth.html")
            })
            .state("leader", {
                url: "/leader",
                controller: 'leaderCtrl',
                templateUrl: uc.siteTmplUrl("../views/leader.html")
            })
            .state("user_center", {
                url: "/user-center",
                controller: 'mainCtrl',
                templateUrl: uc.siteTmplUrl("../views/main.html")
            })
            .state("user_center.test", {
                url: "/test",
                controller: "testCtrl",
                templateUrl: uc.siteTmplUrl("../views/test.html")
            })
            .state("user_center.message", {
                url: "/message",
                controller: 'messageCtrl',
                templateUrl: uc.siteTmplUrl("../views/message/message.html")
            })
            //.state("user_center.topic", {
            //    url: "/topic",
            //    controller: 'topicCtrl',
            //    templateUrl: uc.siteTmplUrl("../views/message/topic.html")
            //})
            .state("user_center.comment", {
                url: "/comment",
                controller: 'commentCtrl',
                templateUrl: uc.siteTmplUrl("../views/message/comment.html")
            })
            .state("user_center.letter", {
                url: "/letter",
                controller: 'letterCtrl',
                templateUrl: uc.siteTmplUrl("../views/message/letter.html")
            })  
            .state("user_center.project", {
                url: "/project",
                controller: 'projectCtrl',
                templateUrl: uc.siteTmplUrl("../views/project/project.html")
            })
            .state("user_center.launch", {
                url: "/launch",
                controller: 'launchCtrl',
                templateUrl: uc.siteTmplUrl("../views/project/launch.html")
            })
            .state("user_center.invitationCode", {
                url: "/invitation-code",
                controller: 'invitationCodeCtrl',
                templateUrl: uc.siteTmplUrl("../views/mine/invitation-code.html")
            })
            .state("user_center.coupon", {
                url: "/coupon",
                controller: 'couponCtrl',
                templateUrl: uc.siteTmplUrl("../views/mine/coupon.html")
            })
            .state("user_center.hongbao", {
                url: "/hongbao",
                controller: 'hongbaoCtrl',
                templateUrl: uc.siteTmplUrl("../views/mine/hongbao.html")
            })
            .state("user_center.account", {
                url: "/account",
                controller: 'accountCtrl',
                templateUrl: uc.siteTmplUrl("../views/mine/account.html")
            })
            .state("user_center.focus", {
                url: "/focus",
                controller: 'focusCtrl',
                templateUrl: uc.siteTmplUrl("../views/mine/focus.html")
            })
            .state("user_center.userinfo", {
                url: "/userinfo",
                controller: 'userinfoCtrl',
                templateUrl: uc.siteTmplUrl("../views/userinfo/userinfo.html")
            })
            .state("user_center.changePassword", {
                url: "/change-password",
                controller: 'changePasswordCtrl',
                templateUrl: uc.siteTmplUrl("../views/userinfo/change-password.html")
            })
            .state("user_center.address", {
                url: "/address",
                controller: 'addressCtrl',
                templateUrl: uc.siteTmplUrl("../views/userinfo/address.html")
            })
            .state("user_center.idcard", {
                url: "/idcard",
                controller: 'idcardCtrl',
                templateUrl: uc.siteTmplUrl("../views/userinfo/idcard.html")
            })
            .state("user_center.bindcard", {
                url: "/bindcard",
                controller: 'bindCardCtrl',
                templateUrl: uc.siteTmplUrl("../views/userinfo/bindcard.html")
            })
            .state("user_center.rewardOrder", {
                url: "/reward-order",
                controller: 'rewardOrderCtrl',
                templateUrl: uc.siteTmplUrl("../views/order/reward-order.html")
            })
            .state("user_center.equityOrder", {
                url: "/equity-order",
                controller: 'equityOrderCtrl',
                templateUrl: uc.siteTmplUrl("../views/order/equity-order.html")
            })
            .state("user_center.equityOrderBuy", {
                url: "/equity-order-buy",
                controller: 'equityOrderBuyCtrl',
                templateUrl: uc.siteTmplUrl("../views/order/equity-order.html")
            });
        //$urlRouterProvider.otherwise('/user-center');
        //$locationProvider.html5Mode(true);
    }])
    .config(function ($sceProvider) {
        $sceProvider.enabled(false);
    })
    .run(['$rootScope', '$urlRouter', '$state', '$timeout','$interval', function ($rootScope, $urlRouter, $state, $timeout,$interval) {
        var title = document.title;
        var agent = navigator.userAgent.toLowerCase();
        if (!!window.ActiveXObject || "ActiveXObject" in window || $.browser.msie){
            $interval(function(){
                document.title = title;
            },100);
        }
        $rootScope.$on('$stateChangeStart', function(e, newUrl, oldUrl) {
            //e.preventDefault();
            if (e && $('.uploadify').length>0) {
                $('.uploadify').uploadify('destroy');
            }
        });
        $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl) {
            // Prevent $urlRouter's default handler from firing
            document.title= title;
            e.preventDefault();
            $timeout(function () {
                var stateName = $state.current.name.replace('user_center', '');
                $(document.body).find('[ui-sref]').removeClass('cur');
                $(document.body).find('.grzxLNavItem h3').removeClass('cur');
                var item = $(document.body).find('[ui-sref="' + stateName + '"]');
                item.addClass('cur');
                item.parent().parent().prev().addClass('cur');
            }, 500);
        });
        // Configures $urlRouter's listener *after* your custom listener
        $urlRouter.listen();
    }]);
})(window, window.angular,jQuery);
/**
 * Created by YL Huang on 2015/7/22.
 */
(function (window) {
    'use strict';
    window.uc = {
        siteTmplUrl: function (url) {
            url = url.split("views/").pop();
            return "/tmpl?file=" + url + "&app=uc";
        },
        staticUrl: function (url) {
            if (!url) { return ""; }
            if (url.match(/^\.?\//)) {
                url = '/' + url.replace(/^\.?\//g, "");
            }

            var obj = uc.parse_url(url);
            if (/\.web/.test(window.location.href)) {
                var m = location.href.match(/([^/]*)\.web.*(com|cn)/);
                return "http://" + m[1] + ".web.zhongchou." + m[2] + '/static/' + obj.path;
            } else {
                url = obj.path;
                var rnd = Math.floor(Math.random() * 9) + 1;
                var n_href = "http://zcs" + rnd + ".ncfstatic.com/" + url;
                return n_href + "?v=" + STATIC_VERSION;
            }
        },
        getActivateEmailURL : function(email){
            var hash = {
                'qq.com': 'http://mail.qq.com',
                'gmail.com': 'http://mail.google.com',
                'sina.com': 'http://mail.sina.com.cn',
                '163.com': 'http://mail.163.com',
                '126.com': 'http://mail.126.com',
                'yeah.net': 'http://www.yeah.net/',
                'sohu.com': 'http://mail.sohu.com/',
                'tom.com': 'http://mail.tom.com/',
                'sogou.com': 'http://mail.sogou.com/',
                '139.com': 'http://mail.10086.cn/',
                'hotmail.com': 'http://www.hotmail.com',
                'live.com': 'http://login.live.com/',
                'live.cn': 'http://login.live.cn/',
                'live.com.cn': 'http://login.live.com.cn',
                '189.com': 'http://webmail16.189.cn/webmail/',
                'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
                'yahoo.cn': 'http://mail.cn.yahoo.com/',
                'eyou.com': 'http://www.eyou.com/',
                '21cn.com': 'http://mail.21cn.com/',
                '188.com': 'http://www.188.com/',
                'foxmail.com': 'http://www.foxmail.com'
            };
            var url = 'javascript:;';
            if(!email){
                return url;
            }
            var laster = email.split('@')[1];
            if (hash[laster]) {
                url = hash[laster];
            }else{
                url = 'http://mail.'+laster;
            }
            return url;
        },
        copyObjectProperties: function (obj) {
            /* 只copy对象属性，不包括function */
            var deepCopy = function (source) {
                var result = {};
                for (var key in source) {
                    var typeStr = Object.prototype.toString.call(source[key]).toLowerCase()
                    if (typeStr !== "[object function]") {
                        if (typeStr === "[object object]") {
                            result[key] = deepCopy(source[key]);
                        } else {
                            result[key] = source[key];
                        }
                    }
                }
                return result;
            };
            return deepCopy(obj);
        },
        serviceUrl: function (url) {
            var r = '/rpc-' + url.replace(/\//g, ',');
            return r;
        },
        parse_url: function (url) {
            var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
            var matches = url.match(pattern);

            var dats = {
                scheme: matches[2],
                authority: matches[4],
                path: matches[5],
                query: matches[7],
                fragment: matches[9]
            };
            return dats;

        },
        imageProcess : function(url, type, width, height){
            if(!url || url.length==0){
                return '';
            }
            var rpos = url.lastIndexOf("/");
            var left = url.substr(0, rpos + 1);
            var right = url.substr(rpos + 1, url.length - rpos);

            var prts = right.split(".");
            var new_file_name = prts[0] + "_" + type + "_" + width + "x" + height + "." + prts[1];
            return left + new_file_name;

        },
        staticUpldImg: function (url) {
            if (!url) { return ""; }
            if (url.match(/^\.?\//)) {
                url = '/' + url.replace(/^\.?\//g, "");
            }

            var obj = uc.parse_url(url);
            if (/\.web/.test(window.location.href)) {
                var m = location.href.match(/([^/]*)\.web.*(com|cn)/);
                if (url.match('avatar')) {

                    return "http://" + m[1] + ".web.zhongchou." + m[2] + obj.path;
                } else {

                    return "http://" + m[1] + ".api.zhongchou." + m[2] + obj.path;
                }
            } else {
                url = obj.path;
                var rnd = Math.floor(Math.random() * 9) + 1;
                var n_href = "http://zcr" + rnd + ".ncfstatic.com" + url;
                return n_href + "?v=" + STATIC_VERSION;
            }

        },
        staticZCSImg: function (url) {
            if (!url) { return ""; }
            if (url.match(/^\.?\//)) {
                url = '/' + url.replace(/^\.?\//g, "");
            }

            var obj = uc.parse_url(url);
            url = obj.path;
            var rnd = Math.floor(Math.random() * 9) + 1;
            var n_href = "http://zcs" + rnd + ".ncfstatic.com" + url;
            return n_href + "?v=" + STATIC_VERSION;
        },
        psvc_url: function () {
            var baseUrl = "/prpc/";
            var urlPrts = [];
            for (var i = 0; i < arguments.length; i++) {
                var url = arguments[i].url.replace(/\//g, "-");
                var query = uc.build_query(arguments[i].data);
                if (url.indexOf('&') === -1 && query) {
                    url += "&";
                }
                url += query;
                url = url.replace(/[&?=]/g, "-");
                if (arguments[i].name) {
                    url = arguments[i].name + "," + url;
                }
                urlPrts.push(url);
            }
            return baseUrl + urlPrts.join("/");
        },

        build_query: function (params) {
            var p = [];
            for (var key in params) {
                p.push(key + "=" + (params[key] ? params[key] : ""));
            }
            return p.join('&');
        },
        format_money: function (money) {
            money = parseFloat(money || 0);
            var diff = money - Math.floor(money);
            if (diff > 0) {
                return money.toFixed(2);
            }
            return money.toFixed(0);
        },
        eqParams: function(controller, action, method ,params){

            var obj = {
                a : controller,
                f : action,
                t : method == 'GET' ? "0" : "1"
            };

            var p_arr = [];
            for(var key in params){
                p_arr.push(key + "|" + params[key]);
            }
            obj.p = p_arr.join("|");
            return obj;
        },
        modal: {
            confirm: function (title, content, callback) {
                var modal = $('<div class="modal fade">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title">' + title + '</h4>\
                            </div>\
                            <div class="modal-body">' + content + '</div>\
                            <div class="modal-footer">\
                                <button type="button" class="modal-cancel">取消</button>\
                                <button type="button" class="modal-ok">确认</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>');
                if ($('.modal').length > 0) {
                    $('.modal').remove();
                }
                $(document.body).append(modal);
                modal.fadeIn().addClass('in');
                function close() {
                    if (uc.static.isBeforeIE9()) {
                        $('.modal').remove();
                        return;
                    }
                    modal.removeClass('in');
                    setTimeout(function () {
                        $('.modal').remove();
                    }, 500);
                }

                $('.modal-header').find('.close').click(close);
                $('.modal-footer .modal-cancel').click(close);
                if (!callback) {
                    $('.modal-footer .modal-ok').click(close);
                } else {
                    $('.modal-footer .modal-ok').click(function () {
                        $(this).attr('disabled', 'disabled');
                        $(this).text('处理中...');
                        callback();
                    });
                }
            },

            alert: function (title, content, callback) {
                var modal = $('<div class="modal fade">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title">' + title + '</h4>\
                            </div>\
                            <div class="modal-body">' + content + '</div>\
                            <div class="modal-footer">\
                                <button type="button" class="modal-ok">确定</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>');
                if ($('.modal').length > 0) {
                    $('.modal').remove();
                }
                $(document.body).append(modal);
                modal.fadeIn().addClass('in');
                function close() {
                    if (uc.static.isBeforeIE9()) {
                        $('.modal').remove();
                        return;
                    }
                    modal.removeClass('in');
                    setTimeout(function () {
                        $('.modal').remove();
                    }, 1000);
                }

                $('.modal-header').find('.close').click(close);
                $('.modal-footer button').click(function () {
                    if (callback) {
                        $(this).attr('disabled', 'disabled');
                        $(this).text('处理中...');
                        callback();
                    }
                    close();
                });
            },

            close: function () {
                if (uc.static.isBeforeIE9()) {
                    $('.modal').remove();
                    return;
                }
                $('.modal').removeClass('in');
                setTimeout(function () {
                    $('.modal').remove();
                }, 500);
            }
        }
    };
    window.uc.static = {
        JS_PATH: window.uc.staticUrl('v4/uc/js/'),
        UPLOAD_SWF_PATH: '/static/v4/uc/js/uploadify.swf',
        COPY_SWF_PATH: window.uc.staticUrl('v4/uc/js/ZeroClipboard.swf'),
        DEFAULT_UPLOAD_IMAGE:window.uc.staticUrl('v4/uc/images/defaultPic.png'),
        isBeforeIE9: function () {
            var agent = navigator.userAgent.toLowerCase();
            /*ie9以下ie浏览器使用*/
            return agent.indexOf("msie") > 0 && !(-[1,]);
        }
    };
})(window);
(function (window, angular, ucApp) {

    ucApp.controller("authCtrl", ['$scope','$location', 'Common', 'User', function ($scope,$location, Common, User) {
        Common.noInvitationCode();
        $scope.buildNumArray = Common.buildNumArray;
        $scope.redirect = Common.redirect;
        $scope.currentYear = new Date().getFullYear();
        $scope.index = Common.AUTH_TYPE.IDCARD;

        $scope.sex = [{
            text: '男',
            value: 1
        }, {
            text: '女',
            value: 0
        }];
        $scope.local = [{
            text: '香港',
            value: 1
        }, {
            text: '澳门',
            value: 2
        }, {
            text: '台湾',
            value: 3
        }];
        $scope.title = 0;
        $scope.index = 0;
        var searchObject = $location.search();
        if(searchObject['s']){
            $scope.fromProject = true;
        }
        var qualify = null;
        if(searchObject['q']){
            try {
                //个人资金情况 1-金融资产不低于500万 2-近三年个人年收入不低于50万
                // 只有1和2两个值
                qualify = parseInt(searchObject['q'], 10);
                if(qualify!=1 && qualify!=2){
                    qualify = null;
                }
            }catch(ex){

            }
        }
        var afterGetAuth = function (data) {
            $scope.finishShow = {
                name: '',
                number: ''
            };
            switch (data.status){
                case 1:
                    $scope.index = 3;
                    $scope.finishShow = {
                        name: data.auth_info.true_name,
                        number: data.auth_info.card
                    };
                    break;
                case 2:
                    $scope.index = 5;
                    gaTrack('invest', 'failed');
                    $scope.finishShow = {
                        name: data.auth_info.true_name,
                        number: data.auth_info.card
                    };
                    break;
                case 3:
                    $scope.index = 4;
                    break;
                default :
                    $scope.index= 1;
                    break;
            }
        };
        User.get_auth().then(afterGetAuth);
        $scope.goProject = function(){
            if($scope.fromProject){
                gaTrack('invest', 'goProject');
                location.href = searchObject['s'];
            }
        };

        $scope.$watch('index', function (newValue, oldValue) {
            if (newValue == Common.AUTH_TYPE.IDCARD) {
                $scope.card = {
                    name: '',
                    idcard: ''
                };
            };
            if (newValue == Common.AUTH_TYPE.PASSPORT) {
                $scope.passport = {
                    image: uc.static.DEFAULT_UPLOAD_IMAGE
                };
                $scope.passport.sex = 1;
                $scope.passport.local = 1;
            };
        });

        $scope.saveIdCard = function () {
            $('#idCardForm input').blur();
            if ($('#idCardForm [invalid_data]').length == 0) {
                var idCard = {
                    type: 0,
                    idCard: $scope.card.idCard,
                    realName: $scope.card.name
                };
                if(qualify){
                    idCard.qualify = qualify;
                }
                gaTrack('invest', 'infoConfirm');
                User.user_auth(idCard).then(function (data) {
                    if (!data.error) {
                        User.get_auth().then(afterGetAuth);
                    }
                });
            }
        };
        $scope.savePassport = function () {
            $('#passportForm input').blur();
            $('#passportForm select').blur();
            if ($('#passportForm [invalid_data]').length == 0 && $scope.passport.image!=uc.static.DEFAULT_UPLOAD_IMAGE) {
                var pass = $scope.passport;
                var startTime = moment( new Date(pass.startyear,parseInt(pass.startmonth,10)-1,pass.startday)).format('YYYY-MM-DD') ;
                var endTime =  moment( new Date(pass.endyear,parseInt(pass.endmonth,10)-1,pass.endday)).format('YYYY-MM-DD') ;
                var birthday = moment( new Date(pass.year,parseInt(pass.month,10)-1,pass.day)).format('YYYY-MM-DD') ;
                var passportData = {
                    type: 1,
                    sex: pass.sex,
                    realName: pass.name,
                    birthday: birthday,
                    start: startTime,
                    end: endTime,
                    pass: pass.id,
                    hmt: pass.local,
                    hmt_img:[$scope.passport.image]
                };
                if(qualify){
                    passportData.qualify = qualify;
                }
                User.user_auth(passportData).then(function (data) {
                    if (!data.error) {
                        User.get_auth().then(afterGetAuth);
                    }
                })
            }else if($('#passportForm [invalid_data]').length == 0 && $scope.passport.image==uc.static.DEFAULT_UPLOAD_IMAGE){
                uc.modal.alert("提示信息", "请上传证件照片");
            }
        };
    }]);
})(window, window.angular, angular.module('ucApp'));
(function (window, angular, ucApp) {
    'use strict';
    ucApp.controller("leaderCtrl", ['$rootScope', '$scope', 'Common', 'User', 'Project', 'Order', function ($rootScope, $scope, Common, User, Project, Order) {
        $scope.leaderList = [];
        $scope.hidedis = 0;
        $scope.dealID = window.location.href.split("#")[2];
        $scope.updateList = function () {
            Order.getleaderList($scope.dealID).then(function (d) {
                $scope.hidedis = 1;
                $scope.leaderList = d.data.leaderData;
            });
        };
        $scope.updateList();
        $scope.chooseLeader = function (data) {
            uc.modal.confirm("选择领投人", "领投人审核通过后将不能取消，您是否和申请者充分沟通并确认其成为领投人？", function () {
                Order.chooseLeader(data).then(function (data) {
                    $scope.updateList();
                    uc.modal.close();
                });
            });
        };
        $scope.cancelLeader = function (data) {
            uc.modal.confirm("驳回领投人", "领投人驳回之后将不可取消，您是否和申请者充分沟通并确认驳回其领投申请？", function () {
            Order.chooseLeader(data).then(function (data) {
                    $scope.updateList();
                    uc.modal.close();
                });
            });
        };
    }]);
})(window, window.angular, angular.module('ucApp'));

(function(window, angular,ucApp) {
    'use strict';
    angular.module('ucApp')
    ucApp.controller("testCtrl",['$rootScope','$scope','Common','User','Project',function($rootScope,$scope,Common,User,Project){
      // var user = new User();
      // var promise = user.do();
      //
      // user.replyz({}).then(function(data){
      //      if(data){
      //        //alert(1);
      //          console.log(data);
      //      }
      //  });
      // promise.then(function(data){
      //     console.log(data);
      // });
      //User.get_city_listz().then(function(data){console.log(data)});
      //User.get_fanli_list().then(function(data){console.log(data)});
      //User.get_invitation_list().then(function(data){console.log(data)});
      //User.get_user_answerlist_list().then(function(data){console.log(data)});
      //User.get_user_received_comment_list().then(function(data){console.log(data)});
      //User.get_letter_list().then(function(data){console.log(data)});
      // User.get_user_received_comment_list().then(function(a){console.log(a)})
       //console.log(User.get_user_address_listz().then(function(data){console.log(data)}));
      
    }]);
})(window, window.angular,angular.module('ucApp'));

/**
 * 地址选择控件
 * @author weimeng
 */

(function(window, angular,$,ucApp,ZeroClipboard) {
    'use strict';
    ucApp.directive('address',['Address', function (Address) {
        return {
            restrict: 'A',
            replace: false,
            scope : {
                province : "=province",
                city : "=city"    
            },
            link: function (scope, elem, attrs) {
              
                var $province = $("#" + attrs['provinceSelector']);
                var $city = $("#" + attrs['citySelector']);

                var provinceList = [];
                var cityList = [];
                var province = scope.province;
                var city = scope.city;


                if(!province){
                    Address.emptySelection();
                }
                scope.$watch("province", function(){
                    Address.loadProvinces(scope.province, scope.city);
                });
        
                scope.$on(Address.Events.ADDR_PROVINCES_LOAD, function(event, data){
                    provinceList = data;
                    render();
                });


                scope.$on(Address.Events.ADDR_PROVINCE_CHANGED, function(event, data){
                    cityList = data.cityList;
                });

                scope.$on(Address.Events.ADDR_CITY_CHANGED, function(event, data){
                    scope.province = data.province;
                    scope.city= data.city;
                    scope.$apply();
                    render();
                });

                $province.change(function(){
                    var provinceId = $province.val();
                    Address.changeProvince(provinceId);
                });
                $city.change(function(){
                    var cityId = $city.val();
                    Address.changeCity(cityId);
                });

                function render(){
                    $province.empty();
                    $city.empty();
                    $province.append("<option selected='selected' value=''>请选择</option>");
                    $city.append("<option selected='selected' value=''>请选择</option>");
                    _.each(provinceList, function(p){
                        var option = $("<option></option>");
                        option.text(p.name);
                        option.val(p.zone_id);
                        $province.append(option);
                    });

                    _.each(cityList, function(c){
                        var option = $("<option></option>");
                        option.text(c.name);
                        option.val(c.zone_id);
                        $city.append(option);
                    });

                    $province.val(Address.getSelectedProvinceId());
                    $city.val(Address.getSelectedCityId());
                    $province.width(0).width("");
                    $city.width(0).width("");
                }
            }
        };
    }]);
})(window, window.angular,$,angular.module('ucApp'),ZeroClipboard);


/**
 * 地址选择控件
 * @author weimeng
 */

(function(window, angular,$,ucApp,ZeroClipboard) {
    'use strict';
    ucApp.directive('address2',['Address2', function (Address) {
        return {
            restrict: 'A',
            replace: false,
            scope : {
                province : "=province",
                city : "=city",
                cityString : "=cityString"
            },
            link: function (scope, elem, attrs) {
                var address = new Address();
              
                var $province = $("#" + attrs['provinceSelector']);
                var $city = $("#" + attrs['citySelector']);

                var provinceList = [];
                var cityList = [];

                var province = scope.province;
                var city = scope.city;


                function loadProvince(){
                    address.loadProvinces(scope.province).then(function(data){
                        provinceList = data.provinceList;
                        cityList = data.cityList;
                        render();

                        var province_name = $province.find('option:selected').text();
                        var city_name = $city.find('option:selected').text();
                        scope.cityString = (province_name || "" ) + (city_name || "");
                    });
                }
                scope.$watch("province", function(){
                    loadProvince();
                });

                scope.$watch("city", function(){
                   render();

                });
        

                $province.change(function(){
                    var provinceId = $province.val();
                    scope.province = provinceId;
                    loadProvince(provinceId);
                    var province_name = $province.find('option:selected').text();
                    scope.cityString = (province_name || "" );
                });

                $city.change(function(){
                    var cityId = $city.val();

                    var province_name = $province.find('option:selected').text();

                    var city_name = $city.find('option:selected').text();
                    scope.cityString = (province_name || "" ) + (city_name || "");
                    scope.city = cityId;
                    scope.$apply();
                });

                function render(){
                    $province.empty();
                    $city.empty();
                    $province.append("<option selected='selected' value=''>请选择</option>");
                    $city.append("<option selected='selected' value=''>请选择</option>");
                    _.each(provinceList, function(p){
                        var option = $("<option></option>");
                        option.text(p.name);
                        option.val(p.zone_id);
                        $province.append(option);
                    });

                    _.each(cityList, function(c){
                        var option = $("<option></option>");
                        option.text(c.name);
                        option.val(c.zone_id);
                        $city.append(option);
                    });

                    $province.val(scope.province);
                    $city.val(scope.city);
                    $province.width(0).width("");
                    $city.width(0).width("");
                }
            }
        };
    }]);
})(window, window.angular,$,angular.module('ucApp'),ZeroClipboard);


/**
 * Created by YL Huang on 2015/10/30.
 */
(function(window, angular,$,ucApp,ZeroClipboard) {
    'use strict';
    ucApp.directive('bindEmail', function () {
        return {
            restrict: 'A',
            scope:{
                model : '=model'
            },
            replace: false,
            link: function (scope, elem, attrs) {
                $(elem).click(function() {
                    var form = $('<div><fieldset><legend></legend></fieldset></div>');
                    var email = $('\
                        <div class="formitm">\
                            <label class="lab">常用邮箱：</label>\
                            <div class="inpt">\
                            <input type="text" class="u-ipt">\
                                <span class="error-txt"></span>\
                            </div>\
                        </div>\
                    ');
                    var btnGroup = $('\
                        <div class="formitm">\
                            <div class="inpt mt20">\
                                <button class="btn btn-blue small mr20" type="button">提交</button>\
                            </div>\
                        </div>\
                    ');
                    form.append(email).append(btnGroup);
                    openWindow('绑定邮箱', form);
                    setPosition();

                    btnGroup.find('button').first().click(function(){
                        form.find('input').blur();
                        var _this = this;
                        if(form.find('[invalid]').length==0){
                            var emailValue= $.trim(email.find('input').val());
                            $(_this).removeClass('btn-blue').addClass('btn-light-gay');
                            $.post(uc.serviceUrl('validate/email?v=3'),{ email : emailValue },function(data){
                                $(_this).removeClass('btn-light-gay').addClass('btn-blue');
                                if(data.errno == 0){
                                    scope.model = emailValue;
                                    scope.$apply();
                                    closeWindow();
                                    showValidEmailWindow('激活邮箱',data.data.show_email,data.data.resend_url);
                                }else{
                                    uc.modal.alert('提示信息',data.error);
                                }
                            });

                        }
                    });
                    $('#prefectInfo-pop').find('.close').click(closeWindow);

                    var errorCls = '.error-txt';
                    function textBlur(obj,message){
                        var value = $.trim(obj.val());
                        var empty = value.length == 0;
                        if (empty) {
                            obj.parent().find(errorCls).show().text(message);
                            obj.attr('invalid', 'true');
                        } else {
                            if (value.length > 50) {
                                obj.parent().find(errorCls).show().text('最多只能输入20个字符');
                                obj.attr('invalid', 'true');
                                return;
                            }
                            obj.removeAttr('invalid');
                            obj.parent().find(errorCls).hide();
                        }
                    }
                    email.find('input').on('blur',function(){
                        var value = $.trim($(this).val());
                        if(value.length>0){
                            if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)){
                                $(this).parent().find(errorCls).show().text('邮箱格式错误');
                                $(this).attr('invalid', 'true');
                            }else{
                                $(this).removeAttr('invalid');
                                $(this).parent().find(errorCls).hide();
                            }
                        }else{
                            $(this).parent().find(errorCls).show().text('请输入邮箱');
                            $(this).attr('invalid', 'true');
                        }
                    });
                });
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));



/**
 * Created by YL Huang on 2015/10/30.
 */
(function(window, angular,$,ucApp,ZeroClipboard) {
    'use strict';
    ucApp.directive('bindMobile', function () {
        return {
            restrict: 'A',
            scope:{
                model : '=model'
            },
            replace: false,
            link: function (scope, elem, attrs) {
                $(elem).click(function() {
                    var form = $('<div><fieldset><legend></legend></fieldset></div>');
                    var useImageValidCode = false;
                    var mobilePhone = $('\
                        <div class="formitm">\
                            <label class="lab">手机号码：</label>\
                            <div class="inpt">\
                            <input type="text" class="u-ipt">\
                                <span class="error-txt">*手机号不能为空</span>\
                            </div>\
                        </div>\
                    ');
                    var imgValidCode = $('\
                        <div class="formitm">\
                            <label class="lab">图片验证码：</label>\
                            <div class="inpt img-tel-ver">\
                                <input type="text" class="u-ipt">\
                                <img src="/verify.php" alt="" class="domain">\
                                <span class="error-txt">*请填写图片验证码</span>\
                            </div>\
                        </div>\
                    ');
                    var mobileValidCode = $('\
                        <div class="formitm">\
                            <label class="lab">手机验证码：</label>\
                            <div class="inpt img-tel-ver">\
                                <input type="text" class="u-ipt">\
                                <a href="javascript:" class="domain btn-orange">获取</a>\
                                <span class="error-txt">*请填写手机验证码</span>\
                            </div>\
                        </div>\
                    ');
                    var btnGroup = $('\
                        <div class="formitm">\
                            <div class="inpt mt20">\
                                <button class="btn btn-blue small mr20" type="button">提交</button>\
                            </div>\
                        </div>\
                    ');
                    form.append(mobilePhone).append(imgValidCode.hide()).append(mobileValidCode).append(btnGroup);
                    openWindow('绑定手机', form);
                    setPosition();
                    function reload(){
                        var $img = imgValidCode.find('img');
                        var src = $img.attr('src');
                        if(src.match(/t=\d+/)){
                            src = src.replace(/t=(\d+)/, 't=' + Date.parse(new Date()))
                        }else{
                            src = src + "?t=" + Date.parse(new Date()) ;
                        }

                        $img.attr('src',src);
                    }
                    imgValidCode.find('img').click(function(){
                        reload();

                    });
                    btnGroup.find('button').first().click(function(){
                        form.find('input').blur();
                        var _this = this;
                        if(!useImageValidCode){
                            imgValidCode.find('input').removeAttr('invalid');
                        }
                        if(form.find('[invalid]').length==0){
                            var mobilePhoneValue= $.trim(mobilePhone.find('input').val());
                            var mobilePhoneCodeValue= $.trim(mobileValidCode.find('input').val());
                            var postData = {
                                mobile : mobilePhoneValue,
                                smscode : mobilePhoneCodeValue
                            };
                            $(_this).removeClass('btn-blue').addClass('btn-light-gay');
                            $.post(uc.serviceUrl('validate/mobile?v=3'),postData,function(data){
                                $(_this).removeClass('btn-light-gay').addClass('btn-blue');
                                if(data.errno == 0){
                                    scope.model = mobilePhoneValue;
                                    scope.$apply();
                                    closeWindow();
                                    showSuccessWindow('绑定手机');
                                }else{
                                    uc.modal.alert('提示信息',data.error);
                                }
                            });

                        }
                    });
                    $('#prefectInfo-pop').find('.close').click(closeWindow);

                    var errorCls = '.error-txt';
                    function textBlur(obj,message){
                        var value = $.trim(obj.val());
                        var empty = value.length == 0;
                        if (empty) {
                            obj.parent().find(errorCls).show().text(message);
                            obj.attr('invalid', 'true');
                        } else {
                            if (value.length > 50) {
                                obj.parent().find(errorCls).show().text('最多只能输入20个字符');
                                obj.attr('invalid', 'true');
                                return;
                            }
                            obj.removeAttr('invalid');
                            obj.parent().find(errorCls).hide();
                        }
                    }
                    mobilePhone.find('input').on('blur',function(){
                        textBlur($(this),'请输入手机号码');
                        var value = $.trim($(this).val());
                        if(value.length>0){
                            if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)){
                                $(this).parent().find(errorCls).show().text('手机号码格式错误');
                                $(this).attr('invalid', 'true');
                            }else{
                                $(this).removeAttr('invalid');
                                $(this).parent().find(errorCls).hide();
                            }
                        }
                    });
                    mobileValidCode.find('input').on('blur',function(){
                        textBlur($(this),'请输入手机验证码');
                    });
                    mobileValidCode.find('a').click(function(){
                        if($(this).hasClass('btn-light-gray')) return;
                        mobilePhone.find('input').blur();
                        if(mobilePhone.find('input')[0].hasAttribute('invalid')){
                            return;
                        }

                        var postData = {
                            mobile : $.trim(mobilePhone.find('input').val())
                        };

                        if(useImageValidCode){
                            imgValidCode.find('input').blur();
                            if(imgValidCode.find('input')[0].hasAttribute('invalid')){
                                return;
                            }else {
                                postData.v_code = $.trim(imgValidCode.find('input').val());
                            }
                        }

                        $(this).removeClass('btn-orange').addClass('btn-light-gray');
                        $.post(uc.serviceUrl('user/sendsms?v=3'),postData,function(data){
                            if(data.errno == 0) {
                                var time = 60;
                                var interval = setInterval(function () {
                                    time--;
                                    if (time == 0) {
                                        mobileValidCode.find('a').text('获取');
                                        mobileValidCode.find('a').removeClass('btn-light-gray').addClass('btn-orange');
                                        clearInterval(interval);
                                    } else {
                                        mobileValidCode.find('a').text(time + '秒后获取');
                                    }
                                }, 1000);
                            }else{
                                reload();
                                uc.modal.alert('提示信息',data.error);
                                mobileValidCode.find('a').removeClass('btn-light-gray').addClass('btn-orange');
                            }
                            if (data.data.show_captcha) {
                                useImageValidCode = true;
                                imgValidCode.show();
                            }
                        });
                    });
                });
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));



/**
 * Created by YL Huang on 2015/7/16.
 */

(function(window, angular,$,ucApp,ZeroClipboard) {
    'use strict';
    /**
     * attrs
     *      data-clipboard-text 必选 需要copy的内容
     *      id 必选 使用对象的id
     */
    ucApp.directive('copy', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                if(uc.static.isBeforeIE9()){
                    $(elem).click(function(){
                        window.clipboardData.setData('text',attrs.clipboardText);
                        uc.modal.alert('信息提示','复制成功！');
                    });
                    return;
                }
                var client = new ZeroClipboard(document.getElementById(attrs.id));
                client.on("ready", function() {
                    client.on( "aftercopy", function() {
                        uc.modal.alert('信息提示','复制成功！');
                    });
                } );
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'),window.ZeroClipboard);



/**
 * Created by YL Huang on 2015/7/15.
 */
(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('navigation', ['$state',function ($state) {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl:uc.siteTmplUrl('views/navigation.html'),
            link: function (scope, elem, attrs) {
                $(elem).find('a').click(function(){
                    $(elem).find('a').removeClass('cur');
                    $(elem).find('h3').removeClass('cur');
                    $(this).addClass('cur');
                    $(this).parent().parent().prev().addClass('cur');
                });
            }
        };
    }]);
})(window, window.angular,$,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */
(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('ngElementReady', function () {
        return {
            restrict: 'AE',
            replace: false,
            link: function (scope, elem, attrs) {
                $("#mainloading").slideUp(500);
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/16.
 */
(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('pagination', function () {
        return {
            restrict: 'AE',
            scope: {
                pages: '=pages',
                currentPage:'=currentPage'
            },
            replace: true,
            link: function (scope, elem, attrs) {
                function createPagination(page){
                    var str_prv='<a class="prev normalPage">上一页</a>',
                        str_next='<a class="next normalPage">下一页</a>',
                        str_begin ='<div class="pager">',
                        str_end ='<div style="clear: both;"></div></div>',
                        str = '';
                    var init = function(){
                        $(elem).html('');
                        if(scope.currentPage != page){
                            scope.currentPage = page;
                            scope.$apply();
                        }else{
                            scope.currentPage = page;
                        }
                    };
                    var loop = function(begin,end){
                        for(var i=begin;i<=end;i++){
                            if(scope.currentPage == i){
                                str += '<a class="selected normalPage">'+i+'</a>';
                            }else{
                                str += '<a class="normalPage">'+i+'</a>';
                            }
                        }
                    };
                    var addEndPage = function(){
                        str += '<a class="normalPage">'+(scope.pages-1)+'</a>';
                        str += '<a class="normalPage">'+(scope.pages)+'</a>';
                    };
                    var buildOther = function(){
                        str += '<a class="normalPage">1</a>';
                        str += '<a class="normalPage">2</a>';
                        if(scope.currentPage>=7 && scope.pages>10){
                            str += '<a class="normalPage" page="'+(scope.currentPage-3)+'">...</a>';
                        }
                        if(scope.pages-scope.currentPage>5){
                            var begin = scope.currentPage - 2;
                            var end = scope.currentPage + 2;
                            if(end > scope.pages){
                                end = scope.pages;
                                begin = end - 4;
                                if(scope.currentPage - begin < 2){
                                    begin = begin-1;
                                }
                            }else if(end + 1 == scope.pages){
                                end = scope.pages-2;
                            }
                            loop(begin,end);
                            if(end != scope.pages && scope.pages-scope.currentPage>3){
                                str += '<a class="normalPage" page="'+(scope.currentPage+3)+'">...</a>';
                            }
                            if(scope.currentPage<scope.pages-2){
                                addEndPage();
                            }
                        }else{
                            loop(scope.pages-6,scope.pages);
                        }
                    };
                    var doPage = function(){
                        if(scope.pages <= 8){
                            loop(1,scope.pages);
                        }else{
                            if(scope.currentPage <= 6){
                                loop(1,7);
                                if(scope.pages>10){
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
                                if(scope.currentPage == 1){
                                    return
                                };
                                createPagination(page-1);
                                return;
                            }
                            if($(this).attr('class').indexOf('next')>-1){
                                if(scope.currentPage == scope.pages){
                                    return
                                }
                                createPagination(page+1);
                                return;
                            }
                            if($(this).attr('page')){
                                createPagination(parseInt($(this).attr('page'),10));
                                return;
                            }
                            var val = parseInt($(this).text(),10);
                            createPagination(val);
                        });
                    };
                    if(scope.pages>1){
                        init();
                        doPage();
                        createElement();
                    }else{
                        $(elem).html('');
                    }
                };
                createPagination(scope.currentPage);
                scope.$watch('pages',function(newValue,oldValue){
                    if(newValue && newValue!=oldValue) {
                        createPagination(scope.currentPage);
                    }
                });
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));



/**
 * weimeng
 */

(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('projectOperation', ['$rootScope', function ($rootScope) {
        /**
         * @options 必选 操作描述对象
         * @project 项目
         */
        return {
            restrict: 'A',
            replace: true,
            scope : {
                options :'=options',
                project : '=project'
            },

            link: function ($scope, elem, attrs) {

                var options = $scope.options;
                var project = $scope.project;
                _.each(options, function(option){
                    var operation = option.operation;
                    var mode = option.mode;
                    var $__elem, url = '', params = [], tip = '';
                    $__elem = $('<a></a>');
                    if(operation) {
                        switch (operation.type) {
                            case 'eq_url' :
                                var user = $rootScope.user;
                                 url = operation.url.replace(/\{([^\{}]*)\}/g, function (item) {
                                    var key = item.match(/\{([^\{\}]*)\}/).pop();
                                    return project[key];
                                });
                                url = eq_jump(user.user_id, user.user_token, url, true);
                                $__elem.attr("href", url);
                                break;
                            case 'url' :
                                url = operation.url.replace(/\{([^\{}]*)\}/g, function (item) {
                                    var key = item.match(/\{([^\{\}]*)\}/).pop();
                                    return project[key];
                                });
                                $__elem.attr("href", url);
                                break;
                            case 'tooltip':
                                tip = operation.hint.replace(/\{([^\{}]*)\}/g, function (item) {
                                    var key = item.match(/\{([^\{\}]*)\}/).pop();
                                    return project[key];
                                });
                                if (!tip || tip.length == 0) {
                                    tip = "无";
                                }
                                $__elem.tooltip({
                                    content: tip,
                                    animation: true,
                                    html: true,
                                    trigger: 'hover',
                                    placement: 'bottom'
                                });
                                break;
                            case 'click':
                                $__elem.click(function () {
                                    operation.handler(project);
                                });
                                break; 
                            case 'popup':
                                $__elem.click(function(){
                                    var title = operation.title.replace(/\{([^\{}]*)\}/g, function (item) {
                                        var key = item.match(/\{([^\{\}]*)\}/).pop();
                                        return project[key];
                                    });
                                    var content = operation.content.replace(/\{([^\{}]*)\}/g, function (item) {
                                    var key = item.match(/\{([^\{\}]*)\}/).pop();
                                        return project[key];
                                    });
                                    if(!title||title.length==0){
                                        title='提示';
                                    }
                                    if (!content || content.length == 0) {
                                        content = "无";
                                    }
                                    if(sitePop)sitePop.popUp(title,content);
                                });
                        }

                        if (operation.target) {
                            $__elem.attr("target", operation.target);
                        }
                        // 计算样式
                        if (mode === 'lbtn') {
                            $__elem.addClass('ddLastbtn_A');
                        } else {
                            $__elem.addClass('ddLastbtn_B');
                            // 宽度
                            if (operation.text.length >= 4) {
                                $__elem.css("width", "100px");
                            } else {
                                $__elem.css("width", "45px");
                            }
                        }
                        $__elem.addClass('btn_ALink');
                        $__elem.text(operation.text);
                        $(elem).append($__elem);
                    }
                });
            }
        };
    }]);
})(window, window.angular,$,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/8/4.
 */
/**
 * Created by YL Huang on 2015/7/20.
 */

(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('qrcode', function () {
        /**
         * attrs
         *      width
         *      height
         *      url
         */
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                var qrcode = new QRCode(elem[0], {
                    width : attrs.width,
                    height : attrs.height
                });
                qrcode.makeCode(attrs.url);
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/20.
 */

(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('tooltip', function () {
        /**
         * attrs
         *      title|content 必选 多行使用||分割
         *      direction top bottom lef right
         *      trigger click hover focus， 默认hover focus鼠标滑倒元素或焦点掉元素上显示
         *      two-dimensional-code false 二维码/红包，该属性为true时，content或title中的内容必须为二维码的图片url
         */
        return {
            scope : {
                showText : '=showText'
            },
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                var direction = attrs.direction || 'bottom',
                    trigger = attrs.trigger || 'hover focus';
                var customer_content = attrs.title || attrs.content;
                var text_arr = customer_content.split('||');

                if(text_arr.length>1){
                    customer_content = '';
                    for(var i=0 ;i<text_arr.length;i++){
                        customer_content += text_arr[i]+'<br />';
                    }
                }
                if(attrs.twoDimensionalCode){
                    customer_content ='<div><img src="'+customer_content+'" width="300" height="300"></div><div style="text-align: center;font-size: 14px; line-height: 20px;">微信扫上方二维码发红包给朋友</div>';
                };
                if(scope.showText){
                    customer_content = scope.showText;
                }
                scope.$watch('showText',function(newValue,oldValue){
                    $(elem).tooltip({
                        content:newValue,
                        animation: true,
                        html : true,
                        trigger : trigger,
                        placement : direction
                    });
                });
                $(elem).tooltip({
                    content:customer_content,
                    animation: true,
                    html : true,
                    trigger : trigger,
                    placement : direction
                });
                $(elem).focus(function(){
                    $(this).blur();
                });
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));
(function(window, angular,$,ucApp) {
    'use strict';

    ucApp.directive('uploadAvatar', function () {
        /**
         * scope
         *      model
         * attrs
         *      html
         */
        return {
            scope:{
                model : '=model'
            },
            restrict: 'EA',
            link: function (scope, elem, attrs) {
                $(elem).uploadify({
                    queueSizeLimit:1,
                    multi:false,
                    height: 20,
                    buttonText:'选择图片',
                    swf:uc.static.UPLOAD_SWF_PATH,
                    uploader:"/uploadimg",
                    width:70,
                    fileObjName:"images",
                    formData:{type:11},
                    onUploadStart: function(file) {
                        var formData = this.wrapper.uploadify('settings', 'formData');
                        var session_name = $('#session_name').val();
                        formData[session_name] = wx.cookie(session_name);
                        this.wrapper.uploadify('settings', 'formData', formData);
                    },
                    onUploadSuccess:function(file, data, response){
                        data=$.parseJSON(data);
                        scope.model =data.data.big;
                        scope.$apply();
                    }
                });
                $('.uploadify-button').html(attrs.html);
                $('.uploadify-queue').remove();
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));
(function(window, angular,$,ucApp) {
    'use strict';

    ucApp.directive('uploadPassport', function () {
        /**
         * scope
         *      model
         * attrs
         *      html
         */
        return {
            scope:{
                model : '=model'
            },
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $(elem).uploadify({
                    queueSizeLimit:1,
                    multi:false,
                    height        : 20,
                    'buttonText' : '选择图片',
                    swf           : uc.static.UPLOAD_SWF_PATH,
                    uploader      : "/uploadimg",
                    width         : 70,
                    fileObjName  : "images",
                    formData     : {type:10},
                    onUploadStart: function(file) {
                        var formData = this.wrapper.uploadify('settings', 'formData');
                        var session_name = $('#session_name').val();
                        formData[session_name] = wx.cookie(session_name);
                        this.wrapper.uploadify('settings', 'formData', formData);
                    },
                    onUploadSuccess: function(file, data, response){
                        data=$.parseJSON(data);
                        scope.model =data.data.image_data[0].image;
                        scope.$apply();
                    }
                });
                $('.uploadify-button').html(attrs.html)
                $('.uploadify-queue').remove();
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));



(function(window, angular,$,ucApp) {
    'use strict';

    ucApp.directive('uploadAvatar02', ['$rootScope',function ($rootScope) {
        /**
         * scope
         *      model
         * attrs
         *      html
         */
        return {
            scope:{
                model : '=model'
            },
            restrict: 'EA',
            link: function (scope, elem, attrs) {
                $(elem).uploadify({
                    queueSizeLimit:1,
                    multi:false,
                    height        : 59,
                    'buttonText' : '',
                    swf           : uc.static.UPLOAD_SWF_PATH,
                    uploader      : "/uploadimg",//uc.serviceUrl('avatar/avatar?v=1'),
                    width         : 59,
                    fileObjName  : "images",
                    formData     : {type:13},
                    onUploadStart: function(file) {
                        var formData = this.wrapper.uploadify('settings', 'formData');
                        var session_name = $('#session_name').val();
                        formData[session_name] = wx.cookie(session_name);
                        this.wrapper.uploadify('settings', 'formData', formData);
                    },
                    onUploadSuccess: function(file, data, response){
                        data=$.parseJSON(data);
                        scope.model = data.data.static_url + data.data.image_data[0].image;// data.smallUrl;
                        scope.$apply();
                        var img={
                            static_url:data.data.static_url,
                            image :data.data.image_data[0].image
                        } ;

                        $rootScope.$broadcast("UPLOAD_SUCC",img);
                    }
                });
                $('.uploadify-button').html(attrs.html);
                $('.uploadify-queue').remove();
            }
        };
    }]);
})(window, window.angular,$,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/16.
 */
(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('validation', function () {
        /**
         * scope
         *      remoteMethod 远程验证函数，必须是可执行函数，返回promise
         *      remoteMethodParam 远程验证函数的参数，数组形式传入
         *           [
         *               { isInputTarget : true, '#username' },
         *               { isInputTarget : true, '.active' },
         *               { isInputTarget : false, 13922311345 }
         *               ...
         *           ]
         * attrs
         *      required
         *      empty_msg
         *      error_msg
         *      valid_type 验证类型，如email，telephone，详细请参见methods中的定义，如需自定义，请适当向methods中添加函数
         *      error_to 必选，显示错误信息内容的区域element的id或者class，选择器必须只得到一个element
         *      equal_to 比较值是否相等，传入比较对象的element的id或者class，选择器必须只得到一个element
         *      invalid_data 验证未通过会在标签上绑定该属性，提交之前验证表单中是否存在有该属性的元素
         *      custom_error 自定义错误信息，定义远程验证未通过或者使用equalTo未通过时显示的信息
         */
        return {
            scope : {
                remoteMethod:'=remoteMethod',
                remoteMethodParam:'=remoteMethodParam',
            },
            restrict: 'A',
            replace: true,
            link: function (scope, elem, attrs) {
                var errorMsg ={
                    required : attrs.emptyMsg,
                    error:attrs.errorMsg,
                    waiting:'正在向服务器验证...'
                };
                var dirty = false;
                var methods = {
                    required: function() {
                        return $.trim($(elem).val()).length>0;
                    },
                    telephone:function(){
                        return /^0\d{2,3}-?\d{7,8}$/.test($(elem).val());
                    },
                    mobilePhone:function(){
                        return /^1[3|4|5|7|8][0-9]\d{8}$/.test($(elem).val());
                    },
                    postCode:function(){
                        return /^[1-9][0-9]{5}$/.test($(elem).val());
                    },
                    money:function(){
                        return /^\d+(\.\d{1,2})?$/.test($(elem).val());
                    },
                    number: function () {
                        return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test($(elem).val());
                    },
                    digits: function () {
                        return /^\d+$/.test($(elem).val());
                    },
                    email: function () {
                        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test($(elem).val());
                    },
                    url: function () {
                        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test($(elem).val());
                    },
                    date: function () {
                        return !/Invalid|NaN/.test(new Date($(elem).val()).toString());
                    },
                    dateISO: function () {
                        return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test($(elem).val());
                    },
                    equalTo: function () {
                        var sourceValue =  $.trim($(elem).val());
                        var targetValue = $.trim($(attrs.equalTo).val());
                        return sourceValue == targetValue;
                    },
                    password:function(){
                        var val = $(elem).val();
                        return val.length>=6 && val.length<=16;
                    },
                    idCard : function(){
                        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
                        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
                        function idCardValidate(idCard) {
                            idCard = $.trim(idCard);
                            if (idCard.length == 15) {
                                return validity15(idCard);
                            };
                            if (idCard.length == 18) {
                                return validity18(idCard);
                            };
                            return false;
                        };

                        function validity15(idCard) {
                            var year = parseInt(idCard.substring(6, 8),10);
                            var month = parseInt(idCard.substring(8, 10),10);
                            var day = parseInt(idCard.substring(10, 12),10);

                            var temp_date = new Date(year, month - 1, day);
                            if (
                                temp_date.getYear() != year ||
                                temp_date.getMonth() != month - 1 ||
                                temp_date.getDate() != day
                            ) {
                                return false;
                            }
                            return true;
                        };

                        function validity18(idCard) {
                            function validity(idCard) {
                                var year = parseInt(idCard.substring(6, 10),10);
                                var month = parseInt(idCard.substring(10, 12),10);
                                var day = parseInt(idCard.substring(12, 14),10);
                                var temp_date = new Date(year, month - 1, day);
                                if (
                                    temp_date.getFullYear() != year ||
                                    temp_date.getMonth() != month - 1 ||
                                    temp_date.getDate() != day
                                ) {
                                    return false;
                                }
                                return true;
                            };
                            var result = validity(idCard);
                            if (result) {
                                var nums = idCard.split("");
                                var sum = 0;
                                if (nums[17].toLowerCase() == 'x') {
                                    nums[17] = 10;
                                };
                                for (var i = 0; i < nums.length - 1; i++) {
                                    sum += Wi[i] * parseInt(nums[i],10);
                                };
                                var position = sum % 11;
                                if (nums[17] == ValideCode[position]) {
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        };
                        return idCardValidate($(elem).val());
                    },
                    nickName : function(){
                        var getBLen = function(str) {
                            if (str == null) return 0;
                            if (typeof str != "string"){
                                str += "";
                            }
                            var length = str.replace(/[^\x00-\xff]/g,"01").length
                            return length>=4 && length<=24;
                        };
                        return getBLen($(elem).val());
                    }
                };

                function validate(){
                    if(attrs.required){
                        if(!methods.required()){
                            return {valid : false, error_msg : errorMsg.required};
                        }
                    }
                    if(attrs.validType){
                        if(!methods[attrs.validType]()){
                            return {valid : false, error_msg : errorMsg.error};
                        }
                    }
                    if(attrs.equalTo){
                        if(!methods.equalTo()){
                            return {valid : false, error_msg : attrs.customError,isValidEqual:true};
                        }
                    }
                    /*
                    if(scope.remoteMethod){
                        var arg=[];
                        for(var item in scope.remoteMethodParam){
                            if(item.isInputTarget){
                                arg.push($.trim($(item.value)));
                            }else{
                                arg.push(item.value);
                            }
                        };
                        $(elem).attr('invalid_data','true');
                        $(attrs.errorTo).show().text(errorMsg.waiting);
                        scope.remoteMethod.apply(null,arg).then(function(data){
                            if(data.success){
                                $(attrs.errorTo).hide();
                                $(elem).removeAttr('invalid_data');
                            }else{
                                $(attrs.errorTo).show().text(attrs.custom_error);
                            }
                        });

                        return;
                    }
                    */
                    return {valid : true};
                }
                scope.$on("VALIDATE", function(){
                    dirty = true;
                    $(attrs.errorTo).css({color:'#CE0000'});
                    var result = validate();
                    if(!result.valid){
                        if(dirty){
                            $(attrs.errorTo).fadeIn(500).text(result.error_msg);
                        }
                        $(elem).attr('invalid_data','true');
                    }else{
                        $(elem).removeAttr('invalid_data');
                        $(attrs.errorTo).fadeOut(500);
                    }
                });
                $(elem).blur(function(){
                    $(attrs.errorTo).css({color:'#CE0000'});

                    var result = validate();
                    if(!result.valid){
                        $(attrs.errorTo).fadeIn(500).text(result.error_msg);
                        $(elem).attr('invalid_data','true');
                    }else{
                        $(elem).removeAttr('invalid_data');
                        $(attrs.errorTo).fadeOut(500);
                    }
                });
                //$(elem).bind("input propertychange change", function(){
                //    dirty = true;
                //    setTimeout(function(){
                //        $(attrs.errorTo).css({color:'#CE0000'});
                //
                //        var result = validate();
                //        if(!result.valid){
                //            $(attrs.errorTo).fadeIn(500).text(result.error_msg);
                //            $(elem).attr('invalid_data','true');
                //        }else{
                //            $(elem).removeAttr('invalid_data');
                //            $(attrs.errorTo).fadeOut(500);
                //        }
                //    }, 500);
                //});
                //$(elem).focus(function(){
                //});
            }
        };
    });
})(window, window.angular,$,angular.module('ucApp'));

/**
 * Created by YL Huang on 2015/7/21.
 */
(function(window, angular,ucApp) {
    'use strict';
    ucApp.filter('partialHide', function () {
        /**
         * type : realName,mobilePhone,idCard
         */
        var filterfun = function(name,type){
            function isNumStr(str){
                return /^[0-9]*$/.test(str);
            };
            if(!name) return '';
            var strs = name.toString().split('');
            if(strs.length==0) return '';
            if(type==='realName'){
                if(strs.length==0) return;
                if(strs.length==1) return strs[0]+'*';
                if(strs.length>2) return strs[0]+'*'+strs[strs.length-1];
                else return strs[0]+'*';
            }
            if(type==='mobilePhone' && strs.length===11 && isNumStr(name)){
                var str = '';
                for(var i=0;i<3;i++){
                    str+=strs[i];
                }
                for(var i=3;i<strs.length-4;i++){
                    str+='*';
                }
                for(var i=strs.length-4;i<strs.length;i++){
                    str+=strs[i];
                }
                return str;
            }
            if(type==='idCard'&& (strs.length===15|| strs.length===18)&& isNumStr(name)){
                var str = '';
                for(var i=0;i<3;i++){
                    str+=strs[i];
                }
                for(i=3;i<strs.length-4;i++){
                    str+='*';
                }
                for(i=strs.length-4;i<strs.length;i++){
                    str+=strs[i];
                }
                return str;
            }
        };
        return filterfun;
    });
})(window, window.angular,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/30.
 */
(function(window, angular,ucApp) {
    'use strict';
    ucApp.factory("Account",['Common','$q',function(Common,$q){
        var Account = {
            Hongbao: function (obj) {
                var defaults = {
                    id: "",  //红包ID
                    total_amount: 0,//红包总金额
                    start_time: "", //红包开始时间
                    end_time: "",//红包结束时间
                    total_num: 0, //此红包总共可抢5次
                    used_count: 0,//已被抢次数
                    share: true, //是否可被分享 //根据此
                    zh_status: "" //红包状态
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            },
            Invitation: function (obj) {
                var defaults = {
                    id: 0,
                    owner_id: 0,
                    user_id: 0,
                    deal_id: 0,
                    finance_id: 0,
                    order_id: 0,
                    profit: 0,
                    invite_code: "",
                    type: 0,
                    is_pay: 0,
                    pay_type: 0,
                    ctime: "",
                    mtime: "",
                    target_fund: "",
                    name: "",
                    publisher_name: "",
                    earner_name: "",
                    order_money: "",
                    rewardRate: ""
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            },
            Voucher :function(obj){
                var defaults = {
                    amount: "",
                    desc: "",
                    expireTime: "",
                    limit: "",
                    priceLimit: 0,
                    startTime: "",
                    status: "0",
                    totalLimit: 0,
                    type: 0,
                    voucherID: ""
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            },
            Deal_Rebate: function (obj) {
                var defaults = {
                    name: "",
                    success_time: "",
                    rebate: 0,
                    percent: 0,
                    status: "",
                    zh_status: "",
                    deal_name: ""
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            },
            Reg_Rebate : function (obj) {
                var defaults = {
                    invited_user: "",
                    invite_time: "",
                    memo: ""
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            },
            Balance:function(obj){
                var defaults = {
                    id: "", //编号
                    create_time: "",//余额变动时间
                    description: "", //余额变动描述
                    type: "", //使用类型
                    money: "" //使用金额
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            }
        };

        Account.Hongbao.getAll = function(){
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/user/userhongbaolist?v=3')).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };
        Account.Hongbao.prototype.get_dimension_code_image = function(){
            return uc.serviceUrl('/user/hongbaoqrcode?v=3&hongbao_id='+this.id);
        };

        Account.Voucher.getAll = function(){
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/user/getvouchers?v=2')).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };

        Account.Invitation.getAll = function(isUsed,page,pageSize){
            var parmas ={
                s : isUsed ? 1: 0,
                p : page,
                pn: pageSize
            };
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/corp/stockbonus?v=3'),parmas).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };

        Account.Deal_Rebate.getAll = function(){
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/corp/dealuserrebate?v=3')).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };

        Account.Reg_Rebate.getAll = function(){
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/corp/invitation?v=3')).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };

        Account.Balance.getAll =  function(){
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/user/balance?v=3')).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };
        return Account;
    }]);
})(window, window.angular,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.factory('Common', ['$rootScope','$http', '$q','$state', function ($rootScope,$http, $q,$state) {
        return {
            redirect : function(router){
                $state.go(router);
            },
            noInvitationCode : function(){
                $rootScope.invitationCode =  {
                    index  : 0,
                    showCodeImage : false
                }
            },
            getPageCount : function(total,pageSize){
                if (total % pageSize > 0) {
                    return parseInt(total / pageSize,10) + 1;
                }
                return parseInt(total / pageSize,10);
            },
            buildNumArray : function(start,end,desc){
                var arr=[];
                if(desc){
                    for(var i=end;i>=start;i--){
                        arr.push(i);
                    }
                }else{
                    for(var i=start;i<=end;i++){
                        arr.push(i);
                    }
                }
                return arr;
            },
            httpGet:function(url,parma){
                var defer = $q.defer();
                $http({method: 'GET',url: url,params: parma}).success(function (data) {
                    if(data.errno==1004){
                        location.reload(true);
                        return;
                    };
                    if (data && data.errno != 0 && data.errno!=6000) {
                        uc.modal.alert('信息提示',data.error);
                        defer.resolve(null);
                    }else{
                        defer.resolve(data.data);
                    }
                }).error(function () {
                    uc.modal.alert('信息提示','网络异常，请稍后再试！');
                    defer.reject();
                });
                return defer.promise;
            },
            httpPost: function (url, parma) {
                var defer = $q.defer();
                $http({
                    method: 'post',url: url,data: parma,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).success(function (data) {
                    if(data.errno==1004){
                        location.reload(true);
                        return;
                    };
                    if (data.errno) {
                        setTimeout(function () {
                            uc.modal.alert('信息提示', data.error);
                        }, 1000);
                        defer.resolve(data);
                    } else {
                        defer.resolve(data.data);
                    }
                }).error(function () {
                    uc.modal.alert('信息提示', '网络异常，请稍后再试！');
                    defer.reject();
                });
                return defer.promise;
            },

            
            AUTH_TYPE:{
                IDCARD : 1,
                PASSPORT:2
            },


            PROJECT_TYPE : {
                REWARDS : 0,
                EQUITY :1
            },
            REWARDS_PROJECT_STATUS : {
                DRAFT : 0,
                APPROVING :1,
                UNAPPROVE :2,
                INVESTING :3,
                SUCCESS :4,
                FAILD : 5,
                COMPLETE :6
            },
            STOCK_RIGHT_PROJECTT_STATUS : {
                DRAFT : 0,
                APPROVING :1,
                UNAPPROVE :2,
                APPROVED :3,
                IN_RESERVATION :4,
                PUBLISHING :5,
                COMPLETE :6,
                FAILD : 7
            },
            STOCK_RIGHT_PROJECTT_OPERATE_STATUS : {
                WAITING_FOR_ONLINE : 0,
                PUBLISH_APPROVING :1 ,
                WAITING_FOR_INVESTER_PAY :2
            },
            OFFLINE_PAYMENT_STATUS : {
                IN_PROGRESS : 0,
                CONFIRMING : 1,
                SUCCESS :2,
                FAILD :3
            },
            DEAL_TYPE : {
                REBATE : 0,
                BUY :1
            },
            INVEST_STATUS : {
                APPROVING : 0,
                FAILD : 1,
                SUCCESS :2
            },
            REWARDS_ORDER_STATUS : {
                UNPAID : 0,
                PAID : 1,
                WAITING_FOR_DELIVER : 2,
                DELIVERED : 3,
                RECEIVED : 4,
                WAITING_FOR_REFUND : 5,
                REFUND_IN_PROGRESS : 6,
                REFUNDED :7
            },
            SUBSCRIBE_ORDER_STATUS : {
                DEAL_SUCCESS : 1,
                DEAL_FAILD :0
            },
            RESERVATION_ORDER_STATUS : {
                WAITING_FOR_PAY : 0,
                RESERVATION_SUCCESS :1,
                RESERVATION_FAILD :2
            },
            SETTLEMENT_STATUS : {
                NOT_SETTLE : 0,
                FIRST_PART_UNAPPLY :1,
                FIRST_PART_APPROVING :2,
                FIRST_PART_REJECTED :3,
                FIRST_PART_SETTLING :4,
                FIRST_PART_SETTLED :5,
                LAST_PART_APPROVING :6,
                LAST_PART_REJECTED :7,
                LAST_PART_SETTLING :8,
                LAST_PART_SETTLED :9
            },
            Area : {
                get_province_list : function(){

                },
                get_city_list : function(province_id){

                }
            }
        };
    }]);

})(window, window.angular,$,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/29.
 */
(function(window, angular,ucApp) {
    'use strict';
    ucApp.factory("Message",['Common','$q',function(Common,$q){
        var Message = {
            Topic: function (obj) {
                var defaults = {
                    log_id: "", //话题ID
                    message: "", //
                    user_name: "", //我的用户名
                    user_id: "",//我的用户ID
                    avatar: "",//我的头像
                    create_time: "",//创建时间
                    deal_name: "",//项目名称
                    dealID: ""//项目ID
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            },
            Comment: function (obj) {
                var defaults = {
                    commentID:"",
                    projectID :'',
                    topicID:'',
                    comment_id: "",
                    user_id: "",
                    user_name: "",
                    deal_id: "",
                    reply_user_id: "",
                    reply_user_name: "",
                    message: "",
                    create_time: "",
                    log_id: "",
                    user_avatar: "",
                    deal_name: ""
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            },
            Letter: function (obj) {
                var defaults = {
                    letter_id: "",
                    send_user_id: "",
                    send_user_name: "",
                    receive_user_id: "",
                    receive_user_name: "",
                    message: "",
                    create_time: "",
                    send_user_avatar: "",
                    receive_user_avatar: ""
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            },
            SystemMessage: function (obj) {
                var defaults = {
                    system_letterID: "",
                    comments: "",
                    isRead: 0,//0未读 1已读
                    create_time: "",
                    uid: 0,
                    is_sys: 1 //1系统消息(uid=0) 2通知    --系统消息不能删除
                };
                obj ? $.extend(this, obj) : $.extend(this, defaults);
            }
        };

        Message.Topic.get_page_list = function(page,pageSize){
            var params = {
                offset:(page-1)*pageSize,
                page_size : pageSize
            };
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/corp/answerlist?v=3'),params).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };

        Message.Comment.get_page_list = function(type,page,pageSize){
            var params = {
                type : type,
                offset:(page-1)*pageSize,
                page_size : pageSize
            };
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/corp/comments?v=3'),params).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };
        Message.Comment.prototype.reply = function(){
            var defer = $q.defer();
            Common.httpPost(uc.serviceUrl('/deal/addcomment?v=1'),uc.copyObjectProperties(this)).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };

        Message.Letter.get_page_list = function(type,page,pageSize){
            var params = {
                type : type,
                offset:(page-1)*pageSize,
                page_size : pageSize
            };
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/corp/letter?v=3'),params).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };
        Message.Letter.prototype.reply = function(){
            var defer = $q.defer();
            Common.httpPost(uc.serviceUrl('/corp/sendletter?v=3'),uc.copyObjectProperties(this)).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };

        Message.SystemMessage.get_page_list = function(page,pageSize){
            var defer = $q.defer();
            Common.httpGet(uc.serviceUrl('/corp/getsystemmessage?v=3'),{page:page,page_size :pageSize}).then(function(data){
                defer.resolve(data);
            });
            return defer.promise;
        };
        //Message.SystemMessage.prototype.delete = function(){
        //    var defer = $q.defer();
        //    Common.httpPost(uc.serviceUrl('/corp/DeleteSystemMessage'),{system_letterID:this.system_letterID});
        //    return defer.promise;
        //};
        return Message;
    }]);
})(window, window.angular,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/25.
 */
(function (window, angular, $, ucApp) {
    'use strict';
    ucApp.factory('Order', ['$http', '$q', 'httpMock', 'Common','$rootScope',
        function ($http, $q, httpMock, Common,$rootScope) {
            var Order = function () {
                this.f = "c";
            };

            Order.doDelete = function(order, type){
                return Common.httpPost(uc.serviceUrl('order/deleteorder?v=3'), {type : type, order_id : order.id});
            };

            Order.get_user_Order_list = function (offset, count, type) {
                var promise = Common.httpGet(uc.serviceUrl('user/getsupport?v=3'), {offset: offset, count : count, type : type});
                var defer = $q.defer();
                promise.then(function(data){
                    _.each(data.list, function(order){
                        order.vocher = uc.format_money(order.vocher);
                        order.total_price= uc.format_money(order.total_price);
                        order.delivery_fee = uc.format_money(order.delivery_fee);
                        order.deliveryPriceStr = order.delivery_fee > 0 ? "含运费" + order.delivery_fee+"元" : "免运费";
                        order.memo = order.memo || "您没有对订单留言";
                        order.canDelete = Order.canDelete(order);
                        order.expressinfo=["正在查询，请稍后。。。"];
                        order.expressdisplay=0;
                    });
                    defer.resolve(data)
                });

                return defer.promise;

            };

            Order.equityOrderStatusText = function(state,round_result, rate){
                state = parseInt(state);
                var text = '';
                switch (state){
                    case 0 :
                        text = "未开始";
                        break;
                    case 1 :
                        text = "预约中";
                        break;
                    case 2 :
                        text = "发行中";
                        break;
                    case 3 :
                        text = "已结束";
                        break;
                    case 10 :
                        text = "领投人三天打款期";
                        break;
                }

                if((state ==1 || state ==10) && rate>=100) {
                    text = '预约结束';
                }
                if(state ==3 && round_result == 1) {
                    text = '融资成功';
                }
                if(state ==3 && round_result == 0){
                    text ='融资结束'
                }
                return text;
            };

            Order.equityOperation = {
                paysure : {
                    type : "url",
                    url : "/payapp/#/payreserve?dealId={deal_id}&order_id={order_id}",
                    text : "支付保证金",
                    target : "_blank"
                },
                invest : {
                    type : "url",
                    text : "立即投资",
                    url : "/deal-stock/id-{deal_id}",
                    target : "_blank"
                },
                dueDili : {
                    type : "eq_url",
                    text : "尽职调查",
                    url : "http://guquan.yuanshihui.com/investor/survey/deal_id/{deal_id}",
                    target : "_blank"
                },
                pay : {
                    type : "url",
                    text : "去打款",
                    url : "/deal-stock/id-{deal_id}",
                    target : "_blank"
                },
                payNow : {
                    type : "url",
                    text : "立即支付",
                    url : "/payapp/#/paysubscription?dealId={deal_id}&order_id={id}",
                    target : "_blank"
                },
                done : {
                    type : "click",
                    text : "已完成转账",
                    handler : function(order){
                        $rootScope.$broadcast("ENSURE_IMG_UPLOAD",order);
                       
                    }
                }


            };
            Order.getexpress=function(data){
                return Common.httpGet(uc.serviceUrl("order/getexpress?v=2"),data);
            };
            Order.ensureget=function(data){
                return Common.httpPost(uc.serviceUrl("order/receipt?v=2"),data);
            };

            Order.getEquityOperations = function(order){
                var operations = [];
                if(order.opItem && order.opItem.length>0){
                    $.each(order.opItem,function(i,item){
                        switch(item.opStatus){
                            case "支付保证金" :
                                operations.push({operation : Order.equityOperation.paysure, mode : "lbtn"});
                                break;
                            case "立即投资" :
                                operations.push({operation : Order.equityOperation.invest, mode : "lbtn"});
                                break;
                            case "尽职调查":
                                operations.push({operation : Order.equityOperation.dueDili, mode : "lbtn"});
                                break;
                            case "去打款":
                                operations.push({operation : Order.equityOperation.pay, mode : "lbtn"});
                                break;
                            case "立即支付":
                                operations.push({operation : Order.equityOperation.payNow, mode : "lbtn"});
                                break;
                            case "已完成转账" :
                                operations.push({operation : Order.equityOperation.done, mode : "lbtn"});
                                break;
                        }
                    });
                }
                return operations;
            };

            Order.get_equity_orders = function(offset, count, type){
                var url = '';
                if(type == 0) {
                   url = uc.serviceUrl("deal/stockappointmentorder?v=3");
                }else{
                    url = uc.serviceUrl("deal/stocksubscibeorder?v=3");
                }
                var promise = Common.httpGet(url, {p: (offset/10)+1,pn:count,type : type});

                var defer = $q.defer();
                promise.then(function(data){
                    _.each(data.order, function(o){
                        o.stateStr = Order.equityOrderStatusText(o.finance_status, o.round_result, o.rate);
                        o.operations = Order.getEquityOperations(o);
                        if(o.order_status == 'TRADE_REPEAT'){
                            o.payStr = Order.equityPayStatus.TRADE_FAILED + ',' + Order.equityPayStatus.TRADE_REPEAT;
                        } else {
                            o.payStr = Order.equityPayStatus[o.order_status];
                        }
                    });
                    defer.resolve(data);
                });
                return defer.promise;
            };

            Order.canDelete = function(order){
                return order.status == '待支付' || order.status == '已失效';
            };
            
            Order.confirmOffline = function(id,proofs){
                var url = uc.serviceUrl("/corp/api?v=3");
                var params = uc.eqParams('order', 'confirmoffline', 'POST', {id :id,proofs:proofs.join(",")});
                return Common.httpGet(url,params);
                
            };
            
           Order.getleaderList = function(id){
                var url = uc.serviceUrl("/corp/api?v=3");
                var params = uc.eqParams('reserve', 'auditleader', 'GET', {dealId :id });
                return Common.httpGet(url,params);
            };
            
            Order.chooseLeader = function(data){
                var url = uc.serviceUrl("/corp/api?v=3");
                var params = uc.eqParams('my', 'chooseleader', 'POST', data);
                return Common.httpGet(url,params);
            };


            Order.equityPayStatus = {
                WAIT_PAY  : "待支付",
                TRADE_SUCCESS : "交易成功",
                TRADE_CANCEL:"交易取消",
                TRADE_FAILED : "交易失败",
                TRADE_WITHHOLDING: "线下支付中",
                CONFIRM_PAY: "线下支付确认中",
                TRADE_REPEAT:"保证金重复利用",
                REFUND : "已退款"

            };




            //end user defined
            return Order;
        }
    ]);




})(window, window.angular, $, angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/25.
 */
(function (window, angular, $, ucApp) {
    'use strict';
    ucApp.factory('Project', ['$http', '$q', 'httpMock', 'Common', '$rootScope',
        function ($http, $q, httpMock, Common, $rootScope) {
            var Project = function () {
                this.f = "c";
            };

            /**
             * 项目状态的枚举
             */
            Project.StatesText = {
                PROJECT_OFFLINE : "已下线",
                PROJECT_FINISHED : "融资成功",//已完成
                PROJECT_DRAFT : "草稿中",
                PROJECT_AUDITTING : "审核中",
                PROJECT_AUDIT_FAIL : "审核未通过",
                PROJECT_THE_FIRST_AUDIT_FAIL : "第一次审核未通过",
                PROJECT_ONLINE : "众筹中",
                PROJECT_UNSUCCESS : "融资结束",//已失败
                PROJECT_SETTLEMENT_SUCCESS : "已完成结算",
                PROJECT_WAITTING_FOR_ONLINE : "待上线",
                SETTLEMENT_CANNOT_APPLY : "不可申请",
                SETTLEMENT_APPLY_WAITTING  :  "未申请",
                SETTLEMENT_THE_FIRST_END_SECTION :  "首款已结款",
                SETTLEMENT_PAYMENT :  "项目结款中",
                SETTLEMENT_THE_FIRST_PAYMENT :  "首款结款中",
                SETTLEMENT_THE_FIRST_REJECTED :  '首款已驳回',
                SETTLEMENT_AUDITTING :  '结算审核中',
                SETTLEMENT_THE_FIRST_AUDITTING :  '首款审核中',
                SETTLEMENT_THE_END_END_SECTION :  '尾款已结款',
                SETTLEMENT_THE_END_PAYMENT :  '尾款结款中',
                SETTLEMENT_THE_END_REJECTED :  '尾款已驳回',
                SETTLEMENT_THE_END_AUDITTING :  '尾款审核中',
                SETTLEMENT_THE_END_WAITTING :  '尾款未审核',
                PROJECT_STOCK_FINANCE_APPOINTMENT_THREE_DAY : '三天打款阶段',
                PROJECT_STOCK_PUBLISH_WAITING_AUDIT : '发行审核中',
                FRIEND_ROJECT_SUPPORT_EMPTY : '众筹中' // 可以删除的众筹中
            };

            Project.States = {
                PROJECT_OFFLINE : "PROJECT_OFFLINE",
                PROJECT_FINISHED : "PROJECT_FINISHED",
                PROJECT_DRAFT : "PROJECT_DRAFT",
                PROJECT_AUDITTING : "PROJECT_AUDITTING",
                PROJECT_AUDIT_FAIL : "PROJECT_AUDIT_FAIL",
                PROJECT_THE_FIRST_AUDIT_FAIL : "PROJECT_THE_FIRST_AUDIT_FAIL",
                PROJECT_ONLINE : "PROJECT_ONLINE",
                PROJECT_UNSUCCESS : "PROJECT_UNSUCCESS",
                PROJECT_SETTLEMENT_SUCCESS : "PROJECT_SETTLEMENT_SUCCESS",
                PROJECT_WAITTING_FOR_ONLINE : "PROJECT_WAITTING_FOR_ONLINE",
                SETTLEMENT_CANNOT_APPLY : "SETTLEMENT_CANNOT_APPLY",
                SETTLEMENT_APPLY_WAITTING  :  "SETTLEMENT_APPLY_WAITTING",
                SETTLEMENT_THE_FIRST_END_SECTION :  "SETTLEMENT_THE_FIRST_END_SECTION",
                SETTLEMENT_PAYMENT :  "SETTLEMENT_PAYMENT",
                SETTLEMENT_THE_FIRST_PAYMENT :  "SETTLEMENT_THE_FIRST_PAYMENT",
                SETTLEMENT_THE_FIRST_REJECTED :  'SETTLEMENT_THE_FIRST_REJECTED',
                SETTLEMENT_AUDITTING :  'SETTLEMENT_AUDITTING',
                SETTLEMENT_THE_FIRST_AUDITTING :  'SETTLEMENT_THE_FIRST_AUDITTING',
                SETTLEMENT_THE_END_END_SECTION :  'SETTLEMENT_THE_END_END_SECTION',
                SETTLEMENT_THE_END_PAYMENT :  'SETTLEMENT_THE_END_PAYMENT',
                SETTLEMENT_THE_END_REJECTED :  'SETTLEMENT_THE_END_REJECTED',
                SETTLEMENT_THE_END_AUDITTING :  'SETTLEMENT_THE_END_AUDITTING',
                SETTLEMENT_THE_END_WAITTING :  'SETTLEMENT_THE_END_WAITTING',
                PROJECT_STOCK_FINANCE_APPOINTMENT : 'PROJECT_STOCK_FINANCE_APPOINTMENT',
                PROJECT_STOCK_FINANCE_SUBSCRIBE : 'PROJECT_STOCK_FINANCE_SUBSCRIBE',
                PROJECT_STOCK_FINANCE_APPOINTMENT_THREE_DAY : "PROJECT_STOCK_FINANCE_APPOINTMENT_THREE_DAY",
                PROJECT_STOCK_FINANCE_SUCCESS : 'PROJECT_STOCK_FINANCE_SUCCESS',
                PROJECT_STOCK_FINANCE_FAIL : 'PROJECT_STOCK_FINANCE_FAIL',
                PROJECT_STOCK_PUBLISH_SUCCESS : 'PROJECT_STOCK_PUBLISH_SUCCESS',
                PROJECT_STOCK_PUBLISH_FAIL : 'PROJECT_STOCK_PUBLISH_FAIL',
                PROJECT_STOCK_PUBLISH_HALF : 'PROJECT_STOCK_PUBLISH_HALF',
                PROJECT_STOCK_PUBLISH_WAITING_AUDIT : 'PROJECT_STOCK_PUBLISH_WAITING_AUDIT',
                PROJECT_STOCK_PUBLISH_AUDIT_FAIL : 'PROJECT_STOCK_PUBLISH_AUDIT_FAIL',
                FRIEND_ROJECT_SUPPORT_EMPTY: 'FRIEND_ROJECT_SUPPORT_EMPTY'
            };

            /**
             * 获取项目的状态
             * @param state
             * @returns {*}
             */
            Project.getStatusText = function(state){
                return Project.States[state];
            };
            Project.Operations = {
                    reward : {
                        audit : {
                            text : "提交审核",
                            type : "url",
                            url : "/launch/#/project-launch/basic-info?projectID={projectID}",
                            target : "_blank"
                        },
                        audit_new : {
                            text : "提交审核",
                            type : "url",
                            url : "{edit_url}",
                            target : "_blank"
                        },

                        edit : {
                            text : "编辑",
                            type : 'url',
                            url : "/launch/#/project-launch/basic-info?projectID={projectID}",
                            target : "_blank"
                        },
                        edit_new : {
                            text : "编辑",
                            type : 'url',
                            url : "{edit_url}",
                            target : "_blank"
                        },
                        edit_new_b : {
                            text : "修改/提交",
                            type : 'url',
                            url : "/launch/#/project-launch/basic-info?projectID={projectID}",
                            target : "_blank"
                        },
                        preview : {
                            text : "预览",
                            type : 'url',
                            url : "/deal-show/id-{project_id}",
                            target : "_blank"
                        },
                        delete_project : {
                            text : "删除",
                            type : 'click',
                            handler : "deleteProject"
                        },
                        first_reject_reason : {
                            text : "查看驳回原因",
                            type : "tooltip" ,
                            hint : "<pre>{the_first_refuse_reason}</pre>"
                        },
                        second_reject_reason : {
                            text : "查看驳回原因",
                            type : "popup" ,
                            title:'驳回原因',
                            content : "<pre>{refuse_reason}</pre>"
                        },
                        reject_reason_settlement_first : {
                            text : "查看驳回原因",
                            type : "popup" ,
                            title : '驳回原因',
                            content : "<pre>{the_first_refuse_reason}</pre>"
//                            type : "tooltip" ,
//                            hint : "{the_first_refuse_reason}"
                        },
                        settlement_the_first_rejected_reason : {
                            text : "查看驳回原因",
                            type : "popup" ,
                            title : '驳回原因',
                            content : "<pre>{settlement_the_first_rejected_reason}</pre>"
//                            type : "tooltip" ,
//                            hint : "{settlement_the_first_rejected_reason}"
                        },
                        settlement_the_end_rejected_reason : {
                            text : "查看驳回原因",
                            type : "popup" ,
                            title : '驳回原因',
                            content : "<pre>{settlement_the_end_rejected_reason}</pre>"
//                            type : "tooltip" ,
//                            hint : "{settlement_the_end_rejected_reason}"
                        },
                        view_orders : {
                            text : "订单管理",
                            type : 'url',
                            url : "/corp-search/deal_id-{project_id}",
                            target : "_blank",
                        },
                        shoukuan : {
                            text : "申请首款",
                            type : "url",
                            url : "/corp-settlement/id-{project_id}-apply_type-1",
                            target : "_blank"
                        },
                        weikuan : {
                            text : "申请尾款",
                            type : "url",
                            url : "/corp-settlement/id-{project_id}-apply_type-2",
                            target : "_blank"
                        }
                    },
                    equity : {
                        audit : {
                            text : "提交审核",
                            type : "eq_url",
                            url : "http://guquan.yuanshihui.com/newdeal/deal/dealId/{project_id}/financeId/{financeId}",
                            target : "_blank"
                        },
                        audit_new : {
                            text : "提交审核",
                            type : "eq_url",
                            url : "{edit_url}",
                            target : "_blank"
                        },

                        edit : {
                            text : "编辑",
                            type : "eq_url",
                            url : "http://guquan.yuanshihui.com/newdeal/deal/dealId/{project_id}/financeId/{financeId}",
                            target : "_blank"
                        },
                        edit_new : {
                            text : "编辑",
                            type : "eq_url",
                            url : "{edit_url}",
                            target : "_blank"
                        },

                        preview : {
                            text: "预览",
                            type: "url",
                            url: '/deal-stock/id-{project_id}',
                            target: "_blank"
                        },
                        reject_reason : {
                            text : "查看驳回原因",
                            type  : "popup",
                            hint : "<pre>{refuse_reason}</pre>"
                        },
                        view_leaders : {
                            text : "查看领投人",
                            type : "url",
                            url : "/zc/#/leader#{project_id}",
                            target : "_blank"
                        },
                        view_buy_orders : {
                            text : "查看认购订单",
                            type : "url",
                            url : "/deal-stock/id-{project_id}",
                            target : "_blank"
                        },
                        view_reserves : {
                            text : "查看预约列表",
                            type : "url",
                            url : "/deal-stock/id-{project_id}",
                            target : "_blank"
                        },
                        view_dates : {
                            text : "查看预约列表",
                            type : "url",
                            url : "/deal-stock/id-{project_id}"
                        },
                        publish : {
                            text : "发行项目",
                            type : "click",
                            handler : function(project){
                                uc.modal.confirm("发行项目", "您的项目一旦进入发行阶段，所有发行条款及相关协议均将具有法律效力且不可随意更改，融资方如不按发行条款及相关协议履行承诺，投资人及本平台有权向融资方及发起人或创始人追偿损失或提起诉讼，请慎重操作。" , function(){
                                    uc.modal.close();

                                    var url = "http://guquan.yuanshihui.com/publish/index/dealId/" + project.project_id;
                                    url = eq_jump($rootScope.user.user_id, $rootScope.user.user_token, url, true);
                                    window.open(url);
                                });
                            }
                        },
                        modify_publish : {
                            text : "修改发行方案",
                            type : "eq_url",
                            url : "http://guquan.yuanshihui.com/publish/index/dealId/{project_id}",
                            target : "_blank"
                        },
                        view_buyers : {

                        }

                    }
                };

            /**
             * 获取项目的操作列表
             * @param project
             */
            Project.getOperationList = function(project){
                var _ops = [];
                if(project.type == 1){
                    switch(project.deal_status_code){
                        case Project.States.PROJECT_OFFLINE :
                            break;
                        case Project.States.PROJECT_ONLINE:
                        case Project.States.PROJECT_FINISHED:
                        case Project.States.FRIEND_ROJECT_SUPPORT_EMPTY:
                           _ops.push({operation : Project.Operations.reward.view_orders, mode : "btn"});
                            break;

                        case Project.States.PROJECT_DRAFT:  //草稿中

                            if(project.launch_client == 10){
                                _ops.push({operation : Project.Operations.reward.audit_new, mode : "lbtn"});
                                _ops.push({operation : Project.Operations.reward.edit_new, mode : "btn"});
                            }else{
                                _ops.push({operation : Project.Operations.reward.audit, mode : "lbtn"});
                                _ops.push({operation : Project.Operations.reward.edit, mode : "btn"});
                            }


                            _ops.push({operation : Project.Operations.reward.preview, mode : "btn"});
                            break;
                        case Project.States.PROJECT_AUDITTING:
                            _ops.push({operation : Project.Operations.reward.preview, mode : "btn"});
                            break;
                        case Project.States.PROJECT_AUDIT_FAIL:
                            _ops.push({operation : Project.Operations.reward.reject_reason, mode : "btn"});
                            _ops.push({operation : Project.Operations.reward.second_reject_reason, mode : "btn"});
                            _ops.push({operation : Project.Operations.reward.preview, mode : "btn"});

                            //驳回编辑链接
                            if(project.launch_client == 10){
                                _ops.push({operation : Project.Operations.reward.edit_new, mode : "btn"});
                            }else{
                                _ops.push({operation : Project.Operations.reward.edit_new_b, mode : "lbtn"});
                            }

                            break;
                        case Project.States.PROJECT_THE_FIRST_AUDIT_FAIL:
                            _ops.push({operation : Project.Operations.reward.first_reject_reason, mode : "btn"});
                            _ops.push({operation : Project.Operations.reward.preview, mode : "btn"});

                            if (project.launch_client == 10) {
                                _ops.push({operation : Project.Operations.reward.edit_new, mode : "btn"});
                            } else {
                                _ops.push({operation : Project.Operations.reward.edit, mode : "btn"});
                            }

                            break;
                        case Project.States.PROJECT_UNSUCCESS:
                            break;
                        case Project.States.PROJECT_WAITTING_FOR_ONLINE:
                            _ops.push({operation : Project.Operations.reward.preview, mode : "btn"});
                            break;
                    }
                    switch(project.settle_status_code){
                        case Project.States.SETTLEMENT_CANNOT_APPLY :
                            break;
                        case Project.States.SETTLEMENT_APPLY_WAITTING  :
                            _ops.push({operation : Project.Operations.reward.shoukuan, mode : "lbtn"});
                            break;
                        case Project.States.SETTLEMENT_THE_FIRST_END_SECTION :
                            _ops.push({operation : Project.Operations.reward.weikuan, mode : "lbtn"});
                            break;
                        case Project.States.SETTLEMENT_PAYMENT :
                            break;
                        case Project.States.SETTLEMENT_THE_FIRST_PAYMENT :
                            break;
                        case Project.States.SETTLEMENT_THE_FIRST_REJECTED :
                            _ops.push({operation : Project.Operations.reward.settlement_the_first_rejected_reason, mode : "btn"});
                            _ops.push({operation : Project.Operations.reward.shoukuan, mode : "lbtn"});
                            break;
                        case Project.States.SETTLEMENT_AUDITTING :
                            break;
                        case Project.States.SETTLEMENT_THE_FIRST_AUDITTING :
                            break;
                        case Project.States.SETTLEMENT_THE_END_END_SECTION :
                            break;
                        case Project.States.SETTLEMENT_THE_END_PAYMENT :
                            break;
                        case Project.States.SETTLEMENT_THE_END_REJECTED :
                            _ops.push({operation : Project.Operations.reward.settlement_the_end_rejected_reason, mode : "btn"});
                            _ops.push({operation : Project.Operations.reward.weikuan, mode : "lbtn"});
                            break;
                        case Project.States.SETTLEMENT_THE_END_AUDITTING :
                            break;
                        case Project.States.SETTLEMENT_THE_END_WAITTING :
                            break;
                    }
                }else if(project.type == 2){
                    var status = project.deal_status_code;
                    if(project.publish_status_code)
                        status = project.publish_status_code;
                    switch(status){
                        case Project.States.PROJECT_OFFLINE :
                            break;
                        case Project.States.PROJECT_FINISHED :
                            break;
                        case Project.States.PROJECT_DRAFT ://草稿


                            if(project.launch_client == 10){
                                _ops.push({operation : Project.Operations.equity.audit_new, mode : "lbtn"});
                                _ops.push({operation : Project.Operations.equity.edit_new, mode : "btn"});
                            }else{
                                _ops.push({operation : Project.Operations.equity.audit, mode : "lbtn"});
                                _ops.push({operation : Project.Operations.equity.edit, mode : "btn"});
                            }




                            _ops.push({operation : Project.Operations.equity.preview, mode : "btn"});
                            break;
                        case Project.States.PROJECT_AUDITTING ://审核中
                            _ops.push({operation : Project.Operations.equity.preview, mode : "btn"});
                            break;
                        case Project.States.PROJECT_AUDIT_FAIL ://审核失败
                            _ops.push({operation : Project.Operations.equity.reject_reason, mode : "btn"});

                            if(project.launch_client == 10){
                                _ops.push({operation : Project.Operations.equity.edit_new, mode : "btn"});
                            }else{
                                _ops.push({operation : Project.Operations.equity.edit, mode : "btn"});
                            }

                            _ops.push({operation : Project.Operations.equity.preview, mode : "btn"});
                            break;
                        case Project.States.PROJECT_ONLINE :
                            break;
                        case Project.States.PROJECT_UNSUCCESS :
                            break;
                        case Project.States.PROJECT_WAITTING_FOR_ONLINE :
                            _ops.push({operation : Project.Operations.equity.preview, mode : "btn"});
                            break;
                        case Project.States.PROJECT_STOCK_FINANCE_APPOINTMENT :
                            _ops.push({operation : Project.Operations.equity.view_reserves, mode : "btn"});
                            if(project.publish_status_code =='' ){
                                _ops.push({operation : Project.Operations.equity.publish, mode : "lbtn"});
                            }
                            break;
                        case Project.States.PROJECT_STOCK_FINANCE_SUBSCRIBE :
                            _ops.push({operation : Project.Operations.equity.view_buy_orders, mode : "btn"});
                            break;
                        case Project.States.PROJECT_STOCK_FINANCE_APPOINTMENT_THREE_DAY :
                            _ops.push({operation : Project.Operations.equity.view_reserves, mode : "btn"});
                            break;
                        case Project.States.PROJECT_STOCK_FINANCE_SUCCESS :
                            break;
                        case Project.States.PROJECT_STOCK_FINANCE_FAIL :
                            break;
                        case Project.States.PROJECT_STOCK_PUBLISH_SUCCESS :
                            _ops.push({operation : Project.Operations.equity.view_buy_orders, mode : "btn"});
                            break;
                        case Project.States.PROJECT_STOCK_PUBLISH_FAIL :
                            _ops.push({operation : Project.Operations.equity.view_reserves, mode : "btn"})
                            if(project.deal_status_code ==Project.States.PROJECT_STOCK_FINANCE_APPOINTMENT ){
                                _ops.push({operation : Project.Operations.equity.publish, mode : "lbtn"});
                            }
                            break;
                        case Project.States.PROJECT_STOCK_PUBLISH_HALF :
                            _ops.push({operation : Project.Operations.equity.view_reserves, mode : "btn"})
                            if(project.deal_status_code ==Project.States.PROJECT_STOCK_FINANCE_APPOINTMENT ){
                                _ops.push({operation : Project.Operations.equity.publish, mode : "lbtn"});
                            }
                            break;
                        case Project.States.PROJECT_STOCK_PUBLISH_WAITING_AUDIT :
                            _ops.push({operation : Project.Operations.equity.view_reserves, mode : "btn"});
                            break;
                        case Project.States.PROJECT_STOCK_PUBLISH_AUDIT_FAIL :
                            _ops.push({operation : Project.Operations.equity.reject_reason, mode : "btn"});
                            _ops.push({operation : Project.Operations.equity.modify_publish, mode : "btn"});
                            _ops.push({operation : Project.Operations.equity.view_reserves, mode : "btn"});
                            if(project.deal_status_code ==Project.States.PROJECT_STOCK_FINANCE_APPOINTMENT ){
                                _ops.push({operation : Project.Operations.equity.publish, mode : "lbtn"});
                            }
                            break;
                    }
                    if(project.confirm_leader.length!=0 || project.unconfi_leader.length!=0){
                        _ops.push({operation : Project.Operations.equity.view_leaders, mode : "btn"});
                    }
                }

                return _ops;
            };


            /**
             * 项目是否可以被删除
             * @param project
             */
            Project.canDelete = function(project){
                return [
                    Project.States.PROJECT_DRAFT, Project.States.PROJECT_AUDIT_FAIL
                    , Project.States.PROJECT_THE_FIRST_AUDIT_FAIL, Project.States.FRIEND_ROJECT_SUPPORT_EMPTY
                ].indexOf(project.deal_status_code) != -1;
            };
            /**
             * 项目是否可以被点击查看
             * @param project
             */
            Project.canView = function(project){
                return [
                        Project.States.PROJECT_ONLINE, Project.States.PROJECT_FINISHED
                    ].indexOf(project.deal_status_code) != -1;
            };

            Project.getUrl = function(project){
               if(project.type == 1) {
                   if(project.deal_type == 5){
                       //return "http://mf.zhongchou.com/wx/friend?deal_id=" + project.projectID;
                       return project.webDomain + "/friend/project/detail?deal_id=" + project.projectID;

                   }else{
                       return "/deal-show/id-" + project.project_id;
                   }
               }else{
                   return "/deal-stock/id-" + project.project_id;
               }
            };
            /**
             * 获取项目列表
              * @param postdata
             * @returns {deferred.promise|{then, catch, finally}|promise.promise|Function|*|jQuery.promise}
             */
            Project.get_user_project_list = function () {
                var promise = Common.httpGet(uc.serviceUrl('deal/userdeal?v=3'));
                var defer = $q.defer();
                promise.then(function(data){
                    var list = data.user_project;
                    _.each(list ,function(project){
                        project.typeStr = project.type == 1 ? "奖励众筹" : "股权融资";
                        project.operations = Project.getOperationList(project);
                        project.canDelete = Project.canDelete(project);
                        project.canPreview = Project.canView(project);
                        project.settle_status = project.settle_status.split(',');
                        var deal_status = [];
                        if(project.deal_status_code == Project.States.PROJECT_STOCK_FINANCE_APPOINTMENT && project.price_rate >= 100){
                            deal_status.push("预约结束");
                        }else{
                            deal_status.push(project.deal_status);
                        }

                        if(project.deal_status_code == Project.States.PROJECT_STOCK_FINANCE_APPOINTMENT){
                            if(
                                project.publish_status_code!=Project.States.PROJECT_STOCK_PUBLISH_SUCCESS &&
                                project.publish_status_code!=Project.States.PROJECT_STOCK_PUBLISH_FAIL &&
                                project.publish_status_code!=Project.States.PROJECT_STOCK_PUBLISH_HALF
                            ){
                                deal_status.push(project.publish_status);
                            }
                        }

                        project.deal_status = deal_status;
                        project.url = Project.getUrl(project);
                        if(project.type == 1){
                            project.color = project.price_rate >= 100 ? "#ff6520" : "";
                        }
                        else {

                        }

                    });
                    defer.resolve(list);
                });
                return defer.promise;
            };
            // 获取项目状态

            Project.prototype.doDelete = function (project) {
                var type = project.type == 1 ? 0 : 1;
                var promise = Common.httpPost(uc.serviceUrl("deal/deletedeal?v=3"), {projectID : project.projectID, type : type});
                return promise;
            };

            Project.prototype.cancel_focusz = function (postdata) {
                var mock = new httpMock();
                mock.addMock({
                    url: "user/replay",
                    data: {
                        type: 1,
                        //1-直接对用户回复 2-仅仅将replayMark标记为1
                        topicID: "",
                        //对应的话题ID
                        commentsID: "",
                        //对应的回复ID 如果直接对于topic的回复,此项为空
                        commentsMess: ""
                        //消息内容
                    },
                    success: function () {
                            return []

                        },
                        fail: function () {

                        }
                });
                var promise = mock.request({
                    url: "user/replay",
                    data: {
                        type: 1 | 2,
                        //1-直接对用户回复 2-仅仅将replayMark标记为1
                        topicID: "",
                        //对应的话题ID
                        commentsID: "",
                        //对应的回复ID 如果直接对于topic的回复,此项为空
                        commentsMess: ""
                        //消息内容
                    },
                    method: "POST"
                });
                return promise;

            };



            //end user defined
            return Project;
        }
    ]);




})(window, window.angular,$,angular.module('ucApp'));

/**
 * Created by YL Huang on 2015/7/25.
 */
(function (window, angular, $, ucApp) {
    'use strict';
    ucApp.factory('User', ['$http', '$q', 'Common', 'httpMock', 'Project', 'Address',
        function ($http, $q, Common, httpMock, Project, Address) {
            var User = function () {
            };
            User.get_user_address_list = function (data) {
                var defer = $q.defer();
                $http.get(uc.serviceUrl("user/getaddresslist?v=1"), (data || {}))
                    .success(function (data) {
                        defer.resolve(data.data);
                    })
                    .error(function () {
                        defer.reject();
                    });
                return defer.promise;
            };

            User.resendActivateEmail = function (email) {
                return Common.httpPost(uc.serviceUrl("validate/email?v=3"), { email : email });
            };

            User.add_address = function (data) {
                var tempaddr = {};
                tempaddr.person = data.person;
                tempaddr.addressID = "";
                tempaddr.telephone = data.telephone;
                if (data.postcode) {
                    tempaddr.postcode = data.postcode;
                }


                tempaddr.province = data.address.province;
                tempaddr.city = data.address.city;
                tempaddr.address = data.address.address;
                return Common.httpPost(uc.serviceUrl("user/addaddress?v=1"), tempaddr);
            };
            User.user_auth = function (postdata) {
                return Common.httpPost(uc.serviceUrl("user/authuser?v=3"), postdata);
            };
            User.get_auth_info = function () {
                return Common.httpGet(uc.serviceUrl("user/checkuserauth?v=3"));
            };
            User.get_fanli_list = function (data) {
                var defer = $q.defer();
                $http.get(uc.serviceUrl("corp/dealuserrebate?v=3"), (data || {}))
                    .success(function (data) {
                        defer.resolve(data.data);
                    })
                    .error(function () {
                        defer.reject();
                    });
                return defer.promise;
            };
            User.get_invitation_list = function (data) {
                var defer = $q.defer();
                $http.get(uc.serviceUrl("corp/invitation?v=3"), (data || {}))
                    .success(function (data) {
                        defer.resolve(data.data);
                    })
                    .error(function () {
                        defer.reject();
                    });
                return defer.promise;
            };
            User.get_letter_list = function (data) {
                var defer = $q.defer();
                $http.get(uc.serviceUrl("corp/letter?v=3"), (data || {}))
                    .success(function (data) {
                        defer.resolve(data.data);
                    })
                    .error(function () {
                        defer.reject();
                    });
                return defer.promise;
            };
            User.get_user_answerlist_list = function (data) {
                var defer = $q.defer();
                $http.get(uc.serviceUrl("corp/answerlist?v=3"), (data || {}))
                    .success(function (data) {
                        defer.resolve(data.data);
                    })
                    .error(function () {
                        defer.reject();
                    });
                return defer.promise;
            };
            User.get_user_received_comment_list = function (data) {
                var defer = $q.defer();
                $http.get(uc.serviceUrl("corp/comments?v=3"), (data || {}))
                    .success(function (data) {
                        defer.resolve(data.data);
                    })
                    .error(function () {
                        defer.reject();
                    });
                return defer.promise;
            };
            User.set_default_address = function (data) {
                return Common.httpPost(uc.serviceUrl("user/setdefaultaddr?v=1"), data);
            };
            User.mod_address = function (data) {
                var tempaddr = {};
                tempaddr.person = data.person;
                tempaddr.addressID = data.addressID;
                tempaddr.telephone = data.telephone;
                if(data.postcode) {
                    tempaddr.postcode = data.postcode;
                }
                tempaddr.province = data.address.province;
                tempaddr.city = data.address.city;
                tempaddr.address = data.address.address;
                return Common.httpPost(uc.serviceUrl("user/modaddress?v=1"), tempaddr);
            };
            User.remove_address = function (data) {
                return Common.httpPost(uc.serviceUrl("user/deladdress?v=1"), data);
            };
            User.getFocusList = function () {
                var defer = $q.defer();
                var promise = Common.httpGet(uc.serviceUrl("deal/focusdeal?v=3"));
                promise.then(function (data) {
                    var list = data.user_project;
                    _.each(list, function (project) {
                        project.url = Project.getUrl(project);
                    });
                    defer.resolve(list);
                });
                return defer.promise;
            };
            User.cancelFocus = function (project) {
                var type = project.type == 1 ? 0 : 1;
                return Common.httpPost(uc.serviceUrl("deal/cancelfocus?v=3"), {
                    type: type,
                    projectID: project.projectID
                });
            };
            User.save_userinfo = function (data) {
                return Common.httpPost(uc.serviceUrl("user/modinfo?v=1"), data);
            };
            User.get_userinfo = function () {
                return Common.httpGet(uc.serviceUrl("user/info?v=1"));
            };
            User.get_auth = function () {
                return Common.httpGet(uc.serviceUrl("user/checkuserauth?v=3"));
            };
            User.change_password = function (postdata) {
                return Common.httpPost(uc.serviceUrl("user/modifypwd?v=3"), postdata);
            };


            User.bindcard = function(userId, city, province, branch, card_no, account_name){
                var params = uc.eqParams("my", 'savebank', "GET", {userId : userId, city : city, province : province, bank_name : branch, card_no : card_no, account_name : account_name});
                var url = uc.serviceUrl("corp/api?v=3");
                return Common.httpGet(url, params);
            };
            return User;
        }
    ]);

})(window, window.angular, $, angular.module('ucApp'));



/**
 * 地址相关类
 * @author weimeng
 */

(function(window, angular,$,ucApp) {
    ucApp.factory('Address', ['$http', '$q', '$rootScope', 'Check', function ($http, $q, $rootScope, Check) {
        var list = [];
        var provinceList = [];
        var cityList = [];
        var selectedProvinceId;
        var selectedCityId;

       /**
         * 获取当前数据
         */
        function getData(){
            return list;
        }

        function _ajax(options){
            var _s = this;
            $.ajax({
                url : options.url,
                type : options.method,
                cache : options.cache || false,
                dataType : 'json',
                data : options.data,
                success : function(data){

                    if(data.errno){
                        if(data.errno == '1004'){
                            $rootScope.$broadcast("LOGIN_ERROR", data.error);
                        }else{
                            $rootScope.$broadcast("LOGIC_ERROR", data.error);
                        }
                    }else{
                        options.success.call(_s, data.data);
                    }
                },
                error : function(){
                    uc.modal.alert("网络错误", "无法连接到服务器，请确认网络环境然后重试");
                }
            });
        };

        var Events = {
            ADDR_CREATED : "ADDR_CREATED",
            ADDR_DELETED : "ADDR_DELETED",
            ADDR_DEF_CHANGED : "ADDR_DEF_CHANGED",
            LOGIC_ERROR : "LOGIC_ERROR" ,
            ADDR_CITY_CHANGED : "ADDR_CITY_CHANGED",
            ADDR_PROVINCE_CHANGED : "ADDR_PROVINCE_CHANGED",
            ADDR_PROVINCES_LOAD : "ADDR_PROVINCES_LOAD",
            ADDR_MODIFIED : "ADDR_MODIFIED",
            ADDR_LOAD : "ADDR_LOAD"
        };


        /**
         * 删除
         */
        function deleteItem(addressID){
            _ajax({
                url : uc.serviceUrl("user/deladdress?v=1"),
                method : "POST",
                cache : false,
                data : {addressID : addressID},
                success : function(data){
                    item = _.first(_.filter(list, function(o){return o.addressID === addressID; }));
                    list = _.filter(list, function(o){return o.addressID != addressID; });
                    $rootScope.$broadcast(Events.ADDR_DELETED, {list : list, item : item});
                }
            });
        }


        /**
         * 设置默认地址
         */
        function setDefault(addressID){
            _ajax({
                url : uc.serviceUrl("user/setdefaultaddr?v=1"),
                data : {addressID : addressID},
                cache : false,
                method : "POST",
                success : function(data){
                    var item = _.first(_.filter(list, function(o){return o.addressID === addressID; }));
                    _.each(list, function(o){
                        o["default"] = 0;
                    });
                    item["default"] = 1;
                    $rootScope.$broadcast(Events.ADDR_DEF_CHANGED, {list : list, item : item});
                }
            });
        }


        /**
         * 保存收货地址
         */
        function saveItem(item){
            var defer = $q.defer();
            var errors = Check.checkAll([
                {
                    value : item.person,
                    rules : ['required'],
                    hint  : "请填写收货人"
                },
                {
                    value : item.telephone,
                    rules : ['required', 'mobile'],
                    hint  : "请输入正确的手机号"
                },
                {
                    value : item.province,
                    rules : ['minLength-2'],
                    hint  : ['请选择省份']
                },
                {
                    value : item.city,
                    rules : ['minLength-2'],
                    hint  : '请选择城市'
                },
                {
                    value : item.address,
                    rules : ['minLength-6'],
                    hint  : '收货地址的长度不可少于6个字符'
                }]);
            if(errors.length > 0){
                uc.modal.alert("输入提示", errors[0]);
                return;
            }
            if(item.addressID){
                $.ajax({
                    url : uc.serviceUrl("user/modaddress?v=1"),
                    dataType : 'json',
                    data : item,
                    type: 'POST',
                    cache : false,
                    success : function(data){
                        if(data.errno){
                            uc.modal.alert("填写错误", data.error);
                        }else{
                            var lItem = _.first(_.filter(list, function(i){
                                return i.addressID = item.addressID;
                            })) ;

                            lItem.address.address = item.address;
                            lItem.telephone = item.telephone;
                            lItem.person = item.person;
                            lItem.address.province = item.province;
                            lItem.address.city = item.city;
                            defer.resolve(list);
                            //$rootScope.$broadcast(Events.ADDR_MODIFIED,list);
                        }
                    },
                    error :function(xhr, state, err){}
                });

            }else{
                $.ajax({
                    url : uc.serviceUrl("user/addaddress?v=1"),
                    dataType : 'json',
                    data : item,
                    type : 'POST',
                    cache : false,
                    success : function(data){

                        if(data.errno){
                            uc.modal.alert("填写错误", data.error);
                            //$rootScope.$broadcast(Events.LOGIC_ERROR, data.error);
                        }else{
                            var newItem = {
                                address : {
                                    address : item.address,
                                    city : item.city,
                                    province : item.province
                                },
                                addressID : data.data.addressID,
                                "default" : 0,
                                person : item.person,
                                telephone : item.telephone
                            };

                            list.push(newItem);
                            if(list.length == 1){
                                newItem["default"] = 1;
                            }
                            defer.resolve(list);
                            //$rootScope.$broadcast(Events.ADDR_CREATED, list);
                        }
                    },
                    error :function(xhr, state, err){}
                });
            }
            return defer.promise;
        }

        /**
         * 加载所有的地址
         */
        function loadAll(){
            var url = uc.serviceUrl("user/getaddresslist?v=1");
            $.ajax({
                url : url,
                dataType : 'json',
                cache : false,
                success : function(data){
                    list = data.data;
                    list = _.sortBy(list, function(addr, i){return addr["default"] ? -100 : i; });
                    $rootScope.$broadcast(Events.ADDR_LOAD, list);
                }
            });
        }

        /**
         * 加载所有的省份
         */
        function loadProvinces(province, city){
            _ajax({
                url : uc.serviceUrl('address/provincelist?v=3'),
                cache : true,
                dataType : 'json',
                success : function(data){
                    var p = {};
                    provinceList = data;
                    if(province){
                        p = getProvinceByName(province);
                        changeProvince(p.zone_id, city);
                    }
                    $rootScope.$broadcast(Events.ADDR_PROVINCES_LOAD, data);
                },
                error : function(){}
            });
        }


        /**
         * 改变省份
         */
        function changeProvince(provinceId, city){
            selectedProvinceId = provinceId;
            selectedCityId = undefined;
            _ajax({
                url : uc.serviceUrl("address/citylist?v=3"),
                cache : true,
                data : {provinceId : provinceId},
                success : function(data){
                    cityList = data;
                    var province = getProvince();
                    var c = {};
                    if(city){
                        c = getCityByName(city) || {};
                        selectedCityId = c.zone_id;
                    }
                    $rootScope.$broadcast(Events.ADDR_PROVINCE_CHANGED, {cityList : cityList, province: province.name, provinceId : province.zone_id});
                    $rootScope.$broadcast(Events.ADDR_CITY_CHANGED, {cityId: selectedCityId, provinceId : provinceId, cityList : cityList, city : c.name, cityId : c.zone_id , province : province.name});
                }
            });
        }

        function getProvince(){
            var provinceItem = _.first(_.filter(provinceList, function(item){return selectedProvinceId === item.zone_id; }));
            return provinceItem;
        }

        function getCity(){
            return _.first(_.filter(cityList, function(item){return selectedCityId === item.zone_id; }));
        }

        function getProvinceByName(name){
            return _.first(_.filter(provinceList, function(item){return name === item.name; }));
        }

        function getCityByName(name){
            return _.first(_.filter(cityList, function(item){return name === item.name; }));
        }


        /**
         * 改变城市
         */
        function changeCity(cityId){
            selectedCityId = cityId;
            var cityItem = getCity();
            var provinceItem = getProvince();
            $rootScope.$broadcast(Events.ADDR_CITY_CHANGED, {cityId: cityId, provinceId : provinceItem.zone_id, city : cityItem.name, province : provinceItem.name});
        }


        return {
            load : loadAll,
            deleteItem : deleteItem,
            loadProvinces : loadProvinces,
            changeProvince : changeProvince,
            changeCity : changeCity,
            save : saveItem,
            setDefault : setDefault,
            Events : Events,
            getSelectedProvinceId : function(){return selectedProvinceId;},

            getSelectedCityId : function(){return selectedCityId;},
            emptySelection : function(){selectedProvinceId = ''; selectedCityId = '';}
        };

    }]);
})(window, window.angular, $, angular.module('ucApp'));

/**
 * 地址相关类
 * @author weimeng
 */

(function(window, angular,$,ucApp) {
    ucApp.factory('Address2', ['$http', '$q', '$rootScope', 'Check', function ($http, $q, $rootScope, Check) {
         function _ajax(options){
            var _s = this;
            $.ajax({
                url : options.url,
                type : options.method,
                cache : options.cache || false,
                dataType : 'json',
                data : options.data,
                success : function(data){

                    if(data.errno){
                        if(data.errno == '1004'){
                            $rootScope.$broadcast("LOGIN_ERROR", data.error);
                        }else{
                            $rootScope.$broadcast("LOGIC_ERROR", data.error);
                        }
                    }else{
                        options.success.call(_s, data.data);
                    }
                },
                error : function(){
                    uc.modal.alert("网络错误", "无法连接到服务器，请确认网络环境然后重试");
                }
            });
        };

        function Address(){

        }

        Address.prototype.loadProvinces = function(provinceId){
            var defer = $q.defer();
            var _s = this;
            _ajax({
                url : uc.serviceUrl('address/provincelist?v=3'),
                cache : true,
                dataType : 'json',
                success : function(data){
                    if(provinceId){
                       _s.loadCities(provinceId).then(function(cities){
                           defer.resolve({provinceList : data, cityList : cities});
                       });
                    }else{
                        defer.resolve({provinceList : data});
                    }
                }
            });
            return defer.promise;
        };


        Address.prototype.loadCities = function(provinceId){
            var defer = $q.defer();
            _ajax({
                url : uc.serviceUrl("address/citylist?v=3"),
                cache : true,
                data : {provinceId : provinceId},
                success : function(data){
                   defer.resolve(data);
                }
            });
            return defer.promise;
        };

        return Address;

    }]);
})(window, window.angular, $, angular.module('ucApp'));

/**
 * Created by weimeng on 15/7/26.
 */
/**
 * (function(window, angular,$,ucApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,ucApp) {
    ucApp.factory('Check', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
        var Check = {
            required: function(value) {
                return value && value.length > 0;
            },
            email: function(value) {
                return value.length === 0 || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },
            mobile: function(value) {
                return value.length === 0 || /^1[3|4|5|7|8][0-9]\d{8}$/.test(value);
            },
            telphone: function(value) {
                return value.length === 0 || /^(\d{3}-\d{8}|\d{4,5}-\d{7,8})$/.test(value);
            },
            range: function(value, param) {
                param = param.split("-");
                return value.length === 0 || (value >= parseFloat(param[0]) && value <= parseFloat(param[1]));
            },
            min: function(value, param) {
                return value.length === 0 || (value >= parseFloat(param));
            },
            max: function(value, param) {
                return value.length === 0 || value <= parseFloat(param);
            },
            rangeEqual: function(value, param) {
                return value.length === 0 || value.length === parseInt(param, 10);
            },
            rangelength: function(value, param) {
                param = param.split("-");
                return value.length === 0 || (value.length >= parseInt(param[0], 10) && value.length <= parseInt(param[1], 10));
            },
            minLength: function(value, param) {
                return value && (value.length === 0 || value.length >= parseInt(param, 10));
            },
            maxLength: function(value, param) {
                return value && (value.length === 0 || value.length <= parseInt(param, 10));
            },
            length : function (value, param){
                return value && value.length == param;
            },
            byteRangeLength: function(value, param) {
                param = param.split("-");
                return value.length === 0 || (value.getBytes() >= parseInt(param[0], 10) && value.getBytes() <= parseInt(param[1], 10));
            },
            byteMinLength: function(value, param) {
                return value.length === 0 || value.getBytes() >= parseInt(param, 10);
            },
            byteMaxLength: function(value, param) {
                return value.length === 0 || value.getBytes() <= parseInt(param, 10);
            },
            byteRangeEqual: function(value, param) {
                return value.length === 0 || value.getBytes() === parseInt(param, 10);
            },
            equalTo: function(value, equalToElement) {
                return value.length === 0 || value.length > 0 && value === $("input[name='" + equalToElement + "']").val();
            },
            digits: function(value) {
                return value.length === 0 || /^\d+$/.test(value);
            },
            post: function(value) {
                return value.length === 0 || /^[0-9]{6}$/.test(value);
            },
            cardId: function(value) {
                return value.length === 0 || /^(\d{18,18}|\d{15,15}|\d{17,17}[xX])$/.test(value);
            },
            passport: function(value) {
                return value.length === 0 || /^1[45][0-9]{7}$|^G[0-9]{8}$|^P[0-9]{7}$|^S[0-9]{7,8}$|^D[0-9]+$/.test(value);
            },
            noSymbol: function(value) {
                return value.length === 0 || /^[\w|\u4e00-\u9fa5]*$/.test(value);
            },
            url: function(value) {
                return value.length === 0 || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },
            username: function(value) {
                return Check.required(value) && (Check.email(value) || Check.mobile(value));
            },
            password: function(value) {
                return Check.required(value) && Check.rangelength(value, "6-14") && /[A-Za-z_0-9]+/.test(value);
            },
            check: function(options, value) {
                _.each(options, function(opt){
                    var i = opt.indexOf("-");
                    var fn_name, fn_para;
                    if(i === -1){
                        fn_name = opt;
                    }
                    else{
                        fn_name = opt.substr(0, i);
                        fn_para = opt.substr(i+1);
                    }


                    var fn = Check[fn_name];
                    if(!fn(value, fn_para)){
                        return false;
                    }
                });
                return true;
            },
            checkAll : function(options) {
                var errors = [];
                _.each(options, function(option){
                    if(!Check.check(option.rules, option.value)){
                        errors.push(option.hint);
                    }
                });
                return errors;
            }
        };
        return Check;

    }]);
})(window, window.angular,$,angular.module('ucApp'));
/**
 * (function(window, angular,$,ucApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,ucApp) {
   ucApp.factory('httpMock', ['$http', '$q', function ($http, $q) {
      var httpMock = function() {
         if(!window.mockDict){
            window.mockDict = {};
         }
         this.mockDict = window.mockDict;
         var mockcallback;
         function build_query(url, data, method) {
            if(method === 'POST'){
               return url + "-post";
            }
            var params = [];
            for (var key in data) {
               params.push(key + "=" + data[key]);
            }
            if (params.length > 0) {
               return url + "?" + params.join("&");
            }
            return url;
         }

         this.addMock = function (options) {
           // url = build_query(options.url, options.data, options.method);
           
            //this.mockDict[url] = options.success;
             mockcallback=options.success;
         }

         this.request = function (options) {
            url = build_query(options.url, options.data);
            var succ = this.mockDict[url];

            var deferred = $q.defer();
            if (1) {
               setTimeout(function () {
                  deferred.resolve(mockcallback());
               }, 50);
            } else {
               if (options.fail) {
                  deferred.reject({errno: 6000, error: "网络错误"});
               }
            }

            return deferred.promise;

         };
      };
      return httpMock;
   }]);



})(window, window.angular, $, angular.module('ucApp'));

/**
 * Created by YL Huang on 2015/7/7.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("mainCtrl",['$rootScope','$scope','$state','$timeout','$interval','Common','User',function($rootScope,$scope,$state,$timeout,$interval,Common,User){
        Common.noInvitationCode();
        $rootScope.redirect=Common.redirect;

        $rootScope.prjMgrLink = "/corp-order";
        if(window.location.href.match("yuanshihui")){
            $rootScope.prjMgrLink = "http://www.zhongchou.com/corp-order";
            $rootScope.isYSH = true;
        }
        User.get_userinfo().then(function(data){
            if(data){ 
                $rootScope.user = data;
                if($rootScope.user.headerUrl==''){
                    $rootScope.user.headerUrl = 'http://istatic.yuanshihui.com/angelpc/v3/static/images/common/defult_sys_avatar_s.png';
                }
                $rootScope.$broadcast("UserInfoLoaded");
                //console.log($rootScope.user);
            }
        });       
        
    }]);
})(window, window.angular,angular.module('ucApp'));   


   
/**
 * Created by YL Huang on 2015/7/7.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("commentCtrl",['$rootScope','$scope','Common','Message','$timeout',function($rootScope,$scope,Common,Message,$timeout){

        Common.noInvitationCode();
        $scope.index = 1;
        $scope.currentPage=1;
        $scope.pages = 1;
        var getCommentList = function(){
            var commentType = 1;
            if($scope.index == 1){
                commentType = 2;
            }
            $scope.loading = true;
            Message.Comment.get_page_list(commentType,$scope.currentPage,5).then(function(data){
                $timeout(function(){
                    $rootScope.user.commentsNum = 0;
                },1000);
                $scope.loading = false;
                $scope.commentList = data.comment_list;
                $scope.pages = Common.getPageCount(data.total,5);
            });
        };
        getCommentList();
        var getTopicList = function(){
            $scope.loading = true;
            Message.Topic.get_page_list($scope.currentPage,5).then(function(data){
                $scope.loading = false;
                $scope.topicList = [];
                if(data.answer_list) {
                    $scope.topicList = data.answer_list;
                }
                $scope.pages = Common.getPageCount(data.total,5);
            });
        };
        $scope.$watch('currentPage',function(newValue,oldValue){
            if(newValue && newValue != oldValue){
                if($scope.index==3){
                    getTopicList();
                }else {
                    getCommentList();
                }
            }
        });
        $scope.$watch('index',function(newValue,oldValue){
            if(newValue && newValue != oldValue){
                $scope.currentPage = 1;
                $scope.pages = 1;
                if(newValue==3){
                    getTopicList();
                }else {
                    getCommentList();
                }
            }
        });
        $scope.replayComment = function(item){
            var html = '<textarea style="width: 94.5%;" class="grzlJianjieText sitePHInput" placeholder="请输入评论内容 最多300个字符" ng-model="content"></textarea><span class="sitePHTip">请输入评论内容 最多300个字符</span><div class="comment_error"></div>';
            uc.modal.confirm('回复：'+item.user_name,html,function(e){
                var content = $.trim($('textarea[ng-model="content"]').val());
                if(content.length==0){
                    $('.modal-ok').removeAttr('disabled').text('确认');
                    $('textarea[ng-model="content"]').focus();
                    $('.comment_error').text('请输入评论内容');
                    return;
                }
                if(content.length>300){
                    $('textarea[ng-model="content"]').focus();
                    $('.modal-ok').removeAttr('disabled').text('确认');
                    $('.comment_error').text('评论内容最多只能输入300个字符');
                    return;
                }

                var comment = new Message.Comment({
                    projectID:item.projectID,
                    topicID:item.topicID,
                    commentID:item.commentID,
                    content:content
                });
                comment.reply().then(function(){
                    uc.modal.close();
                    setTimeout(function(){
                        uc.modal.alert('信息提示','回复成功！');
                    },1000);
                    getCommentList();
                    if($rootScope.user.commentsNum>0){
                        $rootScope.user.commentsNum=$rootScope.user.commentsNum-1;
                    }
                });
            });
            $('.comment_error').css({
                'text-align':'right',
                'color':'#CE0000',
                'padding-top':5
            });
            $('textarea[ng-model="content"]').on('keyup',function(){
                if($.trim($(this).val()).length>0){
                    $('.comment_error').text('');
                }
                if($.trim($(this).val()).length>300){
                    $('.comment_error').text('评论内容最多只能输入300个字符');
                }
            }).blur(function(){
                if($.trim($(this).val()).length==0){
                    $('.comment_error').text('请输入评论内容');
                }
            });
        };
    }]);
})(window, window.angular,angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("letterCtrl",['$scope','$rootScope','Common','Message','$timeout',function($scope,$rootScope,Common,Message,$timeout){
        Common.noInvitationCode();
        $scope.index = 1;
        $scope.currentPage = 1;
        $scope.pages =1 ;
        var getLatterList = function(type){
            $scope.loading = true;
            Message.Letter.get_page_list(type,$scope.currentPage,5).then(function(data){
                $timeout(function(){
                    $rootScope.user.letterNum = 0;
                },1000);
                $scope.loading = false;
                $scope.letterList =  data.letter_list;
                $scope.pages = Common.getPageCount(data.total,5);
            });
        };
        getLatterList(2);
        var getLetterType = function(){
            var type = 1;
            if($scope.index == 1){
                type = 2;
            }
            return type;
        };
        $scope.$watch('currentPage',function(newValue,oldValue){
            if(newValue && newValue != oldValue){
                getLatterList(getLetterType());
            }
        });
        $scope.$watch('index',function(newValue,oldValue){
           if(newValue && newValue != oldValue){
               $scope.currentPage = 1;
               $scope.pages = 1;
               getLatterList(getLetterType());
           }
        });
        $scope.replayLetter = function(item){
            var html = '<textarea style="width: 94.5%;" class="grzlJianjieText sitePHInput" placeholder="请输入私信内容 最多300个字符" ng-model="replyMessage"></textarea><span class="sitePHTip">请输入私信内容 最多300个字符</span><div class="comment_error"></div>';
            uc.modal.confirm('发送私信给'+item.send_user_name,html,function(){
                var content = $.trim($('textarea[ng-model="replyMessage"]').val());
                if(content.length==0){
                    $('.modal-ok').removeAttr('disabled').text('确认');
                    $('textarea[ng-model="replyMessage"]').focus();
                    $('.comment_error').text('请输入私信内容');
                    return;
                }
                if(content.length>300){
                    $('textarea[ng-model="replyMessage"]').focus();
                    $('.modal-ok').removeAttr('disabled').text('确认');
                    $('.comment_error').text('私信内容最多只能输入300个字符');
                    return;
                }

                var letter = new Message.Letter({
                    letter_id : item.letter_id,
                    receive_user_id: item.send_user_id,
                    msg: content
                });
                letter.reply().then(function(){
                    uc.modal.close();
                    setTimeout(function(){
                        uc.modal.alert('信息提示','发送成功！');
                    },1000);
                    if($rootScope.user.letterNum>0){
                        $rootScope.user.letterNum = $rootScope.user.letterNum-1;
                    }
                    item.isRead = 1;
                });
            });$('.comment_error').css({
                'text-align':'right',
                'color':'#CE0000',
                'padding-top':5
            });
            $('textarea[ng-model="replyMessage"]').on('keyup',function(){
                if($.trim($(this).val()).length>0){
                    $('.comment_error').text('');
                }
                if($.trim($(this).val()).length>300){
                    $('.comment_error').text('私信内容最多只能输入300个字符');
                }
            }).blur(function(){
                if($.trim($(this).val()).length==0){
                    $('.comment_error').text('请输入私信内容');
                }
            });
        };
    }]);
})(window, window.angular,angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("messageCtrl",['$scope','$rootScope','Common','User','Message','$timeout',function($scope,$rootScope,Common,User,Message,$timeout){
        Common.noInvitationCode();
        $scope.removeItem = function (item){
            $scope.messageList= _.difference($scope.messageList,item);
        };
        $scope.currentPage = 1;
        $scope.pages = 1;
        var getSystemMessageList = function(){
            $scope.loading = true;
            Message.SystemMessage.get_page_list($scope.currentPage,5).then(function(data){
                $scope.loading = false;
                $scope.messageList = data.message;
                $scope.pages = Common.getPageCount(data.total,5);
                $timeout(function(){
                    $rootScope.user.systemMessNum=0;
                },1000);
            });
        };
        getSystemMessageList();
        $scope.$watch('currentPage',function(newValue,oldValue){
            if(newValue && newValue!=oldValue){
                getSystemMessageList();
            }
        });
    }]);
})(window, window.angular,angular.module('ucApp'));
/**
 * Created by YL Huang on 2015/7/29.
 */
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("topicCtrl",['$scope','$rootScope','Common','Message',function($scope,$rootScope,Common,Message){
        Common.noInvitationCode();
        $scope.currentPage = 1;
        $scope.pages =1 ;
        var getTopicList = function(){
            $scope.loading = true;
            Message.Topic.get_page_list($scope.currentPage,5).then(function(data){
                $scope.loading = false;
                $scope.topicList = [];
                if(data.answer_list) {
                    $scope.topicList = data.answer_list;
                }
                $scope.pages = Common.getPageCount(data.total,5);
            });
        };
        getTopicList();
        $scope.$watch('currentPage',function(newValue,oldValue){
            if(newValue && newValue != oldValue){
                getTopicList();
            }
        });
    }]);
})(window, window.angular,angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("accountCtrl",['$scope','$rootScope','Common','Account',function($scope,$rootScope,Common,Account){
        Common.noInvitationCode();
        $scope.loading = true;
        Account.Balance.getAll().then(function(data){
            $scope.loading = false;
            $scope.balanceList = data.balance;
            $rootScope.user.yue = data.residue ;
        });
        //todo:设置提现按钮的跳转
        $scope.beforeWithdrawMoney = function(e){
            if($rootScope.user.yue<50){
                uc.modal.alert('信息提示','提现金额不少于50元');
            }else{
                $('a[withdraw-money]')[0].click();
            }
        };
    }]);
})(window, window.angular,angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("couponCtrl",['$scope','Common','Account',function($scope,Common,Account){
        Common.noInvitationCode();
        $scope.moment = moment;
        $scope.loading = true;
        $scope.statusName = function(status){
            
            switch(status-0) {
                case 0:
                    return '未使用';
                case  1:
                    return '已使用';
                case 2:
               
                    return '已失效';
            }
        };
        Account.Voucher.getAll().then(function(data){
            $scope.loading = false;
            $scope.couponList = data.list;
            for(var i=0;i<$scope.couponList.length;i++){
                $scope.couponList[i].sta=['未使用','已使用','已失效'][parseInt($scope.couponList[i].status)]
            }
        });
    }]);
})(window, window.angular,angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("focusCtrl",['$scope','Common', "User",function($scope,Common, User){ 
        Common.noInvitationCode();
        $scope.currentPage = 1;
        $scope.pages = 20;
        $scope.moment=moment;
        $scope.moredis=0;
        $scope.loading = true;
        $scope.staticImg = function(src){
            return uc.imageProcess(src, 'thumb', 80, 60);
        };
        User.getFocusList().then(function(list){
            $scope.loading = false;
            $scope.focusList = list;
            if(($scope.focusList.length==0)||(!$scope.focusList)){$scope.moredis=1}
        });
        if(window.location.href.match("yuanshihui")){
           $scope.browseLink = '/guquan';
        }else{

            $scope.browseLink = '/browse';
        }
           
        $scope.cancelFocus = function(item){
            uc.modal.confirm('取消关注','您确认取消关注此项目吗？',function(){
                User.cancelFocus(item).then(function(){
                    $scope.focusList= _.difference($scope.focusList,item);

                    if(($scope.focusList.length==0)||(!$scope.focusList)){$scope.moredis=1}

                    uc.modal.close();
                });
            });
        };
    }]);
})(window, window.angular,angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("hongbaoCtrl",['$scope','Common','Account',function($scope,Common,Account){
        Common.noInvitationCode();
        $scope.moment = moment;
        $scope.loading = true;
        Account.Hongbao.getAll().then(function(data){
            $scope.loading = false;
            $scope.hongbaoList=[];
            if(data.hongbao_list){
                $scope.hongbaoList = data.hongbao_list;
            }
        });
        $scope.getCodeImage= function(item){
            return new Account.Hongbao(item).get_dimension_code_image();
        };
    }]);
})(window, window.angular,angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("invitationCodeCtrl",['$rootScope','$scope','$timeout','Common','Account',function($rootScope,$scope,$timeout,Common,Account){

        $rootScope.invitationCode.showCodeImage =false;
        $scope.childIndex = 1;
        $scope.moment = moment;
        $scope.currentPage = 1;
        $scope.loading = true;
        var getVoucherList = function(isUsed){
            $scope.loading = true;
            Account.Invitation.getAll(isUsed,$scope.currentPage,10).then(function(data){
                $scope.loading = false;
                $scope.invitationList = data.my_bonus.bonus;
                $scope.pages = 0;
                $timeout(function(){
                    $scope.pages = Common.getPageCount(data.my_bonus.total,10);
                },100);
            });
        };
        $scope.changeTab= function(index){
            $scope.loading = true;
            $rootScope.invitationCode.index = index;
            if(index>2){
                $rootScope.invitationCode.showCodeImage=true;
            }else{
                $rootScope.invitationCode.showCodeImage=false;
            }

            if(index == 1){
                $scope.changeChildTab(1);
            }
            if(index == 2){
                Account.Deal_Rebate.getAll().then(function(data){
                    $scope.loading = false;
                    $scope.dealRebateList = data.deal_user_rebate;
                    $scope.deal ={
                        total_amount: data.total_amount ? data.total_amount : 0,
                        able_amount: data.able_amount ? data.able_amount : 0,
                        wait_amount: data.wait_amount ? data.able_amount : 0
                    };
                });
            }
            if(index == 3){
                Account.Reg_Rebate.getAll().then(function(data){
                    $scope.loading = false;
                    $scope.regRebateList = data.invation;
                });
            }
        };
        $scope.changeChildTab = function(index){
            $scope.childIndex = index;
            $scope.currentPage = 1;
            getVoucherList($scope.childIndex!=1)
        };

        if($rootScope.isYSH) {
            $rootScope.invitationCode.index = 1;
        }else {
            $rootScope.invitationCode.index = 2;
        }
        $scope.changeTab($rootScope.invitationCode.index);
        //股权邀请码返利

        $scope.$watch('currentPage',function(newValue,oldValue){
            if(newValue && newValue!=oldValue && newValue>0){
                getVoucherList($scope.childIndex!=1);
            }
        });

        getVoucherList(false);

        $scope.turnOutBalance = function(){
            if($scope.deal.able_amount==0){
                uc.modal.alert('信息提示','您没有可转出的余额！');
            }
        };
    }]);
})(window, window.angular,angular.module('ucApp'));
(function (window, angular, ucApp) {
    'use strict';
    function orderCtrlInit($rootScope,$scope, Common, Order,type){
        Common.noInvitationCode();
        $scope.currentPage = 1;
        $scope.pages = 1;
        $scope.type = type;
        $scope.loading = true;
        $scope.hidedis = 0;
        $scope.uploaddis = 0;
        $scope.uploadpic = [];
        var uploadPicForSubmit =[];
        var staticUrl = "";
        $scope.uploadalertmess = "";
        $scope.uploadid="";
        $scope.defaultpic = "/static/v4/uc/images/defaultPic.png";
        $scope.staticImg = function(src){
            return uc.imageProcess(src, 'thumb', 80, 60);
        };
        var getOrderList = function () {
            $scope.loading = true;
            Order.get_equity_orders(($scope.currentPage - 1) * 10, 10, $scope.type).then(function (data) {
                $scope.loading = false;
                $scope.list = data.order;
                $scope.hidedis = 1;
                $scope.pages = Common.getPageCount(data.total, 10);
            });
        };
        $scope.cancelone=function(e){
            $scope.uploadpic.splice(e,1);
            uploadPicForSubmit.splice(e.replace(staticUrl),1);
        };
        $scope.upload=function(){
            if(uploadPicForSubmit.length>0){
                Order.confirmOffline($scope.uploadid,uploadPicForSubmit).then(function(data){
                    $scope.uploaddis="0";
                    uploadPicForSubmit = [];
                    $scope.uploadpic= [];
                    uc.modal.alert("上传成功","您的凭证已经上传成功");
                    getOrderList();
                });
            }else{
                $scope.uploadalertmess = "请上传凭证";
            }
        };
        getOrderList();
        $scope.$on("ENSURE_IMG_UPLOAD", function (e, d) {
            $scope.uploaddis = 1;
            $scope.uploadid=d.id;
            $scope.$apply();
        });
        $scope.cancelUpload=function(){
            $scope.uploaddis = 0;
            $scope.uploadpic = [];
            uploadPicForSubmit = [];
            $scope.uploadalertmess = "";
            $scope.uploadid="";
            $scope.$apply();
        };
        $scope.$on("UPLOAD_SUCC", function (e, d) {
            staticUrl = d.static_url;
            uploadPicForSubmit.push(d.image);
            $scope.uploadpic.push(d.static_url + d.image);
            $scope.$apply();
        });
        $scope.$watch("currentPage", function (newValue, oldValue) {
            if (newValue && newValue != oldValue) {
                getOrderList();
            }
        });

        $scope.$watch("type", function (newValue, oldValue) {
            if (newValue && newValue != oldValue) {
                getOrderList();
            }
        });

        $scope.deleteOrder = function (order) {
            uc.modal.confirm('确认删除', '您确定要删除该订单吗？', function () {
                Order.doDelete(order, 1).then(function () {
                    getOrderList();
                    uc.modal.close();
                });
            });
        };

        $scope.$watch('type', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.currentPage = 1;
                $scope.pages = 1;
                getOrderList();
            }
        });
    };
    ucApp.controller("equityOrderCtrl", ['$rootScope','$scope', 'Common', 'Order', function ($rootScope,$scope, Common, Order) {
        orderCtrlInit($rootScope,$scope, Common, Order,0)
    }]);
    ucApp.controller("equityOrderBuyCtrl", ['$rootScope','$scope', 'Common', 'Order', function ($rootScope,$scope, Common, Order) {
        orderCtrlInit($rootScope,$scope, Common, Order,1)
    }]);
})(window, window.angular, angular.module('ucApp'));

(function (window, angular, ucApp) {
    'use strict';
    ucApp.controller("rewardOrderCtrl", ['$rootScope','$scope', 'Common', 'Order', function ($rootScope,$scope, Common, Order) {
        Common.noInvitationCode();
        $scope.currentPage = 1;
        $scope.pages = 1;
        $scope.type = 0;
        $scope.loading = true;
        $scope.moredis = 0;
        $scope.staticImg = function(src){
            return uc.imageProcess(src, 'thumb', 80, 60);
        };
        $scope.isNeedPay = function(order){
            return order.status == '待支付' || order.status == '支付中';
        };
        $scope.showStatusStr = function(statusStr){
            if(statusStr == '待支付' || statusStr == '支付中'){
                return "未支付";
            }
            return statusStr;
        };
        $scope.showLottery = function(obj){
            return Object.keys(obj).length;
            //return Object.prototype.toString.call(obj) == '[object Object]';
        };
        $scope.lotteryWin = function(codeList){
            for (var i = 0; i<codeList.length; i++){
                if (codeList[i].is_win == '1'){
                    return true;
                }
            }
            return false;
        };
        $scope.showLotteryCode = function(codeList){
            var itemsHtml ='';
            if(!codeList || codeList.length == 0){
                return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;该订单下无抽奖号';
            }
            $.each(codeList,function(i,code){
               itemsHtml+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>第'+(i+1)+'个</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>'+code.lottery_code+'</span><br>';
            });
            var html ='\
                <div class="drawing-number">\
                    <div>\
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序  号</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;抽奖号</span>\
                    </div>\
                    <div>\
                        '+itemsHtml+'\
                    </div>\
            </div>';

            return html;

        };
        $scope.lottery_content = '<div class="lottery-rules"><div class="lottery-rules-tit clearfix"> <h2>抽奖规则</h2></div> <ul class="lottery-rules-con"> <li> <span>获得抽奖号</span> <p>购买抽奖回报项时按购买顺序产生抽奖号。</p> </li> <li> <span>开奖日期</span> <p>项目成功结束后的下一个周一开奖。如遇周一为非工作日，则延至周一后的第一个工作日开奖。</p> </li> <li class="asterisk"> <span>中奖号计算方法：</span> <p><em>*</em>开奖日收盘时的上证指数6位数字 & 收盘时的深证成指7位数字，两组数字排列得到的13位数；</p> <p><em>*</em>将此13位数整除以项目结束时总抽奖号个数，得到的余数加1。即得到该项目的中奖号码。</p> <p><em>*</em>如果项目开多个奖，则以项目公示“ 每X个参与者抽取1名中奖用户”中的X作为基数，第N个中奖号码=第一个中奖号码+（N-1）*X</p> <p><em>*</em>如果加值后抽奖号码超过了总抽奖号个数，则将抽奖号码减去抽奖号个数得到新的中奖号码。</p> <p><em>*</em>每个抽奖号只有一次中奖机会，如果抽奖号重复中奖，则将该抽奖号码+1得到新的中奖号码。</p> <p><em>*</em>如遇周末节假日等股市休市情况，收盘指数以上一个交易日数据为准。</p> </li> </ul></div>';
        $scope.isShowLogistics = function(order){
            if(order.item.return_type==4) {
                var isWin = _.where(order.lottery.code_list, {is_win: "1"}).length > 0;
                return ((order.status == '待收货') || (order.status == '已完成')) && (order.item.return_type != 3) && isWin;
            }else {
                return ((order.status == '待收货') || (order.status == '已完成')) && (order.item.return_type != 3);
            }
        };
        $scope.isShowSendOutTime = function(order){
            return order.status == '待发货' || order.status == '已支付';
        };
        $scope.replaceBR = function (str) {
            return str.replace(/\n/g, '<br />');
        };
        var getOrderList = function () {
            $scope.loading = true;
            Order.get_user_Order_list(($scope.currentPage - 1) * 10, 10, $scope.type).then(function (data) {
                $scope.list = data.list;
                $scope.moredis = 1;
                $scope.pages = Math.floor((data.count - 1) / 10) + 1;
                $scope.loading = false;
            });
        };

        getOrderList();
        $scope.$watch("currentPage", function (newValue, oldValue) {
            if (newValue != oldValue) {
                getOrderList();
            }
        });
        $scope.showContactor = function (order) {
            var strArr = [];
            if ($.trim(order.consignee).length > 0) {
                strArr.push('姓名:' + order.consignee);
            }
            if ($.trim(order.mobile).length > 0) {
                strArr.push('联系方式:' + order.mobile);
            }
            if ($.trim(order.email).length > 0) {
                strArr.push('电子邮件:' + order.email);
            }
            var returnStr = '';
            $.each(strArr, function (i, item) {
                returnStr += item + '||';
            });
            if (returnStr.length > 0) {
                return returnStr.substring(0, returnStr.length - 2);
            }
            return "暂无";
        };
        $scope.getexpress = function (order) {
            if (order.expressdisplay == 0) {
                for (var p = 0; p < $scope.list.length; p++) {
                    $scope.list[p].expressdisplay = 0;
                }
                if(order.item.return_type==2){
                    order.expressdisplay = 1;
                    order.expressinfo[0] = order.virtual_delivery;
                    return;
                };
                order.expressdisplay = 1;
                order.expressinfo[0] = "正在查询，请稍后。。。";
                Order.getexpress({orderID: order.orderID}).then(function (data) {
                    if (!data.error) {
                        order.expressinfo = [];
                        if (data.status == 200) {
                            order.expressinfo[0] = "快递公司：" + data.com_name;
                            order.expressinfo[1] = "快递单号：" + data.nu;
                            for (var i = 0; i < data.data.length; i++) {
                                order.expressinfo.push(data.data[i].time + data.data[i].context);
                            }
                        } else {
                            order.expressinfo = [];
                            if(data.com_name&&data.nu){
                                order.expressinfo[0] = "快递公司：" + data.com_name;
                                order.expressinfo[1] = "快递单号：" + data.nu;
                            }

                            if(data.message) {
                                order.expressinfo.push(data.message);
                            }else{
                                order.expressinfo.push("暂时没有为您查询到相应的物流信息");
                            }
                        }
                    }
                });
            }
            else {
                order.expressdisplay = 0;
            }
        };
        $scope.ensureget = function (order) {
            uc.modal.confirm("确认收货", "请在确定得到回报的情况下确认收货", function () {
                Order.ensureget({orderID: order.orderID});
                uc.modal.close();
                getOrderList();
            });
        };
        $scope.deleteOrder = function (order) {
            uc.modal.confirm("删除订单", "您是否确认删除？删除之后，该订单信息将不可找回", function () {
                Order.doDelete(order, 0).then(function () {
                    $scope.list = _.difference($scope.list, order);
                });
                uc.modal.close();
            })
        };

        $scope.$watch('type', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.currentPage = 1;
                $scope.pages = 1;
                getOrderList();
            }
        });
    }]);
})(window, window.angular, angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("launchCtrl",[
        '$rootScope','$scope','Common', 'Project', '$location','$http',
        function($rootScope,$scope,Common, Project, $location,$http){

        Common.noInvitationCode();
        var __project = new Project();
        $scope.loading = true;

        var query = $location.search();
        var type = query.type;
        $scope.tab = type ? type : 1;

        $scope.staticImg = function(src){
            if(src){
                return uc.imageProcess(src, 'thumb', 80, 60);
            }else{
                return '/static/v4/uc/images/lazy1.png';
            }
        };
        var loadData = function(){
            Project.get_user_project_list().then(function (list) {



                if($rootScope.isYSH){
                    $scope.projects = _.filter(list, function(project){return project.type == 2;})
                }else {
                    $scope.projects = _.filter(list, function(project){return project.type == 1;})
                }
                //$scope.projects = list;
                $scope.eq_count = _.filter(list, function(project){return project.type == 2;}).length;
                $scope.rw_count = _.filter(list, function(project){return project.type == 1;}).length;
                $scope.loading = false;
            });


        };
        if($rootScope.user){
            loadData();
        }
        $rootScope.$watch('user',function(newValue,oldValue){
            if(newValue && newValue!=oldValue) {
                loadData();
            }
        });


        $scope.changeTab = function(tab){
            this.tab = tab;
        };

        $scope.projects = [];
        $scope.onDeleteProject = function(project){
            uc.modal.confirm("确认删除", "项目删除后将无法恢复，请确认是否删除?", function(){
                var promise = __project.doDelete(project);
                promise.then(function(){
                    $scope.projects = _.filter($scope.projects, function(item){return item.projectID != project.projectID; });
                    uc.modal.close();
                });
            });
        };


        //获取草稿列表
        $scope.getDraftList = function(){
            //$http({
            //    url: '/uc-draftList?limit=100',
            //    method: 'GET'
            //}).success(function (data) {
            //    if(data.ret==0){
            //        $scope.draftlist = data.data.list;
            //        $scope.tab = 4;
            //    }else{
            //        uc.modal.alert('获取草稿列表失败');
            //    }
            //
            //}).error(function () {
            //    uc.modal.alert('获取草稿列表失败');
            //});
        };

        //删除草稿
        $scope.onDeleteGraft = function(graft){
            uc.modal.confirm("确认删除", "项目删除后将无法恢复，请确认是否删除?", function(){
                $http({
                    url: '/uc-draftDelete?draft_id='+ graft.draft_id,
                    method: 'GET'
                }).success(function (data) {
                    if(data.ret==0){
                        $scope.draftlist = _.filter($scope.draftlist, function(item){
                            return item.draft_id != graft.draft_id;
                        });
                        uc.modal.close();
                    }else{
                        uc.modal.alert('删除草稿失败');
                    }

                }).error(function () {
                    uc.modal.alert('删除草稿失败');
                });
            });
        };


        //删除草稿（老系统）
        $scope.onDeleteGraft_old = function(graft){
            uc.modal.confirm("确认删除", "项目删除后将无法恢复，请确认是否删除?", function(){
                $http({
                    url: '/uc-draftDelete?draft_id='+ graft.project_id,
                    method: 'GET'
                }).success(function (data) {
                    if(data.ret==0){
                        $scope.projects = _.filter($scope.projects, function(item){
                            return item.project_id != graft.project_id;
                        });
                        uc.modal.close();
                    }else{
                        uc.modal.alert('删除草稿失败');
                    }

                }).error(function () {
                    uc.modal.alert('删除草稿失败');
                });
            });
        };

    }]);
})(window, window.angular,angular.module('ucApp'));
(function (window, angular, ucApp) {
    'use strict';
    ucApp.controller("addressCtrl", ['$scope', 'Common', 'User',function ($scope, Common, User) {
            User.get_user_address_list().then(function (data) {
                $scope.addressList = [];
                $scope.loading = false;
                if(data) {
                    $scope.addressList = data;
                }
            });
            Common.noInvitationCode();
            $scope.loading = true;
            $scope.currentAddress = null;
            $scope.showEdit = false;
            $scope.showAddBtn = true
            $scope.removeItem = function (item) {
                uc.modal.confirm("删除地址", "您确定要删除地址吗？删除之后将不可找回", function () {
                    User.remove_address({
                        addressID: item.addressID
                    }).then(function (data) {
                        if (!data.error) {
                            uc.modal.alert('提示信息', "地址删除成功");
                            User.get_user_address_list().then(function (data) {
                                $scope.addressList = data;
                            });
                        }
                    });
                    $scope.addressList = _.difference($scope.addressList, item);
                    $scope.currentAddress = null;
                    $scope.showEdit = false;
                });


            };

            var area = [];
            $scope.province_list = [];
            $scope.city_list = [];

            $scope.$watch('currentAddress.address.province', function (newValue, oldValue) {
                if (newValue && newValue != oldValue) {
                    var data = _.findWhere(area, {
                        'province_name': newValue
                    });
                    if (data) {
                        $scope.city_list = data.city_list;
                        $scope.currentAddress.address.city = $scope.city_list[0];
                    }
                }
            });
            $scope.setDefault = function (item) {
                User.set_default_address({
                    addressID: item.addressID
                }).then(function (data) {
                    if (!data.error) {
                        uc.modal.alert('提示信息', "设置默认地址成功");
                        User.get_user_address_list().then(function (data) {
                            $scope.addressList = data;
                        });
                        $.each($scope.addressList, function (i, data) {
                            if (data.addressID == item.addressID) {
                                data["default"] = 1;
                            } else {
                                data["default"] = 0;
                            }
                        });
                    }
                });

            };
            $scope.beforeModify = function (item) {
                $scope.showAddBtn = false;
                $scope.showEdit = false;
                for (var i = 0; i < $scope.addressList.length; i++) {
                    $scope.addressList[i].showMOD = 0;
                }
                $scope.currentAddress = $.extend({}, item);
                var address = $.extend({}, item.address);
                $scope.currentAddress.address = address;
                item.showMOD = 1;
                var e = document.getElementsByClassName("siteIlB_box")[0];
                e.scrollTop = e.scrollHeight;
            };
            $scope.beforeAdd = function () {
                for (var i = 0; i < $scope.addressList.length; i++) {
                    $scope.addressList[i].showMOD = 0;
                }
                $scope.currentAddress = {
                    address: {
                        province: $scope.province_list[0],
                        city: $scope.city_list[0]
                    }
                };
                $scope.showEdit = true;
                $scope.showAddBtn = false;
                setTimeout(function () {
                    document.body.scrollTop = document.body.scrollTop + 300
                }, 200);
            };

            $scope.add = function () {

                var addr = $scope.currentAddress;
                if (!$scope.currentAddress.postcode) {
                    delete addr.postcode
                }

                User.add_address(addr).then(function (result) {
                    if (!result.error) {
                        uc.modal.alert('提示信息', "地址添加成功");
                        $scope.showEdit = false;
                        User.get_user_address_list().then(function (data) {
                            $scope.addressList = data;
                        })
                    }
                });
            };
            $scope.modify = function () {
                if (!$scope.currentAddress.postcode) {
                    delete $scope.currentAddress.postcode;
                }
                User.mod_address($scope.currentAddress).then(function (data) {
                    if (!data.error) {
                        $scope.showEdit = false;
                        $scope.showAddBtn = true;
                        User.get_user_address_list().then(function (data) {
                            $scope.addressList = data;
                        });
                    }
                    document.getElementsByClassName("new_shdzH3")[0].innerHTML = "增加地址"
                });
            };
            $scope.submit = function () {
                $('[validation]').blur();
                if($('[invalid_data]').length>0){
                    return false;
                }
                if (!$scope.currentAddress.addressID) {
                    $scope.add();
                } else {
                    $scope.modify();
                    $scope.showEdit = false;
                }
            };
            $scope.cancel = function () {
                for (var i = 0; i < $scope.addressList.length; i++) {
                    $scope.addressList[i].showMOD = 0;
                }
                $scope.currentAddress = null;
                $scope.showEdit = false;
                $scope.showAddBtn = true;
            };
        }
    ]);
})(window, window.angular, angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("bindCardCtrl",['$scope','User','$rootScope', 'Common', function($scope, User, $rootScope, Common){

        function init(){
            $scope.type = 1;
            if($rootScope.user.ext_bank){

                $scope.account_name = $rootScope.user.ext_bank.account_name || '';
                $scope.branch = $rootScope.user.ext_bank.bank_name || '';
                $scope.province = $rootScope.user.ext_bank.province;
                $scope.city = $rootScope.user.ext_bank.bank_address || '';
                $scope.card_no = $rootScope.user.ext_bank.card_no || '';

                $scope.type = 2;
            }
        }

        if($rootScope.user){

            init();
        }else{
            $scope.$on("UserInfoLoaded", function(){
                init();

            });
        }



        $scope.gotoIdCard = function(){
            Common.redirect('user_center.idcard');
        };
        $scope.gotoBasicInfo = function(){
            Common.redirect('user_center.userinfo');
        };


        $scope.submit = function(){
            $scope.$broadcast("VALIDATE");


            var has_error = false;
            $(".frm").find("input,select").each(function(){
                if($(this).is('[validation]')){
                    var invalid = $(this).attr('invalid_data');
                    if(invalid){
                        has_error = true;
                    }
                }

            });
            console.log($scope.province);
            console.log($scope.city);
            if(!has_error){
                var promise = User.bindcard($rootScope.user.user_id, $scope.city, $scope.province, $scope.branch, $scope.card_no, $scope.account_name);
                promise.then(function(data){
                    if(data) {
                        if(!$rootScope.user.ext_bank){
                            $rootScope.user.ext_bank = {};
                        }
                        $rootScope.user.ext_bank.account_name = $scope.account_name;
                        $rootScope.user.ext_bank.bank_name = $scope.branch;
                        $rootScope.user.ext_bank.province = $scope.province;
                        $rootScope.user.ext_bank.bank_address = $scope.city;
                        $rootScope.user.ext_bank.card_no = $scope.card_no;
                        $scope.type = 2;
                    }
                });
            }
        };

        $scope.modify = function(){
            $scope.type = 1;
        };
    }]);
})(window, window.angular,angular.module('ucApp'));
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("changePasswordCtrl",['$scope','Common','User',function($scope,Common,User){
        Common.noInvitationCode();
        $scope.password ={
            oldPwd:'',
            newPwd1:'',
            newPwd2:''
        };
        $scope.submit = function(){
            $('input[validation]').blur();
            if($('input[invalid_data]').length==0){
                if($scope.password.oldPwd == $scope.password.newPwd1){
                    uc.modal.alert('信息提示','新密码不能与旧密码相同！');
                }
                else {
                    User.change_password({original_pwd:$scope.password.oldPwd,re_pwd:$scope.password.newPwd1,pwd:$scope.password.newPwd1}).then(function(data){
                        if(!data.error){
                            uc.modal.alert('信息提示','密码修改成功！');
                            $scope.password.oldPwd='';
                            $scope.password.newPwd1='';
                            $scope.password.newPwd2='';
                        }
                    });
                }
            }
        };
    }]);
})(window, window.angular,angular.module('ucApp'));
(function (window, angular, ucApp) {

    ucApp.controller("idcardCtrl", ['$scope', 'Common', 'User', function ($scope, Common, User) {
        Common.noInvitationCode();
        $scope.buildNumArray = Common.buildNumArray;
        $scope.redirect = Common.redirect;
        $scope.currentYear = new Date().getFullYear();
        $scope.index = Common.AUTH_TYPE.IDCARD;
        $scope.headerUrl = uc.static.DEFAULT_UPLOAD_IMAGE;
        $scope.sex = [{
            text: '男',
            value: 1
        }, {
            text: '女',
            value: 0
        }];
        $scope.local = [{
            text: '香港',
            value: 1
        }, {
            text: '澳门',
            value: 2
        }, {
            text: '台湾',
            value: 3
        }];
        $scope.title = 0;
        $scope.index = 0;
        $scope.loading = true;
        var afterGetAuth = function (data) {
            $scope.loading = false;
            $scope.finishShow = {
                name: '',
                number: ''
            };
            switch (data.status) {
                case 1:
                    $scope.index = 3;
                    $scope.finishShow = {
                        name: data.auth_info.true_name,
                        number: data.auth_info.card
                    };
                    break;
                case 2:
                    $scope.index = 5;
                    $scope.finishShow = {
                        name: data.auth_info.true_name,
                        number: data.auth_info.card
                    };
                    break;
                case 3:
                    $scope.index = 4;
                    break;
                case 4:
                    $scope.index = 6;
                    break;
                default :
                    $scope.index = 1;
                    break;
            }
        };
        User.get_auth().then(afterGetAuth);

        $scope.$watch('index', function (newValue, oldValue) {
            if (newValue == Common.AUTH_TYPE.IDCARD) {
                $scope.card = {
                    name: '',
                    idcard: ''
                };
            }
            ;
            if (newValue == Common.AUTH_TYPE.PASSPORT) {
                $scope.passport = {
                    image: uc.static.DEFAULT_UPLOAD_IMAGE
                };
                $scope.passport.sex = 1;
                $scope.passport.local = 1;
            }
            ;
        });

        $scope.saveIdCard = function () {
            $('#idCardForm input').blur();
            if ($('#idCardForm [invalid_data]').length == 0) {
                var id = {
                    type: 0,
                    idCard: $scope.card.idCard,
                    realName: $scope.card.name
                };
                User.user_auth(id).then(function (data) {
                    if (!data.error) {
                        if(data.status == 4){
                            $scope.index = 6;
                        }else {
                            User.get_auth().then(afterGetAuth);
                        }
                    }
                });
            }
        };
        $scope.savePassport = function () {
            $('#passportForm input').blur();
            $('#passportForm select').blur();
            if ($('#passportForm [invalid_data]').length == 0 && $scope.headerUrl != uc.static.DEFAULT_UPLOAD_IMAGE) {
                var pass = $scope.passport;
                var startTime = moment( new Date(pass.startyear,parseInt(pass.startmonth,10)-1,pass.startday)).format('YYYY-MM-DD') ;
                var endTime =  moment( new Date(pass.endyear,parseInt(pass.endmonth,10)-1,pass.endday)).format('YYYY-MM-DD') ;
                var birthday = moment( new Date(pass.year,parseInt(pass.month,10)-1,pass.day)).format('YYYY-MM-DD') ;
                User.user_auth({
                    type: 1,
                    sex: pass.sex,
                    realName: pass.name,
                    birthday: birthday,
                    start:startTime ,
                    end: endTime,
                    pass: pass.id,
                    hmt: pass.local,
                    hmt_img: [$scope.headerUrl]
                }).then(function (data) {
                    if (!data.error) {
                        User.get_auth().then(afterGetAuth);
                    }
                })
            }
            else if ($('#passportForm [invalid_data]').length == 0 && $scope.headerUrl == uc.static.DEFAULT_UPLOAD_IMAGE) {
                uc.modal.alert("提示信息", "请上传证件照片");
            }
        };
    }]);
})(window, window.angular, angular.module('ucApp'));
(function (window, angular, ucApp) {
    //'use strict';
    angular.module('ucApp')
    ucApp.controller("userinfoCtrl", ['$rootScope', '$scope', '$interval', 'Common', 'User', function ($rootScope, $scope, $interval, Common, User) {
        Common.noInvitationCode();
        $scope.buildNumArray = Common.buildNumArray;
        var area = [];
        $scope.province_list = [];
        $scope.city_list = [];

        $scope.$on("ADDR_CITY_CHANGED", function (event, data) {
            $scope.userinfo.province = data.province;
            $scope.userinfo.city = data.city;
        });
        $scope.getActivateEmailURL = function(email){
            return uc.getActivateEmailURL(email);
        };

        $scope.showActivateWindow = function(email){
            User.resendActivateEmail(email).then(function(data){
                if(data.show_email) {
                    showValidEmailWindow('激活邮箱', data.show_email, data.resend_url);
                }
            });
        };

        var interval = $interval(function () {
            if ($rootScope.user) {
                $scope.userinfo = {
                    mobile: $rootScope.user.mobile,
                    email : $rootScope.user.email ? $rootScope.user.email:'',
                    email_status: $rootScope.user.email_status,
                    nickname: $rootScope.user.name,
                    sex: $rootScope.user.sex,
                    province: $rootScope.user.location.province? $rootScope.user.location.province:'',
                    city: $rootScope.user.location.city? $rootScope.user.location.city:'',
                    year: $rootScope.user.year,
                    month: $rootScope.user.month,
                    day: $rootScope.user.day,
                    introduction: $rootScope.user.introduction,
                    csrf_token: $rootScope.user.csrf_token,
                };
                $interval.cancel(interval);
            }
        }, 100);
        $scope.sex = [{
            text: '男',
            value: 1
        }, {
            text: '女',
            value: 0
        }, {
            text: '保密',
            value: -1
        }];

        $scope.gotoIdCard = function(){
            Common.redirect('user_center.idcard');
        };

        $scope.$watch('userinfo.province', function (newValue, oldValue) {
            if (newValue && newValue != oldValue) {
                var data = _.findWhere(area, {'province_name': newValue});
                if (data) {
                    $scope.city_list = data.city_list;
                    $scope.userinfo.city = $scope.city_list[0];
                }
            }
        });
        $scope.$watch('userinfo.mobile', function (newValue, oldValue) {
            if (newValue && newValue != oldValue) {
                $rootScope.user.mobile = newValue;
            }
        });
        $scope.submit = function (elem) {
            $('input[validation]').blur();
            $('select[validation]').blur();
            if ($('[invalid_data]').length > 0) {
                return false;
            }
            $(elem).attr('disabled','disabled').val('处理中...');
            var tempuserinfo = {
                province: $scope.userinfo.province?$scope.userinfo.province:'',
                city: $scope.userinfo.city?$scope.userinfo.city:'',
                mobile: $scope.userinfo.mobile,
                sex: $scope.userinfo.sex,
                intro: $scope.userinfo.introduction,
                csrf_token: $scope.userinfo.csrf_token,
            };
            if (($rootScope.user.name != $scope.userinfo.nickname) && ($rootScope.user.name)) {
                tempuserinfo.nickname = $scope.userinfo.nickname
            }
            User.save_userinfo(tempuserinfo).then(function (data) {
                $(elem).removeAttr('disabled').val('保存');
                if(!data.errno){
                    uc.modal.alert('信息提示','保存成功！');
                    User.get_userinfo().then(function (data) {
                        if (data) {
                            $rootScope.user = data;
                        }
                    });
                }
            });
        }
    }]);
})(window, window.angular, angular.module('ucApp'));