webpackJsonp([3],[function(a,e,t){"use strict";function n(a){return a&&a.__esModule?a:{default:a}}var o=t(7),l=n(o);(0,l.default)(document).ready(function(){(0,l.default)(document).on("click",".navigation a, .category-list li a, .archive-list li a",function(a){a.preventDefault();var e=window.location.href;(0,l.default)(".loader").addClass("active"),(0,l.default)("#main .content").load(a.target.href+" #news-wrapper",function(){(0,l.default)(".loader").removeClass("active"),history.pushState({ajaxLoaded:!0,oldURL:e},null,a.target.href)})})})}]);