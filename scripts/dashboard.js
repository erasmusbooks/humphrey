webpackJsonp([4],[function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function dashTime(){var now=(0,_moment2.default)();document.getElementById("dash-weekday").innerHTML=now.format("dddd"),document.getElementById("dash-dayno").innerHTML=now.format("D"),document.getElementById("dash-monthyear").innerHTML=now.format("MMMM YYYY"),document.getElementById("dash-week").innerHTML="Week "+now.format("W"),document.getElementById("dash-time").innerHTML=now.format("HH:mm")}var _jquery=__webpack_require__(7),_jquery2=_interopRequireDefault(_jquery),_moment=__webpack_require__(1),_moment2=_interopRequireDefault(_moment);(0,_jquery2.default)(document).ready(function(){dashTime(),setInterval(function(){dashTime()},6e4),(0,_jquery2.default)(".dash-loader").addClass("active");var now=(0,_moment2.default)().format("E"),today=(0,_moment2.default)(),tomorrow=(0,_moment2.default)().add(1,"days");5==now?tomorrow=(0,_moment2.default)().add(3,"days"):6==now?(today=(0,_moment2.default)().add(2,"days"),tomorrow=(0,_moment2.default)().add(3,"days")):7==now&&(today=(0,_moment2.default)().add(1,"days"),tomorrow=(0,_moment2.default)().add(2,"days")),(0,_jquery2.default)("#dash-today h3").text(now==today.format("E")?"Today":today.format("dddd")),(0,_jquery2.default)("#dash-tomorrow h3").text(now+1==tomorrow.format("E")?"Tomorrow":tomorrow.format("dddd")),_jquery2.default.ajax({method:"GET",url:document.baseURI+"/events/?start="+today.startOf("day").format("X")+"&end="+tomorrow.endOf("day").format("X"),dataType:"json"}).done(function(data){Array.isArray(data)?(data.forEach(function(ev){ev.visible=!0,ev.allday?(ev.start=(0,_moment2.default)(ev.start,"X"),ev.end&&(ev.end=(0,_moment2.default)(ev.end,"X"))):(ev.start=(0,_moment2.default)(ev.start,"X").subtract(2,"hours"),ev.end&&(ev.end=(0,_moment2.default)(ev.end,"X").subtract(2,"hours")))}),setTimeout(function(){(0,_jquery2.default)(".dash-loader").remove(),(0,_jquery2.default)(".dash-events").addClass("active")},300)):setTimeout(function(){(0,_jquery2.default)(".dash-loader").remove(),(0,_jquery2.default)(".dash-events").addClass("active")},300)})})}]);