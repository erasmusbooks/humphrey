webpackJsonp([2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _jquery2.default)(document).ready(function () {
	
		(0, _jquery2.default)(document).on('click', '.navigation a, .category-list li a, .archive-list li a', function (e) {
			e.preventDefault();
			var oldURL = window.location.href;
	
			(0, _jquery2.default)('.loader').addClass('active');
	
			(0, _jquery2.default)('#main .content').load(e.target.href + ' #news-wrapper', function () {
	
				(0, _jquery2.default)('.loader').removeClass('active');
				history.pushState({ ajaxLoaded: true, oldURL: oldURL }, null, e.target.href);
			});
		});
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9uZXdzLmpzIl0sIm5hbWVzIjpbImRvY3VtZW50IiwicmVhZHkiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm9sZFVSTCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImFkZENsYXNzIiwibG9hZCIsInRhcmdldCIsInJlbW92ZUNsYXNzIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImFqYXhMb2FkZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFFQSx1QkFBRUEsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQU07O0FBRXZCLHdCQUFFRCxRQUFGLEVBQVlFLEVBQVosQ0FBZSxPQUFmLEVBQXdCLHdEQUF4QixFQUFrRixhQUFLO0FBQ3RGQyxLQUFFQyxjQUFGO0FBQ0EsT0FBSUMsU0FBU0MsT0FBT0MsUUFBUCxDQUFnQkMsSUFBN0I7O0FBRUEseUJBQUUsU0FBRixFQUFhQyxRQUFiLENBQXNCLFFBQXRCOztBQUVBLHlCQUFFLGdCQUFGLEVBQW9CQyxJQUFwQixDQUF5QlAsRUFBRVEsTUFBRixDQUFTSCxJQUFULEdBQWdCLGdCQUF6QyxFQUEyRCxZQUFNOztBQUVoRSwwQkFBRSxTQUFGLEVBQWFJLFdBQWIsQ0FBeUIsUUFBekI7QUFDQUMsWUFBUUMsU0FBUixDQUFrQixFQUFFQyxZQUFZLElBQWQsRUFBb0JWLFFBQVFBLE1BQTVCLEVBQWxCLEVBQXdELElBQXhELEVBQThERixFQUFFUSxNQUFGLENBQVNILElBQXZFO0FBQ0EsSUFKRDtBQUtBLEdBWEQ7QUFZQSxFQWRELEUiLCJmaWxlIjoibmV3cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcblxyXG5cdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcubmF2aWdhdGlvbiBhLCAuY2F0ZWdvcnktbGlzdCBsaSBhLCAuYXJjaGl2ZS1saXN0IGxpIGEnLCBlID0+IHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGxldCBvbGRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHJcblx0XHQkKCcubG9hZGVyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdCQoJyNtYWluIC5jb250ZW50JykubG9hZChlLnRhcmdldC5ocmVmICsgJyAjbmV3cy13cmFwcGVyJywgKCkgPT4ge1xyXG5cclxuXHRcdFx0JCgnLmxvYWRlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoeyBhamF4TG9hZGVkOiB0cnVlLCBvbGRVUkw6IG9sZFVSTCB9LCBudWxsLCBlLnRhcmdldC5ocmVmKTtcdFxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvc3JjL25ld3MuanMiXSwic291cmNlUm9vdCI6IiJ9