("object"==typeof module&&"object"==typeof module.exports&&function(e){module.exports=e()}||"function"==typeof define&&function(e){define("domchanger",e)}||function(e){window.domChanger=e()})(function(){"use strict"
function e(e,t){for(var n=Object.keys(e),r=0,o=n.length;o>r;++r){var l=n[r]
t(l,e[l])}}function t(r,l,i){function a(){w.parentNode.appendChild(w),e(E,function(e,t){t.el?l.appendChild(t.el):t.append&&t.append()})}function c(){w.parentNode.removeChild(w),w=null,d(E),delete k.update,delete k.destroy,delete k.handleEvent,j()}function d(t){e(t,function(e,n){n.el?n.el.parentNode.removeChild(n.el):n.destroy&&n.destroy(),delete t[e],n.children&&d(n.children)})}function u(){if(N){var e=n(N.apply(null,g))
m(l,e,E)}}function p(e){e.destroy?e.destroy():e.el.parentNode.removeChild(e.el)}function m(n,r,l){e(l,function(e,t){r[e]||(p(t),delete l[e])})
var i,a,f,c=Object.keys(l),d=Object.keys(r)
for(i=0,a=d.length;a>i;i++){f=d[i]
var u=l[f],s=r[f]
if("text"in s)u?s.text!==u.text&&(u.el.nodeValue=u.text=s.text):(u=l[f]={text:s.text,el:document.createTextNode(s.text)},n.appendChild(u.el))
else if(s.tagName)u||(u=l[f]={tagName:s.tagName,el:document.createElement(s.tagName),children:{}},s.ref&&(u.ref=s.ref,b[u.ref]=u.el),n.appendChild(u.el)),u.props||(u.props={}),o(u.el,s.props,u.props),s.children&&m(u.el,s.children,u.children)
else if(s.component)u||(u=l[f]=t(s.component,n,k),u.append()),u.update.apply(null,s.data)
else{if(!s.el)throw console.error(s),Error("This shouldn't happen")
u&&(u=p(u)),u=l[f]={el:s.el},n.appendChild(u.el)}}var v=!1
for(i=0,a=d.length;a>i;i++){f=d[i]
var h=c.indexOf(f)
if(h>=0&&h!==i){v=!0
break}}v&&e(r,function(e){var t=l[e]
delete l[e],l[e]=t,t.append?t.append():n.appendChild(t.el)})}function v(){g=s.call(arguments),u()}function h(){if(!i)throw Error("Can't emit events from top-level component")
i.handleEvent.apply(null,arguments)}function y(e){var t=C[e]
if(!t){if(i)return i.handleEvent.apply(null,arguments)
throw Error("Missing event handler for "+e)}t.apply(null,s.call(arguments,1))}var b={},g=[],E={},x=r(h,u,b),N=x.render,C=x.on||{},j=x.cleanup||f,k={update:v,destroy:c,append:a,handleEvent:y},w=document.createComment(r.name)
return l.appendChild(w),k}function n(e){function t(e,n){var o,l,i
if("number"==typeof n&&(n+=""),"string"==typeof n)o="text"
else if(Array.isArray(n)){if(!n.length)return
if(l=n[0],"function"==typeof l)o="component"
else{if("string"!=typeof l)return void n.forEach(function(n){t(e,n)})
i=r(n),o="element"}}else{if(!(n instanceof HTMLElement))throw console.error(n),new TypeError("Invalid item")
o="el"}for(var f=1,c="element"==o?i.name:"component"==o?n[0].name:o,d="element"===o?i.ref:"component"===o?n.key:null,u=d?c+"-"+d:c;e[u];)u=c+"-"+(d||"")+ ++f
var p
if("text"===o)return void(e[u]={text:n})
if("el"===o)return void(e[u]={el:n})
if("element"===o){var s={}
return p=e[u]={tagName:i.name},a(i.props)||(p.props=i.props),i.ref&&(p.ref=i.ref),i.body.forEach(function(e){t(s,e)}),void(a(s)||(p.children=s))}if("component"===o)return void(e[u]={component:n[0],data:n.slice(1)})
throw new TypeError("Invalid type")}var n={}
return t(n,e),n}function r(e){var t,n={}
if(e[1]&&e[1].constructor===Object){for(var r=Object.keys(e[1]),o=0,l=r.length;l>o;o++){var a=r[o]
n[a]=e[1][a]}t=e.slice(2)}else t=e.slice(1)
var f=e[0],s=f.match(p),m={name:s?s[0]:"div",props:n,body:t},v=f.match(c)
v&&(v=v.map(i).join(" "),n["class"]?n["class"]+=" "+v:n["class"]=v)
var h=f.match(d)
h&&(n.id=i(h[0]))
var y=f.match(u)
return y&&(m.ref=i(y[0])),m}function o(t,n,r){Object.keys(r).forEach(function(e){if(!n||!n[e]){if("on"===e.substr(0,2)){var o=e.substring(2)
t.removeEventListener(o,r[e])}else t.removeAttribute(e)
r[e]=null}}),n&&e(n,function(e,n){var o=r[e]
if("style"===e&&"object"==typeof n)return"string"==typeof o&&t.removeAttribute("style"),o&&"object"==typeof o||(o=r.style={}),void l(t.style,n,o)
if(o!==n)if(r[e]=n,"on"===e.substr(0,2)){var i=e.substring(2)
o&&t.removeEventListener(i,o),t.addEventListener(i,n)}else if("checked"===e&&"INPUT"===t.nodeName){if(t.checked===n)return
t.checked=n}else if("value"===e&&"INPUT"===t.nodeName){if(t.value===n)return
t.value=n}else"boolean"==typeof n?n?t.setAttribute(e,e):t.removeAttribute(e):t.setAttribute(e,n)})}function l(t,n,r){e(r,function(e){n&&n[e]||(r[e]=t[e]="")}),n&&e(n,function(e,o){var l=r[e]
l!==o&&(r[e]=t[e]=n[e])})}function i(e){return e.substring(1)}function a(e){return!Object.keys(e).length}function f(){}var c=/\.[^.#$]+/g,d=/#[^.#$]+/,u=/\$[^.#$]+/,p=/^[^.#$]+/,s=[].slice
return t})
