(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/index"],{"76c0":function(t,e,s){"use strict";(function(t){s("81aa"),s("921b");i(s("66fd"));var e=i(s("933c"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,s("543d")["createPage"])},"933c":function(t,e,s){"use strict";s.r(e);var i=s("a08a"),a=s("cb8f");for(var n in a)"default"!==n&&function(t){s.d(e,t,function(){return a[t]})}(n);s("cae4");var o,r=s("f0c5"),u=Object(r["a"])(a["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],o);e["default"]=u.exports},9404:function(t,e,s){},a08a:function(t,e,s){"use strict";var i,a=function(){var t=this,e=t.$createElement;t._self._c},n=[];s.d(e,"b",function(){return a}),s.d(e,"c",function(){return n}),s.d(e,"a",function(){return i})},cae4:function(t,e,s){"use strict";var i=s("9404"),a=s.n(i);a.a},cb8f:function(t,e,s){"use strict";s.r(e);var i=s("f882"),a=s.n(i);for(var n in i)"default"!==n&&function(t){s.d(e,t,function(){return i[t]})}(n);e["default"]=a.a},f882:function(t,e,s){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var s={data:function(){return{topMarginStyle:"",menu:"user",CustomBar:this.CustomBar,indexImages:this.$config.indexImages,indexClass:"animation-slide-bottom",loginClass:"hidden",registerClass:"hidden",userClass:"hidden",isRotate:!1,param:{account:"admin",password:"123456",mobile:"17080057443",captcha:"1111"},cont:1,lang:localStorage.getItem("locale"),userInfo:this.$db.get("userInfo"),avatarStyle:this.$config.logo}},methods:{getCaptcha:function(){var t=this;console.log("parseInt(this.param.mobile)",parseInt(this.param.mobile)),this.isRotate?this.$refs["myMessage"].warn(this.i18n.pleaseWaitPatiently):this.param.mobile<1e4?this.$refs["myMessage"].warn(this.i18n.mobileInputError):(this.isRotate=!0,this.$api.sendLoginCaptcha(this.param,function(e){e.code?(t.$refs["myMessage"].success(e.msg),t.$refs.countdown.$emit("runCountdown")):t.$refs["myMessage"].err(e.msg)},function(){t.isRotate=!1}))},ChangeLanguage:function(t){this.$common.respond(),this.lang=t,this.$i18n.locale=t},skip:function(){t.redirectTo({url:"./app"})},mobileLogin:function(){var t=this;this.isRotate?this.$refs["myMessage"].warn(this.i18n.pleaseWaitPatiently):""==this.param.mobile||this.param.mobile.length<6?this.$refs["myMessage"].warn(this.i18n.mobileInputError):""==this.param.captcha||this.param.mobile.captcha<4?this.$refs["myMessage"].warn(this.i18n.captchaInputError):(this.isRotate=!0,this.$api.mobileLogin(this.param,function(e){e.code?(t.$common.saveUserInfo(e.data),t.$refs["myMessage"].success(e.msg)):t.$refs["myMessage"].err(e.msg)},function(){t.isRotate=!1}))},login:function(){var t=this;this.isRotate?this.$refs["myMessage"].warn(this.i18n.pleaseWaitPatiently):""==this.param.account||this.param.password.length<6?this.$refs["myMessage"].warn(this.i18n.accountPassErr):(this.isRotate=!0,setTimeout(function(){t.$api.login(t.param,function(e){e.code?(t.$common.saveUserInfo(e.data),t.$refs["myMessage"].success(e.msg)):t.$refs["myMessage"].err(e.msg)},function(){t.isRotate=!1})},1e3))},Toggle:function(t){var e=this;switch(this.isRotate=!1,t){case"login":this.indexClass="anim-slide-right-out",setTimeout(function(){e.loginClass="anim-slide-left-in z-i-9"},100);break;case"user":this.indexClass="anim-slide-right-out",setTimeout(function(){e.userClass="anim-slide-left-in z-i-9"},100);break;case"register":this.indexClass="anim-slide-right-out",setTimeout(function(){e.registerClass="anim-slide-left-in z-i-9"},100);break;case"index":"login"==this.menu?(this.loginClass="anim-slide-left-out",setTimeout(function(){e.indexClass="anim-slide-right-in z-i-9"},100)):"user"==this.menu?(this.$db.del("userInfo"),this.userClass="anim-slide-left-out",setTimeout(function(){e.indexClass="anim-slide-right-in z-i-9"},100)):(this.registerClass="anim-slide-left-out",setTimeout(function(){e.indexClass="anim-slide-right-in z-i-9"},100));break;default:break}this.menu=t}},created:function(){console.log("页面创建完成")},onLoad:function(){var t=this,e=this.CustomBar;if(this.topMarginStyle="margin-top:".concat(e,"px;"),this.userInfo){var s=this.userInfo.avatar?this.userInfo.avatar:this.config.logo;this.avatarStyle="background-image:url(".concat(s,");"),console.log("this.userInfo",this.userInfo),this.$api.refreshUser("",function(e){e.code&&(t.$common.saveUserInfo(e.data),t.Toggle("user"))})}},computed:{i18n:function(){return this.$t("index")}}};e.default=s}).call(this,s("543d")["default"])}},[["76c0","common/runtime","common/vendor"]]]);