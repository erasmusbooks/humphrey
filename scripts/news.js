webpackJsonp([5],[function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _jquery=__webpack_require__(7),_jquery2=_interopRequireDefault(_jquery);(0,_jquery2.default)(document).ready(function(){(0,_jquery2.default)(document).on("click",".navigation a, .category-list li a, .archive-list li a",function(e){e.preventDefault();var oldURL=window.location.href;(0,_jquery2.default)(".loader").addClass("active"),(0,_jquery2.default)("#main .content").load(e.target.href+" #news-wrapper",function(){(0,_jquery2.default)(".loader").removeClass("active"),history.pushState({ajaxLoaded:!0,oldURL:oldURL},null,e.target.href)})})})}]);