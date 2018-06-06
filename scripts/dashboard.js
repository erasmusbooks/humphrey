webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function dashTime() {
		var now = (0, _moment2.default)();
	
		document.getElementById('dash-weekday').innerHTML = now.format('dddd');
		document.getElementById('dash-dayno').innerHTML = now.format('D');
		document.getElementById('dash-monthyear').innerHTML = now.format('MMMM YYYY');
		document.getElementById('dash-week').innerHTML = 'Week ' + now.format('W');
		document.getElementById('dash-time').innerHTML = now.format('HH:mm');
	}
	
	(0, _jquery2.default)(document).ready(function () {
		if ((0, _jquery2.default)('body').data('where') == 'dashboard') {
			dashTime();
			setInterval(function () {
				dashTime();
			}, 60000);
		}
	
		(0, _jquery2.default)('.dash-loader').addClass('active');
	
		var now = (0, _moment2.default)().format('E'),
		    today = (0, _moment2.default)(),
		    tomorrow = (0, _moment2.default)().add(1, 'days');
	
		if (now == 5) {
			tomorrow = (0, _moment2.default)().add(3, 'days');
		} else if (now == 6) {
			today = (0, _moment2.default)().add(2, 'days');
			tomorrow = (0, _moment2.default)().add(3, 'days');
		} else if (now == 7) {
			today = (0, _moment2.default)().add(1, 'days');
			tomorrow = (0, _moment2.default)().add(2, 'days');
		}
	
		(0, _jquery2.default)('#dash-today h3').text(now == today.format('E') ? 'Today' : today.format('dddd'));
		(0, _jquery2.default)('#dash-tomorrow h3').text(now + 1 == tomorrow.format('E') ? 'Tomorrow' : tomorrow.format('dddd'));
	
		_jquery2.default.ajax({
			method: 'GET',
			url: document.baseURI + '/events/?start=' + today.startOf('day').format('X') + '&end=' + tomorrow.endOf('day').format('X'),
			dataType: 'json'
		}).done(function (data) {
			if (Array.isArray(data)) {
				data.forEach(function (ev) {
					ev['visible'] = true;
	
					if (ev.allday) {
						ev.start = (0, _moment2.default)(ev.start, 'X');
						if (ev.end) ev.end = (0, _moment2.default)(ev.end, 'X');
					} else {
						ev.start = (0, _moment2.default)(ev.start, 'X').subtract(2, 'hours');
						if (ev.end) ev.end = (0, _moment2.default)(ev.end, 'X').subtract(2, 'hours');
					}
				});
	
				setTimeout(function () {
					(0, _jquery2.default)('.dash-loader').remove();
					(0, _jquery2.default)('.dash-events').addClass('active');
				}, 300);
			} else {
				setTimeout(function () {
					(0, _jquery2.default)('.dash-loader').remove();
					(0, _jquery2.default)('.dash-events').addClass('active');
				}, 300);
			}
		});
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9kYXNoYm9hcmQuanMiXSwibmFtZXMiOlsiZGFzaFRpbWUiLCJub3ciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwiZm9ybWF0IiwicmVhZHkiLCJkYXRhIiwic2V0SW50ZXJ2YWwiLCJhZGRDbGFzcyIsInRvZGF5IiwidG9tb3Jyb3ciLCJhZGQiLCJ0ZXh0IiwiYWpheCIsIm1ldGhvZCIsInVybCIsImJhc2VVUkkiLCJzdGFydE9mIiwiZW5kT2YiLCJkYXRhVHlwZSIsImRvbmUiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiZXYiLCJhbGxkYXkiLCJzdGFydCIsImVuZCIsInN1YnRyYWN0Iiwic2V0VGltZW91dCIsInJlbW92ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsVUFBU0EsUUFBVCxHQUFvQjtBQUNuQixNQUFJQyxNQUFNLHVCQUFWOztBQUVBQyxXQUFTQyxjQUFULENBQXdCLGNBQXhCLEVBQXdDQyxTQUF4QyxHQUFvREgsSUFBSUksTUFBSixDQUFXLE1BQVgsQ0FBcEQ7QUFDQUgsV0FBU0MsY0FBVCxDQUF3QixZQUF4QixFQUFzQ0MsU0FBdEMsR0FBa0RILElBQUlJLE1BQUosQ0FBVyxHQUFYLENBQWxEO0FBQ0FILFdBQVNDLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDQyxTQUExQyxHQUFzREgsSUFBSUksTUFBSixDQUFXLFdBQVgsQ0FBdEQ7QUFDQUgsV0FBU0MsY0FBVCxDQUF3QixXQUF4QixFQUFxQ0MsU0FBckMsR0FBaUQsVUFBVUgsSUFBSUksTUFBSixDQUFXLEdBQVgsQ0FBM0Q7QUFDQUgsV0FBU0MsY0FBVCxDQUF3QixXQUF4QixFQUFxQ0MsU0FBckMsR0FBaURILElBQUlJLE1BQUosQ0FBVyxPQUFYLENBQWpEO0FBQ0E7O0FBRUQsdUJBQUVILFFBQUYsRUFBWUksS0FBWixDQUFrQixZQUFNO0FBQ3ZCLE1BQUksc0JBQUUs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dEIsUUFBbEIsQ0FBMkIsUUFBM0I7QUFDQSxLQUhELEVBR0csR0FISDtBQUlBO0FBQ0QsR0FqQ0Q7QUFrQ0EsRUFqRUQsRSIsImZpbGUiOiJkYXNoYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJCBmcm9tICdqcXVlcnknXHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50J1xyXG5cclxuZnVuY3Rpb24gZGFzaFRpbWUoKSB7XHJcblx0bGV0IG5vdyA9IG1vbWVudCgpXHJcblxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXNoLXdlZWtkYXknKS5pbm5lckhUTUwgPSBub3cuZm9ybWF0KCdkZGRkJylcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaC1kYXlubycpLmlubmVySFRNTCA9IG5vdy5mb3JtYXQoJ0QnKVxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXNoLW1vbnRoeWVhcicpLmlubmVySFRNTCA9IG5vdy5mb3JtYXQoJ01NTU0gWVlZWScpXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rhc2gtd2VlaycpLmlubmVySFRNTCA9ICdXZWVrICcgKyBub3cuZm9ybWF0KCdXJylcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaC10aW1lJykuaW5uZXJIVE1MID0gbm93LmZvcm1hdCgnSEg6bW0nKVxyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcblx0aWYgKCQoJ2JvZHknKS5kYXRhKCd3aGVyZScpID09ICdkYXNoYm9hcmQnKSB7XHJcblx0XHRkYXNoVGltZSgpXHJcblx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdGRhc2hUaW1lKClcclxuXHRcdH0sIDYwMDAwKVxyXG5cdH1cclxuXHJcblx0JCgnLmRhc2gtbG9hZGVyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblxyXG5cdGxldCBub3cgPSBtb21lbnQoKS5mb3JtYXQoJ0UnKSxcclxuXHRcdHRvZGF5ID0gbW9tZW50KCksXHJcblx0XHR0b21vcnJvdyA9IG1vbWVudCgpLmFkZCgxLCAnZGF5cycpXHJcblxyXG5cdGlmIChub3cgPT0gNSkge1xyXG5cdFx0dG9tb3Jyb3cgPSBtb21lbnQoKS5hZGQoMywgJ2RheXMnKVxyXG5cdH0gZWxzZSBpZiAobm93ID09IDYpIHtcclxuXHRcdHRvZGF5ID0gbW9tZW50KCkuYWRkKDIsICdkYXlzJylcclxuXHRcdHRvbW9ycm93ID0gbW9tZW50KCkuYWRkKDMsICdkYXlzJylcclxuXHR9IGVsc2UgaWYgKG5vdyA9PSA3KSB7XHJcblx0XHR0b2RheSA9IG1vbWVudCgpLmFkZCgxLCAnZGF5cycpXHJcblx0XHR0b21vcnJvdyA9IG1vbWVudCgpLmFkZCgyLCAnZGF5cycpXHJcblx0fVxyXG5cclxuXHQkKCcjZGFzaC10b2RheSBoMycpLnRleHQoXHJcblx0XHRub3cgPT0gdG9kYXkuZm9ybWF0KCdFJykgPyAnVG9kYXknIDogdG9kYXkuZm9ybWF0KCdkZGRkJylcclxuXHQpXHJcblx0JCgnI2Rhc2gtdG9tb3Jyb3cgaDMnKS50ZXh0KFxyXG5cdFx0bm93ICsgMSA9PSB0b21vcnJvdy5mb3JtYXQoJ0UnKSA/ICdUb21vcnJvdycgOiB0b21vcnJvdy5mb3JtYXQoJ2RkZGQnKVxyXG5cdClcclxuXHJcblx0JC5hamF4KHtcclxuXHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHR1cmw6XHJcblx0XHRcdGRvY3VtZW50LmJhc2VVUkkgK1xyXG5cdFx0XHQnL2V2ZW50cy8/c3RhcnQ9JyArXHJcblx0XHRcdHRvZGF5LnN0YXJ0T2YoJ2RheScpLmZvcm1hdCgnWCcpICtcclxuXHRcdFx0JyZlbmQ9JyArXHJcblx0XHRcdHRvbW9ycm93LmVuZE9mKCdkYXknKS5mb3JtYXQoJ1gnKSxcclxuXHRcdGRhdGFUeXBlOiAnanNvbidcclxuXHR9KS5kb25lKGRhdGEgPT4ge1xyXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuXHRcdFx0ZGF0YS5mb3JFYWNoKGV2ID0+IHtcclxuXHRcdFx0XHRldlsndmlzaWJsZSddID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRpZiAoZXYuYWxsZGF5KSB7XHJcblx0XHRcdFx0XHRldi5zdGFydCA9IG1vbWVudChldi5zdGFydCwgJ1gnKVxyXG5cdFx0XHRcdFx0aWYgKGV2LmVuZCkgZXYuZW5kID0gbW9tZW50KGV2LmVuZCwgJ1gnKVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRldi5zdGFydCA9IG1vbWVudChldi5zdGFydCwgJ1gnKS5zdWJ0cmFjdCgyLCAnaG91cnMnKVxyXG5cdFx0XHRcdFx0aWYgKGV2LmVuZCkgZXYuZW5kID0gbW9tZW50KGV2LmVuZCwgJ1gnKS5zdWJ0cmFjdCgyLCAnaG91cnMnKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdCQoJy5kYXNoLWxvYWRlcicpLnJlbW92ZSgpXHJcblx0XHRcdFx0JCgnLmRhc2gtZXZlbnRzJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdH0sIDMwMClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdCQoJy5kYXNoLWxvYWRlcicpLnJlbW92ZSgpXHJcblx0XHRcdFx0JCgnLmRhc2gtZXZlbnRzJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdH0sIDMwMClcclxuXHRcdH1cclxuXHR9KVxyXG59KVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL3NyYy9kYXNoYm9hcmQuanMiXSwic291cmNlUm9vdCI6IiJ9