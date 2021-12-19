/*
 RequireJS 2.1.2 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(Y){function H(b){return"[object Function]"===L.call(b)}function I(b){return"[object Array]"===L.call(b)}function x(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function M(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));d-=1);}}function r(b,c){return da.call(b,c)}function i(b,c){return r(b,c)&&b[c]}function E(b,c){for(var d in b)if(r(b,d)&&c(b[d],d))break}function Q(b,c,d,i){c&&E(c,function(c,h){if(d||!r(b,h))i&&"string"!==typeof c?(b[h]||(b[h]={}),Q(b[h],
c,d,i)):b[h]=c});return b}function t(b,c){return function(){return c.apply(b,arguments)}}function Z(b){if(!b)return b;var c=Y;x(b.split("."),function(b){c=c[b]});return c}function J(b,c,d,i){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=i;d&&(c.originalError=d);return c}function ea(b){function c(a,g,v){var e,n,b,c,d,j,f,h=g&&g.split("/");e=h;var l=m.map,k=l&&l["*"];if(a&&"."===a.charAt(0))if(g){e=i(m.pkgs,g)?h=[g]:h.slice(0,h.length-1);g=a=e.concat(a.split("/"));
for(e=0;g[e];e+=1)if(n=g[e],"."===n)g.splice(e,1),e-=1;else if(".."===n)if(1===e&&(".."===g[2]||".."===g[0]))break;else 0<e&&(g.splice(e-1,2),e-=2);e=i(m.pkgs,g=a[0]);a=a.join("/");e&&a===g+"/"+e.main&&(a=g)}else 0===a.indexOf("./")&&(a=a.substring(2));if(v&&(h||k)&&l){g=a.split("/");for(e=g.length;0<e;e-=1){b=g.slice(0,e).join("/");if(h)for(n=h.length;0<n;n-=1)if(v=i(l,h.slice(0,n).join("/")))if(v=i(v,b)){c=v;d=e;break}if(c)break;!j&&(k&&i(k,b))&&(j=i(k,b),f=e)}!c&&j&&(c=j,d=f);c&&(g.splice(0,d,
c),a=g.join("/"))}return a}function d(a){z&&x(document.getElementsByTagName("script"),function(g){if(g.getAttribute("data-requiremodule")===a&&g.getAttribute("data-requirecontext")===j.contextName)return g.parentNode.removeChild(g),!0})}function y(a){var g=i(m.paths,a);if(g&&I(g)&&1<g.length)return d(a),g.shift(),j.require.undef(a),j.require([a]),!0}function f(a){var g,b=a?a.indexOf("!"):-1;-1<b&&(g=a.substring(0,b),a=a.substring(b+1,a.length));return[g,a]}function h(a,g,b,e){var n,u,d=null,h=g?g.name:
null,l=a,m=!0,k="";a||(m=!1,a="_@r"+(L+=1));a=f(a);d=a[0];a=a[1];d&&(d=c(d,h,e),u=i(p,d));a&&(d?k=u&&u.normalize?u.normalize(a,function(a){return c(a,h,e)}):c(a,h,e):(k=c(a,h,e),a=f(k),d=a[0],k=a[1],b=!0,n=j.nameToUrl(k)));b=d&&!u&&!b?"_unnormalized"+(M+=1):"";return{prefix:d,name:k,parentMap:g,unnormalized:!!b,url:n,originalName:l,isDefine:m,id:(d?d+"!"+k:k)+b}}function q(a){var g=a.id,b=i(k,g);b||(b=k[g]=new j.Module(a));return b}function s(a,g,b){var e=a.id,n=i(k,e);if(r(p,e)&&(!n||n.defineEmitComplete))"defined"===
g&&b(p[e]);else q(a).on(g,b)}function C(a,g){var b=a.requireModules,e=!1;if(g)g(a);else if(x(b,function(g){if(g=i(k,g))g.error=a,g.events.error&&(e=!0,g.emit("error",a))}),!e)l.onError(a)}function w(){R.length&&(fa.apply(F,[F.length-1,0].concat(R)),R=[])}function A(a,g,b){var e=a.map.id;a.error?a.emit("error",a.error):(g[e]=!0,x(a.depMaps,function(e,c){var d=e.id,h=i(k,d);h&&(!a.depMatched[c]&&!b[d])&&(i(g,d)?(a.defineDep(c,p[d]),a.check()):A(h,g,b))}),b[e]=!0)}function B(){var a,g,b,e,n=(b=1E3*m.waitSeconds)&&
j.startTime+b<(new Date).getTime(),c=[],h=[],f=!1,l=!0;if(!T){T=!0;E(k,function(b){a=b.map;g=a.id;if(b.enabled&&(a.isDefine||h.push(b),!b.error))if(!b.inited&&n)y(g)?f=e=!0:(c.push(g),d(g));else if(!b.inited&&(b.fetched&&a.isDefine)&&(f=!0,!a.prefix))return l=!1});if(n&&c.length)return b=J("timeout","Load timeout for modules: "+c,null,c),b.contextName=j.contextName,C(b);l&&x(h,function(a){A(a,{},{})});if((!n||e)&&f)if((z||$)&&!U)U=setTimeout(function(){U=0;B()},50);T=!1}}function D(a){r(p,a[0])||
q(h(a[0],null,!0)).init(a[1],a[2])}function G(a){var a=a.currentTarget||a.srcElement,b=j.onScriptLoad;a.detachEvent&&!V?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=j.onScriptError;(!a.detachEvent||V)&&a.removeEventListener("error",b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function K(){var a;for(w();F.length;){a=F.shift();if(null===a[0])return C(J("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));D(a)}}var T,W,j,N,U,m={waitSeconds:7,
baseUrl:"./",paths:{},pkgs:{},shim:{},map:{},config:{}},k={},X={},F=[],p={},S={},L=1,M=1;N={require:function(a){return a.require?a.require:a.require=j.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?a.exports:a.exports=p[a.map.id]={}},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return m.config&&i(m.config,a.map.id)||{}},exports:p[a.map.id]}}};W=function(a){this.events=i(X,a.id)||{};this.map=a;this.shim=
i(m.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};W.prototype={init:function(a,b,c,e){e=e||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&(c=t(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;this.ignore=e.ignore;e.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=
b)},fetch:function(){if(!this.fetched){this.fetched=!0;j.startTime=(new Date).getTime();var a=this.map;if(this.shim)j.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],t(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;S[a]||(S[a]=!0,j.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id;b=this.depExports;var e=this.exports,n=this.factory;
if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(H(n)){if(this.events.error)try{e=j.execCb(c,n,b,e)}catch(d){a=d}else e=j.execCb(c,n,b,e);this.map.isDefine&&((b=this.module)&&void 0!==b.exports&&b.exports!==this.exports?e=b.exports:void 0===e&&this.usingExports&&(e=this.exports));if(a)return a.requireMap=this.map,a.requireModules=[this.map.id],a.requireType="define",C(this.error=a)}else e=n;this.exports=e;if(this.map.isDefine&&
!this.ignore&&(p[c]=e,l.onResourceLoad))l.onResourceLoad(j,this.map,this.depMaps);delete k[c];this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,d=h(a.prefix);this.depMaps.push(d);s(d,"defined",t(this,function(e){var n,d;d=this.map.name;var v=this.map.parentMap?this.map.parentMap.name:null,f=j.makeRequire(a.parentMap,{enableBuildCallback:!0,
skipMap:!0});if(this.map.unnormalized){if(e.normalize&&(d=e.normalize(d,function(a){return c(a,v,!0)})||""),e=h(a.prefix+"!"+d,this.map.parentMap),s(e,"defined",t(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),d=i(k,e.id)){this.depMaps.push(e);if(this.events.error)d.on("error",t(this,function(a){this.emit("error",a)}));d.enable()}}else n=t(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),n.error=t(this,function(a){this.inited=!0;this.error=
a;a.requireModules=[b];E(k,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&delete k[a.map.id]});C(a)}),n.fromText=t(this,function(e,c){var d=a.name,u=h(d),v=O;c&&(e=c);v&&(O=!1);q(u);r(m.config,b)&&(m.config[d]=m.config[b]);try{l.exec(e)}catch(k){throw Error("fromText eval for "+d+" failed: "+k);}v&&(O=!0);this.depMaps.push(u);j.completeLoad(d);f([d],n)}),e.load(a.name,f,n,m)}));j.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){this.enabling=this.enabled=!0;x(this.depMaps,t(this,function(a,
b){var c,e;if("string"===typeof a){a=h(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=i(N,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;s(a,"defined",t(this,function(a){this.defineDep(b,a);this.check()}));this.errback&&s(a,"error",this.errback)}c=a.id;e=k[c];!r(N,c)&&(e&&!e.enabled)&&j.enable(a,this)}));E(this.pluginMaps,t(this,function(a){var b=i(k,a.id);b&&!b.enabled&&j.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=
this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){x(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};j={config:m,contextName:b,registry:k,defined:p,urlFetched:S,defQueue:F,Module:W,makeModuleMap:h,nextTick:l.nextTick,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=m.pkgs,c=m.shim,e={paths:!0,config:!0,map:!0};E(a,function(a,b){e[b]?"map"===b?Q(m[b],a,!0,!0):Q(m[b],a,!0):m[b]=a});a.shim&&(E(a.shim,function(a,
b){I(a)&&(a={deps:a});if((a.exports||a.init)&&!a.exportsFn)a.exportsFn=j.makeShimExports(a);c[b]=a}),m.shim=c);a.packages&&(x(a.packages,function(a){a="string"===typeof a?{name:a}:a;b[a.name]={name:a.name,location:a.location||a.name,main:(a.main||"main").replace(ga,"").replace(aa,"")}}),m.pkgs=b);E(k,function(a,b){!a.inited&&!a.map.unnormalized&&(a.map=h(b))});if(a.deps||a.callback)j.require(a.deps||[],a.callback)},makeShimExports:function(a){return function(){var b;a.init&&(b=a.init.apply(Y,arguments));
return b||a.exports&&Z(a.exports)}},makeRequire:function(a,d){function f(e,c,u){var i,m;d.enableBuildCallback&&(c&&H(c))&&(c.__requireJsBuild=!0);if("string"===typeof e){if(H(c))return C(J("requireargs","Invalid require call"),u);if(a&&r(N,e))return N[e](k[a.id]);if(l.get)return l.get(j,e,a);i=h(e,a,!1,!0);i=i.id;return!r(p,i)?C(J("notloaded",'Module name "'+i+'" has not been loaded yet for context: '+b+(a?"":". Use require([])"))):p[i]}K();j.nextTick(function(){K();m=q(h(null,a));m.skipMap=d.skipMap;
m.init(e,c,u,{enabled:!0});B()});return f}d=d||{};Q(f,{isBrowser:z,toUrl:function(b){var d=b.lastIndexOf("."),g=null;-1!==d&&(g=b.substring(d,b.length),b=b.substring(0,d));return j.nameToUrl(c(b,a&&a.id,!0),g)},defined:function(b){return r(p,h(b,a,!1,!0).id)},specified:function(b){b=h(b,a,!1,!0).id;return r(p,b)||r(k,b)}});a||(f.undef=function(b){w();var c=h(b,a,!0),d=i(k,b);delete p[b];delete S[c.url];delete X[b];d&&(d.events.defined&&(X[b]=d.events),delete k[b])});return f},enable:function(a){i(k,
a.id)&&q(a).enable()},completeLoad:function(a){var b,c,d=i(m.shim,a)||{},h=d.exports;for(w();F.length;){c=F.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);D(c)}c=i(k,a);if(!b&&!r(p,a)&&c&&!c.inited){if(m.enforceDefine&&(!h||!Z(h)))return y(a)?void 0:C(J("nodefine","No define call for "+a,null,[a]));D([a,d.deps||[],d.exportsFn])}B()},nameToUrl:function(a,b){var c,d,h,f,j,k;if(l.jsExtRegExp.test(a))f=a+(b||"");else{c=m.paths;d=m.pkgs;f=a.split("/");for(j=f.length;0<j;j-=1)if(k=
f.slice(0,j).join("/"),h=i(d,k),k=i(c,k)){I(k)&&(k=k[0]);f.splice(0,j,k);break}else if(h){c=a===h.name?h.location+"/"+h.main:h.location;f.splice(0,j,c);break}f=f.join("/");f+=b||(/\?/.test(f)?"":".js");f=("/"===f.charAt(0)||f.match(/^[\w\+\.\-]+:/)?"":m.baseUrl)+f}return m.urlArgs?f+((-1===f.indexOf("?")?"?":"&")+m.urlArgs):f},load:function(a,b){l.load(j,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||ha.test((a.currentTarget||a.srcElement).readyState))P=
null,a=G(a),j.completeLoad(a.id)},onScriptError:function(a){var b=G(a);if(!y(b.id))return C(J("scripterror","Script error",a,[b.id]))}};j.require=j.makeRequire();return j}var l,w,A,D,s,G,P,K,ba,ca,ia=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ja=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,aa=/\.js$/,ga=/^\.\//;w=Object.prototype;var L=w.toString,da=w.hasOwnProperty,fa=Array.prototype.splice,z=!!("undefined"!==typeof window&&navigator&&document),$=!z&&"undefined"!==typeof importScripts,ha=z&&
"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,V="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),B={},q={},R=[],O=!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(H(requirejs))return;q=requirejs;requirejs=void 0}"undefined"!==typeof require&&!H(require)&&(q=require,require=void 0);l=requirejs=function(b,c,d,y){var f,h="_";!I(b)&&"string"!==typeof b&&(f=b,I(c)?(b=c,c=d,d=y):b=[]);f&&f.context&&(h=f.context);(y=i(B,h))||(y=B[h]=l.s.newContext(h));
f&&y.configure(f);return y.require(b,c,d)};l.config=function(b){return l(b)};l.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,4)}:function(b){b()};require||(require=l);l.version="2.1.2";l.jsExtRegExp=/^\/|:|\?|\.js$/;l.isBrowser=z;w=l.s={contexts:B,newContext:ea};l({});x(["toUrl","undef","defined","specified"],function(b){l[b]=function(){var c=B._;return c.require[b].apply(c,arguments)}});if(z&&(A=w.head=document.getElementsByTagName("head")[0],D=document.getElementsByTagName("base")[0]))A=
w.head=D.parentNode;l.onError=function(b){throw b;};l.load=function(b,c,d){var i=b&&b.config||{},f;if(z)return f=i.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),f.type=i.scriptType||"text/javascript",f.charset="utf-8",f.async=!0,f.setAttribute("data-requirecontext",b.contextName),f.setAttribute("data-requiremodule",c),f.attachEvent&&!(f.attachEvent.toString&&0>f.attachEvent.toString().indexOf("[native code"))&&!V?(O=!0,f.attachEvent("onreadystatechange",
b.onScriptLoad)):(f.addEventListener("load",b.onScriptLoad,!1),f.addEventListener("error",b.onScriptError,!1)),f.src=d,K=f,D?A.insertBefore(f,D):A.appendChild(f),K=null,f;$&&(importScripts(d),b.completeLoad(c))};z&&M(document.getElementsByTagName("script"),function(b){A||(A=b.parentNode);if(s=b.getAttribute("data-main"))return q.baseUrl||(G=s.split("/"),ba=G.pop(),ca=G.length?G.join("/")+"/":"./",q.baseUrl=ca,s=ba),s=s.replace(aa,""),q.deps=q.deps?q.deps.concat(s):[s],!0});define=function(b,c,d){var i,
f;"string"!==typeof b&&(d=c,c=b,b=null);I(c)||(d=c,c=[]);!c.length&&H(d)&&d.length&&(d.toString().replace(ia,"").replace(ja,function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c));if(O){if(!(i=K))P&&"interactive"===P.readyState||M(document.getElementsByTagName("script"),function(b){if("interactive"===b.readyState)return P=b}),i=P;i&&(b||(b=i.getAttribute("data-requiremodule")),f=B[i.getAttribute("data-requirecontext")])}(f?f.defQueue:R).push([b,c,d])};define.amd=
{jQuery:!0};l.exec=function(b){return eval(b)};l(q)}})(this);

/**
 * @auto xuhu
 * @addtime 20150423
 * 该方法用于判断浏览器类型|版本|操作系统
 * 使用方法：调用这三个方法即可
 *  1、返回浏览器名称 : BrowserDetect.browser
 *  2、返回浏览器版本: BrowserDetect.version
 *  3、返回运行平台: BrowserDetect.OS
 */
