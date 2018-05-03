(function (ng) {

    function ie7ConfigProvider() {
        this._hash = {};
        this.init();
    }

    ie7ConfigProvider.prototype.init = function () {
        var rootElement = document.getElementById('ng-app');
        this.set('enabled', !!ng.element(rootElement).length);
    };

    ie7ConfigProvider.prototype.set = function (prop, val) {
        this._hash[prop] = val;
    };

    ie7ConfigProvider.prototype.get = function (prop) {
        return this._hash[prop];
    };

    ie7ConfigProvider.prototype.$get = function () {
        return this._hash;
    };

    function switchSce(ie7ConfigProvider, $sceProvider) {
        var enable = $sceProvider.enabled();
        if (ie7ConfigProvider.get('enabled')) {
            enable = false;
        }
        $sceProvider.enabled(enable);
    }

    function $animatePatch(ie7Config, $$asyncCallback, $animate) {
        function async(fn) {
            fn && $$asyncCallback(fn);
        }

        function addClass(element, className, done) {
            ng.element(element).addClass(className);
            async(done);
        }

        function removeClass(element, className, done) {
            ng.element(element).removeClass(className);
            async(done);
        }

        if (ie7Config.enabled) {
            $animate.addClass = addClass;
            $animate.removeClass = removeClass;
        }
    }

    ng
        .module('ie7-support', [])
        .provider('ie7Config', ie7ConfigProvider)
        .config(['ie7ConfigProvider', '$sceProvider', switchSce])
        .run(['ie7Config', '$$asyncCallback', '$animate', $animatePatch]);

}(angular));