var BrowserDetect={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS"},searchString:function(e){for(var t=0;t<e.length;t++){var n=e[t].string;var r=e[t].prop;this.versionSearchString=e[t].versionSearch||e[t].identity;if(n){if(n.indexOf(e[t].subString)!=-1)return e[t].identity}else if(r)return e[t].identity}},searchVersion:function(e){var t=e.indexOf(this.versionSearchString);if(t==-1)return;return parseFloat(e.substring(t+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};BrowserDetect.init()


/**
 * 脚本管理组件(将来需要弃用 可以采用require代替)
 * @class ATW.Script
 * @version 2.1
 * @author cqb
 * @deprecated
 */
jQuery.Script = {};
jQuery.extend(jQuery.Script,{
	/**
     * 引入该脚本文件和该类的依赖脚本文件或则依赖样式文件
     * @param {String} libnames 该类的名称串
     * @param {Function} cback 回调函数
     * @return {void}
     */
	importlib: function(libnames, cback){
		var arr = libnames.split(",");
		require(arr, cback);
	},
	
	/**
     * 获取组件库的根路径
     * @return {String} 组件库的根路径
     */
	_getLibPath: function(){
		var elements = document.getElementsByTagName('script');
	    for (var i = 0, len = elements.length; i < len; i++) {
	        if (elements[i].src && elements[i].src.match(/at.scriptmanager.js/)) {
	            return elements[i].src.substring(0, elements[i].src.lastIndexOf('/') + 1);
	        }
	    }
	    throw new Error("未曾引用脚本管理类at.scriptmanager.js");
	    return "";
	},
	
	/**
     * 获取组件库的根路径
     * @return {String} 组件库的根路径
     */
	libPath:(function(){
		var elements = document.getElementsByTagName('script');
	    for (var i = 0, len = elements.length; i < len; i++) {
	        if (elements[i].src && elements[i].src.match(/at.scriptmanager.js/)) {
	            return elements[i].src.substring(0, elements[i].src.lastIndexOf('/') + 1);
	        }
	    }
	    throw new Error("未曾引用脚本管理类at.scriptmanager.js");
	    return "";
	})()
});

require.config({
	baseUrl: jQuery.Script.libPath,
	paths: {
		"jquery": "../../lib/jquery-1.7.2.min",
		"ATW.class": "core/at.core.class",
		"Array": "core/Array",
		"Date": "core/Date",
		"ATW.Object": "core/at.core.object",
		"ATW.Component": "core/at.core.component",
		"ATW.base.Xml": "base/at.base.xml",
		"ATW.Util": "base/at.base.utils",
		"ATW.Parameter": "at.base.parameter",
		"ATW.Control": "form/control/at.form.control",
		"ATW.Accordion": "form/accordion/at.form.accordion",
		"ATW.Animate": "form/animate/at.form.animate",
		"ATW.FloatDiv": "form/floatdiv/at.form.floatdiv",
		"ATW.Audio": "form/audio/at.form.audio",
		"ATW.Balloon": "form/balloon/at.form.balloon",
		"ATW.Chart": "form/chart/at.form.chart",
		"FusionChartsExportComponent": "form/chart/FusionChartsExportComponent",
		
		"ATW.Table": "form/grid/at.form.table",
		"dhtmlxgrid": "form/grid/js/dhtmlxgrid",
		"dhtmlxgrid_pgn": "form/grid/js/dhtmlxgrid_pgn",
		"dhtmlxgridcell": "form/grid/js/dhtmlxgridcell",
		"TableData": "form/grid/at.form.table.data",
		"TableJSONData": "form/grid/at.form.table.json",
		"TableDataSetData": "form/grid/at.form.table.dataset",
		"TableXMLData": "form/grid/at.form.table.xml",
		
		"ATW.keeptouch": "form/keeptouch/at.form.keeptouch",
		"ATW.MessageBox": "form/messagebox/at.form.messagebox",
		"ATW.MouseGesture": "form/mousegesture/at.form.mousegesture",
		"ATW.MultiTouch": "form/multitouch/at.form.multitouch",
		"ATW.Panel": "form/panel/at.form.panel",
		"ATW.Select": "form/select/at.form.select",
		"ATW.SideBar": "form/sidebar/at.form.sidebar",
		"ATW.Spin": "form/spin/at.form.spin",
		"ATW.Splitter": "form/splitter/at.form.splitter",
		"ATW.sTab": "form/stab/at.form.stab",
		"ATW.SimpleTable": "form/table/at.form.simpletable",
		"ATW.TinyScroll": "form/tinyscroll/at.form.tinyScroll",
		"ATW.transform": "form/transform/at.form.transform",
		"ATW.Tree": "form/tree/at.form.tree",
		"dhtmlxtree": "form/tree/js/dhtmlxtree",
		"ATW.Tooltip": "form/tooltip/at.form.tooltip",
		"ATW.Pic360": "form/pic360/at.form.pic360",
		"ATW.ImageShow": "form/imageshow/at.form.imageshow",
		"ATW.PimgShow": "form/imageshow/at.form.pimgshow",
		"ATW.TimeLine": "form/timeline/at.form.timeline",
		"ATW.Dialog": "form/dialog/at.form.dialog",
		"ATW.Video": "form/video/at.form.video",
		
		"ATW.DatePicker": "form/form/datepicker",
		"ATW.CheckBox": "form/form/checkbox",
		"ATW.Radio": "form/form/radio",
		"ATW.Button": "form/form/button",
		"ATW.CEditor": "form/form/ceditor",
		"ATW.Switch": "form/form/switch",
		"ATW.Input": "form/form/input",
		"ATW.Slider": "form/form/slider",
		"ATW.FormImages": "form/form/formimages",
		
		"ATW.ClientDataSet": "../ds/ClientDataSet",
		"ATW.CDataReader": "../ds/CDataReader",
		"ATW.CField": "../ds/CField",
		"ATW.CFieldMeta": "../ds/CFieldMeta",
		"ATW.CFilter": "../ds/CFilter",
		"ATW.CJSONDataReader": "../ds/CJSONDataReader",
		"ATW.ClientDataSetFactory": "../ds/ClientDataSetFactory",
		"ATW.CMeta": "../ds/CMeta",
		"ATW.CPage": "../ds/CPage",
		"ATW.CRecord": "../ds/CRecord",
		"ATW.CXmlDataReader": "../ds/CXmlDataReader",
		
		"ATW.Form": "../form/form",
		"ATW.FormDB": "../form/formdb",
		"ATW.DBLink": "../form/dblink",
		"ATW.FormDesiner": "../form/formdesiner",
		"ATW.Form.ComBox": "../form/core/combox",
		"ATW.Form.DateInput": "../form/core/dateinput",
		"ATW.Form.InputText": "../form/core/inputtext",
		"ATW.Form.TextArea": "../form/core/textarea",
		"ATW.Form.Editor": "../form/core/editor",
		"ATW.Form.CheckBoxGroup": "../form/core/checkboxgroup",
		"ATW.Form.RadioGroup": "../form/core/radiogroup",
		"ATW.Form.Sortable": "form/sortable/Sortable.min",
		
		//extends
		"ATW.LoginDiv" : "extends/at.form.logindiv",
		"ATW.Legend" : "extends/at.form.legend",
		"ATW.DynAccordion" : "extends/dynamicAccordion/at.form.dynamicAccordion"
	},
	shim:{
		"ATW.Object":["ATW.class"],
		"ATW.Util": ["ATW.class"],
		"ATW.Parameter": ["ATW.class"],
		"ATW.Component":["ATW.Object"],
		"ATW.Control":["ATW.Component"],
		"ATW.base.Xml":["ATW.Object"],
		"ATW.Animate": ["ATW.Object"],
		"ATW.Accordion":["ATW.Control"],
		"ATW.FloatDiv":["ATW.Control","ATW.Util"],
		"ATW.Audio":["ATW.Control"],
		"ATW.Balloon":["ATW.Control"],
		"FusionChartsExportComponent": ["form/chart/FusionCharts"],
		"ATW.Chart":["ATW.Control","FusionChartsExportComponent","ATW.base.Xml"],
		
		"TableData": ["ATW.Object"],
		"TableJSONData": ["TableData"],
		"TableDataSetData": ["TableJSONData"],
		"TableXMLData": ["TableData"],
		"ATW.Table": ["ATW.class","ATW.Object","ATW.Control","dhtmlxgrid_pgn","dhtmlxgridcell",
		              "TableData","TableJSONData","TableDataSetData","TableXMLData"],
		"dhtmlxgrid": ["form/grid/js/dhtmlxcommon"],
		"dhtmlxgrid_pgn": ["dhtmlxgrid"],
		"dhtmlxgridcell": ["dhtmlxgrid"],
		
		"ATW.keeptouch":["ATW.Object"],
		"ATW.MessageBox": ["ATW.Object"],
		"ATW.MouseGesture": ["ATW.Object"],
		"ATW.MultiTouch": ["ATW.Object"],
		"ATW.Panel": ["ATW.Control"],
		"ATW.Select": ["ATW.Control"],
		"ATW.SideBar": ["ATW.Control"],
		"ATW.Spin": ["ATW.Control"],
		"ATW.Splitter": ["ATW.Panel"],
		"ATW.sTab": ["ATW.Control"],
		"ATW.SimpleTable": ["ATW.Control","Array"],
		"ATW.TinyScroll": ["ATW.Control"],
		"ATW.transform": ["ATW.Animate"],
		/*"ATW.Tree": ["ATW.Control","ATW.base.Xml","form/tree/js/dhtmlxcommon","form/tree/js/dhtmlxtree"],*/
		"dhtmlxtree": ["form/tree/js/dhtmlxcommon"],
		"ATW.Tree": ["ATW.Control","ATW.base.Xml","dhtmlxtree"],
		"ATW.Tooltip": ["ATW.Control"],
		"ATW.Pic360": ["ATW.FloatDiv"],
		"ATW.ImageShow": ["ATW.FloatDiv"],
		"ATW.PimgShow": ["ATW.Control"],
		"ATW.TimeLine": ["ATW.Control"],
		
		"ATW.DatePicker": ["Date","ATW.Select","ATW.Input"],
		"ATW.CheckBox": ["ATW.Control"],
		"ATW.Radio": ["ATW.Control"],
		"ATW.Button": ["ATW.Control"],
		"ATW.CEditor": ["ATW.Control"],
		"ATW.Switch": ["ATW.Control"],
		"ATW.Input": ["ATW.Control"],
		"ATW.Slider": ["ATW.Control"],
		"ATW.FormImages": ["ATW.Control"],
		"ATW.Video": ["ATW.Control"],
		
		"ATW.ClientDataSet": ["ATW.base.Xml","ATW.CDataReader","ATW.CField","ATW.CFieldMeta","ATW.CFieldMeta",
		                      "ATW.CFilter","ATW.CJSONDataReader","ATW.ClientDataSetFactory","ATW.CMeta",
		                      "ATW.CPage","ATW.CRecord","ATW.CXmlDataReader"],
		"ATW.CDataReader": ["ATW.Object"],
		"ATW.CField": ["ATW.Object"],
		"ATW.CFieldMeta": ["ATW.Object"],
		"ATW.CFilter": ["ATW.Object"],
		"ATW.CJSONDataReader": ["ATW.Object"],
		"ATW.ClientDataSetFactory": ["ATW.Object"],
		"ATW.CMeta": ["ATW.Object"],
		"ATW.CPage": ["ATW.Object"],
		"ATW.CRecord": ["ATW.Object"],
		"ATW.CXmlDataReader": ["ATW.Object"],
		
		
		"ATW.Form.ComBox": ["ATW.DBLink"],
		"ATW.Form.DateInput": ["ATW.DBLink"],
		"ATW.Form.InputText": ["ATW.DBLink"],
		"ATW.Form.TextArea": ["ATW.DBLink"],
		"ATW.Form.Editor": ["ATW.DBLink"],
		"ATW.Form.CheckBoxGroup": ["ATW.DBLink"],
		"ATW.Form.RadioGroup": ["ATW.DBLink"],
		"ATW.FormDB": ["ATW.class"],
		"ATW.FormDesiner": ["ATW.class"],
		"ATW.Form": ["ATW.class","ATW.ClientDataSet","ATW.FormDB","ATW.FormDesiner","ATW.Form.ComBox","ATW.Form.DateInput","ATW.Form.InputText",
		             "ATW.Form.TextArea","ATW.Form.Editor","ATW.Form.CheckBoxGroup","ATW.Form.RadioGroup","ATW.Tooltip",
		             "../form/validate/jquery.validationEngine","../form/validate/languages/jquery.validationEngine-zh_CN"],
		//extends
		"ATW.LoginDiv" : ["ATW.FloatDiv"],
		"ATW.Legend"	: ["ATW.class","ATW.Tree"],
		"ATW.DynAccordion": ["ATW.Control"],
		"ATW.Dialog": ["ATW.Control"]
	}
});