(function(window, angular) {
    'use strict';

    setInterval(function(){
        window.document.title = '浼楃缃�-椤圭洰鍙戣捣';
    }, 200);
    window.onload=function(){
        var elem = document.getElementById('ng-app');
        angular.bootstrap(elem, ['launchApp']);
    };

    function loadModule($locationProvider,$stateProvider,$urlRouterProvider,$rootScopeProvider) {
        $rootScopeProvider.digestTtl(1000);
        $stateProvider
            .state("ProjectLaunch", {
                url:"/project-launch",
                controller: 'mainCtrl',
                templateUrl: uc.siteTmplUrl("../views/main.html")
            })
            .state("ProjectLaunch.BasicInfo", {
                url:"/basic-info",
                controller: 'BasicInfoCtrl',
                templateUrl: uc.siteTmplUrl("../views/basic-info.html")
            })
            .state("ProjectLaunch.ProjectInfo", {
                url:"/project-info",
                controller: 'ProjectInfoCtrl',
                templateUrl: uc.siteTmplUrl("../views/project-info.html")
            })
            .state("ProjectLaunch.DetailInfo", {
                url:"/detail-info",
                controller: 'DetailInfoCtrl',
                templateUrl: uc.siteTmplUrl("../views/detail-info.html")
            })
            .state("ProjectLaunch.Rewards", {
                url:"/rewards",
                controller: 'RewardsCtrl',
                templateUrl: uc.siteTmplUrl("../views/rewards.html")
            })
            .state("ProjectLaunch.Preview", {
                url:"/preview",
                controller: 'PreviewCtrl',
                templateUrl: uc.siteTmplUrl("../views/preview.html")
            })
            .state("ProjectLaunch.Contract", {
                url:"/contract",
                controller: 'ContractCtrl',
                templateUrl: uc.siteTmplUrl("../views/contract.html")
            })
            .state("Start", {
                url:"/start",
                controller: 'StartCtrl',
                templateUrl: uc.siteTmplUrl("../views/start.html")
            })
            .state("Start2", {
                url:"/start2",
                controller: 'Start2Ctrl',
                templateUrl: uc.siteTmplUrl("../views/start2.html")
            })
            .state("Success", {
                url:"/success",
                controller: 'SuccessCtrl',
                templateUrl: uc.siteTmplUrl("../views/success.html")
            })
            .state("Equity", {
                url:"/equity",
                controller: 'EquityCtrl',
                templateUrl: uc.siteTmplUrl("../views/equity.html")
            });
        //$urlRouterProvider.otherwise('/user-center');
        //$locationProvider.html5Mode(true);
    }

    if($.browser.msie && parseInt($.browser.version, 10) == 7){
        angular.module('launchApp', ['ui.router','ie7-support']).config(['$locationProvider','$stateProvider','$urlRouterProvider','$rootScopeProvider', loadModule])
            .run(['$rootScope', '$urlRouter', '$state', '$timeout', function ($rootScope, $urlRouter, $state, $timeout) {
                $rootScope.$on('$stateChangeStart', function(e, newUrl, oldUrl) {
                    //e.preventDefault();
                    if (e && $('.uploadify').length>0) {
                        $('.uploadify').uploadify('destroy');
                    }
                });
                $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl) {
                    // Prevent $urlRouter's default handler from firing
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

    }else{
         angular.module('launchApp', ['ui.router','ngAnimate']).config(['$locationProvider','$stateProvider','$urlRouterProvider','$rootScopeProvider', loadModule]);


    }

})(window, window.angular);

(function(window) {
    'use strict';
    window.uc= {
        siteTmplUrl : function(url){
            url = url.split("\/views/").pop();
            return "/tmpl?file=" + url + "&app=launch";
        },
        static : {
            JS_PATH :'/static/v4/uc/js/',
            UPLOAD_SWF_PATH : '/static/v4/uc/js/uploadify.swf',
            COPY_SWF_PATH : '/static/v4/uc/js/ZeroClipboard.swf',
            isBeforeIE9 : function(){
                var agent = navigator.userAgent.toLowerCase() ;
                /*ie9浠ヤ笅ie娴忚鍣ㄤ娇鐢�*/
                return agent.indexOf("msie") > 0 && !(-[1,]);
            }
        },
        serviceUrl : function(url){
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
        psvc_url : function(){
            var baseUrl = "/prpc/";
            var urlPrts = [];
            for(var i = 0; i < arguments.length; i++){
                var url = arguments[i].url.replace(/\//g, "-");
                var query = uc.build_query(arguments[i].data);
                if(url.indexOf('&') === -1 && query){
                    url += "&";
                }
                url += query;
                url = url.replace(/[&?=]/g, "-");
                if(arguments[i].name){
                    url = arguments[i].name + "," + url;
                }
                urlPrts.push(url);
            }
            return baseUrl + urlPrts.join("/");
        },

        build_query : function(params){
            var p = [];
            for(var key in params){
                p.push(key + "=" + (params[key] ? params[key] : ""));
            }
            return p.join('&');
        },
        modal :{
            pay : function(title, content, callback, cancelCallback){
                var modal = $('<div class="modal pay fade">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title">' + title + '</h4>\
                            </div>\
                            <div class="modal-body">' + content + '</div>\
                            <div class="modal-footer">\
                                <button type="button" class="modal-ok">鎴戝凡缁忓畬鎴愭敮浠�</button>\
                                <button type="button" class="modal-cancel">鏇存崲鏀粯鏂瑰紡</button>\
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
                    if(cancelCallback)
                        cancelCallback();
                    if(uc.static.isBeforeIE9()){
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
                        $(this).attr('disabled','disabled');
                        $(this).text('澶勭悊涓�...');
                        callback();
                    });
                }
            },
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
                                <button type="button" class="modal-cancel">鍙栨秷</button>\
                                <button type="button" class="modal-ok">纭</button>\
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
                    if(uc.static.isBeforeIE9()){
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
                        $(this).attr('disabled','disabled');
                        $(this).text('澶勭悊涓�...');
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
                                <button type="button" class="modal-ok">纭畾</button>\
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
                    if(uc.static.isBeforeIE9()){
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
                    if(callback) {
                        $(this).attr('disabled','disabled');
                        $(this).text('澶勭悊涓�...');
                        callback();
                    }
                    close();
                });
            },
            close:function() {
                if(uc.static.isBeforeIE9()){
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
})(window);

(function(window, angular,launchApp) {
	'use strict';
	launchApp.controller("BasicInfoCtrl",['$scope', 'ProjectLaunch','$location','Forms', 'FormItem', '$rootScope', 'Address',

		function($scope, ProjectLaunch, $location,Forms, FormItem, $rootScope, Address){
			if(window.location.href.match("yuanshihui")){
				window.location.href = window.location.href.replace("yuanshihui", "zhongchou");
			}
			setInterval(function(){
			}, 50);
			var project = ProjectLaunch.getProject();
			//if(!project.commSuccess)
			//	$rootScope.loading = 1;

			var query = $location.search();
			$scope.projectId = query.projectID;

			$scope.form_person = Forms.basic_person;
			$scope.form_org = Forms.basic_org;


			$scope.uploadFormData = {
				dealID: $scope.projectId,
				type: '8'
			};

			//鍒ゆ柇褰撳墠椤垫槸涓嶆槸鍩烘湰淇℃伅椤�

			//鍒濆鍔犺浇

			var commSuccess = project.get_comm_status();


			if(commSuccess != 'OK')
			{$rootScope.loading = 1;}

			$scope.personStatus = eval(project.get_person_status());
			$scope.orgStatus = eval(project.get_org_status());


			//var basicSuccess = project.get_basic_status();

			//鍩烘湰淇℃伅椤靛姞杞�
			$scope.$on("BASIC_HTTP", function(event, basicInformation){

				project.get_page_step("basicInfo");
				$scope.uploadFormData = {
					dealID: $scope.projectId,
					type: '8'
				};

				$scope.form_person.personName.value = basicInformation.true_name;
				$scope.form_person.idCard.value = basicInformation.id_card;
				$scope.form_person.mobile.value = basicInformation.mobile;
                $scope.form_person.address.value = basicInformation.address;
                $scope.form_person.callName.value = basicInformation.callName;
                $scope.form_person.callTel.value = basicInformation.callTel;

				$scope.province = basicInformation.province;
				$scope.city = basicInformation.city;

				Forms.basic_person.addr.city = $scope.city;
				Forms.basic_person.addr.province = $scope.province;

				$scope.form_org.org_name.value = basicInformation.org_name;
				$scope.form_org.org_licence.value = basicInformation.org_licence;
				$scope.form_org.legal_person.value = basicInformation.legal_person;
				$scope.form_org.org_address.value = basicInformation.org_address;
				$scope.form_org.contact_name.value = basicInformation.contact_name;
				$scope.form_org.contact_mobile.value = basicInformation.contact_mobile;
				$scope.form_org.org_call_name.value = basicInformation.org_call_name;
				$scope.form_org.org_call_address.value = basicInformation.org_call_address;
				$scope.form_org.org_call_tel.value = basicInformation.org_call_tel;


				//寰楀埌椤圭洰ID
				//$scope.projectId = basicInformation.dealID;

				//寰楀埌韬唤绫诲瀷锛�0涓轰釜浜猴紝1涓轰紒涓氾紝榛樿涓轰紒涓�
				$scope.is_org = basicInformation.is_org;
				if($scope.is_org){
					$scope.form = Forms.basic_org;
				}else{
					$scope.form = Forms.basic_person;
				}

				//寰楀埌涓汉韬唤淇℃伅
				//缁欏熀鏈俊鎭〉浼犱釜浜烘暟鎹�

				$scope.personStatus = eval(basicInformation.person_status);
				$scope.orgStatus = eval(basicInformation.org_status);

				//寰楀埌琛屼笟鍒嗙被缂栧彿锛屽搴旇涓氬垎绫绘暟缁勯噷鐨勪綅缃紝榛樿鍊间负0锛岃〃绀哄彇绗竴涓�
				//$scope.cate_id = basicInformation.categoryID;

				//鏁扮粍锛屼釜浜洪€夐」鐨勮涓氬垎绫伙紝鍖呮嫭鍚嶇О锛屽唴瀹癸紝闇€瑕佷笂浼犵殑璇佷功
				$scope.cate_person = basicInformation.cate_list_person;

				//鏁扮粍锛屼紒涓氶€夐」鐨勮涓氬垎绫伙紝鍖呮嫭鍚嶇О锛屽唴瀹癸紝闇€瑕佷笂浼犵殑璇佷功
				$scope.cate_org = basicInformation.cate_list_org;

				//鐢ㄦ埛涓婁紶鐨勮瘉涔﹀垪琛紝鍒濆涓虹┖
				//$scope.cert_list = basicInformation.cert_list;

				//鏁扮粍锛屾湇鍔¤垂鐜囧垪琛紝姣忎竴璐圭巼鍖呭惈锛屽唴瀹癸紝璐圭巼鍊硷紝id
				//$scope.fees_list = basicInformation.fees_list;

				//鐢ㄦ埛閫変腑鐨勬湇鍔¤垂鐜囧€�
				//$scope.form.fees.fees_rate = basicInformation.fees_rate;

				$scope.currentCatePerson = basicInformation.currentCatePerson;
				$scope.currentCateOrg = basicInformation.currentCateOrg;


				//$scope.form.fees.fees_id = basicInformation.fees_id;

				if(basicInformation.is_org == 0){
					$scope.cate_id = basicInformation.currentCatePerson.categoryID;
					$scope.cid = basicInformation.currentCatePerson.categoryID;
				}

				if(basicInformation.is_org == 1){
					$scope.cate_id = basicInformation.currentCateOrg.categoryID;
					$scope.cid = basicInformation.currentCateOrg.categoryID;
				}

				//

				Forms.basic_person.certs.cert_list_person = basicInformation.cert_list_person;
				//Forms.basic_person.certs.cert_list_person =basicInformation.cert_list_person;

				Forms.basic_org.certs.cert_list_org = basicInformation.cert_list_org;

				$rootScope.loading = 0;

				//$scope.$apply();



			});
			if (commSuccess != "OK"){project.get_basic_http($scope.projectId);}


			$scope.$on("BASIC_LOAD",function(event, basicInfoTotal){
				project.get_page_step("basicInfo");

				$scope.uploadFormData = {
					dealID: $scope.projectId,
					type: '8'
				};

				$scope.form_org.org_name.value =basicInfoTotal.org_name;
				$scope.form_org.org_licence.value=basicInfoTotal.org_licence;
				$scope.form_org.org_address.value =basicInfoTotal.org_address;
				$scope.form_org.legal_person.value =basicInfoTotal.legal_person;
				$scope.form_org.contact_name.value=basicInfoTotal.contact_name;
				$scope.form_org.contact_mobile.value =basicInfoTotal.contact_mobile;
                $scope.form_org.org_call_name.value = basicInfoTotal.org_call_name;
                $scope.form_org.org_call_address.value = basicInfoTotal.org_call_address;
                $scope.form_org.org_call_tel.value = basicInfoTotal.org_call_tel;


				$scope.is_org =basicInfoTotal.is_org;
				if($scope.is_org){
					$scope.form = Forms.basic_org;
					//Forms.basic_org.fees.fees_id =basicInfoTotal.fees_id;
				}else{
					$scope.form = Forms.basic_person;
					//Forms.basic_person.fees.fees_id =basicInfoTotal.fees_id;
					//Forms.basic_person.fees.fees_rate=basicInfoTotal.fees_rate;
				}
				$scope.cate_id =basicInfoTotal.categoryID;

				//$scope.cert_list =basicInfoTotal.certs;
				Forms.basic_person.certs.cert_list_person = basicInfoTotal.cert_list_person;
				Forms.basic_org.certs.cert_list_org =basicInfoTotal.cert_list_org;


				$scope.form_org.org_name.value =basicInfoTotal.org_name;
				$scope.form_org.org_licence.value=basicInfoTotal.org_licence;
				$scope.form_org.org_address.value =basicInfoTotal.org_address;
				$scope.form_org.legal_person.value =basicInfoTotal.legal_person;
				$scope.form_org.contact_name.value=basicInfoTotal.contact_name;
				$scope.form_org.contact_mobile.value =basicInfoTotal.contact_mobile;
                $scope.form_org.org_call_name.value = basicInfoTotal.org_call_name;
                $scope.form_org.org_call_address.value = basicInfoTotal.org_call_address;
                $scope.form_org.org_call_tel.value = basicInfoTotal.org_call_tel;

				$scope.form_person.idCard.value =basicInfoTotal.id_card;
				$scope.form_person.personName.value = basicInfoTotal.true_name;
				$scope.form_person.mobile.value =basicInfoTotal.mobile;
				$scope.form_person.callName.value =basicInfoTotal.callName;
				$scope.form_person.callTel.value =basicInfoTotal.callTel;

				$scope.province =basicInfoTotal.province;
				$scope.city =basicInfoTotal.city;

				Forms.basic_person.addr.city = $scope.city;
				Forms.basic_person.addr.province = $scope.province;

				$scope.form_person.address.value =basicInfoTotal.address;

				$scope.cate_person =basicInfoTotal.cate_list_person;
				$scope.cate_org =basicInfoTotal.cate_list_org;
				//$scope.cert_list =basicInfoTotal.cert_list;
				//$scope.fees_list =basicInfoTotal.fees_list;
				//
				//$scope.form.fees.fees_rate = basicInfoTotal.fees_rate;
				//$scope.form.fees.fees_id = basicInfoTotal.fees_id;


				$scope.currentCatePerson=basicInfoTotal.currentCatePerson;
				$scope.currentCateOrg =basicInfoTotal.currentCateOrg;
				$scope.$apply();

			});
			if (commSuccess == "OK"){project.get_basic_info()};


			$scope.saveDraft = function(){

				console.log("sync basic-info data");
				if(!$scope.form){return;}
				var basicInfoDraft ={
					is_org:$scope.is_org,
					categoryID:$scope.cate_id,
					//fees_id:$scope.form.fees.fees_id,
					cert_list_person:Forms.basic_person.certs.cert_list_person,
					cert_list_org:Forms.basic_org.certs.cert_list_org,

					org_name:$scope.form_org.org_name.value,
					org_licence:$scope.form_org.org_licence.value,
					org_address:$scope.form_org.org_address.value,
					legal_person:$scope.form_org.legal_person.value,
					contact_name:$scope.form_org.contact_name.value,
					contact_mobile:$scope.form_org.contact_mobile.value,
                    org_call_name:$scope.form_org.org_call_name.value,
                    org_call_address:$scope.form_org.org_call_address.value,
                    org_call_tel:$scope.form_org.org_call_tel.value,

					id_card:$scope.form_person.idCard.value,
					true_name:$scope.form_person.personName.value,
					mobile:$scope.form_person.mobile.value,
                    callName:$scope.form_person.callName.value,
                    callTel:$scope.form_person.callTel.value,

					province:Forms.basic_person.addr.province,
					city:Forms.basic_person.addr.city,

					address:$scope.form_person.address.value,

					cate_list_person:$scope.cate_person,

					cate_list_org:$scope.cate_org,

					//cert_list:$scope.cert_list,
					//
					//fees_list:$scope.fees_list,
					//
					//fees_rate:$scope.form.fees.fees_rate,
					currentCatePerson:$scope.currentCatePerson,
					currentCateOrg:$scope.currentCateOrg
				};
				project.save_basic_total(basicInfoDraft);


			};

			var I = null;
			I = setInterval($scope.saveDraft,1000);




			//淇濆瓨鑽夌ǹ


			//閫夋嫨涓汉鎴栬€呬紒涓�
			$scope.onClickIdentity = function(tab){
				if (tab === 'person') {
					$scope.form = Forms.basic_person;
					$scope.is_org = 0;
				}
				if (tab === 'enterprise') {
					$scope.form = Forms.basic_org;
					$scope.is_org = 1;
				}
			};

			//涓汉琛屼笟鍒嗙被閫夋嫨
			$scope.onClickP = function(cateP){

				if(cateP && cateP.name == '鍟嗛摵'){
					return;
				}
				if($scope.cate_id != cateP.categoryID){

					$scope.currentCatePerson = cateP;
					$scope.cate_id = cateP.categoryID;
					Forms.basic_person.certs.cert_list_person = $scope.currentCatePerson.certs;
					_.each(Forms.basic_person.certs.cert_list_person, function(cert){
						cert.url = '';
					});
					$scope.form_person.certs.dirty = false;
					$scope.form_person.certs.invalid = false;

					$scope.form_person.certs.error_msg = "";
					$scope.form_org.certs.dirty = false;
					$scope.form_org.certs.invalid = false;

					$scope.form_org.certs.error_msg = "";
				}
			};


			//浼佷笟琛屼笟鍒嗙被閫夋嫨
			$scope.onClickO = function(cateO){

				if($scope.cate_id != cateO.categoryID){

					$scope.currentCateOrg = cateO;
					$scope.cate_id = cateO.categoryID;

					Forms.basic_org.certs.cert_list_org = $scope.currentCateOrg.certs;
					_.each(Forms.basic_org.certs.cert_list_org, function(cert){
						cert.url = '';
					});
					$scope.form_person.certs.dirty = false;
					$scope.form_person.certs.invalid = false;
					$scope.form_org.certs.dirty = false;
					$scope.form_org.certs.invalid = false;
				}


			};


			//閫夋嫨骞冲彴鏈嶅姟
			//$scope.selectService = function (fees) {
			//	$scope.form.fees.fees_rate = fees.fees_rate;
			//	$scope.form.fees.fees_id = fees.id;
			//};

			//project.get_basic_info();

			$scope.basicNext = function(path){
				$("body, html").animate({scrollTop : 0}, 0)
				$location.path(path);


			};

			function validateCerts(){
				var u_certs = [];
				var certs = Forms.basic_person.certs.cert_list_person;

				if($scope.is_org){
					certs = Forms.basic_org.certs.cert_list_org;
				}
				for (var i = 0; i<certs.length; i++){
					var cert = certs[i];
                    if(!cert.url && cert.check == 0){
						u_certs.push(cert.title);
					}
				}

				if(u_certs.length > 0){
					var m = u_certs.pop();
					if(u_certs.length > 1){

						return "*璇蜂笂浼�" + u_certs.join(",")  + "鍜�" + m;
					}else{

						return "*璇蜂笂浼�" + m ;
					}
				}
				return '';
			}


			function validateAddress(){
				var addr = Forms.basic_person.addr;
				if(addr.province && addr.city){
					return '';
				}
				return '*璇烽€夋嫨鍦板潃';
			}

			function validateCates(){
				if($scope.cate_id){
					return '';
				}
				return '*璇烽€夋嫨琛屼笟鍒嗙被';
			}

			//function validateFees(item){
			//
			//	if(item.fees_rate || item.fees_id){
			//		return '';
			//	}
			//	return '*璇烽€夋嫨骞冲彴鏈嶅姟璐圭巼';
			//}

			function append_validation_rules(form, isOrg){

				form.certs = new FormItem();
				form.cate = new FormItem();
				//form.fees= new FormItem();
				form.certs.validationRule = validateCerts;

				if(!isOrg){
					form.addr = new FormItem();
					form.addr.validationRule = validateAddress;
				}

				form.cate.validationRule = validateCates;
				//form.fees.validationRule = validateFees;
			}


			if(!window.basicInfoFormAppended){
				window.basicInfoFormAppended = true;

				append_validation_rules(Forms.basic_org, true);
				append_validation_rules(Forms.basic_person);
			}


			$scope.$on(Address.Events.ADDR_CITY_CHANGED, function(event, data){
				Forms.basic_person.addr.dirty = true;

				Forms.basic_person.addr.province = data.province;
				Forms.basic_person.addr.city = data.city;
				Forms.basic_person.addr.validate();
				$scope.$apply();
			});

			$scope.$on("UPLOAD_IMAGE", function(event, type){

				if(type == 'cert'){

					setTimeout(function(){
						if($scope.is_org){
							Forms.basic_org.certs.validate(false);
						}else{
							Forms.basic_person.certs.validate(false);
						}

						$scope.$apply();
					}, 10);

				}
			});

			$scope.$on("$destroy", function(){
					clearInterval(I);


					if ($scope.is_org == 0){

						var tmpCerts = [];

						for ( var i = 0; i<Forms.basic_person.certs.cert_list_person.length; i++){
							tmpCerts[i]=
							{
								id:Forms.basic_person.certs.cert_list_person[i].id,
								url:Forms.basic_person.certs.cert_list_person[i].url
							};
						}
						$scope.cert_post = tmpCerts;

					}

					if($scope.is_org == 1 )
					{

						var tmpCerts = [];

						for ( var i = 0; i<Forms.basic_org.certs.cert_list_org.length; i++){
							tmpCerts[i]=
							{
								id:Forms.basic_org.certs.cert_list_org[i].id,
								url:Forms.basic_org.certs.cert_list_org[i].url
							};
						}
						$scope.cert_post = tmpCerts;
					}



					var basicInfoPost ={
						dealID:$scope.projectId,
						is_org:$scope.is_org,
						categoryID:$scope.cate_id||'',
						//fees_id:$scope.form.fees.fees_id||'',
						certs:angular.toJson($scope.cert_post)||'',

						org_name:$scope.form_org.org_name.value||'',
						org_licence:$scope.form_org.org_licence.value||'',
						org_address:$scope.form_org.org_address.value||'',
						legal_person:$scope.form_org.legal_person.value||'',
						contact_name:$scope.form_org.contact_name.value||'',
						contact_mobile:$scope.form_org.contact_mobile.value||'',
                        org_call_name:$scope.form_org.org_call_name.value||'',
                        org_call_address:$scope.form_org.org_call_address.value||'',
                        org_call_tel:$scope.form_org.org_call_tel.value||'',

						id_card:$scope.form_person.idCard.value||'',
						true_name:$scope.form_person.personName.value||'',
						mobile:$scope.form_person.mobile.value||'',
                        callName:$scope.form_person.callName.value||'',
                        callTel:$scope.form_person.callTel.value||'',

						province:Forms.basic_person.addr.province,
						city:Forms.basic_person.addr.city,

						address:$scope.form_person.address.value||''
					};

					var basicInfoSaved ={
						is_org:$scope.is_org,
						categoryID:$scope.cate_id,
						//fees_id:$scope.form.fees.fees_id,
						cert_list_person:Forms.basic_person.certs.cert_list_person,
						cert_list_org:Forms.basic_org.certs.cert_list_org,

						//personStatus:$scope.personStatus,
						//orgStatus:$scope.orgStatus,

						org_name:$scope.form_org.org_name.value,
						org_licence:$scope.form_org.org_licence.value,
						org_address:$scope.form_org.org_address.value,
						legal_person:$scope.form_org.legal_person.value,
						contact_name:$scope.form_org.contact_name.value,
						contact_mobile:$scope.form_org.contact_mobile.value,
                        org_call_name:$scope.form_org.org_call_name.value,
                        org_call_address:$scope.form_org.org_call_address.value,
                        org_call_tel:$scope.form_org.org_call_tel.value,

						id_card:$scope.form_person.idCard.value,
						true_name:$scope.form_person.personName.value,
						mobile:$scope.form_person.mobile.value,
                        callName:$scope.form_person.callName.value,
                        callTel:$scope.form_person.callTel.value,

						province:Forms.basic_person.addr.province,
						city:Forms.basic_person.addr.city,

						address:$scope.form_person.address.value,


						cate_list_person:$scope.cate_person,

						cate_list_org:$scope.cate_org,

						//cert_list:$scope.cert_list,

						//fees_list:$scope.fees_list,
						//
						//fees_rate:$scope.form.fees.fees_rate,
						currentCatePerson:$scope.currentCatePerson,
						currentCateOrg:$scope.currentCateOrg

					};

					var validateResult = true;
					if($scope.is_org){
						validateResult = Forms.validate(Forms.basic_org);
						//Forms.basic_org.certs.dirty = true;
					}else{
						validateResult = Forms.validate(Forms.basic_person);
						//Forms.basic_person.certs.dirty = true;
					}

					if(validateResult){
						$scope.basicChecked = true;
					}

					//$scope.basicChecked = Forms.validate(basic);
					//$scope.basicChecked = true;
					project.save_basic_total(basicInfoSaved);
					//project.submit_basic_info(basicInfoPost);
					project.save_basic_checked($scope.basicChecked);
					project.get_finish_checked();



					setTimeout(function () {
						project.save_draft();
					}, 50);

				}
			);

		}]);
})(window, window.angular,angular.module('launchApp'));
/**
 * Created by zihong on 8/8/15.
 */

(function(window, angular,launchApp) {
  'use strict';
  launchApp.controller("ContractCtrl",['$scope','$location','ProjectLaunch',function($scope,$location, ProjectLaunch){

    var project = ProjectLaunch.getProject();
    //鍒濆鍔犺浇
    var query = $location.search();
    $scope.projectId = query.projectID;


    var d = new Date();
    $scope.year = d.getFullYear();
    $scope.month = d.getMonth()+1;
    $scope.day = d.getDate();

    //var commSuccess = project.get_comm_status();

    $scope.$on("CONTRACT_HTTP", function(event, contractHttp){

      //鍒ゆ柇褰撳墠椤垫槸涓嶆槸棰勮椤�
      $scope.step = 'contract';
      project.get_page_step($scope.step);

      if(contractHttp.currentCatePerson.name != '鍏泭'){
        $scope.channel_fee_person = 3.0;
      }
      if(contractHttp.currentCatePerson.name == '鍏泭'){
        $scope.channel_fee_person = 1.5;
      }
      if(contractHttp.currentCateOrg.name != '鍏泭'){
        $scope.channel_fee_org = 3.0;
      }
      if(contractHttp.currentCateOrg.name == '鍏泭'){
        $scope.channel_fee_org = 1.5;
      }

      $scope.contractNumber = contractHttp.contractNumber;
      $scope.is_org = contractHttp.is_org;
      $scope.personName= contractHttp.personName;
      $scope.id_card =contractHttp.id_card;
      $scope.person_address=contractHttp.person_address;
      $scope.person_mobile=contractHttp.person_mobile;
      $scope.userId= contractHttp.userId;
      $scope.fee_rate= contractHttp.fee_rate;
      $scope.title = contractHttp.title;
      $scope.limit_days =contractHttp.limit_days;
      $scope.funding = contractHttp.funding;
      $scope.itemList = contractHttp.itemList;
      $scope.orgName = contractHttp.orgName;
      $scope.org_address = contractHttp.org_address;
      $scope.org_licence = contractHttp.org_licence;
      $scope.org_boss = contractHttp.org_boss;
      $scope.org_contact = contractHttp.org_contact;
      $scope.org_mobile = contractHttp.org_mobile;
    });
    project.get_contract_http($scope.projectId);

    //鍩烘湰淇℃伅椤靛姞杞�
    //$scope.$on('CONTRACT_GOT',function(event, contract){
    //
    //  //鍒ゆ柇褰撳墠椤垫槸涓嶆槸棰勮椤�
    //  $scope.step = 'contract';
    //  project.get_page_step($scope.step);
    //
    //    $scope.contractNumber = contract.contractNumber;
    //    $scope.is_org = contract.is_org;
    //    $scope.personName=contract.personName;
    //    $scope.id_card =contract.id_card;
    //    $scope.person_mobile= contract.person_mobile;
    //    $scope.userId= contract.userId;
    //    $scope.fee_rate=contract.fee_rate;
    //    $scope.title = contract.title;
    //    $scope.limit_days = contract.limit_days;
    //    $scope.funding = contract.funding;
    //    $scope.itemList = contract.itemList;
    //    $scope.orgName = contract.orgName;
    //    $scope.org_address = contract.org_address;
    //    $scope.org_licence = contract.org_licence;
    //    $scope.org_boss = contract.org_boss;
    //    $scope.org_contact = contract.org_contact;
    //    $scope.org_mobile = contract.org_mobile;
    //
    //
    //});
    //if (commSuccess == "OK"){project.get_contract_info()};
    //
    //$scope.agreeAndSubmit = function(){
    //  //project.agreeAndPublish();
    //}

  }]);
})(window, window.angular,angular.module('launchApp'));

(function(window, angular,launchApp) {
    'use strict';
    launchApp.controller("DetailInfoCtrl",["$http", "$q",'$scope','$location','ProjectLaunch','$rootScope','Common',function($http, $q,$scope,$location, ProjectLaunch,$rootScope,Common){

        var project = ProjectLaunch.getProject();


        function checkLaunchAndShowTips(){
            if(!document.cookie.match("LAUNCHED=1")){
                $(".step-mask").show();
                $(".step1-text").show();
                $(".step1").show();
                $("html, body").animate({ scrollTop: "200px" });
                $(".step1-text .btn1, .step1-text .btn2").click(function(){

                    window.NO_SCROLL = 1;
                    $(".step1-text").hide();
                    $(".step1").hide();
                    $(".step2-text").show();
                    $(".step2").show();
                    $("html, body").animate({ scrollTop: "100px" });
                });

                $(".step2-text .btn1, .step2-text .btn2").click(function(){

                    window.NO_SCROLL = 0;
                    $(".step2-text").hide();
                    $(".step2").hide();
                    $(".step-mask").hide();
                });
            }
            document.cookie = 'LAUNCHED=1';
        }

        $(window).on("scrollstop", function(){

            if(window.NO_SCROLL){return ;}
            var i_top = 90;

            var scroll = document.body.scrollTop;

            var $m = $(".detail-model");
            if(!$m.offset()){
                return;
            }
            function offScreen(){


                var ret =
                    ($m.offset().top + i_top - document.body.scrollTop < 0)  ||
                    ($m.offset().top +  $m.height() - document.body.scrollTop - $(window).height() > 0);
                return ret;
            }
            var initial_offset = 321;
            if(scroll > initial_offset){
                var h = scroll - initial_offset + 100;
                var offSc = offScreen();
                if(offSc){

                    console.log('scroll');
                    $('.detail-model').css('top', h + 'px');
                }

            }else{

                $('.detail-model').css('top', i_top + 'px');
            }
        });

        //鍒濆鍔犺浇
        var query = $location.search();
        $scope.projectId = query.projectID;

        $scope.uploadFormData = {
            dealID: $scope.projectId,
            type: '4'
        };

        //Actions on Video Block
        $scope.videoShow = false;
        $scope.saveVideo = function(vLink){
            if(vLink){
            $scope.videoShow = true;

            var videoPost ={
                dealID:$scope.projectId,
                video_link:vLink
            };

            var promise = Common.httpPost(uc.serviceUrl("project/video?v=3"), videoPost);

            promise.then.call(this, function(data){
                $scope.video_thumb = data.video_thumb;
            })

            }
        };

        $scope.cancelVideo = function(){
            $scope.videoShow = false;
            $scope.video_link = '';
            $scope.video_thumb = '';
        };

        var commSuccess = project.get_comm_status();

        if(commSuccess != 'OK')
        {$rootScope.loading = 1;}

        //var detailSuccess = project.get_detail_status();

        $scope.$on("DETAIL_HTTP", function(event, detailInformation){


            //鍒ゆ柇褰撳墠椤垫槸涓嶆槸璇︾粏淇℃伅椤�
            $scope.step = 'detailInfo';
            project.get_page_step($scope.step);

            if(detailInformation.video_thumb){
                $scope.videoShow = true;
            }

            //寰楀埌鍩烘湰淇℃伅
            $scope.detailInformation = detailInformation;
            $scope.video_link = $scope.detailInformation.video_link;
            $scope.video_thumb = $scope.detailInformation.video_thumb;
            $scope.blockList = $scope.detailInformation.new_desc;

            $rootScope.loading = 0;

            //$scope.$apply();

            checkLaunchAndShowTips();

        });
        if (commSuccess != "OK"){project.get_detail_http($scope.projectId)}

        $scope.saveDraft = function(){
            console.log('save-back-detail-info');
            var detailInfoDraft ={
                video_link:$scope.video_link,
                video_thumb:$scope.video_thumb,
                new_desc:$scope.blockList
            };
            project.save_detail_total(detailInfoDraft);


        };

        var I = null;
        I = setInterval($scope.saveDraft,1000);


        //鍩烘湰淇℃伅椤靛姞杞�
        $scope.$on("DETAIL_LOAD", function(event, detailInformation){

            //鍒ゆ柇褰撳墠椤垫槸涓嶆槸璇︾粏淇℃伅椤�
            $scope.step = 'detailInfo';
            project.get_page_step($scope.step);

            //寰楀埌璇︾粏淇℃伅

            if(detailInformation.video_thumb){
                $scope.videoShow = true;
            }

            $scope.video_link = detailInformation.video_link;
            $scope.video_thumb = detailInformation.video_thumb;
            $scope.blockList = detailInformation.new_desc;
            $scope.$apply();


            checkLaunchAndShowTips();
            //$scope.videoShow = detailInformation.videoShow;
        });
        if (commSuccess == "OK"){project.get_detail_info()};

        $scope.addBlock = function(blockType){
            $scope.$on("GET_BLOCKS", function (event,blocks) {
                $scope.blockList = blocks;
            });
            project.add_block(blockType);
            $("body, html").animate({scrollTop : document.documentElement.offsetHeight}, 0)
        };


            $scope.$on('BLOCK_NUMBER',function(event,block_num){
                $scope.block_num = block_num;
            })

            $scope.$on("SAVE_BLOCK", function(event, saved_blocks){
                $scope.blockList = saved_blocks;
            });

            $scope.$on("EDIT_BLOCK", function(event, edited_blocks){
                $scope.blockList = edited_blocks;
            });

        //get deleted blockList
        $scope.$on("DELETE_BLOCK", function(event, deleted_blocks){
            $scope.blockList = deleted_blocks;
        });

        //get switched blockList
        $scope.$on("SWITCH_BLOCK", function(event, switched_blocks){
            $scope.blockList = switched_blocks;
        });


        $scope.detailPrevious = function(path){
            $("body, html").animate({scrollTop : 0}, 0);
            $location.path(path);


        };

        $scope.detailNext = function(path){
            $("body, html").animate({scrollTop : 0}, 0);
            $location.path(path);

        };

        $scope.$on("$destroy", function(){

            clearInterval(I);

            if ($scope.video_link == undefined){
                $scope.video_link = '';
            }

            if ($scope.video_thumb == undefined){
                $scope.video_thumb = '';
            }
            var detailInfoPost ={
                dealID:$scope.projectId,
                video_link:$scope.video_link||'',
                video_thumb:$scope.video_thumb||'',
                new_desc:angular.toJson($scope.blockList)||''
            };


            var detailInfoSaved ={
                video_link:$scope.video_link,
                video_thumb:$scope.video_thumb,
                new_desc:$scope.blockList,
                videoShow:$scope.videoShow
            };

            $scope.block_num = project.get_block_num();

            if ($scope.block_num != 0){
                $scope.detailChecked = true;
            }

            project.save_detail_total(detailInfoSaved);
            //project.submit_detail_info(detailInfoPost);
            project.save_detail_checked($scope.detailChecked);
            project.get_finish_checked();
            setTimeout(function () {
                project.save_draft();
            }, 50);
        }
        );

    }]);
})(window, window.angular,angular.module('launchApp'));

/**
 * Created by zihong on 8/4/15.
 */

(function(window, angular,launchApp) {
  'use strict';
  launchApp.controller("EquityCtrl",['$scope','$location',function($scope,$location){


  }]);
})(window, window.angular,angular.module('launchApp'));

(function(window, angular,launchApp) {
    'use strict';
    launchApp.controller("mainCtrl",['$scope','$location','$state','$timeout', 'ProjectLaunch', '$rootScope',function($scope, $location, $state, $timeout,ProjectLaunch,

                                                                                                                      $rootScope){


        var project = ProjectLaunch.getProject();
        $rootScope.project = project;
        $scope.projectId = project.get_dealID();
        //console.log('涓€寮€濮婭D寰楀埌浜嗗悧',$scope.projectId);
        //var commSuccess = project.get_comm_status();

        $scope.$on('GET_ID_RE',function(event,Re_id){
            $scope.projectId = Re_id;
        });

        $scope.$on('BASIC_RE',function(event,basic_Re_id){
            $scope.projectId = basic_Re_id;
        });

        $scope.$on('PROJECT_RE',function(event,project_Re_id){
            $scope.projectId = project_Re_id;
        });

        $scope.$on('DETAIL_RE',function(event,detail_Re_id){
            $scope.projectId = detail_Re_id;
        });

        $scope.$on('REWARDS_RE',function(event,rewards_Re_id){
            $scope.projectId = rewards_Re_id;
        });

        $scope.$on('PREVIEW_RE',function(event,preview_Re_id){
            $scope.projectId = preview_Re_id;
        });

        $scope.$on('CONTRACT_RE',function(event,contract_Re_id){
            $scope.projectId = contract_Re_id;
        });

        $scope.$on('MAIN_FINISH_CHECKED',function(event, statusChecked){

            if(statusChecked.basicInfo &&
            statusChecked.projectInfo &&
            statusChecked.detailInfo &&
            statusChecked.rewards){
                $scope.enablePublish = true;
            }


        });
        project.get_finish_checked();


        //$scope.$on("ALL_INFO_HTTP",function(event, project_all_info){
        //    $scope.projectId = project_all_info.basicInfo.dealID;

        $rootScope.dir = '';
        $scope.currentSid = 1;
        $scope.previousSid = 1;
        $scope.step = null;

        $scope.basicChecked = false;
        $scope.projectChecked = false;
        $scope.detailChecked = false;
        $scope.rewardsChecked = false;


        function step(name){
            this.finishedChecked = false;
            this.name = name;
        }
        var steps = [
            new step('basicInfo'),
            new step('projectInfo'),
            new step('detailInfo'),
            new step('rewards'),
            new step('preview'),
            new step('contract')
        ];

        //$scope.$on('MAIN_FINISH_CHECKED',function(event, statusChecked){
        //
        //    console.log('妫€鏌ヤ竴涓嬪畬鎴愮姸鎬佸憿',statusChecked)
        //
        //    $scope.enablePublish = true;
        //    for(var i = 0 ; i < 4; i ++){
        //        var __step = steps[i];
        //        if(!__step.finishedChecked){
        //
        //            $scope.enablePublish = false;
        //        }
        //    }
        //
        //});
        //project.get_finish_checked();

        $scope.steps = steps;
        $scope.selectedStep = 'basicInfo';
        $scope.$on("PAGE_STEP", function(event, step){
            $scope.selectedStep = step;
            _.each(steps, function(__step){
                if(__step.name == step) {
                    __step['class'] = 'curr';

                }else{
                    __step['class'] = '';
                }

                if(__step.finishedChecked){
                    __step['class'] = 'cur';
                }

            });
        });

        $scope.$on("FINISH_CHECKED", function(event, obj){
            for(var key in obj) {
                var __step = _.first(_.filter(steps, function(item){return item.name == key;}));
                __step.finishedChecked = obj[key];
            }


        });

            $scope.pageSlide = function(pid){
                $scope.currentSid = pid;
                //console.log('涓绘帶鍒跺櫒鐨処D缁戜笂浜嗗悧锛�',$scope.projectId)

                if ($scope.currentSid > $scope.previousSid){
                    $rootScope.dir = 'left';
                    $scope.previousSid = pid;
                }
                if ($scope.currentSid < $scope.previousSid)
                {
                    $rootScope.dir = 'right'
                    $scope.previousSid = pid;
                }

                if (pid === 1){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/basic-info')
                    .search('projectID', $scope.projectId);
                };
                if (pid === 2){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/project-info')
                    .search('projectID', $scope.projectId);
                };
                if (pid === 3){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/detail-info')
                    .search('projectID', $scope.projectId);
                };

                if (pid === 4){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/rewards')
                    .search('projectID', $scope.projectId);
                };

                if (pid === 5){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/preview')
                    .search('projectID', $scope.projectId);
                };

                if (pid === 6){

                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/contract')
                    .search('projectID', $scope.projectId);

                    //$scope.$on("MAIN_FINISH_CHECKED",function(event,finishChecked){
                    //    //$scope.stepChecked.basicChecked = basicChecked;
                    //    $scope.finishChecked = finishChecked;
                    //    if ($scope.finishChecked.basic_checked&&$scope.finishChecked.project_checked&&$scope.finishChecked.detail_checked&&$scope.finishChecked.rewards_checked){
                    //        $scope.submitOK = true;
                    //
                    //    };
                    //}
                    //);
                    //project.get_finish_checked();

                };
            };

            $scope.Next = function(pid){
                $rootScope.dir = 'left';
                if (pid === 1){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/project-info')
                    .search('projectID', $scope.projectId);
                };
                if (pid === 2){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/detail-info')
                    .search('projectID', $scope.projectId);
                };
                if (pid === 3){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/rewards')
                    .search('projectID', $scope.projectId);
                };
                if (pid === 4){

                    if($scope.enablePublish){
                        $("body, html").animate({scrollTop : 0}, 0)
                        $location.path('/project-launch/contract')
                            .search('projectID', $scope.projectId);

                    }
                };
            };
            $scope.Previous = function(pid){
                $rootScope.dir = 'right';
                if (pid === 2){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/basic-info')
                    .search('projectID', $scope.projectId);

                };
                if (pid === 3){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/project-info')
                    .search('projectID', $scope.projectId);
                };
                if (pid === 4){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/project-launch/detail-info')
                        .search('projectID', $scope.projectId);
                };
            };

            $scope.publish =function(){
                project.agreeAndPublish().then(function(){
                    $("body, html").animate({scrollTop : 0}, 0)
                    $location.path('/success')
                });
            };

        //});
        ////project.get_all_info($scope.projectId);
        //if (commSuccess != "OK"){project.get_all_info($scope.projectId);}
        //if (commSuccess == "OK"){console.log('宸茬粡鍔犺浇瀹屾瘯锛岃骞茬偣浠€涔堝憿锛�')
        //
        //}

        //
        //$scope.$on("GET_DEALID", function(event, dealId){
        //    $scope.projectId = dealId;
        //
        //});
        //project.get_dealId();

        //$scope.$on("MAIN_FINISH_CHECKED",function(event,checkStatus){
        //   if (checkStatus.basic_checked){$scope.basicDisplay = 'cur';}
        //    if (checkStatus.project_checked){$scope.projectDisplay = 'cur';}
        //    if (checkStatus.detail_checked){$scope.detailDisplay = 'cur';}
        //    if (checkStatus.rewards_checked){$scope.rewardDisplay = 'cur';}
        //});
        //project.get_finish_checked();

        //$scope.BasicInfoStep = false;
        //$scope.ProjectInfoStep = false;
        //$scope.DetailInfoStep = false;
        //$scope.RewardsStep = false;

        $scope.$on("DRAFT_POST", function(){
            var d = new Date();
            $rootScope.hour = (d.getHours()<10?'0':'')+ d.getHours();
            $rootScope.min = (d.getMinutes()<10?'0':'')+ d.getMinutes();
            $rootScope.sec = (d.getSeconds()<10?'0':'')+ d.getSeconds();

            $rootScope.draftSaved = false;

            $rootScope.draftSaved = true;


            setTimeout(function(){
                $rootScope.draftSaved = false;
                $rootScope.$apply();
            }, 3000);
        });

    }]);
})(window, window.angular,angular.module('launchApp'));

(function(window, angular,launchApp) {
  'use strict';
  launchApp.controller("PreviewCtrl",["$http", "$q",'$scope','$location','ProjectLaunch', 'User',function($http, $q,$scope,$location, ProjectLaunch, User){

    var project = ProjectLaunch.getProject();

    //鍒濆鍔犺浇
    var query = $location.search();
    $scope.projectId = query.projectID;

    var commSuccess = project.get_comm_status();

      User.getInfo().then(function(data){
          $scope.user_name = data.data.name;
          $scope.headerUrl = data.data.headerUrl;
      });

    //$scope.$on("CATETAGS_GOT",function(event,cateTagList){
    //  $scope.tagsPreview = _.filter(cateTagList, function(item){return item.active;});
    //});
    //var cid = project.select_cate();
    //project.get_cateTags($scope.projectId,cid);


    $scope.$on("PREVIEW_HTTP", function(event, allPreviewData){

      //鍒ゆ柇褰撳墠椤垫槸涓嶆槸棰勮椤�
      $scope.step = 'preview';
      project.get_page_step($scope.step);

      $scope.previewInfo = allPreviewData;

      $scope.currentCatePerson = allPreviewData.basicInfo.cate_list.person[0];
      $scope.currentCateOrg = allPreviewData.basicInfo.cate_list.org[0];

      //榛樿鐨勮涓氬垎绫婚€夋嫨
      for (var i = 0; i<allPreviewData.basicInfo.cate_list.person.length; i++){
        if (allPreviewData.basicInfo.cate_list.person[i].categoryID == allPreviewData.basicInfo.categoryID){
          $scope.currentCatePerson = allPreviewData.basicInfo.cate_list.person[i];
        }
      }

      for (var i = 0; i<allPreviewData.basicInfo.cate_list.org.length; i++){
        if (allPreviewData.basicInfo.cate_list.org[i].categoryID == allPreviewData.basicInfo.categoryID){
          $scope.currentCateOrg = allPreviewData.basicInfo.cate_list.org[i];
        }
      }

      $scope.titlePreview = $scope.previewInfo.projectInfo.name;

      if($scope.previewInfo.basicInfo.is_org){
        $scope.catePreview =$scope.currentCateOrg.name;
      }
      if(!$scope.previewInfo.basicInfo.is_org){
        $scope.catePreview =$scope.currentCatePerson.name;
      }

      $scope.locationPreview= {
        province:$scope.previewInfo.projectInfo.project_province,
        city:$scope.previewInfo.projectInfo.project_city
      };

      $scope.tagsPreview = _.filter($scope.previewInfo.projectInfo.cate_tags, function(item){return item.active;});
      $scope.coverPreview = $scope.previewInfo.projectInfo.image;
      $scope.daysPreview = $scope.previewInfo.projectInfo.deal_days;
      $scope.fundingPreview = $scope.previewInfo.projectInfo.limit_price;
      $scope.descriptionPreview = $scope.previewInfo.projectInfo.brief;
      $scope.namePreview = $scope.previewInfo.basicInfo.true_name;
      $scope.detailPreview = $scope.previewInfo.detailInfo;
      $scope.rewardsPreview = $scope.previewInfo.rewardsInfo;
        $scope.showLottery = _.filter($scope.rewardsPreview, function(item){return item.return_type == 4;});



    });
    
    if (commSuccess != "OK"){project.get_preview_http($scope.projectId)}

    //鍩烘湰淇℃伅椤靛姞杞�
     $scope.$on('PREVIEWINFO_GOT',function(event, previewData){

      //鍒ゆ柇褰撳墠椤垫槸涓嶆槸棰勮椤�
      $scope.step = 'preview';
      project.get_page_step($scope.step);

       $scope.previewInfo = previewData;

       if($scope.previewInfo.basic_preview_info.is_org){
         $scope.catePreview =$scope.previewInfo.basic_preview_info.currentCateOrg.name;
       }
       if(!$scope.previewInfo.basic_preview_info.is_org){
         $scope.catePreview =$scope.previewInfo.basic_preview_info.currentCatePerson.name;
       }

       $scope.titlePreview = $scope.previewInfo.project_preview_info.name;
       $scope.locationPreview= {
         province:$scope.previewInfo.project_preview_info.project_province,
         city:$scope.previewInfo.project_preview_info.project_city
       };

       $scope.tagsPreview = _.filter($scope.previewInfo.project_preview_info.cate_tags, function(item){return item.active;});
       $scope.coverPreview = $scope.previewInfo.project_preview_info.image;
       $scope.daysPreview = $scope.previewInfo.project_preview_info.deal_days;
       $scope.fundingPreview =$scope.previewInfo.project_preview_info.limit_price;
       $scope.descriptionPreview =$scope.previewInfo.project_preview_info.brief;
       $scope.namePreview = $scope.previewInfo.basic_preview_info.true_name;
       $scope.detailPreview = $scope.previewInfo.detail_preview_info;
       $scope.rewardsPreview = $scope.previewInfo.rewards_preview_info;

         $scope.showLottery = _.filter($scope.rewardsPreview, function(item){return item.return_type == 4;});
    });
    if (commSuccess == "OK"){project.get_deal()};

  }]);
})(window, window.angular,angular.module('launchApp'));

(function(window, angular,launchApp) {
	'use strict';
	launchApp.controller("ProjectInfoCtrl",['$scope','ProjectLaunch','$location','Forms', 'FormItem', 'Address','$rootScope',function($scope, ProjectLaunch, $location,Forms, FormItem, Address,$rootScope){

		var project = ProjectLaunch.getProject();

		$scope.form_project = Forms.project;


		var query = $location.search();
		$scope.projectId = query.projectID;

		$scope.uploadFormData = {
			dealID: $scope.projectId,
			type: '9'
		};

		var commSuccess = project.get_comm_status();


		if(commSuccess != 'OK')
		{$rootScope.loading = 1;}

		//var projectSuccess = project.get_project_status();
		function validateAddress(){
			var addr = Forms.project.addr;
			if(addr.province && addr.city){
				return '';
			}
			return '*璇烽€夋嫨鍦板潃';
		}
		function append_validation_rules(form, isOrg){

			form.addr = new FormItem();
			form.addr.validationRule = validateAddress;
		}

		$scope.$on(Address.Events.ADDR_CITY_CHANGED, function(event, data){
			Forms.project.addr.dirty = true;
			Forms.project.addr.province = data.province;
			Forms.project.addr.city = data.city;
			Forms.project.addr.validate();
			$scope.$apply();
		});

		window.frm = Forms.project;
		if(!window.projectFormAppended){
			window.projectFormAppended = true;
			append_validation_rules(Forms.project, true);
		}


		$scope.$on("PROJECT_HTTP", function(event, projectInformation){

			//鍒ゆ柇褰撳墠椤垫槸涓嶆槸椤圭洰淇℃伅椤�
			$scope.step = 'projectInfo';
			project.get_page_step($scope.step);

			$scope.tags_selected =[];



			if (projectInformation.cate_tags){
				$scope.cateTagList = projectInformation.cate_tags;
			}
			if (!projectInformation.cate_tags){
				$scope.$on("CATETAGS_GOT",function(event,cateTagList){
					$scope.cateTagList = cateTagList;
				});
				var cid = project.select_cate();
				project.get_cateTags($scope.projectId,cid);
			}


			//if (projectInformation.project_province == '') {
			//	$scope.province = project.get_basic_province();
			//	$scope.form_project.addr.province = project.get_basic_province();
			//
			//}else{
			//	$scope.province=projectInformation.project_province;
			$scope.form_project.addr.province =projectInformation.project_province;

			//}

			//if(projectInformation.project_city == ''){
			//	$scope.city = project.get_basic_city();
			//	$scope.form_project.addr.city =  project.get_basic_city();
			//
			//}else{
			//	$scope.city =projectInformation.project_city;
			$scope.form_project.addr.city =projectInformation.project_city;
			//}

			$scope.project_province_id = projectInformation.project_province_id;
			$scope.project_city_id = projectInformation.project_city_id;


			//寰楀埌鍩烘湰淇℃伅
			$scope.form_project.image.value =projectInformation.image;

			//$scope.coverUrl = projectInformation.image;

			$scope.form_project.name.value =projectInformation.name;
			$scope.form_project.brief.value =projectInformation.brief;


			if(projectInformation.limit_price == 0){
				$scope.form_project.limit_price.value = '';
			}
			if(projectInformation.deal_days == 0){
				$scope.form_project.deal_days.value = 10;
			}

			if(projectInformation.limit_price != 0){
				$scope.form_project.limit_price.value =projectInformation.limit_price;
			}
			if(projectInformation.deal_days != 0){
				$scope.form_project.deal_days.value =projectInformation.deal_days;
			}

			$scope.cate_tags = _.filter(projectInformation.cate_tags, function(item){return item.active;});
			$scope.form_project.user_tags.value =projectInformation.user_tag;

			$rootScope.loading = 0;

			//$scope.$apply();



		});
		if (commSuccess != "OK"){project.get_project_http($scope.projectId)}



		$scope.saveDraft = function(){
			console.log("save-back_project-info");
			var projectInfoDraft ={
				image:$scope.form_project.image.value,

				name:$scope.form_project.name.value,
				brief:$scope.form_project.brief.value,

				project_province:Forms.project.addr.province,
				project_city:Forms.project.addr.city,

				project_province_id:$scope.project_province_id,
				project_city_id:$scope.project_city_id,

				limit_price:$scope.form_project.limit_price.value,
				deal_days:$scope.form_project.deal_days.value,

				cate_tags:$scope.cate_tags,
				user_tag:$scope.form_project.user_tags.value
			};

			project.save_project_total(projectInfoDraft);

		};

		var I = null;
		I = setInterval($scope.saveDraft,1000);



		$scope.$on("PROJECT_LOAD", function(event, projectInformation){

			//鍒ゆ柇褰撳墠椤垫槸涓嶆槸椤圭洰淇℃伅椤�
			$scope.step = 'projectInfo';
			project.get_page_step($scope.step);

			$scope.cid = project.select_cate();

			$scope.$on("CATETAGS_GOT",function(event,cateTagList){

				var selected_tags =	_.filter(projectInformation.cate_tags, function(item){return item.active;});

				for (var i = 0; i< cateTagList.length; i++){
					for ( var j = 0; j< selected_tags.length; j++){
						if (selected_tags[j].name == cateTagList[i].name){
							cateTagList[i].active = selected_tags[j].active;
						}
					}
				}
				$scope.cateTagList = cateTagList;
				$scope.cate_tags = _.filter(projectInformation.cate_tags, function(item){return item.active;});

			});

			if(projectInformation.cateTagList && ($scope.cid == projectInformation.cid)){

				var selected_tags =	_.filter(projectInformation.cate_tags, function(item){return item.active;});

				for (var i = 0; i< projectInformation.cateTagList.length; i++){
					for ( var j = 0; j< selected_tags.length; j++){
						if (selected_tags[j].name == projectInformation.cateTagList[i].name){
							projectInformation.cateTagList[i].active = selected_tags[j].active;
						}
					}
				}
				$scope.cateTagList = projectInformation.cateTagList;
				$scope.cate_tags = _.filter(projectInformation.cate_tags, function(item){return item.active;});
			}
			if(!projectInformation.cateTagList || ($scope.cid != projectInformation.cid))
			{
				project.get_cateTags($scope.projectId,$scope.cid);
			}

			//if (projectInformation.project_province == ''){
			//	$scope.province = project.get_basic_province();
			//	$scope.form_project.addr.province =project.get_basic_province();
			//}else{

			//$scope.province =projectInformation.project_province;
			$scope.form_project.addr.province = projectInformation.project_province;

			//}


			//if(projectInformation.project_city == ''){
			//	$scope.city = project.get_basic_city();
			//	$scope.form_project.addr.city = project.get_basic_city();
			//
			//}else{

			//$scope.city =projectInformation.project_city;
			$scope.form_project.addr.city =projectInformation.project_city;
			//}



			$scope.project_province_id = projectInformation.project_province_id;
			$scope.project_city_id = projectInformation.project_city_id;


			//寰楀埌鍩烘湰淇℃伅
			$scope.form_project.image.value =projectInformation.image;

			//$scope.coverUrl = projectInformation.image;

			$scope.form_project.name.value =projectInformation.name;
			$scope.form_project.brief.value =projectInformation.brief;


			if(projectInformation.limit_price == 0){
				$scope.form_project.limit_price.value = '';
			}
			if(projectInformation.deal_days == 0){
				$scope.form_project.deal_days.value = '';
			}

			if(projectInformation.limit_price != 0){
				$scope.form_project.limit_price.value =projectInformation.limit_price;
			}
			if(projectInformation.deal_days != 0){
				$scope.form_project.deal_days.value =projectInformation.deal_days;
			}

			//$scope.form_project.limit_price.value =projectInformation.limit_price;
			//$scope.form_project.deal_days.value =projectInformation.deal_days;

			$scope.form_project.cate_tags.value =projectInformation.cate_tags;
			$scope.form_project.user_tags.value =projectInformation.user_tag;

			$scope.cate_tags =projectInformation.cate_tags;
			$scope.form_project.user_tags.value =projectInformation.user_tag;


		});
		if (commSuccess == "OK")project.get_project_info();


		$scope.cateTagsClick = function(selectedTag){

			var _select = null;
			_.each($scope.cateTagList, function(item){
				if(item.id == selectedTag.id){
					_select = item;
					item.active = !item.active;
				}
			});
			var list = _.filter($scope.cateTagList, function(item){return item.active;});
			var count = list.length;
			if(count > 2){
				uc.modal.alert("閿欒鎻愮ず", "鏈€澶氬彧鑳介€夋嫨涓や釜鎺ㄨ崘鏍囩");
				_select.active = 0;
			}
			$scope.cate_tags = _.filter($scope.cateTagList, function(item){return item.active;});

		}


		$scope.$on('PROJECT_IMAGE',function(event,upldOk){
			if(upldOk){
				$scope.form_project.image.validate(true);
			}
		})

		$scope.projectPrevious = function(path){
			$("body, html").animate({scrollTop : 0}, 0)
			$location.path(path);

			$scope.projectChecked = Forms.validate(Forms.project);

		};

		$scope.projectNext = function(path){
			$("body, html").animate({scrollTop : 0}, 0)
			$location.path(path);

			$scope.projectChecked = Forms.validate(Forms.project);
		};

		$scope.$on("$destroy", function(){

				clearInterval(I);

				var projectInfoPost ={
					dealID:$scope.projectId||'',

					image:$scope.form_project.image.value||'',


					name:$scope.form_project.name.value||'',
					brief:$scope.form_project.brief.value||'',

					project_province:Forms.project.addr.province,
					project_city:Forms.project.addr.city,

					project_province_id:$scope.project_province_id,
					project_city_id:$scope.project_city_id,

					limit_price:$scope.form_project.limit_price.value||'',
					deal_days:$scope.form_project.deal_days.value||'',

					cate_tags:angular.toJson($scope.cate_tags)||'',
					user_tag:$scope.form_project.user_tags.value||''

				};


				var projectInfoSaved ={
					image:$scope.form_project.image.value,

					name:$scope.form_project.name.value,
					brief:$scope.form_project.brief.value,

					project_province:Forms.project.addr.province,
					project_city:Forms.project.addr.city,

					project_province_id:$scope.project_province_id,
					project_city_id:$scope.project_city_id,

					limit_price:$scope.form_project.limit_price.value,
					deal_days:$scope.form_project.deal_days.value,

					cate_tags:$scope.cate_tags,
					user_tag:$scope.form_project.user_tags.value,

					cateTagList:$scope.cateTagList,

					cid:$scope.cid

				};

				$scope.projectChecked = Forms.validate(Forms.project);

				//$scope.projectChecked = false;
				project.save_project_total(projectInfoSaved);
				//project.submit_project_info(projectInfoPost);
				project.save_project_checked($scope.projectChecked);
				project.get_finish_checked();
				setTimeout(function () {
					project.save_draft();
				}, 50);

			}
		);



	}]);
})(window, window.angular,angular.module('launchApp'));
(function(window, angular,launchApp) {
	'use strict';
	launchApp.controller("RewardsCtrl",['$scope','ProjectLaunch','$location','$rootScope',function($scope, ProjectLaunch, $location,$rootScope){


		var project = ProjectLaunch.getProject();

		//鍒濆鍔犺浇
		var query = $location.search();
		$scope.projectId = query.projectID;


		$scope.uploadFormData = {
			dealID: $scope.projectId,
			type: '6'
		};

		//鍥炴姤淇℃伅椤靛姞杞�

		var commSuccess = project.get_comm_status();
		if(commSuccess != 'OK')
		{$rootScope.loading = 1;}

		$scope.$on("REWARDS_HTTP", function(event, rewardsInformation){

			//鍒ゆ柇褰撳墠椤垫槸涓嶆槸鍥炴姤淇℃伅椤�
			$scope.step = 'rewards';
			project.get_page_step($scope.step);

			//寰楀埌鍥炴姤淇℃伅
			$scope.rewardList = rewardsInformation;
			_.each(rewardsInformation, function(reward){
				reward.lottery_checked = reward.lottery_checked ? '1' : '0';
			});

			$rootScope.loading = 0;

			//$scope.$apply();

		});
		if (commSuccess != "OK")project.get_rewards_http($scope.projectId);

		$scope.saveDraft = function(){
			console.log('save-back-rewards');
			project.save_rewards_total($scope.rewardList);

		};

		var I = null;
		I = setInterval($scope.saveDraft,1000);


		$scope.$on("REWARDS_LOAD", function(event, itemList){

			//鍒ゆ柇褰撳墠椤垫槸涓嶆槸鍥炴姤淇℃伅椤�
			$scope.step = 'rewards';
			project.get_page_step($scope.step);

			//寰楀埌鍥炴姤淇℃伅
			$scope.rewardList = itemList;
			_.each(itemList, function(reward){
				reward.lottery_checked = reward.lottery_checked ? '1' : '0';
			});
			$scope.$apply();
		});
		if (commSuccess == "OK")project.get_rewards_info();

		/*Add a new reward*/
		$scope.addReward = function(){
			$scope.$on("REWARD_ADDED", function (event,added_rewards) {
				$scope.rewardList = added_rewards;
			});
			project.add_item();
			document.body.scrollTop = document.documentElement.offsetHeight;

		};

		$scope.$on('ITEM_NUMBER',function(event, item_num){
			$scope.item_num = item_num;
		})

		$scope.$on("TYPE_REWARD", function(event, type_reward){
			$scope.rewardList = type_reward;
		});

		$scope.$on("SAVE_REWARD", function(event, reward_save){
			$scope.rewardList = reward_save;
		});

		$scope.$on("EDIT_REWARD", function(event, reward_edit){
			$scope.rewardList = reward_edit;
		});

		//get a reward copy
		$scope.$on("REWARD_COPY", function(event, reward_copy){
			$scope.rewardList = reward_copy;
			document.body.scrollTop = document.documentElement.offsetHeight;
		});

		//get deleted blockList
		$scope.$on("REWARD_DELETED", function(event, deleted_rewards){
			$scope.rewardList = deleted_rewards;
		});

		//get switched blockList
		$scope.$on("REWARD_SWITCHED", function(event, switched_rewards){
			$scope.rewardList = switched_rewards;
		});

		$scope.$on("REWARDS_CHECKED",function(event,reward_checked){

			$scope.rewardsChecked = reward_checked;
			project.save_rewards_checked($scope.rewardsChecked);
			project.get_page_step('rewards');
			project.get_finish_checked();
		});

      //

		$scope.rewardsPrevious = function(path){
			$("body, html").animate({scrollTop : 0}, 0)
			$location.path(path);



		};
		$scope.publish = function(){

		};

		$scope.$on("$destroy", function(){

				clearInterval(I);

				var rewardsInfoPost ={
					dealID:$scope.projectId,
					items:angular.toJson($scope.rewardList)||''
				};

				$scope.item_num = project.get_item_num();

				if ($scope.item_num != 0){
					$scope.rewardsChecked = true;
				}

				project.save_rewards_total($scope.rewardList);
				//project.submit_rewards_info(rewardsInfoPost);
				project.save_rewards_checked($scope.rewardsChecked);
				project.get_finish_checked();

				setTimeout(function () {
					project.save_draft();
				}, 50);

			}
		);

	}]);
})(window, window.angular,angular.module('launchApp'));

/**
 * Created by zihong on 8/4/15.
 */

(function(window, angular,launchApp) {
  'use strict';
  launchApp.controller("StartCtrl",['$scope','$location','ProjectLaunch', 'User',function($scope,$location, ProjectLaunch, User){


    window.launch=null;
    window.LaunchForms = null;

    $scope.service_checked = "true";

    var project = ProjectLaunch.getProject();

    if(window.location.href.match("zhongchou")){

      $scope.rewardLaunch = true;
    }else if(window.location.href.match("yuanshihui")){

      $scope.rewardLaunch = false;
    }

    $scope.step = 'start';
    var project = ProjectLaunch.getProject();
    project.get_page_step($scope.step);

    $scope.TypeLaunch = function () {

      var service_select = $scope.service_checked;
      var maxT = 0;
      function do_jump() {
        User.getInfo().then(function (data) {


          function goLaunch() {

            if ($scope.rewardLaunch == true) {
              $scope.$on('START_HTTP', function (event, StartData) {
                $scope.projectId = StartData.basicInfo.dealID;
                window.location.href = "/launch-jump?projectID=" + $scope.projectId;

                $("body, html").animate({scrollTop: 0}, 0)
              });
              project.get_start();
            }

            if ($scope.rewardLaunch == false) {
              if (data.errno) {
                maxT++;
                if (maxT > 5) {
                  window.location.reload();
                }
                setTimeout(function () {
                  do_jump();
                }, 500);
              } else {

                var authStatus = data.data.authInfo.idCard;
                switch(authStatus){
                  case 0:
                  case 2:
                    uc.modal.alert("閿欒鎻愮ず", "鎮ㄩ渶瑕佸疄鍚嶈璇�", function(){
                      window.location.href = "/zc/#/auth";
                    });
                      return;
                  case 3:
                    uc.modal.alert("閿欒鎻愮ず", "鎮ㄧ殑瀹炲悕淇℃伅姝ｅ湪瀹℃牳锛岃鑰愬績绛夊緟瀹℃牳缁撴灉銆�", function(){
                      window.location.href = "/";
                    });
                    break;
                }
                //window.location.href = 'http://guquan.yuanshihui.com/newdeal/deal';
                eq_jump(data.data.user_id, data.data.user_token, 'http://guquan.yuanshihui.com/newdeal/deal');
              }

            }
          }


          if (data.errno) {
            zc.show_login(function () {

              window.location.href = "/launch-dist";

             // goLaunch();
            });
          } else {
            window.location.href = "/launch-dist";

            //goLaunch();
          }

        });
      }


      if ($scope.service_checked == "true"){
        do_jump();
      }
      if ($scope.service_checked == "false"){
        uc.modal.alert("閿欒鎻愮ず", "鏈嶅姟鍗忚涓哄繀鍕鹃」");
      }

    }

    $scope.TypeLaunch();

  }]);
})(window, window.angular,angular.module('launchApp'));

/**
 * Created by zihong on 8/4/15.
 */

(function(window, angular,launchApp) {
  'use strict';
  launchApp.controller("Start2Ctrl",['$scope','$location','ProjectLaunch', 'User',function($scope,$location, ProjectLaunch, User){


    window.launch=null;
    window.LaunchForms = null;

    $scope.service_checked = "true";

    var project = ProjectLaunch.getProject();

    if(window.location.href.match("zhongchou")){

      $scope.rewardLaunch = true;
    }else if(window.location.href.match("yuanshihui")){

      $scope.rewardLaunch = false;
    }

    $scope.step = 'start';
    var project = ProjectLaunch.getProject();
    project.get_page_step($scope.step);

    $scope.TypeLaunch = function () {

      var service_select = $scope.service_checked;
      var maxT = 0;
      function do_jump() {
        User.getInfo().then(function (data) {


          function goLaunch() {

            if ($scope.rewardLaunch == true) {
              $scope.$on('START_HTTP', function (event, StartData) {
                $scope.projectId = StartData.basicInfo.dealID;
                window.location.href = "/launch-jump?projectID=" + $scope.projectId;

                $("body, html").animate({scrollTop: 0}, 0)
              });
              project.get_start();
            }

            if ($scope.rewardLaunch == false) {
              if (data.errno) {
                maxT++;
                if (maxT > 5) {
                  window.location.reload();
                }
                setTimeout(function () {
                  do_jump();
                }, 500);
              } else {

                var authStatus = data.data.authInfo.idCard;
                switch(authStatus){
                  case 0:
                  case 2:
                    uc.modal.alert("閿欒鎻愮ず", "鎮ㄩ渶瑕佸疄鍚嶈璇�", function(){
                      window.location.href = "/zc/#/auth";
                    });
                      return;
                  case 3:
                    uc.modal.alert("閿欒鎻愮ず", "鎮ㄧ殑瀹炲悕淇℃伅姝ｅ湪瀹℃牳锛岃鑰愬績绛夊緟瀹℃牳缁撴灉銆�", function(){
                      window.location.href = "/";
                    });
                    break;
                }
                //window.location.href = 'http://guquan.yuanshihui.com/newdeal/deal';
                eq_jump(data.data.user_id, data.data.user_token, 'http://guquan.yuanshihui.com/newdeal/deal');
              }

            }
          }


          if (data.errno) {
            zc.show_login(function () {

              //window.location.href = "/launch-dist";

              goLaunch();
            });
          } else {
            //window.location.href = "/launch-dist";

            goLaunch();
          }

        });
      }


      if ($scope.service_checked == "true"){
        do_jump();
      }
      if ($scope.service_checked == "false"){
        uc.modal.alert("閿欒鎻愮ず", "鏈嶅姟鍗忚涓哄繀鍕鹃」");
      }

    }

    $scope.TypeLaunch();

  }]);
})(window, window.angular,angular.module('launchApp'));

/**
 * Created by zihong on 8/9/15.
 */

(function(window, angular,launchApp) {
  'use strict';
  launchApp.controller("SuccessCtrl",['$scope','$location',function($scope,$location){

    if(window.launch && window.launch.project){
      window.launch.project.stopSaveDraft();
    }
  }]);
})(window, window.angular,angular.module('launchApp'));

/**
 * 鍦板潃閫夋嫨鎺т欢
 * @author weimeng
 */

(function(window, angular,$,ucApp) {
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
                    render();
                });

                scope.$on(Address.Events.ADDR_CITY_CHANGED, function(event, data){

                    scope.province = data.province;
                    if(!data.province){
                        cityList = [];
                    }
                    render();
                    scope.city = data.city;
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
                    $province.append("<option value=''>璇烽€夋嫨</option>");
                    $city.append("<option value=''>璇烽€夋嫨</option>");
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
                    $province.width(0).width('');
                    $city.width(0).width('');
                }
            }
        };
    }]);
})(window, window.angular,$,angular.module('launchApp'));


/**
 * @author weimeng
 */

(function(window, angular,$,payApp) {
    'use strict';
    payApp.animation('.animate-slide', ['$rootScope',function ($rootScope) {
        return {
            enter : function(element, df){
                var $element = $(element);
                var dir = $rootScope.dir;
                $(".animate-slide").css("position", "absolute");
                if(dir == 'left'){

                    $element.css("left", '100%');
                    $element.animate({
                        left : "0%"
                    }, 500, function(){
                        $element.css("position", 'relative');
                        df();
                    });

                }else if(dir == 'right'){
                    $element.css("left", '-100%');
                    $element.animate({
                        left : "0%"
                    }, 500, function(){
                        $element.css("position", 'relative');
                        df();
                    });
                }else{

                    $(".animate-slide").css("position", "relative");
                    df();

                }


            },
            move : function(element){
            },
            leave: function(element, df){
                var $element = $(element);
                var dir = $rootScope.dir;

                $(".animate-slide").css("position", "absolute");
                if(dir == 'left'){
                    $element.css("left", 0);
                    setTimeout(function(){
                        $element.animate({
                            left : "-100%"
                        }, 500, function(){
                            df();
                        });
                    }, 10);
                }else if(dir == 'right'){
                    $element.css("left", 0);
                    setTimeout(function(){
                        $element.animate({
                            left : "100%"
                        }, 50, function(){
                            df();
                        });
                    }, 10);
                }else{

                    $(".animate-slide").css("position", "relative");
                    df();
                }


            }
        };
    }]);
})(window, window.angular,$,angular.module('launchApp'));
(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.directive('blockPicture', ['ProjectLaunch',function (ProjectLaunch) {
    return {
      scope : {
        //method:"=method"
        //params:"=params"
        block: '=block',
        formData:'=formData'
      },
      restrict: 'AE',
      templateUrl: uc.siteTmplUrl("../views/directives_views/block-picture.html"),
      replace: true,
      link: function (scope) {


        var project = ProjectLaunch.getProject();

        scope.$on('BLOCK_IMAGE',function(event, saved){
          scope.block.saved = saved;
        })

        scope.save = function(){
          scope.saved = project.save_block(scope.block);
        };
        scope.delete_it = function(){

          uc.modal.confirm("鍒犻櫎鎻愮ず", "纭畾瑕佸垹闄よ繖寮犲浘鐗囧悧锛�", function(){
            project.delete_block(scope.block);
            uc.modal.close();
            scope.$apply();
          });

        };
        scope.edit = function(){
          scope.saved= project.edit_block();
        };

        scope.up = function(){
          project.switch_block(scope.block,'up');
        };
        scope.down = function(){
          project.switch_block(scope.block, 'down');
        }

      }
    };

    }]);
})(window, window.angular,$,angular.module('launchApp'));

/**
 * Created by zihong on 7/29/15.
 */

(function(window, angular,$,launchApp) {
  'use strict';
  launchApp.directive('blockReward', ['ProjectLaunch',function (ProjectLaunch) {
    return {
      scope : {
        reward:"=reward",
        formData:'=formData',
        status:'=status'
        //params:"=params"
      },
      restrict: 'AE',
      templateUrl: uc.siteTmplUrl("../views/directives_views/block-reward.html"),
      replace: true,
      link: function (scope) {


        scope.selectRewardType = function(rewardType){
          project.selectReturnType(scope.reward,rewardType);
        };

        var project = ProjectLaunch.getProject();



        scope.$on('REWARD_IMAGE',function(event, itemImages){

          if (itemImages.id == scope.reward.rewardId){

            var list = [];
            if (!scope.reward.images){list = [];}
            if (scope.reward.images){ list = scope.reward.images.slice(0)}
            list.push(itemImages.url);
           var count = list.length;
          if(count > 3){
            uc.modal.alert("鎻愮ず", "鏈€澶氬彧鑳戒笂浼犱笁寮犵収鐗�");
            list.pop();
          }
          scope.reward.images = list;
          }

        });

        scope.lottery_content = '<div class="lottery-rules"><div class="lottery-rules-tit clearfix"> <h2>鎶藉瑙勫垯</h2></div> <ul class="lottery-rules-con"> <li> <span>鑾峰緱鎶藉鍙�</span> <p>璐拱鎶藉鍥炴姤椤规椂鎸夎喘涔伴『搴忎骇鐢熸娊濂栧彿銆�</p> </li> <li> <span>寮€濂栨棩鏈�</span> <p>椤圭洰鎴愬姛缁撴潫鍚庣殑涓嬩竴涓懆涓€寮€濂栥€傚閬囧懆涓€涓洪潪宸ヤ綔鏃ワ紝鍒欏欢鑷冲懆涓€鍚庣殑绗竴涓伐浣滄棩寮€濂栥€�</p> </li> <li class="asterisk"> <span>涓鍙疯绠楁柟娉曪細</span> <p><em>*</em>寮€濂栨棩鏀剁洏鏃剁殑涓婅瘉鎸囨暟6浣嶆暟瀛� & 鏀剁洏鏃剁殑娣辫瘉鎴愭寚7浣嶆暟瀛楋紝涓ょ粍鏁板瓧鎺掑垪寰楀埌鐨�13浣嶆暟锛�</p> <p><em>*</em>灏嗘13浣嶆暟鏁撮櫎浠ラ」鐩粨鏉熸椂鎬绘娊濂栧彿涓暟锛屽緱鍒扮殑浣欐暟鍔�1銆傚嵆寰楀埌璇ラ」鐩殑涓鍙风爜銆�</p> <p><em>*</em>濡傛灉椤圭洰寮€澶氫釜濂栵紝鍒欎互椤圭洰鍏ず鈥� 姣廥涓弬涓庤€呮娊鍙�1鍚嶄腑濂栫敤鎴封€濅腑鐨刋浣滀负鍩烘暟锛岀N涓腑濂栧彿鐮�=绗竴涓腑濂栧彿鐮�+锛圢-1锛�*X</p> <p><em>*</em>濡傛灉鍔犲€煎悗鎶藉鍙风爜瓒呰繃浜嗘€绘娊濂栧彿涓暟锛屽垯灏嗘娊濂栧彿鐮佸噺鍘绘娊濂栧彿涓暟寰楀埌鏂扮殑涓鍙风爜銆�</p> <p><em>*</em>姣忎釜鎶藉鍙峰彧鏈変竴娆′腑濂栨満浼氾紝濡傛灉鎶藉鍙烽噸澶嶄腑濂栵紝鍒欏皢璇ユ娊濂栧彿鐮�+1寰楀埌鏂扮殑涓鍙风爜銆�</p> <p><em>*</em>濡傞亣鍛ㄦ湯鑺傚亣鏃ョ瓑鑲″競浼戝競鎯呭喌锛屾敹鐩樻寚鏁颁互涓婁竴涓氦鏄撴棩鏁版嵁涓哄噯銆�</p> </li> </ul></div>';


        scope.delete_itemPic = function(picId){

          uc.modal.confirm("鍒犻櫎鎻愮ず", "纭畾瑕佸垹闄よ繖寮犲浘鐗囧悧锛�", function(){
            scope.reward.images.splice(picId,1);
            uc.modal.close();
            scope.$apply();
          });
        }


        scope.save = function(status){
          if (!status){
            project.save_item(scope.reward);
          }
        };

        scope.save_lottery = function(status){

          if(scope.reward.lottery_checked != 1){
            uc.modal.alert("鎻愮ず", "璇烽槄璇诲苟鍚屾剰浼楃缃戞娊濂栬鍒�");
          }
          if (!status){
            project.save_item(scope.reward);
          }
        };

        scope.cancel = function(){
          scope.reward.return_type=1;
          scope.reward.extra_need={
            user_name:0,
            mobile:0,
            email:0
          };
          scope.reward.price = null;
          scope.reward.title = '';
          scope.reward.description = '';
          scope.reward.limit_user = 0;
          scope.reward.delivery_fee = 0;
          scope.reward.repaid_day = 0;
          scope.reward.images = [];
          scope.reward.saved = false;
        };


        scope.edit = function(){
          project.edit_item(scope.reward);
        };

        scope.copy = function(){
          project.copy_item(scope.reward);
        };

        scope.delete_reward = function(){

          uc.modal.confirm("鍒犻櫎鎻愮ず", "纭畾瑕佸垹闄よ繖椤瑰洖鎶ュ悧锛�", function(){
            project.delete_item(scope.reward);
            uc.modal.close();
            scope.$apply();
          });

        };
        scope.up = function(){
          project.switch_item(scope.reward,'up');
        };
        scope.down = function(){
          project.switch_item(scope.reward, 'down');
        };

        //scope.$apply();
      }
    };

  }]);
})(window, window.angular,$,angular.module('launchApp'));


/**
 * Created by zihong on 7/30/15.
 */

(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.directive('blockWord', ['ProjectLaunch', 'Forms',function (ProjectLaunch, Forms) {
    return {
      scope : {
        //method:"=saveMethod",
        block:'=block'
        //params:"=params"
      },
      restrict: 'AE',
      templateUrl: uc.siteTmplUrl("../views/directives_views/block-word.html"),
      replace: true,

      link:function(scope){

        var project = ProjectLaunch.getProject();


        if (scope.block.blockId == 1){
          scope.titleDefault = '';
          scope.contentDefault = '';
        }
        //
        //if (scope.block.blockId == 2){
        //  scope.titleDefault = '鎴戜负浠€涔堥渶瑕佷綘鐨勬敮鎸�';
        //  scope.contentDefault = '鎴戦渶瑕佷綘鐨勬敮鎸佹潵骞蹭粈涔�'
        //}
        //
        //if (scope.block.blockId == 3){
        //  scope.titleDefault = '椋庨櫓鍜屾寫鎴�';
        //  scope.contentDefault = '缁欐垜鏀寔鍚庯紝浼氶亣鍒颁粈涔堥闄╁拰鎸戞垬'
        //}

        if (scope.block.blockId != 1){
          scope.titleDefault = '鏍囬';
          scope.contentDefault = '姝ｆ枃'
        }

        scope.save = function(status){
          if (!status){
          scope.saved = project.save_block(scope.block);
          }
        };

        scope.cancel = function(){
          scope.block.title = '';
          scope.block.content = '';
        }

        scope.delete_it = function(){

          uc.modal.confirm("鍒犻櫎鎻愮ず", "纭畾瑕佸垹闄よ繖娈垫枃鏈悧锛�", function(){
            project.delete_block(scope.block);
            uc.modal.close();
            scope.$apply();
          });

        };
        scope.edit = function(){
          scope.saved= project.edit_block(scope.block);
        };

        scope.up = function(){
          project.switch_block(scope.block,'up');
        };
        scope.down = function(){
          project.switch_block(scope.block, 'down');
        };

      }


    };

    }]);
})(window, window.angular,$,angular.module('launchApp'));

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
})(window, window.angular,$,angular.module('launchApp'));

/**
 * Created by YL Huang on 2015/7/15.
 */
(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.directive('classfix', function () {
        return {
            restrict: 'AE',
            replace: false,
            scope : {
                cls : "="
            },
            link: function (scope, elem, attrs) {

                scope.$watch("cls", function(){

                    $(elem).removeClass();
                    if(attrs.tClass){

                        if(scope.cls){

                            $(elem).addClass(attrs.tClass);
                        }else{

                            $(elem).addClass(attrs.fClass);
                        }

                    }else{
                        $(elem).addClass(scope.cls);
                    }

                });
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('contentBox', function () {
        return {
            restrict: 'A',
            replace: false,
            scope : {
                content : "="
            },
            link: function (scope, elem, attrs) {
                var content = scope.content;

                var $elem = $(elem);
                scope.$watch('content', function(){
                    $elem.empty();
                    if(scope.content){
                        scope.content = scope.content.replace(/(<\/?[^/]+\/?>)/g, "");
                        var prts = scope.content.split(/\n/);
                        _.each(prts, function(prt){
                            var $p = $("<p>" + prt + "</p>");
                            if(attrs.contentClass){
                                $p.addClass(attrs.contentClass);
                            }
                            $elem.append($p);
                        });
                    }

                });
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('elastic', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {


                $(elem).elastic();
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('fancybox', function () {
        return {
            restrict: 'A',
            replace: false,
            scope  : {
                'images' : "="
            },
            link: function (scope, elem, attrs) {

                $(elem).click(function(){

                    var src = $(elem).find("img").attr("src");
                    sitePop.oriPic(src);
                });
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('helpTip', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {

                var color = $(elem).css('border-color');
                var size  = $(elem).css("border-size");

            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */
(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.directive('navigation', function () {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl:uc.siteTmplUrl('views/navigation.html'),
            link: function (scope, elem, attrs) {
                $(elem).children('span').click(function(){
                    $(elem).children('span').removeClass('active');
                    $(this).addClass('active');
                });
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('numonly', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                var $elem = $(elem);
                $elem.keydown(function(e){
                    var keycode = e.keyCode;
                    if(keycode == 13){

                    }
                    else if(keycode < 48 || keycode > 57){
                        console.log(keycode);

                        $elem.css("background-color", 'pink');
                        setTimeout(function(){

                            $elem.css("background-color", 'white');
                        }, 50);
                        e.preventDefault();
                    }
                });

            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by YL Huang on 2015/7/16.
 */

(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.directive('pagination', function () {
        return {
            restrict: 'AE',
            scope: {
                pages: '=pages',
                currentPage:'=currentPage'
            },
            replace: true,
            link: function (scope, elem, attrs) {
                function create(page){
                    var str_prv='<a class="prev">涓婁竴椤�</a>',
                        str_next='<a class="next">涓嬩竴椤�</a>',
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
                        if(scope.currentPage == 1){
                            str_prv = '';
                        }
                        if(scope.currentPage == scope.pages){
                            str_next = '';
                        }
                    };
                    var loop = function(begin,end){
                        for(var i=begin;i<=end;i++){
                            if(scope.currentPage == i){
                                str += '<a class="selected">'+i+'</a>';
                            }else{
                                str += '<a>'+i+'</a>';
                            }
                        }
                    };
                    var addEndPage = function(){
                        str += '<a>'+(scope.pages-1)+'</a>';
                        str += '<a>'+(scope.pages)+'</a>';
                    };
                    var buildOther = function(){
                        str += '<a>1</a>';
                        str += '<a>2</a>';
                        if(scope.currentPage>5){
                            str += '<a page="'+(scope.currentPage-3)+'">...</a>';
                        }
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
                            str += '<a page="'+(scope.currentPage+3)+'">...</a>';
                        }
                        if(scope.currentPage<scope.pages-2){
                            addEndPage();
                        }
                    };
                    var doPage = function(){
                        if(scope.pages <= 8){
                            loop(1,scope.pages);
                        }else{
                            if(scope.currentPage <= 4){
                                loop(1,5);
                                str += '<a page="6">...</a>';
                                addEndPage();
                            }else{
                                buildOther();
                            }
                        }
                    };
                    var createElement = function(){
                        $(elem).html(str_begin + str_prv + str + str_next +str_end);
                        $(elem).find('a').click(function(){
                            if($(this).attr('class') == 'prev'){
                                create(page-1);
                                return;
                            }
                            if($(this).attr('class') == 'next'){
                                create(page+1);
                                return;
                            }
                            if($(this).attr('page')){
                                create(parseInt($(this).attr('page'),10));
                                return;
                            }
                            var val = parseInt($(this).text(),10);
                            create(val);
                        });
                    }
                    init();
                    doPage();
                    createElement();
                };
                create(scope.currentPage);
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));



/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('placeHolder', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                    var text = attrs['placeHolder'];
                /*
                if(supDetectObj.placeH){
                    elem.attr("placeholder", text);
                }
                else{
                */
                var position = elem.position();
                var hd = $("<span class='placeholder'></span>");
                function pxVal(str){
                    var m = str.match(/(\d+)px/);
                    return parseInt(m[1]);
                }
                var paddingLeft = pxVal($(elem).css("padding-left"));
                var lineHeight = $(elem).css("line-height");
                var paddingTop = pxVal($(elem).css("padding-top"));

                hd.css("line-height", lineHeight);

                hd.css("padding-top", paddingTop - 1 + 'px');
                hd.text(text);
                hd.css("left", position.left + paddingLeft +  2 + "px");

                hd.css("top", position.top + 1 + "px");


                function showHide(){
                    if(!$(elem).val()){
                        hd.show();
                    }else{
                        hd.hide();
                    }
                }

                $(elem[0].parentNode).append(hd);

                hd.click(function(){
                    $(elem).focus();
                });


                scope.$watch(attrs.ngModel, function(val){

                    showHide();
                });
                $(elem).bind("input propertychange", function(){
                    showHide();
                });


                $(elem).keyup(function(){
                   showHide();
                }).blur(function(){
                   showHide();
                });


            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));

$(function(){
	// ==> span list
	$('select[custom-select]').each(function(){
		var $options = $(this).children(),
			_options='',
			selectholder = $(this).data('placeholder'),
			selectclass = $(this).data('class');
		//span ==> list
		for(var i=0;i<$options.length;i++){
			var subname = $options.eq(i).data('sub'),subnodelist='';
			//has sub
			if(subname){
				var subnode = $('select[data-subname="'+subname+'"]').children();
				//span sub list
				for(var j=0;j<subnode.length;j++){
					subnodelist+='<span class="opts" data-ind="'+subname+j+'">'+subnode.eq(j).text()+'</span>';
				}
				_options+='<span class="opts" data-ind="'+i+'">'+$options.eq(i).text()+'<span class="sublist '+subname+'">'+subnodelist+'</span>'+'</span>';
			}else{
				//span list
				_options+='<span class="opts" data-ind="'+i+'">'+$options.eq(i).text()+'</span>';
			}
		}
		//insert ==> page
		$(this).after('<span class="select-span"><span class="select-title '+selectclass+'">'+selectholder+'</span><span class="select-wrapper select-'+selectclass+'-wrapper" >'+_options+'</span></span>');
		//pull
		$('.'+selectclass).on('click',function(){
			var selectbox = $(this).siblings('.select-wrapper');
			$('.select-wrapper').not(selectbox).slideUp();
			selectbox.slideToggle();
			$(this).toggleClass('title-add');
		})
	})
	//selected
	$('.opts').on('click',function(){
		if(!$(this).children().length){
			var selectind = $(this).data('ind');
			$(this).parents('.select-span').find('.select-title').text($(this).text()).end().end().parents('.select-wrapper').slideUp().end().parents('.select-span').find('.select-title').toggleClass('title-add');
			//reset selected
			$(this).parents('.select-span').siblings('select').children().removeAttr('selected').end().children().prop('selected',false);
			//set selected
			$(this).parents('.select-span').siblings('select').children().eq(selectind).attr('selected','selecter').end().eq(selectind).prop('selected',true);
		}
	})
	var slen = $('option[selected]');
	for(var i=0;i<slen.length;i++){
		var sz = $('option[selected]').eq(i).text();
		$('option[selected]').eq(i).prop('selected',true).attr('selected',true).closest('div').find('.select-title').text(sz);
	}
	//sub list slide
	$('.select-wrapper > .opts').on('mouseenter',function(){
		$(this).siblings().children().slideUp('fast').end().end().children().slideDown('fast');
	})
	//out
	$(document).on('click',function(e){
		var isSelect = $(e.target).parents('.select-span');
		if(!isSelect.length){
			$('.select-wrapper').slideUp().siblings('.select-title').removeClass('title-add');
		}
	})
	$(document).on('mousemove',function(e){
		var isSelect = $(e.target).parents('.select-span');
		if(!isSelect.length){
			$('.select-wrapper .sublist').slideUp();
		}
	})
})

function selspan(yb){
	//select ==> span list
	$(yb).each(function(){
		var $options = $(this).children(),
			_options='',
			selectholder = $(this).data('placeholder'),
			selectclass = $(this).data('class');
		//span ==> list
		for(var i=0;i<$options.length;i++){
			var subname = $options.eq(i).data('sub'),subnodelist='';
			//has sub
			if(subname){
				var subnode = $('select[data-subname="'+subname+'"]').children();
				//span sub list
				for(var j=0;j<subnode.length;j++){
					//temp add id
					subnodelist+='<span class="opts" data-id="'+subnode.eq(j).data('id')+'" data-ind="'+subname+j+'">'+subnode.eq(j).text()+'</span>';
				}
				_options+='<span class="opts" data-ind="'+i+'">'+$options.eq(i).text()+'<span class="sublist '+subname+'">'+subnodelist+'</span>'+'</span>';
			}else{
				//span list
				_options+='<span class="opts" data-id="'+$options.eq(i).data('id')+'" data-ind="'+i+'">'+$options.eq(i).text()+'</span>';
			}
		}
		//insert ==> page
		$(this).after('<span class="select-span"><span class="select-title '+selectclass+'">'+selectholder+'</span><span class="select-wrapper select-'+selectclass+'-wrapper" >'+_options+'</span></span>');
		//pull
		$('.'+selectclass).on('click',function(){
			var selectbox = $(this).siblings('.select-wrapper');
			$('.select-wrapper').not(selectbox).slideUp();
			selectbox.slideToggle();
			$(this).toggleClass('title-add');
		})
	})
	//selected
	$('.opts').on('click',function(){
		if(!$(this).children().length){
			var selectind = $(this).data('ind');
			$(this).parents('.select-span').find('.select-title').text($(this).text()).end().end().parents('.select-wrapper').slideUp().end().parents('.select-span').find('.select-title').toggleClass('title-add');
			//reset selected
			$(this).parents('.select-span').prev('select').children().removeAttr('selected').end().children().prop('selected',false);
			//set selected
			$(this).parents('.select-span').prev('select').children().eq(selectind).attr('selected','selecter').end().eq(selectind).prop('selected',true);
		}
	})
	//sub list slide
	$('.select-wrapper > .opts').on('mouseenter',function(){
		$(this).siblings().children().slideUp('fast').end().end().children().slideDown('fast');
	})
	//out
	$(document).on('click',function(e){
		var isSelect = $(e.target).parents('.select-span');
		if(!isSelect.length){
			$('.select-wrapper').slideUp().siblings('.select-title').removeClass('title-add');
		}
	})
	$(document).on('mousemove',function(e){
		var isSelect = $(e.target).parents('.select-span');
		if(!isSelect.length){
			$('.select-wrapper .sublist').slideUp();
		}
	})
}

/**
 * Created by zihong on 8/4/15.
 */
(function(window, angular,$,launchApp) {
  'use strict';
  launchApp.directive('customSelect', ['ProjectLaunch',function (projectLaunch) {


  }]);
})(window, window.angular,$,angular.module('launchApp'));

/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('fixsrc', function () {
        return {
            restrict: 'A',
            replace: false,
            scope : {
                fsrc : "="
            },
            link: function (scope, elem, attrs) {

                var $elem = $(elem);
                scope.$watch('fsrc', function(){
                   $(elem).attr("src", scope.fsrc);
                });
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('textInput', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {

                var max = attrs['max'];
                var cls =  attrs['hintClass'] || 'text-length-hint' ;
                var $count = $("<span class='" + cls + "'></span>");

                $(elem[0].parentNode).append($count);
                function setText(){
                    if($(elem).val().length > max){
                        $(elem).val($(elem).val().substring(0, max));
                    }
                    $count.text(max - $(elem).val().length + "/" + max);
                }

                $(elem).bind("input propertychange", function(){
                    setText();

                });

                scope.$watch(attrs.ngModel, function(){
                    setText();
                });
                if(attrs['elastic']){
                    $(elem).elastic();
                }

            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));
/**
 * Created by YL Huang on 2015/7/20.
 */

(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.directive('tooltip', function () {
        /**
         * attrs
         *      title 蹇呴€� 澶氳浣跨敤||鍒嗗壊
         *      direction top bottom lef right
         *      trigger click hover focus锛� 榛樿hover focus榧犳爣婊戝€掑厓绱犳垨鐒︾偣鎺夊厓绱犱笂鏄剧ず
         *      two-dimensional-code false 浜岀淮鐮�/绾㈠寘锛岃灞炴€т负true鏃讹紝content鎴杢itle涓殑鍐呭蹇呴』涓轰簩缁寸爜鐨勫浘鐗噓rl
         */
        return {
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
                    customer_content ='<div><img src="'+customer_content+'" width="300" height="300"></div><div style="text-align: center;font-size: 14px; line-height: 20px;">寰俊鎵笂鏂逛簩缁寸爜鍙戠孩鍖呯粰鏈嬪弸</div>';
                };

                $(elem).tooltip({
                    content:customer_content,
                    animation: true,
                    html : true,
                    trigger : trigger,
                    placement : direction
                });

                var style = '';
                if($(elem).attr('style')){
                    style = $(elem).attr('style').replace('display:block','');
                }
                $(elem).attr('style',style);
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));

/**
 * Created by huangzihong on 15/10/22.
 */

(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.directive('tooltipLottery', function () {
        /**
         * attrs
         *      title 蹇呴€� 澶氳浣跨敤||鍒嗗壊
         *      direction top bottom lef right
         *      trigger click hover focus锛� 榛樿hover focus榧犳爣婊戝€掑厓绱犳垨鐒︾偣鎺夊厓绱犱笂鏄剧ず
         *      two-dimensional-code false 浜岀淮鐮�/绾㈠寘锛岃灞炴€т负true鏃讹紝content鎴杢itle涓殑鍐呭蹇呴』涓轰簩缁寸爜鐨勫浘鐗噓rl
         */
        return {
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
                    customer_content ='<div><img src="'+customer_content+'" width="300" height="300"></div><div style="text-align: center;font-size: 14px; line-height: 20px;">寰俊鎵笂鏂逛簩缁寸爜鍙戠孩鍖呯粰鏈嬪弸</div>';
                };

                $(elem).tooltip({
                    content:customer_content,
                    animation: true,
                    html : true,
                    trigger : trigger,
                    placement : direction
                });

                var style = '';
                if($(elem).attr('style')){
                    style = $(elem).attr('style').replace('display:block','');
                }
                $(elem).attr('style',style);
            }
        };
    });
})(window, window.angular,$,angular.module('launchApp'));

(function(window, angular,$,launchApp) {
    'use strict';
  launchApp.directive('upload',['$rootScope', function ($rootScope) {

    /**
     * scope
     *      model
     * attrs
     *      html
     */
    return {
      scope: {
        model: '=model',
        formData: '=formData',
        itemId: '=itemId',
        onSucc : '&'
      },
      restrict: 'EA',

      link: function (scope, elem, attrs) {
        var upld = attrs['upld'];
        var id;
        if(attrs.index){
          id = 'uplodify_in_repeat_'+attrs.index;
          $(elem).attr('id',id);
        }
        var height = attrs.height || 60;
        $(elem).uploadify({
          queueSizeLimit : 1,
          height: attrs['sHeight'],
          swf: '/static/v3/static/uploadify/uploadify.swf',
          uploader: "/uploadimg",//uc.serviceUrl('avatar/avatar?v=1'),
          width: attrs.sWidth,
          buttonClass : attrs['btnClass'],
          multi : false,
          fileObjName: "images",
          formData: scope.formData,
          fileSizeLimit : "5MB",
          'fileTypeDesc' : '鍥剧墖鏂囦欢',
          'fileTypeExts' : '*.gif; *.jpg; *.png;*.bmp;*.jpeg;',
          onSelectError : function(file, error){
            switch(error){
              case -110:
                uc.modal.alert("閿欒鎻愮ず", "璇锋鏌ュ浘鐗囨牸寮忓拰澶у皬锛屾渶澶т笉鑳借秴杩�5M");
                break;
              case -130:
                uc.modal.alert("閿欒鎻愮ず", "鎮ㄤ笂浼犵殑鏂囦欢鏍煎紡涓嶆纭�!");
                break;
            }
          },
          onUploadStart : function(){
			var formData = this.wrapper.uploadify('settings', 'formData');
			var session_name = $('#session_name').val();
			formData[session_name] = wx.cookie(session_name);
			this.wrapper.uploadify('settings', 'formData', formData);
			
            if(attrs['innerOnly']){

            }else{
              scope.model = uc.staticUrl('v4/uc/images/loading.gif');
              scope.$apply();$()
            }

          },
          onUploadSuccess: function (file, data, response) {

            if (response && data) {
              var result = $.parseJSON(data), images;
              if (result && result.errno == 0) {
                images = result.data.image_data || result.data;
              }
            }

            $rootScope.$broadcast("UPLOAD_IMAGE",upld);
            scope.model = result.data.static_url + images[0].image;

            var itemImages = {
              id: scope.itemId,
              url:scope.model
            };
            $rootScope.$broadcast('REWARD_IMAGE',itemImages);

            $rootScope.$broadcast('BLOCK_IMAGE',true);

            $rootScope.$broadcast('PROJECT_IMAGE',true);

            scope.$apply();



          },
          onUploadError: function (file, errorCode, errorMsg, errorString) {
            scope.model = '';
            scope.$apply();
          },
          onFallback : function() {
              var no_id = $(this).attr('id');
              $('#'+no_id).parent().append('<p style="text-align:center;width:265px;float: left;line-height:64px;">鎮ㄦ病鏈夊畨瑁協lash player~~璇锋偍<a href="http://www.adobe.com/go/getflashplayer" target="_blank" style="color:#51aaf2;">绔嬪嵆瀹夎</a></p>');
              $('#'+no_id).remove();
          }
        });
        //console.log($(elem).attr('id'));
        $(elem).attr('style', attrs.style);
        $('.uploadify-button').html(attrs.html);
        $('.uploadify-queue').remove();
      }
    };

  }]);
})(window, window.angular, $, angular.module('launchApp'));


/**
 * Created by YL Huang on 2015/7/16.
 */
(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.directive('validation',['Forms',function (Forms) {

        /**
         * scope
         *      remoteMethod 杩滅▼楠岃瘉鍑芥暟锛屽繀椤绘槸鍙墽琛屽嚱鏁帮紝杩斿洖promise
         *      remoteMethodParam 杩滅▼楠岃瘉鍑芥暟鐨勫弬鏁帮紝鏁扮粍褰㈠紡浼犲叆
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
         *      valid_type 楠岃瘉绫诲瀷锛屽email锛宼elephone锛岃缁嗚鍙傝methods涓殑瀹氫箟锛屽闇€鑷畾涔夛紝璇烽€傚綋鍚憁ethods涓坊鍔犲嚱鏁�
         *      error_to 蹇呴€夛紝鏄剧ず閿欒淇℃伅鍐呭鐨勫尯鍩焑lement鐨刬d鎴栬€卌lass锛岄€夋嫨鍣ㄥ繀椤诲彧寰楀埌涓€涓猠lement
         *      equal_to 姣旇緝鍊兼槸鍚︾浉绛夛紝浼犲叆姣旇緝瀵硅薄鐨別lement鐨刬d鎴栬€卌lass锛岄€夋嫨鍣ㄥ繀椤诲彧寰楀埌涓€涓猠lement
         *      invalid_data 楠岃瘉鏈€氳繃浼氬湪鏍囩涓婄粦瀹氳灞炴€э紝鎻愪氦涔嬪墠楠岃瘉琛ㄥ崟涓槸鍚﹀瓨鍦ㄦ湁璇ュ睘鎬х殑鍏冪礌
         *      custom_error 鑷畾涔夐敊璇俊鎭紝瀹氫箟杩滅▼楠岃瘉鏈€氳繃鎴栬€呬娇鐢╡qualTo鏈€氳繃鏃舵樉绀虹殑淇℃伅
         */
        return {
            scope : {
                remoteMethod:'=remoteMethod',
                remoteMethodParam:'=remoteMethodParam'

                //model:"=model",
                //step:"=step"
            },
            restrict: 'A',
            replace: true,
            link: function (scope, elem, attrs) {

                var errorMsg ={
                    required : attrs.emptyMsg,
                    error:attrs.errorMsg,
                    waiting:'姝ｅ湪鍚戞湇鍔″櫒楠岃瘉...'
                };
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
                        return /^\w{6,15}$/.test($(elem).val());
                    },
                    fundingAmount:function(){
                        if ($(elem).val() >= 500)
                            return true;
                        else
                            return false;
                    },
                    fundingDays:function(){
                        if ($(elem).val()>=10 && $(elem).val()<=90)
                            return true;
                        else
                            return false;
                    },
                    max999999:function(){
                        if ($(elem).val()>=1 && $(elem).val()<=999999 && /^\d+$/.test($(elem).val()))
                            return true;
                        else
                            return false;
                    },
                    max999:function(){
                        if ($(elem).val()>=0 && $(elem).val()<=999 && /^\d+$/.test($(elem).val()))
                            return true;
                        else
                            return false;
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
                    }
                };

                $(elem).blur(function(){
                    if(attrs.required){
                        if(!methods.required()){
                            $(attrs.errorTo).show().text(errorMsg.required);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
                    if(attrs.validType){
                        if(!methods[attrs.validType]()){
                            var error = attrs.customError || errorMsg.error;
                            $(attrs.errorTo).show().text(error);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
                    if(attrs.fundingAmount){
                        if(!methods[attrs.fundingAmount]()){
                            var error = attrs.customError || errorMsg.error;
                            $(attrs.errorTo).show().text(error);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
                    if(attrs.fundingDays){
                        if(!methods[attrs.fundingDays]()){
                            var error = attrs.customError || errorMsg.error;
                            $(attrs.errorTo).show().text(error);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
                    if(attrs.max999999){
                        if(!methods[attrs.max999999]()){
                            var error = attrs.customError || errorMsg.error;
                            $(attrs.errorTo).show().text(error);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
                    if(attrs.max999){
                        if(!methods[attrs.max999]()){
                            var error = attrs.customError || errorMsg.error;
                            $(attrs.errorTo).show().text(error);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
                    if(attrs.equalTo){
                        if(!methods.equalTo()){
                            var error = attrs.customError || errorMsg.error;
                            $(attrs.errorTo).show().text(error);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
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
                    $(elem).removeAttr('invalid_data');
                    $(attrs.errorTo).hide();
                });
                $(elem).focus(function(){
                    $(attrs.errorTo).hide();
                });
            }
        };


        ///**
        // * scope
        // *      maxLength 鏈€澶ч暱搴�
        // *      minLength 鏈€灏忛暱搴�
        // *      rangeLength 闀垮害鍖洪棿锛屾暟缁勫舰寮忎紶鍏鏈€灏忓€�,鏈€澶у€糫
        // *      maxValue 鏈€澶у€�
        // *      minValue 鏈€灏忓€�
        // *      rangeValue 鍊煎尯闂达紝鏁扮粍褰㈠紡浼犲叆[鏈€灏忓€�,鏈€澶у€糫
        // *      remoteMethod 杩滅▼楠岃瘉鍑芥暟锛屽繀椤绘槸鍙墽琛屽嚱鏁帮紝杩斿洖promise
        // *      remoteMethodParam 杩滅▼楠岃瘉鍑芥暟鐨勫弬鏁帮紝鏁扮粍褰㈠紡浼犲叆
        // *           [
        // *               { isInputTarget : true, '#username' },
        // *               { isInputTarget : true, '.active' },
        // *               { isInputTarget : false, 13922311345 }
        // *               ...
        // *           ]
        // * attrs
        // *      label 蹇呴€�
        // *      required
        // *      valid_type 楠岃瘉绫诲瀷锛屽email锛宼elephone锛岃缁嗚鍙傝methods涓殑瀹氫箟锛屽闇€鑷畾涔夛紝璇烽€傚綋鍚憁ethods涓坊鍔犲嚱鏁�
        // *      error_to 蹇呴€夛紝鏄剧ず閿欒淇℃伅鍐呭鐨勫尯鍩焑lement鐨刬d鎴栬€卌lass锛岄€夋嫨鍣ㄥ繀椤诲彧寰楀埌涓€涓猠lement
        // *      equal_to 姣旇緝鍊兼槸鍚︾浉绛夛紝浼犲叆姣旇緝瀵硅薄鐨別lement鐨刬d鎴栬€卌lass锛岄€夋嫨鍣ㄥ繀椤诲彧寰楀埌涓€涓猠lement
        // *      invalid_data 楠岃瘉鏈€氳繃浼氬湪鏍囩涓婄粦瀹氳灞炴€э紝鎻愪氦涔嬪墠楠岃瘉琛ㄥ崟涓槸鍚﹀瓨鍦ㄦ湁璇ュ睘鎬х殑鍏冪礌
        // *      custom_error 鑷畾涔夐敊璇俊鎭紝瀹氫箟杩滅▼楠岃瘉鏈€氳繃鎴栬€呬娇鐢╡qualTo鏈€氳繃鏃舵樉绀虹殑淇℃伅
        // */
        //return {
        //    scope : {
        //        maxLength:'=maxLength',
        //        minLength:'=minLength',
        //        rangeLength:'=rangeLength',
        //        maxValue:'=maxValue',
        //        minValue:'=minValue',
        //        rangeValue:'=rangeValue',
        //        remoteMethod:'=remoteMethod',
        //        remoteMethodParam:'=remoteMethodParam'
        //    },
        //    restrict: 'A',
        //    replace: true,
        //    link: function (scope, elem, attrs) {
        //        var errorMsg ={
        //            required : '璇疯緭鍏�'+attrs.label,
        //            error:attrs.label+'鏍煎紡涓嶆纭�',
        //            waiting:'姝ｅ湪鍚戞湇鍔″櫒楠岃瘉...'
        //        };
        //        var methods = {
        //            required: function() {
        //                return $.trim($(elem).val()).length>0;
        //            },
        //            telephone:function(){
        //                return /^0\d{2,3}-?\d{7,8}$/.test($(elem).val());
        //            },
        //            mobilePhone:function(){
        //                return /^1[3|4|5|7|8][0-9]\d{8}$/.test($(elem).val());
        //            },
        //            postCode:function(){
        //                return /^[1-9][0-9]{5}$/.test($(elem).val());
        //            },
        //            money:function(){
        //                return /^\d+(\.\d{1,2})?$/.test($(elem).val());
        //            },
        //            number: function () {
        //                return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test($(elem).val());
        //            },
        //            digits: function () {
        //                return /^\d+$/.test($(elem).val());
        //            },
        //            email: function () {
        //                return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test($(elem).val());
        //            },
        //            url: function () {
        //                return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test($(elem).val());
        //            },
        //            date: function () {
        //                return !/Invalid|NaN/.test(new Date($(elem).val()).toString());
        //            },
        //            dateISO: function () {
        //                return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test($(elem).val());
        //            },
        //            minLength: function () {
        //                return scope.minLength <= $.trim($(elem).val()).length;
        //            },
        //            maxLength: function () {
        //                return scope.maxLength >= $.trim($(elem).val()).length;
        //            },
        //            rangeLength: function () {
        //                var length = $.trim($(elem).val()).length;
        //                return ( length >= scope.rangeLength[0] && length <= scope.rangeLength[1] );
        //            },
        //            min: function () {
        //                return  $.trim($(elem).val()) >= scope.minValue;
        //            },
        //            max: function () {
        //                return  $.trim($(elem).val()) <= scope.maxValue;
        //            },
        //            range: function () {
        //                var value = $.trim($(elem).val());
        //                return ( value >= scope.rangeValue[0] && value <= scope.rangeValue[1] );
        //            },
        //            equalTo: function () {
        //                var sourceValue =  $.trim($(elem).val());
        //                var targetValue = $.trim($(attrs.equalTo).val());
        //                return sourceValue == targetValue;
        //            }
        //        };
        //
        //        $(elem).blur(function(){
        //            if(attrs.required){
        //                if(!methods.required()){
        //                    $(attrs.errorTo).show().text(errorMsg.required);
        //                    $(elem).attr('invalid_data','true');
        //                    return;
        //                }
        //            }
        //            if(attrs.validType){
        //                if(!methods[attrs.validType]()){
        //                    var error = attrs.customError || errorMsg.error;
        //                    $(attrs.errorTo).show().text(error);
        //                    $(elem).attr('invalid_data','true');
        //                    return;
        //                }
        //            }
        //            if(scope.remoteMethod){
        //                var arg=[];
        //                for(var item in scope.remoteMethodParam){
        //                    if(item.isInputTarget){
        //                        arg.push($.trim($(item.value)));
        //                    }else{
        //                        arg.push(item.value);
        //                    }
        //                };
        //                $(elem).attr('invalid_data','true');
        //                $(attrs.errorTo).show().text(errorMsg.waiting);
        //                scope.remoteMethod.apply(null,arg).then(function(data){
        //                    if(data.success){
        //                        $(attrs.errorTo).hide();
        //                        $(elem).removeAttr('invalid_data');
        //                    }else{
        //                        $(attrs.errorTo).show().text(attrs.custom_error);
        //                    }
        //                });
        //
        //                return;
        //            }
        //            $(elem).removeAttr('invalid_data');
        //            $(attrs.errorTo).hide();
        //        });
        //    }
        //};

    }]);
})(window, window.angular,$,angular.module('launchApp'));

/**
 * Created by YL Huang on 2015/7/21.
 */
(function(window, angular,launchApp) {
    'use strict';
    launchApp.filter('partialHide', function () {

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
})(window, window.angular,angular.module('launchApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.factory('Common', ['$http', '$q', function ($http, $q) {
        return {
            httpPost: function (url, parma, skip_error) {
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
                    if (data.errno) {
                        setTimeout(function () {
                            if(!skip_error)
                                uc.modal.alert('淇℃伅鎻愮ず', data.error);
                        }, 300);
                        //defer.resolve({error: 1});
                    } else {
                        defer.resolve(data.data);
                    }
                }).error(function () {
                    uc.modal.alert('淇℃伅鎻愮ず', '缃戠粶寮傚父锛岃绋嶅悗鍐嶈瘯锛�');
                    defer.reject();
                });
                return defer.promise;
            },
            httpPost1: function (url, parma) {
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

                    defer.resolve(data);
                }).error(function () {
                    uc.modal.alert('淇℃伅鎻愮ず', '缃戠粶寮傚父锛岃绋嶅悗鍐嶈瘯锛�');
                    defer.reject();
                });
                return defer.promise;
            },
            httpGet:function(url,parma){
                var defer = $q.defer();
                $http({method: 'GET',url: url,params: parma}).success(function (data) {
                    defer.resolve(data);
                }).error(function () {
                    uc.modal.alert('淇℃伅鎻愮ず','缃戠粶寮傚父锛岃绋嶅悗鍐嶈瘯锛�');
                    defer.reject();
                });
                return defer.promise;
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

})(window, window.angular,$,angular.module('launchApp'));

/**
 */

(function(window, angular,$,launchApp) {
	launchApp.factory("ProjectLaunch", ["$http", "$q",'Common', 'httpMock', '$rootScope', function($http, $q, Common,httpMock,$rootScope){

		var ProjectLaunch = function(projectID){
			/**
			 * 椤圭洰鐨処D,涓€涓槸鍔犲瘑鐨勶紝涓€涓槸鏈姞瀵嗙殑
			 */

			var I = null;


			this.isNew = true;
			this.allowSaveDraft = false;
			this.startSaveDraft = function(){
				var _s = this;
				if(I){return;}
				I = setInterval(function(){
					_s.save_draft();
				}, 60000);
			};

			this.stopSaveDraft = function(){
				clearInterval(I);
			};

			/**
			 *鍏ㄥ眬
			 */
				//鍏ㄥ眬姝ラ瀹氫綅
			this.get_page_step = function(step){
				this.step = step;
				$rootScope.$broadcast("PAGE_STEP", this.step);
			};

			this.get_comm_status = function(){
				return this.commSuccess;
			};

			this.get_basic_status = function(){
				return this.basicSuccess;
			};

			this.get_project_status = function(){
				return this.projectSuccess;
			};


			this.get_detail_status = function(){
				return this.detailSuccess;
			};

			this.get_rewards_status = function(){
				return this.rewardsSuccess;
			};

			this.get_start = function(projectID){
				this.commSuccess = '';
				var svcUrl_test = uc.serviceUrl("project/draftproject?v=3");
				$http.get(svcUrl_test).then(function(data){
					if(data.data.data.draft_project){

						projectID = data.data.data.draft_project.id;
						$rootScope.$broadcast("START_HTTP", data.data);
					}
					var svcUrl = uc.psvc_url(
							{url : 'project/basicinfo?v=3',name : 'basicInfo', data:{dealID:projectID}}
					);
					var promise = $http.get(svcUrl);
					promise.then.call(this, function(data){
						$rootScope.$broadcast("START_HTTP", data.data);

					});

				});

			};


			this.get_dealID = function(){
				return this.dealID;
			};

			//棰勮椤甸潰
			this.preview_info = {
				basic_preview_info:{},
				project_preview_info:{},
				detail_preview_info:{},
				rewards_preview_info:{}
			};

			this.get_deal = function(){
				this.preview_info.basic_preview_info = this.basic_info_total;
				this.preview_info.project_preview_info = this.project_info_total;
				this.preview_info.detail_preview_info = this.detail_info_total;
				this.preview_info.rewards_preview_info = this.rewards_info_total;
				$rootScope.$broadcast("PREVIEWINFO_GOT", this.preview_info);
			};

			this.agreeAndPublish = function(){

				if (this.basic_info_total.is_org == 0){
					this.certs_post = this.basic_info_total.cert_list_person;
				}

				if (this.basic_info_total.is_org == 1){
					this.certs_post = this.basic_info_total.cert_list_org;
				}

				var basic_post = {
					dealID:this.dealID,
					is_org:this.basic_info_total.is_org,
					categoryID:this.basic_info_total.categoryID||'',
					fees_id:this.basic_info_total.fees_id||'',
					certs:angular.toJson(this.certs_post)||'',
					org_name:this.basic_info_total.org_name||'',
					org_licence:this.basic_info_total.org_licence||'',
					org_address:this.basic_info_total.org_address||'',
					legal_person:this.basic_info_total.legal_person||'',
					contact_name:this.basic_info_total.contact_name||'',
					contact_mobile:this.basic_info_total.contact_mobile||'',
                    org_call_name:this.basic_info_total.org_call_name||'',
                    org_call_address:this.basic_info_total.org_call_address||'',
                    org_call_tel:this.basic_info_total.org_call_tel||'',

					id_card:this.basic_info_total.id_card||'',
					true_name:this.basic_info_total.true_name||'',
					mobile:this.basic_info_total.mobile||'',
                    callName:this.basic_info_total.callName||'',
                    callTel:this.basic_info_total.callTel||'',
					province:this.basic_info_total.province||'',
					city:this.basic_info_total.city||'',
					address:this.basic_info_total.address||''
				};
				var cate_ids = _.map(_.filter(this.project_info_total.cate_tags, function(item){
					return item.active;
				}), function(item){
					return item.id;
				});
				var project_post = {

					dealID:this.dealID||'',
					image:this.project_info_total.image||'',
					name:this.project_info_total.name||'',
					brief:this.project_info_total.brief||'',
					project_province:this.project_info_total.project_province||'',
					project_city:this.project_info_total.project_city||'',

					project_province_id:this.project_info_total.project_province_id||'',
					project_city_id:this.project_info_total.project_city_id||'',

					limit_price:this.project_info_total.limit_price||'',
					deal_days:this.project_info_total.deal_days||'',
					cate_tags:angular.toJson(cate_ids),
					user_tag:this.project_info_total.user_tag||''

				};

				var blockList = [];
				blockList = _.filter(this.detail_info_total.new_desc, function(block){
					//return block.saved;
					return block.title||block.content||block.src;
				});
				var detail_post = {

					dealID:this.dealID,
					video_link:this.detail_info_total.video_link||'',
					video_thumb:this.detail_info_total.video_thumb||'',
					new_desc:angular.toJson(blockList)||''

				};

				var items = [];
				items = _.filter(this.rewards_info_total, function(item){
					return item.saved;
				});
				var rewards_post = {

					dealID:this.dealID,
					items:angular.toJson(items)||''

				};

				var self = this;
				var promise_basic = Common.httpPost1(uc.serviceUrl("project/basicinfo?v=3"), basic_post);
				var defer = $q.defer();
				promise_basic.then(function(data_basic){

					if (data_basic.errno != 0){
						uc.modal.alert("閿欒鎻愮ず", data_basic.error);
						return false;
					}
					if (data_basic.errno == 0){

						var promise_project = Common.httpPost1(uc.serviceUrl("project/projectinfo?v=3"), project_post);
						promise_project.then(function(data_project){
							if (data_project.errno != 0){
								uc.modal.alert("閿欒鎻愮ず", data_project.error);
								return false;
							}
							if (data_project.errno == 0){
								var promise_detail = Common.httpPost1(uc.serviceUrl("project/detail?v=3"), detail_post);
								promise_detail.then.call(this, function(data_detail){

									if (data_detail.errno != 0){

										uc.modal.alert("閿欒鎻愮ず", data_detail.error);
										return false;
									}
									if (data_detail.errno == 0){
										var promise_rewards = Common.httpPost1(uc.serviceUrl("project/items?v=3"), rewards_post);
										promise_rewards.then.call(this, function(data_rewards){

											if (data_rewards.errno != 0){

												uc.modal.alert("閿欒鎻愮ず", data_rewards.error);
												return false;
											}
											if (data_detail.errno == 0){

												var promise_submit = Common.httpPost1(uc.serviceUrl("project/submit?v=3"), {dealID: self.dealID});
												promise_submit.then.call(this, function(data_submit){
													if (data_submit.errno != 0){

														uc.modal.alert("閿欒鎻愮ず", data_submit.error);
														return false;
													}
													if (data_detail.errno == 0){
														defer.resolve();
														console.log('鍙戝竷鎴愬姛鍟婏紒锛侊紒')
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
				return defer.promise;
			};// 缁撴潫

			//淇濆瓨鑽夌ǹ

			this.save_draft = function(){

				if(!this.allowSaveDraft){return;}
				if(!this.basic_info_total){return;}
				if(this.basic_info_total.cert_list_person){
					var tmpCerts_person = [];
					for ( var i = 0; i<this.basic_info_total.cert_list_person.length; i++){
						tmpCerts_person[i]=
						{
							id:this.basic_info_total.cert_list_person[i].id,
							url:this.basic_info_total.cert_list_person[i].url
						};
					}
					this.certs_person_draft = tmpCerts_person;
				}

				if(this.basic_info_total.cert_list_org){
					var tmpCerts_org = [];

					for ( var i = 0; i<this.basic_info_total.cert_list_org.length; i++){
						tmpCerts_org[i]=
						{
							id:this.basic_info_total.cert_list_org[i].id,
							url:this.basic_info_total.cert_list_org[i].url
						};
					}
					this.certs_org_draft = tmpCerts_org;
				}

				if(!this.basic_info_total.cert_list_person){
					this.currentCatePerson = this.basic_info_total.cate_list.person[0];
					for (var i = 0; i<this.basic_info_total.cate_list.person.length; i++){
						if (this.basic_info_total.cate_list.person[i].categoryID == this.basic_info_total.categoryID){
							this.currentCatePerson = this.basic_info_total.cate_list.person[i];
							this.certs_person_draft = this.currentCatePerson.certs ;
						}
					}

				}

				if(!this.basic_info_total.cert_list_org){

					this.currentCateOrg = this.basic_info_total.cate_list.org[0];
					for (var i = 0; i<this.basic_info_total.cate_list.org.length; i++){
						if (this.basic_info_total.cate_list.org[i].categoryID == this.basic_info_total.categoryID){
							this.currentCateOrg = this.basic_info_total.cate_list.org[i];
							this.certs_org_draft = this.currentCateOrg.certs;
						}
					}

				}

				this.certs_draft = {
					person:this.certs_person_draft,
					org:this.certs_org_draft
				};

				var cate_ids = _.map(_.filter(this.project_info_total.cate_tags, function(item){
					return item.active;
				}), function(item){
					return item.id;
				});

				var draft_post = {
					dealID:this.dealID,
					is_org:this.basic_info_total.is_org||'',
					categoryID:this.basic_info_total.categoryID||'',
					fees_id:this.basic_info_total.fees_id||'',
					certs:angular.toJson(this.certs_draft)||'',
					org_name:this.basic_info_total.org_name||'',
					org_licence:this.basic_info_total.org_licence||'',
					org_address:this.basic_info_total.org_address||'',
					legal_person:this.basic_info_total.legal_person||'',
					contact_name:this.basic_info_total.contact_name||'',
					contact_mobile:this.basic_info_total.contact_mobile||'',
                    org_call_name:this.basic_info_total.org_call_name||'',
                    org_call_address:this.basic_info_total.org_call_address||'',
                    org_call_tel:this.basic_info_total.org_call_tel||'',
					id_card:this.basic_info_total.id_card||'',
					true_name:this.basic_info_total.true_name||'',
					mobile:this.basic_info_total.mobile||'',
                    callName:this.basic_info_total.callName||'',
                    callTel:this.basic_info_total.callTel||'',
					province:this.basic_info_total.province||'',
					city:this.basic_info_total.city||'',
					address:this.basic_info_total.address||'',

					image:this.project_info_total.image||'',
					name:this.project_info_total.name||'',
					brief:this.project_info_total.brief||'',
					project_province:this.project_info_total.project_province||'',
					project_city:this.project_info_total.project_city||'',

					project_province_id:this.project_info_total.project_province_id||'',
					project_city_id:this.project_info_total.project_city_id||'',

					limit_price:this.project_info_total.limit_price||'',
					deal_days:this.project_info_total.deal_days||'',
					cate_tags:angular.toJson(cate_ids)||'',
					user_tag:this.project_info_total.user_tag||'',

					video_link:this.detail_info_total.video_link||'',
					video_thumb:this.detail_info_total.video_thumb||'',
					new_desc:angular.toJson(this.detail_info_total.new_desc)||'',
					items:angular.toJson(this.rewards_info_total)||'',
					checked:this.finish_check.basicInfo +' ' + this.finish_check.projectInfo +' ' + this.finish_check.detailInfo +' ' + this.finish_check.rewards
				}


				var promise = Common.httpPost(uc.serviceUrl("project/draft?v=3"), draft_post, true);

				promise.then.call(this, function(data){
					$rootScope.$broadcast("DRAFT_POST", data);
				});
			};


			//鏍￠獙姣忎竴姝ユ槸鍚﹀畬鎴�
			this.finish_check = {
				basicInfo:false,
				projectInfo:false,
				detailInfo:false,
				rewards:false
			};


			this.save_basic_checked = function(basic_checked){
				this.finish_check.basicInfo = basic_checked;
				$rootScope.$broadcast("FINISH_CHECKED", {basicInfo : basic_checked});
			};

			this.save_project_checked = function(project_checked){
				this.finish_check.projectInfo = project_checked;

				$rootScope.$broadcast("FINISH_CHECKED", {projectInfo : project_checked});
			};

			this.save_detail_checked = function(detail_checked){
				this.finish_check.detailInfo = detail_checked;

				$rootScope.$broadcast("FINISH_CHECKED", {detailInfo : detail_checked});

			};

			this.save_rewards_checked = function(rewards_checked){
				this.finish_check.rewards = rewards_checked;
				$rootScope.$broadcast("FINISH_CHECKED", {rewards : rewards_checked});
			};

			this.get_finish_checked = function () {
				$rootScope.$broadcast("MAIN_FINISH_CHECKED", this.finish_check);
			};



			//鍏ㄥ眬璇锋眰鏁版嵁


			this.new_block = [
                {
                    blockId:1,
                    type: 'text',
                    title: '椤圭洰鏁呬簨',
                    content: '浠ヤ竴涓紩浜烘敞鐩殑鏁呬簨寮€绡囷紝璁╂敮鎸佽€呮効鎰忕户缁湅浣犵殑椤圭洰',
                    src: '',
                    saved: true
                },
                {
                    blockId:2,
                    type: 'text',
                    title: '鎴戦渶瑕佹洿澶氱殑鏀寔',
                    content: '鍛婅瘔鏀寔鑰咃紝浣犵編濡欑殑姊︽兂鎴栨畫閰风殑鐜板疄锛屼负浠€涔堥渶瑕佸ぇ瀹剁殑鏀寔',
                    src: '',
                    saved: true
                },
                {
                    blockId:3,
                    type: 'text',
                    title: '鎴戞彁渚涚殑椤圭洰鍥炴姤',
                    content: '涓轰簡鎰熻阿澶у鐨勬敮鎸侊紝浣犲簲璇ュ噯澶囦竴浜涘洖鎶ワ紝鍥炴姤鍐呭闄や簡璇︾粏鐨勬枃瀛楁弿杩板拰娓呮櫚缇庤鐨勫浘鐗囷紝涔熶笉瑕佸繕璁板啓涓婂彂鍑哄洖鎶ョ殑鏃堕棿銆�',
                    src: '',
                    saved: true
                },
                {
                    blockId:4,
                    type: 'text',
                    title: '鍏充簬鎴�',
                    content: '浠嬬粛鑷繁鍜屼綘椤圭洰鍥㈤槦鐨勬垚鍛橈紝璇蜂娇鐢ㄧ湡璇氳川鏈寸殑鏂囧瓧',
                    src: '',
                    saved: true
                },
                {
                    blockId:5,
                    type: 'image',
                    title: '',
                    content: '',
                    src: '',
                    saved: false
                }]

			this.new_reward = [
				{
					rewardId:1,
					itemID:0,
					return_type:1,
					extra_need:{
						user_name:0,
						mobile:0,
						email:0
					},
					price:null,
					title:'',
					lottery_number:2,
					lottery_rules:{per:null},
					lottery_type:1,
					lottery_checked:0,
					description:'',
					limit_user:0,
					delivery_fee:0,
					repaid_day:0,
					images:[],
					saved:false
				}
			]

			this.common_http = function(projectID){
				var _s = this;
				var defer = $q.defer();
				var svcUrl = uc.psvc_url(
					{url : 'project/basicinfo?v=3',name : 'basicInfo', data:{dealID:projectID}},
					{url : 'project/projectinfo?v=3', name : "projectInfo", data:{dealID:projectID}},
					{url : 'project/detail?v=3', name : "detailInfo", data:{dealID:projectID}},
					{url : 'project/items?v=3', name : "rewardsInfo", data:{dealID:projectID}}
				);
				var promise = $http.get(svcUrl);
				promise.then(function(data){

					if(data.data.errors){
						for(var key in data.data.errors){
							var item = data.data.errors[key];
							if(item.errno == '1004'){
								zc.show_login(function(){
									$rootScope.$broadcast("LOGINED");
								});
								return false;
							}else{
								uc.modal.alert("閿欒鎻愮ず", item.error, function(){
									uc.modal.close();
									window.history.go(-1);
								});
							}
						}
					}
					defer.resolve(data);
					setTimeout(function(){
						_s.allowSaveDraft = true;
					}, 1000);
					this.allowSaveDraft = true;
					_s.startSaveDraft();
				}, function(){
					defer.reject(data);
				});
				return defer.promise;
			}

			/**
			 *1.鍩烘湰淇℃伅椤�
			 */

				//鑾峰彇鍩烘湰淇℃伅

			this.get_basic_http = function(projectID){


				var promise = this.common_http(projectID);
				var self=this;
				promise.then.call(this, function(data){

					if(data.data.basicInfo.checked){
					var checkedList = data.data.basicInfo.checked.split(' ');

					self.finish_check.basicInfo = eval(checkedList[0]);
					self.finish_check.projectInfo = eval(checkedList[1]);
					self.finish_check.detailInfo = eval(checkedList[2]);
					self.finish_check.rewards = eval(checkedList[3]);

					self.save_basic_checked(eval(checkedList[0]));
					self.save_project_checked(eval(checkedList[1]));
					self.save_detail_checked(eval(checkedList[2]));
					self.save_rewards_checked(eval(checkedList[3]));
					self.get_finish_checked();
					}

					if(!data.data.basicInfo.checked){
						self.finish_check.basicInfo = false;
						self.finish_check.projectInfo = false;
						self.finish_check.detailInfo = false;
						self.finish_check.rewards = false;

						self.save_basic_checked(false);
						self.save_project_checked(false);
						self.save_detail_checked(false);
						self.save_rewards_checked(false);
						self.get_finish_checked();
					}

					self.dealID = data.data.basicInfo.dealID;

					self.person_status = data.data.basicInfo.identity.person.status;
					self.org_status = data.data.basicInfo.identity.org.legal_status;

					self.currentCatePerson = data.data.basicInfo.cate_list.person[0];
					self.currentCateOrg = data.data.basicInfo.cate_list.org[0];

					//榛樿鐨勮涓氬垎绫婚€夋嫨
					for (var i = 0; i<data.data.basicInfo.cate_list.person.length; i++){
						if (data.data.basicInfo.cate_list.person[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCatePerson = data.data.basicInfo.cate_list.person[i];
						}
					}

					for (var i = 0; i<data.data.basicInfo.cate_list.org.length; i++){
						if (data.data.basicInfo.cate_list.org[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCateOrg = data.data.basicInfo.cate_list.org[i];
						}
					}

					var initialFeesId =  _.first(_.filter(data.data.basicInfo.fees_list, function(item){return item.fees_rate == data.data.basicInfo.fees_rate; }));

					if(initialFeesId){
						self.fees_id = initialFeesId.id;
					}
					if(!initialFeesId){
						self.fees_id = data.data.basicInfo.fees_list[0].id;
					}

					var basic_refresh = {
						is_org:data.data.basicInfo.is_org,
						categoryID:data.data.basicInfo.categoryID,
						fees_id:self.fees_id,
						//certs:data.data.basicInfo.cert_list,
						cert_list_person:self.currentCatePerson.certs,
						cert_list_org:self.currentCateOrg.certs,

						person_status:self.person_status,
						org_status:self.org_status,

						org_name:data.data.basicInfo.identity.org.org_name,
						org_licence:data.data.basicInfo.identity.org.org_licence,
						org_address:data.data.basicInfo.identity.org.org_address,
						legal_person:data.data.basicInfo.identity.org.legal_person,
						contact_name:data.data.basicInfo.identity.org.contact_name,
						contact_mobile:data.data.basicInfo.identity.org.contact_mobile,
                        org_call_name:data.data.basicInfo.identity.org.org_call_name,
                        org_call_address:data.data.basicInfo.identity.org.org_call_address,
                        org_call_tel:data.data.basicInfo.identity.org.org_call_tel,

						id_card:data.data.basicInfo.identity.person.id_card,
						true_name:data.data.basicInfo.identity.person.true_name,
						mobile:data.data.basicInfo.identity.person.mobile,
                        callName:data.data.basicInfo.identity.person.callName,
                        callTel:data.data.basicInfo.identity.person.callTel,
						province:data.data.basicInfo.identity.person.province,
						city:data.data.basicInfo.identity.person.city,

						address:data.data.basicInfo.identity.person.address,

						cate_list_person:data.data.basicInfo.cate_list.person,
						cate_list_org:data.data.basicInfo.cate_list.org,
						//cert_list:data.data.basicInfo.cert_list,
						fees_list:data.data.basicInfo.fees_list,
						fees_rate:data.data.basicInfo.fees_rate,
						currentCatePerson:self.currentCatePerson,
						currentCateOrg:self.currentCateOrg
					};

					self.basic_info_total = basic_refresh;
					self.project_info_total = data.data.projectInfo;
					self.detail_info_total = data.data.detailInfo;
					self.rewards_info_total = data.data.rewardsInfo.items;
					self.person_status = data.data.basicInfo.identity.person.status;
					self.org_status = data.data.basicInfo.identity.org.legal_status;

					if(data.data.detailInfo.new_desc[0] == null){
						self.detail_info_total = {
							video_link: data.data.detailInfo.video_link,
							video_thumb: data.data.detailInfo.video_thumb,
							new_desc: self.new_block

						};
						self.blockId = 5;
					}
					if(data.data.detailInfo.new_desc[0]!= null){
						var tmpDetail = data.data.detailInfo.new_desc;

						for (var i=0; i<tmpDetail.length; i++){
							tmpDetail[i]={
								blockId: i+1,
								type:tmpDetail[i].type,
								title:tmpDetail[i].title,
								content:tmpDetail[i].content,
								src:tmpDetail[i].src,
								saved:tmpDetail[i].saved
							}
						}

						self.detail_info_total = {
							video_link:data.data.detailInfo.video_link,
							video_thumb:data.data.detailInfo.video_thumb,
							new_desc: tmpDetail
						};
						self.blockId = data.data.detailInfo.new_desc.length+1;
					}

					if(data.data.rewardsInfo.items[0] == null){

						self.rewards_info_total = self.new_reward;
						self.rewardId = 2;
						self.itemLen = 1;
						self.lottery_reward_num = 0;
					}

					if(data.data.rewardsInfo.items[0] != null){

						self.lottery_reward_num = 0;
						var tmpRewards = data.data.rewardsInfo.items;
						for (var i=0; i<tmpRewards.length; i++){
							if(tmpRewards[i].return_type == 4){
								self.lottery_reward_num += 1;
							}
							tmpRewards[i]={
								rewardId: i+1,
								itemID:tmpRewards[i].itemID,
								return_type:tmpRewards[i].return_type,
								extra_need:tmpRewards[i].extra_need,
								price:tmpRewards[i].price,
								title:tmpRewards[i].title,
								lottery_number:tmpRewards[i].lottery_number,
								lottery_rules:tmpRewards[i].lottery_rules,
								lottery_type:tmpRewards[i].lottery_type,
								lottery_checked:tmpRewards[i].lottery_checked,
								description:tmpRewards[i].description,
								limit_user:tmpRewards[i].limit_user,
								delivery_fee:tmpRewards[i].delivery_fee,
								repaid_day:tmpRewards[i].repaid_day,
								images:tmpRewards[i].images,
								saved:tmpRewards[i].saved
							}
						}
						self.rewards_info_total = tmpRewards;
						self.rewardId = data.data.rewardsInfo.items.length+1;
						self.itemLen = data.data.rewardsInfo.items.length;
					}

					self.commSuccess = data.statusText;
					setTimeout(function(){
						self.allowSaveDraft = true;
					}, 1000);
					$rootScope.$broadcast("BASIC_HTTP", self.basic_info_total);

				})
				$rootScope.$broadcast("BASIC_RE", projectID);
			};

			this.get_basic_info = function(){
				var _s = this;
				setTimeout(function(){
					$rootScope.$broadcast("BASIC_LOAD", _s.basic_info_total);
				});
			};

			//鎻愪氦鍩烘湰淇℃伅(POST)
			this.submit_basic_info = function(postdata){
				var promise = Common.httpPost(uc.serviceUrl("project/basicinfo?v=3"), postdata);
				promise.then.call(this, function(data){
					$rootScope.$broadcast("BASICINFO_POST", data);
				});
			};

			//寰楀埌鍒濆鍩烘湰淇℃伅
			this.get_basic_initial = function(){
				return this.basic_info_total;
			};

			this.get_person_status = function(){
				return this.person_status;
			};

			this.get_org_status = function(){
				return this.org_status;
			};

			//寰楀埌鍩烘湰淇℃伅鐨勫湴鍧€
			this.get_basic_province = function(){
				return this.basic_info_total.province;
			}

			this.get_basic_city = function(){
				return this.basic_info_total.city;
			}

			//淇濆瓨鍩烘湰淇℃伅(POST)
			this.save_basic_total = function(savedData){
				this.basic_info_total = savedData;
			};

			//绗竴姝ヤ繚瀛橀」鐩甀d
			this.save_dealId = function(did){
				this.dealID = did;
			};

			this.select_cate = function(){
				return this.basic_info_total.categoryID;

			}


			/**
			 *2.椤圭洰淇℃伅椤�
			 */

				//

			this.get_project_http = function(projectID){

				var promise = this.common_http(projectID);
				var self=this;
				promise.then.call(this, function(data){

					var checkedList = data.data.basicInfo.checked.split(' ');

					self.finish_check.basicInfo = eval(checkedList[0]);
					self.finish_check.projectInfo = eval(checkedList[1]);
					self.finish_check.detailInfo = eval(checkedList[2]);
					self.finish_check.rewards = eval(checkedList[3]);

					self.save_basic_checked(eval(checkedList[0]));
					self.save_project_checked(eval(checkedList[1]));
					self.save_detail_checked(eval(checkedList[2]));
					self.save_rewards_checked(eval(checkedList[3]));
					self.get_finish_checked();

					self.dealID = data.data.basicInfo.dealID;
					self.person_status = data.data.basicInfo.identity.person.status;
					self.org_status = data.data.basicInfo.identity.org.legal_status;

					self.currentCatePerson = data.data.basicInfo.cate_list.person[0];
					self.currentCateOrg = data.data.basicInfo.cate_list.org[0];

					//榛樿鐨勮涓氬垎绫婚€夋嫨
					for (var i = 0; i<data.data.basicInfo.cate_list.person.length; i++){
						if (data.data.basicInfo.cate_list.person[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCatePerson = data.data.basicInfo.cate_list.person[i];
						}
					}

					for (var i = 0; i<data.data.basicInfo.cate_list.org.length; i++){
						if (data.data.basicInfo.cate_list.org[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCateOrg = data.data.basicInfo.cate_list.org[i];
						}
					}

					var initialFeesId =  _.first(_.filter(data.data.basicInfo.fees_list, function(item){return item.fees_rate == data.data.basicInfo.fees_rate; }));

					if(initialFeesId){
						self.fees_id = initialFeesId.id;
					}
					if(!initialFeesId){
						self.fees_id = data.data.basicInfo.fees_list[0].id;
					}


					var basic_refresh = {
						is_org:data.data.basicInfo.is_org,
						categoryID:data.data.basicInfo.categoryID,
						//fees_id:data.data.basicInfo.fees_list[0].id,
						//certs:data.data.basicInfo.cert_list,
						cert_list_person:self.currentCatePerson.certs,
						cert_list_org:self.currentCateOrg.certs,


						org_name:data.data.basicInfo.identity.org.org_name,
						org_licence:data.data.basicInfo.identity.org.org_licence,
						org_address:data.data.basicInfo.identity.org.org_address,
						legal_person:data.data.basicInfo.identity.org.legal_person,
						contact_name:data.data.basicInfo.identity.org.contact_name,
						contact_mobile:data.data.basicInfo.identity.org.contact_mobile,
                        org_call_tel:data.data.basicInfo.identity.org.org_call_tel,
                        org_call_address:data.data.basicInfo.identity.org.org_call_address,
                        org_call_tel:data.data.basicInfo.identity.org.org_call_tel,

						id_card:data.data.basicInfo.identity.person.id_card,
						true_name:data.data.basicInfo.identity.person.true_name,
						mobile:data.data.basicInfo.identity.person.mobile,
                        callName:data.data.basicInfo.identity.person.callName,
                        callTel:data.data.basicInfo.identity.person.callTel,
						province:data.data.basicInfo.identity.person.province,
						city:data.data.basicInfo.identity.person.city,

						address:data.data.basicInfo.identity.person.address,

						cate_list_person:data.data.basicInfo.cate_list.person,
						cate_list_org:data.data.basicInfo.cate_list.org,
						//cert_list:data.data.basicInfo.cert_list,
						fees_list:data.data.basicInfo.fees_list,
						fees_rate:data.data.basicInfo.fees_rate,
						fees_id:self.fees_id,
						currentCatePerson:self.currentCatePerson,
						currentCateOrg:self.currentCateOrg
					};

					self.basic_info_total = basic_refresh;
					self.project_info_total = data.data.projectInfo;
					self.detail_info_total = data.data.detailInfo;
					self.rewards_info_total = data.data.rewardsInfo.items;

					if(data.data.detailInfo.new_desc[0] == null){
						self.detail_info_total = {
							video_link: data.data.detailInfo.video_link,
							video_thumb: data.data.detailInfo.video_thumb,
							new_desc: self.new_block
						};
						self.blockId = 5;
					}
					if(data.data.detailInfo.new_desc[0]!= null){
						var tmpDetail = data.data.detailInfo.new_desc;

						for (var i=0; i<tmpDetail.length; i++){
							tmpDetail[i]={
								blockId: i+1,
								type:tmpDetail[i].type,
								title:tmpDetail[i].title,
								content:tmpDetail[i].content,
								src:tmpDetail[i].src,
								saved:tmpDetail[i].saved
							}
						}

						self.detail_info_total = {
							video_link:data.data.detailInfo.video_link,
							video_thumb:data.data.detailInfo.video_thumb,
							new_desc: tmpDetail
						};
						self.blockId = data.data.detailInfo.new_desc.length+1;
					}


					if(data.data.rewardsInfo.items[0] == null){
						self.rewards_info_total = self.new_reward;
						self.rewardId = 2;
						self.itemLen = 1;
						self.lottery_reward_num = 0;
					}

					if(data.data.rewardsInfo.items[0] != null){
						self.lottery_reward_num = 0;
						var tmpRewards = data.data.rewardsInfo.items;
						for (var i=0; i<tmpRewards.length; i++){
							if(tmpRewards[i].return_type == 4){
								self.lottery_reward_num += 1;
							}
							tmpRewards[i]={
								rewardId: i+1,
								itemID:tmpRewards[i].itemID,
								return_type:tmpRewards[i].return_type,
								extra_need:tmpRewards[i].extra_need,
								price:tmpRewards[i].price,
								title:tmpRewards[i].title,
								lottery_number:tmpRewards[i].lottery_number,
								lottery_rules:tmpRewards[i].lottery_rules,
								lottery_type:tmpRewards[i].lottery_type,
								lottery_checked:tmpRewards[i].lottery_checked,
								description:tmpRewards[i].description,
								limit_user:tmpRewards[i].limit_user,
								delivery_fee:tmpRewards[i].delivery_fee,
								repaid_day:tmpRewards[i].repaid_day,
								images:tmpRewards[i].images,
								saved:tmpRewards[i].saved
							}
						}
						self.rewards_info_total = tmpRewards;
						self.rewardId = data.data.rewardsInfo.items.length+1;
						self.itemLen = data.data.rewardsInfo.items.length;
					}

					self.commSuccess = data.statusText;

					$rootScope.$broadcast("PROJECT_HTTP", self.project_info_total);
				});

				$rootScope.$broadcast("PROJECT_RE", projectID);
			};
			//鑾峰彇椤圭洰淇℃伅
			this.get_project_info = function(){

				var _s = this;
				setTimeout(function(){
					$rootScope.$broadcast("PROJECT_LOAD", _s.project_info_total);
				});
			};

			//鎻愪氦椤圭洰淇℃伅
			this.submit_project_info = function(postdata){
				var promise = Common.httpPost(uc.serviceUrl("project/projectinfo?v=3"), postdata);
				promise.then.call(this, function(data){
					$rootScope.$broadcast("PROJECTINFO_POST", data);
				});
			};


			//寰楀埌琛屾キ鎺ㄨ枽妯欑堡
			this.get_cateTags = function(projectID,cateId){
				var svcUrl = uc.psvc_url(
					{url : 'project/tags?v=3', name : "cateTags", data:{dealID:projectID, categoryID:cateId}}
				);
				var promise = $http.get(svcUrl);
				var self=this;
				promise.then.call(this, function(data){
					self.cateTags = [];
					if(data.data.cateTags.cate_tags)
						self.cateTags = data.data.cateTags.cate_tags.reverse();
					$rootScope.$broadcast("CATETAGS_GOT", self.cateTags);
				})
			}

			//寰楀埌鍒濆椤圭洰淇℃伅
			this.get_project_initial = function(){
				return this.project_info_total;
			};

			//淇濆瓨椤圭洰淇℃伅(POST)
			this.save_project_total = function(savedData){
				this.project_info_total = savedData;
			};

			this.get_project_status = function(){
				return this.projectSuccess;

			};

			/**
			 *3.璇︾粏淇℃伅椤�
			 */
				//鑾峰彇璇︾粏淇℃伅

			this.get_detail_http = function(projectID){

				var promise = this.common_http(projectID);
				var self=this;
				promise.then.call(this, function(data){

					var checkedList = data.data.basicInfo.checked.split(' ');

					self.finish_check.basicInfo = eval(checkedList[0]);
					self.finish_check.projectInfo = eval(checkedList[1]);
					self.finish_check.detailInfo = eval(checkedList[2]);
					self.finish_check.rewards = eval(checkedList[3]);

					self.save_basic_checked(eval(checkedList[0]));
					self.save_project_checked(eval(checkedList[1]));
					self.save_detail_checked(eval(checkedList[2]));
					self.save_rewards_checked(eval(checkedList[3]));
					self.get_finish_checked();

					self.dealID = data.data.basicInfo.dealID;

					self.person_status = data.data.basicInfo.identity.person.status;
					self.org_status = data.data.basicInfo.identity.org.legal_status;


					self.currentCatePerson = data.data.basicInfo.cate_list.person[0];
					self.currentCateOrg = data.data.basicInfo.cate_list.org[0];

					//榛樿鐨勮涓氬垎绫婚€夋嫨
					for (var i = 0; i<data.data.basicInfo.cate_list.person.length; i++){
						if (data.data.basicInfo.cate_list.person[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCatePerson = data.data.basicInfo.cate_list.person[i];
						}
					}

					for (var i = 0; i<data.data.basicInfo.cate_list.org.length; i++){
						if (data.data.basicInfo.cate_list.org[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCateOrg = data.data.basicInfo.cate_list.org[i];
						}
					}

					var initialFeesId =  _.first(_.filter(data.data.basicInfo.fees_list, function(item){return item.fees_rate == data.data.basicInfo.fees_rate; }));

					if(initialFeesId){
						self.fees_id = initialFeesId.id;
					}
					if(!initialFeesId){
						self.fees_id = data.data.basicInfo.fees_list[0].id;
					}

					var basic_refresh = {
						is_org:data.data.basicInfo.is_org,
						categoryID:data.data.basicInfo.categoryID,
						fees_id:self.fees_id,
						//certs:data.data.basicInfo.cert_list,
						cert_list_person:self.currentCatePerson.certs,
						cert_list_org:self.currentCateOrg.certs,

						org_name:data.data.basicInfo.identity.org.org_name,
						org_licence:data.data.basicInfo.identity.org.org_licence,
						org_address:data.data.basicInfo.identity.org.org_address,
						legal_person:data.data.basicInfo.identity.org.legal_person,
						contact_name:data.data.basicInfo.identity.org.contact_name,
						contact_mobile:data.data.basicInfo.identity.org.contact_mobile,
                        org_call_name:data.data.basicInfo.identity.org.org_call_name,
                        org_call_address:data.data.basicInfo.identity.org.org_call_address,
                        org_call_tel:data.data.basicInfo.identity.org.org_call_tel,

						id_card:data.data.basicInfo.identity.person.id_card,
						true_name:data.data.basicInfo.identity.person.true_name,
						mobile:data.data.basicInfo.identity.person.mobile,
                        callName:data.data.basicInfo.identity.person.callName,
                        callTel:data.data.basicInfo.identity.person.callTel,
						province:data.data.basicInfo.identity.person.province,
						city:data.data.basicInfo.identity.person.city,

						address:data.data.basicInfo.identity.person.address,

						cate_list_person:data.data.basicInfo.cate_list.person,
						cate_list_org:data.data.basicInfo.cate_list.org,
						//cert_list:data.data.basicInfo.cert_list,
						fees_list:data.data.basicInfo.fees_list,
						fees_rate:data.data.basicInfo.fees_rate,
						currentCatePerson:self.currentCatePerson,
						currentCateOrg:self.currentCateOrg
					};

					self.basic_info_total = basic_refresh;
					self.project_info_total = data.data.projectInfo;
					self.detail_info_total = data.data.detailInfo;
					self.rewards_info_total = data.data.rewardsInfo.items;

					if(data.data.detailInfo.new_desc[0] == null){
						self.detail_info_total = {
							video_link: data.data.detailInfo.video_link,
							video_thumb: data.data.detailInfo.video_thumb,
							new_desc: self.new_block
						};
						self.blockId = 5;
					}
					if(data.data.detailInfo.new_desc[0]!= null){
						var tmpDetail = data.data.detailInfo.new_desc;

						for (var i=0; i<tmpDetail.length; i++){
							tmpDetail[i]={
								blockId: i+1,
								type:tmpDetail[i].type,
								title:tmpDetail[i].title,
								content:tmpDetail[i].content,
								src:tmpDetail[i].src,
								saved:tmpDetail[i].saved
							}
						}

						self.detail_info_total = {
							video_link:data.data.detailInfo.video_link,
							video_thumb:data.data.detailInfo.video_thumb,
							new_desc: tmpDetail
						};
						self.blockId = data.data.detailInfo.new_desc.length+1;
					}


					if(data.data.rewardsInfo.items[0] == null){
						self.rewards_info_total = self.new_reward;
						self.rewardId = 2;
						self.itemLen = 1;
						self.lottery_reward_num = 0;
					}

					if(data.data.rewardsInfo.items[0] != null){
						self.lottery_reward_num = 0;
						var tmpRewards = data.data.rewardsInfo.items;
						for (var i=0; i<tmpRewards.length; i++){
							if(tmpRewards[i].return_type == 4){
								self.lottery_reward_num += 1;
							}
							tmpRewards[i]={
								rewardId: i+1,
								itemID:tmpRewards[i].itemID,
								return_type:tmpRewards[i].return_type,
								extra_need:tmpRewards[i].extra_need,
								price:tmpRewards[i].price,
								title:tmpRewards[i].title,
								lottery_number:tmpRewards[i].lottery_number,
								lottery_rules:tmpRewards[i].lottery_rules,
								lottery_type:tmpRewards[i].lottery_type,
								lottery_checked:tmpRewards[i].lottery_checked,
								description:tmpRewards[i].description,
								limit_user:tmpRewards[i].limit_user,
								delivery_fee:tmpRewards[i].delivery_fee,
								repaid_day:tmpRewards[i].repaid_day,
								images:tmpRewards[i].images,
								saved:tmpRewards[i].saved
							}
						}
						self.rewards_info_total = tmpRewards;
						self.rewardId = data.data.rewardsInfo.items.length+1;
						self.itemLen = data.data.rewardsInfo.items.length;
					}


					self.commSuccess = data.statusText;

					$rootScope.$broadcast("DETAIL_HTTP", self.detail_info_total);
				})
				$rootScope.$broadcast("DETAIL_RE", projectID);

			};

			this.get_detail_info = function(){
				var _s = this;
				setTimeout(function(){
					$rootScope.$broadcast("DETAIL_LOAD", _s.detail_info_total);
				});
			};
			//鎻愪氦璇︾粏淇℃伅
			this.submit_detail_info = function(postdata){
				var promise = Common.httpPost(uc.serviceUrl("project/detail?v=3"), postdata);
				promise.then.call(this, function(data){
					$rootScope.$broadcast("DETAILINFO_POST", data);
				});
			};

			//寰楀埌鍒濆璇︾粏淇℃伅
			this.get_detail_initial = function(){
				return this.detail_info_total;
			};

			//淇濆瓨鍩烘湰淇℃伅(POST)
			this.save_detail_total = function(savedData){
				this.detail_info_total = savedData;
			};

			//娣诲姞block
			this.add_block = function(type){
				if(type == 'text'){
					var block_word = {
						blockId:this.blockId,
						type: 'text',
						title: '',
						content: '',
						src: '',
						saved:false
					};
					this.detail_info_total.new_desc.push(block_word);
					$rootScope.$broadcast("GET_BLOCKS", this.detail_info_total.new_desc);
					this.blockId += 1;
				}
				if (type == 'image'){
					var block_pic = {
						blockId:this.blockId,
						type: 'image',
						title: '',
						content: '',
						src: '',
						saved:false
					};
					this.detail_info_total.new_desc.push(block_pic);
					$rootScope.$broadcast("GET_BLOCKS", this.detail_info_total.new_desc);
					this.blockId += 1;
				}
			};

			//淇濆瓨block
			this.blockNumber = 0;
			this.save_block = function(block){
				var b_index =this.detail_info_total.new_desc.indexOf(block);

				var saved_block = {
					blockId:block.blockId,
					type: block.type,
					title:block.title,
					content:block.content,
					src: block.src,
					saved:true
				};
				this.detail_info_total.new_desc[b_index] = saved_block;

				$rootScope.$broadcast("SAVE_BLOCKS", this.detail_info_total.new_desc);

				this.blockNumber += 1;
				$rootScope.$broadcast("BLOCK_NUMBER", this.blockNumber);

			};
			//缂栬緫block
			this.edit_block = function(block){

				var b_index =this.detail_info_total.new_desc.indexOf(block);

				var edited_block = {
					blockId:block.blockId,
					type: block.type,
					title:block.title,
					content:block.content,
					src: block.src,
					saved:false
				};
				this.detail_info_total.new_desc[b_index] = edited_block;

				$rootScope.$broadcast("EDIT_BLOCKS", this.detail_info_total.new_desc);

				this.blockNumber = this.blockNumber - 1;
				$rootScope.$broadcast("BLOCK_NUMBER", this.blockNumber);
			};
			//鍒犻櫎block
			this.delete_block = function(block){
				this.detail_info_total.new_desc = _.filter(this.detail_info_total.new_desc,function(item){
					return block!=item;
				});
				$rootScope.$broadcast("DELETE_BLOCK", this.detail_info_total.new_desc);

				this.blockNumber = this.blockNumber - 1;
				$rootScope.$broadcast("BLOCK_NUMBER", this.blockNumber);
			};

			this.get_block_num = function(){
				return _.filter(this.detail_info_total.new_desc, function(item){return item.saved; }).length;
			}

			//block浣嶇疆涓婁笅璋冩暣
			this.switch_block = function(block, direction){
				if (this.detail_info_total.new_desc.length >1){
				var b_index =this.detail_info_total.new_desc.indexOf(block);
				if (direction == 'up'){
					if(b_index != 0){
					var tmp = this.detail_info_total.new_desc[b_index-1];
					this.detail_info_total.new_desc[b_index-1] = this.detail_info_total.new_desc[b_index];
					this.detail_info_total.new_desc[b_index] = tmp;
					}
				}
				if (direction == 'down'){
					if(b_index != this.detail_info_total.new_desc.length-1){
					var tmp = this.detail_info_total.new_desc[b_index+1];
					this.detail_info_total.new_desc[b_index+1] = this.detail_info_total.new_desc[b_index];
					this.detail_info_total.new_desc[b_index] = tmp;
					}
				}
				$rootScope.$broadcast("SWITCH_BLOCK", this.detail_info_total.new_desc);
				}
			};

			/**
			 * 4. 鍥炴姤淇℃伅椤�
			 */
				//鑾峰彇鍥炴姤淇℃伅
			this.get_rewards_http = function(projectID){

				var promise = this.common_http(projectID);
				var self=this;
				promise.then.call(this, function(data){

					var checkedList = data.data.basicInfo.checked.split(' ');

					self.finish_check.basicInfo = eval(checkedList[0]);
					self.finish_check.projectInfo = eval(checkedList[1]);
					self.finish_check.detailInfo = eval(checkedList[2]);
					self.finish_check.rewards = eval(checkedList[3]);

					self.save_basic_checked(eval(checkedList[0]));
					self.save_project_checked(eval(checkedList[1]));
					self.save_detail_checked(eval(checkedList[2]));
					self.save_rewards_checked(eval(checkedList[3]));
					self.get_finish_checked();

					self.dealID = data.data.basicInfo.dealID;

					self.person_status = data.data.basicInfo.identity.person.status;
					self.org_status = data.data.basicInfo.identity.org.legal_status;

					self.currentCatePerson = data.data.basicInfo.cate_list.person[0];
					self.currentCateOrg = data.data.basicInfo.cate_list.org[0];

					//榛樿鐨勮涓氬垎绫婚€夋嫨
					for (var i = 0; i<data.data.basicInfo.cate_list.person.length; i++){
						if (data.data.basicInfo.cate_list.person[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCatePerson = data.data.basicInfo.cate_list.person[i];
						}
					}

					for (var i = 0; i<data.data.basicInfo.cate_list.org.length; i++){
						if (data.data.basicInfo.cate_list.org[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCateOrg = data.data.basicInfo.cate_list.org[i];
						}
					}

					var initialFeesId =  _.first(_.filter(data.data.basicInfo.fees_list, function(item){return item.fees_rate == data.data.basicInfo.fees_rate; }));

					if(initialFeesId){
						self.fees_id = initialFeesId.id;
					}
					if(!initialFeesId){
						self.fees_id = data.data.basicInfo.fees_list[0].id;
					}

					var basic_refresh = {
						is_org:data.data.basicInfo.is_org,
						categoryID:data.data.basicInfo.categoryID,
						fees_id:self.fees_id,
						//certs:data.data.basicInfo.cert_list,
						cert_list_person:self.currentCatePerson.certs,
						cert_list_org:self.currentCateOrg.certs,

						org_name:data.data.basicInfo.identity.org.org_name,
						org_licence:data.data.basicInfo.identity.org.org_licence,
						org_address:data.data.basicInfo.identity.org.org_address,
						legal_person:data.data.basicInfo.identity.org.legal_person,
						contact_name:data.data.basicInfo.identity.org.contact_name,
						contact_mobile:data.data.basicInfo.identity.org.contact_mobile,
                        org_call_name:data.data.basicInfo.identity.org.org_call_name,
                        org_call_address:data.data.basicInfo.identity.org.org_call_address,
                        org_call_tel:data.data.basicInfo.identity.org.org_call_tel,

						id_card:data.data.basicInfo.identity.person.id_card,
						true_name:data.data.basicInfo.identity.person.true_name,
						mobile:data.data.basicInfo.identity.person.mobile,
                        callName:data.data.basicInfo.identity.person.callName,
                        callTel:data.data.basicInfo.identity.person.callTel,
						province:data.data.basicInfo.identity.person.province,
						city:data.data.basicInfo.identity.person.city,

						address:data.data.basicInfo.identity.person.address,

						cate_list_person:data.data.basicInfo.cate_list.person,
						cate_list_org:data.data.basicInfo.cate_list.org,
						//cert_list:data.data.basicInfo.cert_list,
						fees_list:data.data.basicInfo.fees_list,
						fees_rate:data.data.basicInfo.fees_rate,
						currentCatePerson:self.currentCatePerson,
						currentCateOrg:self.currentCateOrg
					};

					self.basic_info_total = basic_refresh;
					self.project_info_total = data.data.projectInfo;
					self.detail_info_total = data.data.detailInfo;
					self.rewards_info_total = data.data.rewardsInfo.items;


					if(data.data.detailInfo.new_desc[0] == null){
						self.detail_info_total = {
							video_link: data.data.detailInfo.video_link,
							video_thumb: data.data.detailInfo.video_thumb,
							new_desc: self.new_block
						};
						self.blockId = 5;
					}
					if(data.data.detailInfo.new_desc[0]!= null){
						var tmpDetail = data.data.detailInfo.new_desc;

						for (var i=0; i<tmpDetail.length; i++){
							tmpDetail[i]={
								blockId: i+1,
								type:tmpDetail[i].type,
								title:tmpDetail[i].title,
								content:tmpDetail[i].content,
								src:tmpDetail[i].src,
								saved:tmpDetail[i].saved
							}
						}

						self.detail_info_total = {
							video_link:data.data.detailInfo.video_link,
							video_thumb:data.data.detailInfo.video_thumb,
							new_desc: tmpDetail
						};
						self.blockId = data.data.detailInfo.new_desc.length+1;
					}


					if(data.data.rewardsInfo.items[0] == null){
						self.rewards_info_total = self.new_reward;
						self.rewardId = 2;
						self.itemLen = 1;
						self.lottery_reward_num = 0;
					}

					if(data.data.rewardsInfo.items[0] != null){
						self.lottery_reward_num = 0;
						var tmpRewards = data.data.rewardsInfo.items;
						for (var i=0; i<tmpRewards.length; i++){
							if(tmpRewards[i].return_type == 4){
								self.lottery_reward_num += 1;
							}
							tmpRewards[i]={
								rewardId: i+1,
								itemID:tmpRewards[i].itemID,
								return_type:tmpRewards[i].return_type,
								extra_need:tmpRewards[i].extra_need,
								price:tmpRewards[i].price,
								title:tmpRewards[i].title,
								lottery_number:tmpRewards[i].lottery_number,
								lottery_rules:tmpRewards[i].lottery_rules,
								lottery_type:tmpRewards[i].lottery_type,
								lottery_checked:tmpRewards[i].lottery_checked,
								description:tmpRewards[i].description,
								limit_user:tmpRewards[i].limit_user,
								delivery_fee:tmpRewards[i].delivery_fee,
								repaid_day:tmpRewards[i].repaid_day,
								images:tmpRewards[i].images,
								saved:tmpRewards[i].saved
							}
						}
						self.rewards_info_total = tmpRewards;
						self.rewardId = data.data.rewardsInfo.items.length+1;
						self.itemLen = data.data.rewardsInfo.items.length;
					}

					self.commSuccess = data.statusText;


					$rootScope.$broadcast("REWARDS_HTTP", self.rewards_info_total);
				})

				$rootScope.$broadcast("REWARDS_RE", projectID);
			};

			this.get_rewards_info = function(){
				var _s = this;
				setTimeout(function(){
					$rootScope.$broadcast("REWARDS_LOAD", _s.rewards_info_total);
				});
			};
			//鎻愪氦鍥炴姤淇℃伅
			this.submit_rewards_info = function(postdata){
				var promise = Common.httpPost(uc.serviceUrl("project/items?v=3"), postdata);
				promise.then.call(this, function(data){
					$rootScope.$broadcast("REWARDSINFO_POST", data);
				});
			};

			//寰楀埌鍒濆鍩烘湰淇℃伅
			this.get_rewards_initial = function(){
				return this.rewards_info_total;
			};

			//淇濆瓨鍩烘湰淇℃伅(POST)
			this.save_rewards_total = function(savedData){
				this.rewards_info_total = savedData;
			};

			//
			this.selectReturnType = function(item,r_type){
				var lotteryList = _.filter(this.rewards_info_total, function(item){
					return item.return_type == 4;
				});
				if (r_type == 4){
					if (lotteryList.length > 0){
						uc.modal.alert('淇℃伅鎻愮ず', '1涓」鐩笅鏈€澶氬彧鍙坊鍔�1涓娊濂栧洖鎶ラ」');
						return false;
					}
					this.lottery_reward_num += 1;
				}
				if(r_type == 1 || r_type ==2){
					this.lottery_reward_num = 0;
				}
				var r_index = this.rewards_info_total.indexOf(item);
				var typed_reward ={
					rewardId:item.rewardId,
					itemID:item.itemID,
					return_type:r_type,
					extra_need:item.extra_need,
					price:item.price,
					title:item.title,
					lottery_number:item.lottery_number,
					lottery_rules:item.lottery_rules,
					lottery_type:item.lottery_type,
					lottery_checked:item.lottery_checked,
					description:item.description,
					limit_user:item.limit_user,
					delivery_fee:item.delivery_fee,
					repaid_day:item.repaid_day,
					images:item.images,
					saved:item.saved
				};
				this.rewards_info_total[r_index] = typed_reward;
				$rootScope.$broadcast("TYPE_REWARD", this.rewards_info_total);
			};

			//娣诲姞鍥炴姤椤�
			//this.itemLen = 1;

			this.add_item = function(){
				var block_reward ={
					rewardId:this.rewardId,
					itemID:0,
					return_type:1,
					extra_need:{
						user_name:0,
						mobile:0,
						email:0
					},
					price:null,
					title:'',
					lottery_number:2,
					lottery_rules:{per:null},
					lottery_type:1,
					lottery_checked:0,
					description:'',
					limit_user:0,
					delivery_fee:0,
					repaid_day:0,
					images:[],
					saved:false
				};
				if(!this.rewards_info_total){
					this.rewards_info_total = [];
				}
				this.rewards_info_total.push(block_reward);
				$rootScope.$broadcast("REWARD_ADDED", this.rewards_info_total);
				this.rewardId += 1;
				this.itemLen += 1;
			};


			//淇濆瓨鍥炴姤椤�
			this.rewardNumber = 0;
			this.save_item = function(item){
				var r_index = this.rewards_info_total.indexOf(item);
				var saved_reward ={
					rewardId:item.rewardId,
					itemID:item.itemID,
					return_type:item.return_type,
					extra_need:item.extra_need,
					price:item.price,
					title:item.title,
					lottery_number:item.lottery_number,
					lottery_rules:item.lottery_rules,
					lottery_type:item.lottery_type,
					lottery_checked:item.lottery_checked,
					description:item.description,
					limit_user:item.limit_user,
					delivery_fee:item.delivery_fee,
					repaid_day:item.repaid_day,
					images:item.images,
					saved:true
				};
				this.rewards_info_total[r_index] = saved_reward;
				$rootScope.$broadcast("SAVE_REWARD", this.rewards_info_total);
				this.rewardNumber += 1;
				$rootScope.$broadcast("ITEM_NUMBER", this.rewardNumber);
				$rootScope.$broadcast('REWARDS_CHECKED',true)
			};

			//缂栬緫鍥炴姤椤�
			this.edit_item = function(item){
				var r_index = this.rewards_info_total.indexOf(item);
				var edited_reward ={
					rewardId:item.rewardId,
					itemID:item.itemID,
					return_type:item.return_type,
					extra_need:item.extra_need,
					price:item.price,
					title:item.title,
					lottery_number:item.lottery_number,
					lottery_rules:item.lottery_rules,
					lottery_type:item.lottery_type,
					lottery_checked:item.lottery_checked,
					description:item.description,
					limit_user:item.limit_user,
					delivery_fee:item.delivery_fee,
					repaid_day:item.repaid_day,
					images:item.images,
					saved:false
				};
				this.rewards_info_total[r_index] = edited_reward;
				$rootScope.$broadcast("EDIT_REWARD", this.rewards_info_total);

				this.rewardNumber = this.rewardNumber - 1;
				$rootScope.$broadcast("ITEM_NUMBER", this.rewardNumber);

			};

			//澶嶅埗鍥炴姤椤�
			this.copy_item = function(item){

				var copied_reward ={
					rewardId:this.rewardId,
					itemID:0,
					return_type:item.return_type,
					extra_need:item.extra_need,
					price:item.price,
					title:item.title,
					lottery_number:item.lottery_number,
					lottery_rules:item.lottery_rules,
					lottery_type:item.lottery_type,
					lottery_checked:item.lottery_checked,
					description:item.description,
					limit_user:item.limit_user,
					delivery_fee:item.delivery_fee,
					repaid_day:item.repaid_day,
					images:item.images.slice(0),
					saved:false
				};
				this.rewards_info_total.push(copied_reward);
				$rootScope.$broadcast("REWARD_COPY", this.rewards_info_total);
				this.rewardId += 1;
				this.itemLen += 1;
			};

			//鍒犻櫎涓€涓洖鎶�
			this.delete_item = function(reward){
				this.rewards_info_total = _.filter(this.rewards_info_total,function(item){
					return reward!=item;
				});
				if(reward.return_type == 4){
					this.lottery_reward_num -= 1;
				}
				$rootScope.$broadcast("REWARD_DELETED", this.rewards_info_total);
				this.rewardNumber = this.rewardNumber - 1;
				this.itemLen = this.itemLen -1;
				$rootScope.$broadcast("ITEM_NUMBER", this.rewardNumber);

				var self = this;
				if (this.itemLen == 0){
					self.add_item();
				}
			};

			this.get_item_num = function(){
				return _.filter(this.rewards_info_total, function(item){return item.saved;}).length;
			}

			//璋冩暣鍥炴姤椤逛綅缃�
			this.switch_item = function(item, direction){
				if (this.rewards_info_total.length > 1){
				var r_index = this.rewards_info_total.indexOf(item);
				if (direction == 'up'){
					if(r_index !=0){
					var tmp = this.rewards_info_total[r_index-1];
					this.rewards_info_total[r_index-1] = this.rewards_info_total[r_index];
					this.rewards_info_total[r_index] = tmp;
					}
				}
				if (direction == 'down'){
					if (r_index != this.rewards_info_total.length -1){
					var tmp = this.rewards_info_total[r_index+1];
					this.rewards_info_total[r_index+1] = this.rewards_info_total[r_index];
					this.rewards_info_total[r_index] = tmp;
					}
				}
				$rootScope.$broadcast("REWARD_SWITCHED", this.rewards_info_total);
				}

			};

			//鍒ゆ柇鏄惁鑷冲皯鏈変竴涓洖鎶ラ」
			this.is_items_empty = function(item){};

			//绛剧讲绾夸笂鍚堝悓
			//this.get_contract = function(projectID){
			//
			//};


			//鍙戝竷椤圭洰
			//this.agree = false;
			//this.publish = function(projectID){
			//};
			/**
			 *5.棰勮椤�
			 */

			this.get_preview_http = function(projectID){

				var promise = this.common_http(projectID);
				var self=this;
				promise.then.call(this, function(data){

					var checkedList = data.data.basicInfo.checked.split(' ');

					self.finish_check.basicInfo = eval(checkedList[0]);
					self.finish_check.projectInfo = eval(checkedList[1]);
					self.finish_check.detailInfo = eval(checkedList[2]);
					self.finish_check.rewards = eval(checkedList[3]);

					self.save_basic_checked(eval(checkedList[0]));
					self.save_project_checked(eval(checkedList[1]));
					self.save_detail_checked(eval(checkedList[2]));
					self.save_rewards_checked(eval(checkedList[3]));
					self.get_finish_checked();

					self.dealID = data.data.basicInfo.dealID;

					self.person_status = data.data.basicInfo.identity.person.status;
					self.org_status = data.data.basicInfo.identity.org.legal_status;

					self.currentCatePerson = data.data.basicInfo.cate_list.person[0];
					self.currentCateOrg = data.data.basicInfo.cate_list.org[0];

					//榛樿鐨勮涓氬垎绫婚€夋嫨
					for (var i = 0; i<data.data.basicInfo.cate_list.person.length; i++){
						if (data.data.basicInfo.cate_list.person[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCatePerson = data.data.basicInfo.cate_list.person[i];
						}
					}

					for (var i = 0; i<data.data.basicInfo.cate_list.org.length; i++){
						if (data.data.basicInfo.cate_list.org[i].categoryID == data.data.basicInfo.categoryID){
							self.currentCateOrg = data.data.basicInfo.cate_list.org[i];
						}
					}

					var initialFeesId =  _.first(_.filter(data.data.basicInfo.fees_list, function(item){return item.fees_rate == data.data.basicInfo.fees_rate; }));

					if(initialFeesId){
						self.fees_id = initialFeesId.id;
					}
					if(!initialFeesId){
						self.fees_id = data.data.basicInfo.fees_list[0].id;
					}

					var basic_refresh = {
						is_org:data.data.basicInfo.is_org,
						categoryID:data.data.basicInfo.categoryID,
						fees_id:self.fees_id,
						//certs:data.data.basicInfo.cert_list,
						cert_list_person:self.currentCatePerson.certs,
						cert_list_org:self.currentCateOrg.certs,

						org_name:data.data.basicInfo.identity.org.org_name,
						org_licence:data.data.basicInfo.identity.org.org_licence,
						org_address:data.data.basicInfo.identity.org.org_address,
						legal_person:data.data.basicInfo.identity.org.legal_person,
						contact_name:data.data.basicInfo.identity.org.contact_name,
						contact_mobile:data.data.basicInfo.identity.org.contact_mobile,
                        org_call_name:data.data.basicInfo.identity.org.org_call_name,
                        org_call_address:data.data.basicInfo.identity.org.org_call_address,
                        org_call_tel:data.data.basicInfo.identity.org.org_call_tel,

						id_card:data.data.basicInfo.identity.person.id_card,
						true_name:data.data.basicInfo.identity.person.true_name,
						mobile:data.data.basicInfo.identity.person.mobile,
                        callName:data.data.basicInfo.identity.person.callName,
                        callTel:data.data.basicInfo.identity.person.callTel,
						province:data.data.basicInfo.identity.person.province,
						city:data.data.basicInfo.identity.person.city,

						address:data.data.basicInfo.identity.person.address,

						cate_list_person:data.data.basicInfo.cate_list.person,
						cate_list_org:data.data.basicInfo.cate_list.org,
						//cert_list:data.data.basicInfo.cert_list,
						fees_list:data.data.basicInfo.fees_list,
						fees_rate:data.data.basicInfo.fees_rate,
						currentCatePerson:self.currentCatePerson,
						currentCateOrg:self.currentCateOrg
					};

					self.basic_info_total = basic_refresh;
					self.project_info_total = data.data.projectInfo;
					self.detail_info_total = data.data.detailInfo;
					self.rewards_info_total = data.data.rewardsInfo.items;

					if(data.data.detailInfo.new_desc[0] == null){
						self.detail_info_total = {
							video_link: data.data.detailInfo.video_link,
							video_thumb: data.data.detailInfo.video_thumb,
							new_desc: self.new_block
						};
						self.blockId = 5;
					}
					if(data.data.detailInfo.new_desc[0]!= null){
						var tmpDetail = data.data.detailInfo.new_desc;

						for (var i=0; i<tmpDetail.length; i++){
							tmpDetail[i]={
								blockId: i+1,
								type:tmpDetail[i].type,
								title:tmpDetail[i].title,
								content:tmpDetail[i].content,
								src:tmpDetail[i].src,
								saved:tmpDetail[i].saved
							}
						}

						self.detail_info_total = {
							video_link:data.data.detailInfo.video_link,
							video_thumb:data.data.detailInfo.video_thumb,
							new_desc: tmpDetail
						};
						self.blockId = data.data.detailInfo.new_desc.length+1;
					}


					if(data.data.rewardsInfo.items[0] == null){
						self.rewards_info_total = self.new_reward;
						self.rewardId = 2;
						self.itemLen = 1;
						self.lottery_reward_num = 0;
					}

					if(data.data.rewardsInfo.items[0] != null){
						self.lottery_reward_num = 0;
						var tmpRewards = data.data.rewardsInfo.items;
						for (var i=0; i<tmpRewards.length; i++){
							if(tmpRewards[i].return_type == 4){
								self.lottery_reward_num += 1;
							}
							tmpRewards[i]={
								rewardId: i+1,
								itemID:tmpRewards[i].itemID,
								return_type:tmpRewards[i].return_type,
								extra_need:tmpRewards[i].extra_need,
								price:tmpRewards[i].price,
								title:tmpRewards[i].title,
								lottery_number:tmpRewards[i].lottery_number,
								lottery_rules:tmpRewards[i].lottery_rules,
								lottery_type:tmpRewards[i].lottery_type,
								lottery_checked:tmpRewards[i].lottery_checked,
								description:tmpRewards[i].description,
								limit_user:tmpRewards[i].limit_user,
								delivery_fee:tmpRewards[i].delivery_fee,
								repaid_day:tmpRewards[i].repaid_day,
								images:tmpRewards[i].images,
								saved:tmpRewards[i].saved
							}
						}
						self.rewards_info_total = tmpRewards;
						self.rewardId = data.data.rewardsInfo.items.length+1;
						self.itemLen = data.data.rewardsInfo.items.length;
					}

					self.commSuccess = data.statusText;

					$rootScope.$broadcast("PREVIEW_HTTP", data.data);
				})

				$rootScope.$broadcast("PREVIEW_RE", projectID);
			};

			/**
			 *6.鍚堝悓椤�
			 */
			this.get_contract_http = function(projectID){

				//var svcUrl = uc.psvc_url(
				//{url : 'project/basicinfo?v=3',name : 'basicInfo', data:{dealID:projectID}},
				//{url : 'project/projectinfo?v=3', name : "projectInfo", data:{dealID:projectID}},
				//{url : 'project/detail?v=3', name : "detailInfo", data:{dealID:projectID}},
				//{url : 'project/items?v=3', name : "rewardsInfo", data:{dealID:projectID}}
				//);
				//var promise = $http.get(svcUrl);
				//var self=this;
				//promise.then.call(this, function(data){
				//
				//	self.dealID = data.data.basicInfo.dealID;
				//
				//	var basic_refresh = {
				//		is_org:data.data.basicInfo.is_org,
				//		categoryID:data.data.basicInfo.categroyID,
				//		fees_id:data.data.basicInfo.fees_list[0].id,
				//		certs:data.data.basicInfo.cert_list,
				//
				//		org_name:data.data.basicInfo.identity.org.org_name,
				//		org_licence:data.data.basicInfo.identity.org.org_licence,
				//		org_address:data.data.basicInfo.identity.org.org_address,
				//		legal_person:data.data.basicInfo.identity.org.legal_person,
				//		legal_idcard:data.data.basicInfo.identity.org.legal_idcard,
				//		contact_name:data.data.basicInfo.identity.org.contact_name,
				//		contact_mobile:data.data.basicInfo.identity.org.contact_mobile,
				//
				//		id_card:data.data.basicInfo.identity.person.id_card,
				//		true_name:data.data.basicInfo.identity.person.true_name,
				//		mobile:data.data.basicInfo.identity.person.mobile,
				//		province:data.data.basicInfo.identity.person.province,
				//		city:data.data.basicInfo.identity.person.city,
				//
				//		address:data.data.basicInfo.identity.person.address,
				//
				//		cate_list_person:data.data.basicInfo.cate_list.person,
				//		cate_list_org:data.data.basicInfo.cate_list.org,
				//		cert_list:data.data.basicInfo.cert_list,
				//		fees_list:data.data.basicInfo.fees_list,
				//		fees_rate:data.data.basicInfo.fees_rate,
				//		currentCatePerson:data.data.basicInfo.cate_list.person[0],
				//		currentCateOrg:data.data.basicInfo.cate_list.org[0]
				//	};
				//
				//	self.basic_info_total = basic_refresh;
				//
				//	self.project_info_total = data.data.projectInfo;
				//	self.detail_info_total = data.data.detailInfo;
				//	self.rewards_info_total = data.data.rewardsInfo.items;
				//
				//	if(data.data.detailInfo.new_desc[0] == null){
				//		self.detail_info_total = {
				//			video_link: self.video_link,
				//			video_thumb: self.video_thumb,
				//			new_desc: [{
				//				blockId:1,
				//				type: 'text',
				//				title: '',
				//				content: '',
				//				src: '',
				//				saved: false
				//			},
				//				{
				//					blockId:2,
				//					type: 'text',
				//					title: '',
				//					content: '',
				//					src: '',
				//					saved: false
				//				},
				//				{
				//					blockId:3,
				//					type: 'text',
				//					title: '',
				//					content: '',
				//					src: '',
				//					saved: false
				//				},
				//				{
				//					blockId:4,
				//					type: 'image',
				//					title: '',
				//					content: '',
				//					src: '',
				//					saved: false
				//				}]
				//		};
				//		self.blockId = 5;
				//	}
				//	if(data.data.detailInfo.new_desc[0]!= null){
				//		var tmpDetail = data.data.detailInfo.new_desc;
				//
				//		for (var i=0; i<tmpDetail.length; i++){
				//			tmpDetail[i]={
				//				blockId: i+1,
				//				type:tmpDetail[i].type,
				//				title:tmpDetail[i].title,
				//				content:tmpDetail[i].content,
				//				src:tmpDetail[i].src,
				//				saved:true
				//			}
				//		}
				//
				//		self.detail_info_total = {
				//			video_link:self.video_link,
				//			video_thumb:self.video_thumb,
				//			new_desc: tmpDetail
				//		};
				//		self.blockId = data.data.detailInfo.new_desc.length+1;
				//	}
				//
				//
				//	if(data.data.rewardsInfo.items[0] == null){
				//		self.rewards_info_total = [
				//			{
				//				rewardId:1,
				//				itemID:null,
				//				return_type:1,
				//				extra_need:[{
				//					user_name:0,
				//					mobile_name:0,
				//					mobile_name:0
				//				}],
				//				price:null,
				//				title:'',
				//				description:'',
				//				limit_user:null,
				//				delivery_fee:null,
				//				repaid_day:null,
				//				images:'',
				//				saved:false
				//			}
				//		];
				//		self.rewardId = 2;
				//	}
				//
				//	if(data.data.rewardsInfo.items[0] != null){
				//
				//		var tmpRewards = data.data.rewardsInfo.items;
				//		for (var i=0; i<tmpRewards.length; i++){
				//			tmpRewards[i]={
				//				rewardId: i+1,
				//				itemID:tmpRewards[i].itemID,
				//				return_type:tmpRewards[i].return_type,
				//				extra_need:tmpRewards[i].extra_need,
				//				price:tmpRewards[i].price,
				//				title:tmpRewards[i].title,
				//				description:tmpRewards[i].description,
				//				limit_user:tmpRewards[i].limit_user,
				//				delivery_fee:tmpRewards[i].delivery_fee,
				//				repaid_day:tmpRewards[i].repaid_day,
				//				images:tmpRewards[i].images,
				//				saved:true
				//			}
				//		}
				//		self.rewards_info_total = tmpRewards;
				//		self.rewardId = data.data.rewardsInfo.items.length+1;
				//	}
				//
				//	self.commSuccess = data.statusText;
				//
				//	$rootScope.$broadcast("BASIC_HTTP", self.basic_info_total);
				//	$rootScope.$broadcast("PROJECT_HTTP", self.project_info_total);
				//	$rootScope.$broadcast("DETAIL_HTTP", self.detail_info_total);
				//	$rootScope.$broadcast("REWARDS_HTTP", self.rewards_info_total);
				//
				//
				//})

				var svcUrl_c = uc.psvc_url(
					{url : 'project/contract?v=3', name : "contractInfo", data:{dealID:projectID}}
				);
				var promise_c = $http.get(svcUrl_c);
				var self = this;
				promise_c.then.call(this, function(data){

					var contract_info={
						userId:data.data.contractInfo.user_id,
						contractNumber: data.data.contractInfo.contract_sn,
						is_org:self.basic_info_total.is_org,
						personName:self.basic_info_total.true_name,
						id_card :self.basic_info_total.id_card,
						person_address:self.basic_info_total.province+self.basic_info_total.city+self.basic_info_total.address,
						person_mobile:self.basic_info_total.mobile,
						fee_rate:self.basic_info_total.fees_rate,
						currentCatePerson:self.basic_info_total.currentCatePerson,
						currentCateOrg:self.basic_info_total.currentCateOrg,
						title:self.project_info_total.name,
						limit_days:self.project_info_total.deal_days,
						funding:self.project_info_total.limit_price,
						itemList:self.rewards_info_total,
						orgName:self.basic_info_total.org_name,
						org_address: self.basic_info_total.org_address,
						org_licence:self.basic_info_total.org_licence,
						org_boss: self.basic_info_total.legal_person,
						org_contact: self.basic_info_total.contact_name,
						org_mobile: self.basic_info_total.contact_mobile,
                        org_call_name: self.basic_info_total.org_call_name,
                        org_call_address: self.basic_info_total.org_call_address,
                        org_call_tel: self.basic_info_total.org_call_tel
					};
					$rootScope.$broadcast("CONTRACT_HTTP", contract_info);
				})
				$rootScope.$broadcast("CONTRACT_RE", projectID);
			};

		};

		return {
			getProject : function(projectID){
				if(!window.launch){
					window.launch = {};
					if(!window.launch.project){
						window.launch.project = new ProjectLaunch(projectID);
					}
				}
				return window.launch.project;
			}
		};

	}]);
})(window, window.angular,$,angular.module('launchApp'));

/**
 * 鍦板潃鐩稿叧绫�
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
         * 鑾峰彇褰撳墠鏁版嵁
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
                    uc.modal.alert("缃戠粶閿欒", "鏃犳硶杩炴帴鍒版湇鍔″櫒锛岃纭缃戠粶鐜鐒跺悗閲嶈瘯");
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
         * 鍒犻櫎
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
         * 璁剧疆榛樿鍦板潃
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
                        o['default'] = 0;
                    });
                    item['default'] = 1;
                    $rootScope.$broadcast(Events.ADDR_DEF_CHANGED, {list : list, item : item});
                }
            });
        }


        /**
         * 淇濆瓨鏀惰揣鍦板潃
         */
        function saveItem(item){
            var defer = $q.defer();
            var errors = Check.checkAll([
                {
                    value : item.person,
                    rules : ['required'],
                    hint  : "璇峰～鍐欐敹璐т汉"
                },
                {
                    value : item.telephone,
                    rules : ['required', 'mobile'],
                    hint  : "璇疯緭鍏ユ纭殑鎵嬫満鍙�"
                },
                {
                    value : item.province,
                    rules : ['minLength-2'],
                    hint  : ['璇烽€夋嫨鐪佷唤']
                },
                {
                    value : item.city,
                    rules : ['minLength-2'],
                    hint  : '璇烽€夋嫨鍩庡競'
                },
                {
                    value : item.address,
                    rules : ['minLength-6'],
                    hint  : '鏀惰揣鍦板潃鐨勯暱搴︿笉鍙皯浜�6涓瓧绗�'
                }]);
            if(errors.length > 0){
                uc.modal.alert("杈撳叆鎻愮ず", errors[0]);
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
                            uc.modal.alert("濉啓閿欒", data.error);
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
                            uc.modal.alert("濉啓閿欒", data.error);
                            //$rootScope.$broadcast(Events.LOGIC_ERROR, data.error);
                        }else{
                            var newItem = {
                                address : {
                                    address : item.address,
                                    city : item.city,
                                    province : item.province
                                },
                                addressID : data.data.addressID,
                                person : item.person,
                                telephone : item.telephone
                            };
                            newItem['default'] = 0;

                            list.push(newItem);
                            if(list.length == 1){
                                newItem['default'] = 1;
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
         * 鍔犺浇鎵€鏈夌殑鍦板潃
         */
        function loadAll(){
            var url = uc.serviceUrl("user/getaddresslist?v=1");
            $.ajax({
                url : url,
                dataType : 'json',
                cache : false,
                success : function(data){
                    list = data.data;
                    list = _.sortBy(list, function(addr, i){return addr['default'] ? -100 : i; });
                    $rootScope.$broadcast(Events.ADDR_LOAD, list);
                }
            });
        }

        /**
         * 鍔犺浇鎵€鏈夌殑鐪佷唤
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
         * 鏀瑰彉鐪佷唤
         */
        function changeProvince(provinceId, city){

            selectedProvinceId = provinceId;
            if(!provinceId){


                $rootScope.$broadcast(Events.ADDR_CITY_CHANGED, {cityId: undefined, provinceId : undefined, cityList : [], city : null, cityId : undefined, province : undefined});

                return;
            }
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
                        c = getCityByName(city);
                        if(c){

                            selectedCityId = c.zone_id;
                        }
                    }
                    $rootScope.$broadcast(Events.ADDR_PROVINCE_CHANGED, {cityList : cityList, province: province.name, provinceId : province.zone_id});
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
         * 鏀瑰彉鍩庡競
         */
        function changeCity(cityId){
            selectedCityId = cityId;
            var cityItem = getCity();
            var provinceItem = getProvince();
            var c_name = cityItem ? cityItem.name : '';
            $rootScope.$broadcast(Events.ADDR_CITY_CHANGED, {cityId: cityId, provinceId : provinceItem.zone_id, city : c_name, province : provinceItem.name});
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
})(window, window.angular, $, angular.module('launchApp'));

/**
 * @author weimeng
 */

(function(window, angular,$,launchApp) {
    'use strict';
    launchApp.factory('FormItem', ['$http', '$q', function ($http, $q) {
        function FormItem(value, label, required, valid_type){

            this.value = value;
            this.label = label;
            this.required = required;
            this.valid_type = valid_type;
            this.invalid = false;
            this.dirty = false;

            this.validate = function(dirtyNotChange){

                if(!dirtyNotChange)
                    this.dirty = true;

                this.error_msg = '';
                this.invalid = false;
                if(this.validationRule){
                    var _e = this.validationRule(this);
                    if(_e){
                        this.invalid = true;
                        this.error_msg = _e;
                        return false;
                    }
                    return true;

                }

                if(this.required){
                    if(!this.value){
                        this.invalid = true;
                        this.error_msg = '锛�' + this.label;
                        return false;
                    }
                }
                switch(this.valid_type){
                    case 'personName':
                        if(/^[\s\S]{2,20}$/.test(this.value)){
                            return true;
                        }
                        this.invalid = true;
                        this.error_msg = '锛婅濉啓姝ｇ‘鐨勫鍚�';
                        return false;

                    case 'idCard':
                        this.invalid = !this.idCardValidation(this.value);
                        if (this.invalid){
                            this.error_msg = '锛婅韩浠借瘉鍙风爜涓嶆纭�';
                            return false;
                        }
                        break;

                    case 'mobile':
                        this.invalid = !this.mobileValidation(this.value);
                        if (this.invalid){
                            this.error_msg = '*鎵嬫満鍙风爜涓嶆纭紝璇疯緭鍏ユ纭殑鎵嬫満鍙�';
                            return false;
                        }
                        break;
                    case 'limit_price':
                        if(!this.validateInt()){
                           return false;
                        }

                        this.invalid = !this.limitPriceValidation(this.value);
                        if (this.invalid){
                            this.error_msg = '*绛硅祫閲戦涓嶈兘灏戜簬500鍏�,涓嶈兘楂樹簬1浜�';
                            return false;
                        }
                        break;

                    case 'deal_days':
                        if(!this.validateInt()) {
                            return false;
                        }

                        this.invalid = !this.dealDaysValidation(this.value);
                        if (this.invalid){
                            this.error_msg = '*绛硅祫鏃堕棿鍛ㄦ湡椤诲湪10锝�59澶╀箣鍐�';
                            return false;
                        }
                        break;
                    case 'org_licence' :
                        if((!this.value) || (this.value && this.value.length > 50)){
                            this.invalid = true;
                            this.error_msg = '璇疯緭鍏ユ纭殑浼佷笟钀ヤ笟鎵х収鍙�';
                            return false;
                        }
                        break;

                    case 'user_tags':
                        this.invalid = !this.userTagsValidation(this.value);
                        if (this.invalid){
                            return false;
                        }
                        break;

                    default:
                        break;
                }
                this.error_msg = '';
                return true;
            };

            this.idCardValidation = function(idCardValue){
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
                return idCardValidate(idCardValue);
            };

            this.mobileValidation = function(mobileValue){
                return /^1[3|4|5|7|8][0-9]\d{8}$/.test(mobileValue);
            };

            this.limitPriceValidation = function(limitPriceValue)
            {
                if (limitPriceValue >= 500 && limitPriceValue<= 100000000)
                    return true;
                else
                    return false;
            };

            this.dealDaysValidation = function(dealDaysValue){
                if (dealDaysValue>=10 && dealDaysValue<=90)
                    return true;
                else
                    return false;
            };


            this.validateInt = function(){
                if(!/^[1-9][0-9]*$/.test(this.value)){
                    this.error_msg = '锛�' + this.label + "锛屽彧鏀寔鏁存暟";
                    this.invalid = false;
                    return false;
                }
                return true;

            };

            this.userTagsValidation = function(user_tags){
                var u_tags = user_tags.split(/[,锛�;锛�  ]+/);

                if (u_tags.length >3){
                    this.error_msg = "*鏈€澶氳緭鍏ヤ笁涓嚜瀹氫箟鏍囩";
                    this.invalid = false;
                    return false;
                }

                for (var i = 0; i<u_tags.length; i++){
                    if (u_tags[i].length>5){
                        this.error_msg = '*姣忎釜鏍囩涓嶈秴杩�5涓眽瀛�';
                        this.invalid = false;
                        return false;
                    }
                }

                return true
            }

        }

        return FormItem;

    }]);
})(window, window.angular,$,angular.module('launchApp'));

/**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,launchApp) {
  'use strict';
  launchApp.factory('Forms', ['$http', '$q', "FormItem", function ($http, $q, FormItem) {
    if(window.LaunchForms){
      return window.LaunchForms;
    }
    else{
      window.LaunchForms = {};
    }
    var Forms = window.LaunchForms;


    //Basic Step
    Forms.basic_person = {

      personName: new FormItem('','璇峰～鍐欐偍鐨勭湡瀹炲鍚�',true,'personName'),
      idCard: new FormItem('','璇峰～鍐欐偍鐨勮韩浠借瘉鍙�',true,'idCard'),
      mobile:new FormItem('','璇峰～鍐欐偍鐨勬墜鏈哄彿鐮�',true,'mobile'),
      address:new FormItem('','璇峰～鍐欐偍鐨勮缁嗗湴鍧€',false,'address'),
      callName:new FormItem('','璇峰～鍐欏鏈嶈仈绯讳汉',true,'personName'),
      callTel:new FormItem('','璇峰～鍐欏鏈嶅挩璇㈢數璇�',true,'mobile'),
      contactsName:new FormItem('', '璇峰～鍐欐偍鐨勮缁嗗湴鍧€', false, 'contactsName')
    };


    Forms.basic_org = {

      org_name:new FormItem('','璇峰～鍐欐満鏋勬垨浼佷笟鍚嶇О',true,'org_name'),
      org_licence:new FormItem('','璇峰～鍐欎紒涓氳惀涓氭墽鐓у彿',true,'org_licence'),
      legal_person:new FormItem('','璇峰～鍐欐硶浜轰唬琛ㄧ殑濮撳悕',true,'legal_person'),
      org_address:new FormItem('','璇峰～鍐欎紒涓氭敞鍐屽湴鍧€',true,'org_address'),
      contact_name:new FormItem('','璇峰～鍐欒仈绯讳汉鐨勫鍚�',true,'contact_name'),
      contact_mobile:new FormItem('','璇峰～鍐欒仈绯讳汉鐨勬墜鏈哄彿鐮�',true,'mobile'),
      org_call_name:new FormItem('','璇峰～鍐欎紒涓�/鏈烘瀯绠€绉�',true,'org_call_name'),
      org_call_address:new FormItem('','璇峰～鍐欎紒涓�/鏈烘瀯缁忚惀鍦板潃',true,'org_call_address'),
      org_call_tel:new FormItem('','璇峰～鍐欏鏈嶅挩璇㈢數璇�',true,'org_call_tel')
    };

    //Project Step
    Forms.project = {
      image: new FormItem('','璇蜂笂浼犻」鐩皝闈�',true,'image'),
      name: new FormItem('','璇峰～鍐欓」鐩爣棰�',true,'name'),
      brief: new FormItem('','璇峰～鍐欑娆剧洰鐨�',true,'brief'),
      limit_price: new FormItem('','璇峰～鍐欑璧勯噾棰�',true,'limit_price'),
      deal_days: new FormItem('','璇峰～鍐欑璧勫ぉ鏁�',true,'deal_days'),
      cate_tags: new FormItem('','',false,''),
      user_tags: new FormItem('','',false,'user_tags')
    };

    Forms.validate = function(form){
      var ret = true;
      for(var key in form){
        var formItem = form[key];
        if(!formItem.validate(true)){
          console.log(key + " validation error");
          ret = false;
        }
      }
      return ret;
    };

    return Forms;
  }]);

})(window, window.angular,$,angular.module('launchApp'));

/**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,launchApp) {
   launchApp.factory('httpMock', ['$http', '$q', function ($http, $q) {
      var httpMock = function() {
         if(!window.mockDict){
            window.mockDict = {};
         }
         this.mockDict = window.mockDict;

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

            url = build_query(options.url, options.data, options.method);
            this.mockDict[url] = options.success;
         }

         this.request = function (options) {
            url = build_query(options.url, options.data, options.method);
            var succ = this.mockDict[url];

            var deferred = $q.defer();
            if (succ) {
               setTimeout(function () {
                  deferred.resolve(succ());
               }, 50);
            } else {
               if (options.fail) {
                  deferred.reject({errno: 6000, error: "缃戠粶閿欒"});
               }
            }

            return deferred.promise;
         };

         this.post = function(options){
            
         };

      };
      return httpMock;
   }]);



})(window, window.angular, $, angular.module('launchApp'));

/**
 * (function(window, angular,$,payApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,payApp) {
    payApp.factory('User', ['$http', '$q', 'Common', function ($http, $q, Common) {

        var User = function(){};
        User.getVCode = function(mobile){
            return Common.httpPost(uc.serviceUrl('user/invitecode?v=3'), {mobile : mobile});
        } ;
        User.fast_login = function(mobile, vcode){
            return Common.httpPost(uc.serviceUrl('user/login?v=3'), {identity : mobile, code : vcode});
        }

        User.getInfo = function(){
            return Common.httpGet(uc.serviceUrl("user/info?v=1"));
        };

        User.authentication = function(){
            uc.modal.alert("閿欒鎻愮ず", "鎮ㄨ繕娌℃湁瀹炲悕璁よ瘉,璇峰厛杩涜瀹炲悕璁よ瘉銆�", function(){
                window.location.href = '/zc/#/auth';
            });
        };
        return User;

    }]);



})(window, window.angular, $, angular.module('launchApp'));