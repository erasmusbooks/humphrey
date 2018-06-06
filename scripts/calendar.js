webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(48);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _reactCookie = __webpack_require__(186);
	
	var _reactCookie2 = _interopRequireDefault(_reactCookie);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _underscore = __webpack_require__(189);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _calendarBody = __webpack_require__(297);
	
	var _calendarBody2 = _interopRequireDefault(_calendarBody);
	
	var _calendarSidebar = __webpack_require__(305);
	
	var _calendarSidebar2 = _interopRequireDefault(_calendarSidebar);
	
	var _calendarDetail = __webpack_require__(309);
	
	var _calendarDetail2 = _interopRequireDefault(_calendarDetail);
	
	var _calendarCreate = __webpack_require__(311);
	
	var _calendarCreate2 = _interopRequireDefault(_calendarCreate);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Calendar = function (_React$Component) {
		_inherits(Calendar, _React$Component);
	
		function Calendar(props) {
			_classCallCheck(this, Calendar);
	
			var _this = _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call(this, props));
	
			var now = (0, _moment2.default)(),
			    cookieView = _reactCookie2.default.load('view') || 'weekly',
			    cookieFilter = _reactCookie2.default.load('catFilter') || [];
	
			now['position'] = 0;
	
			_this.state = {
				date: now,
				view: cookieView,
				events: [],
				queue: [],
				popup: { a: false, p: false },
				user: false,
				message: { a: false, m: false, o: false },
				loading: false,
				detail: false,
				catFilter: cookieFilter,
				categories: []
			};
	
			_this.fetchCategories = _this.fetchCategories.bind(_this);
			_this.fetchEvents = _this.fetchEvents.bind(_this);
			_this.refreshEvents = _this.refreshEvents.bind(_this);
			_this.handleEventChange = _this.handleEventChange.bind(_this);
			_this.handleDate = _this.handleDate.bind(_this);
			_this.handlePopup = _this.handlePopup.bind(_this);
			_this.handleDetail = _this.handleDetail.bind(_this);
			_this.cancelPopup = _this.cancelPopup.bind(_this);
			_this.cancelPopupClick = _this.cancelPopupClick.bind(_this);
			_this.cancelMessage = _this.cancelMessage.bind(_this);
			_this.preventCancelPopup = _this.preventCancelPopup.bind(_this);
			_this.toggleFilter = _this.toggleFilter.bind(_this);
			_this.viewToggle = _this.viewToggle.bind(_this);
			return _this;
		}
	
		_createClass(Calendar, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				var now = (0, _moment2.default)();
	
				this.fetchCategories();
				this.handleDate(now);
	
				if (this.state.view == 'weekly') {
					document.title = (0, _moment2.default)(this.state.date).startOf('isoWeek').format('D') + '\u2013' + (0, _moment2.default)(this.state.date).endOf('isoWeek').format('D MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
				} else if (this.state.view == 'monthly') {
					document.title = (0, _moment2.default)(this.state.date).format('MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
				}
			}
		}, {
			key: 'fetchCategories',
			value: function fetchCategories() {
				var _this2 = this;
	
				var x = this.state.categories.length;
	
				_jquery2.default.ajax({
					method: 'GET',
					url: document.baseURI + '/events/?categories=1',
					dataType: 'json'
				}).done(function (categoryList) {
	
					var catList = _underscore2.default.sortBy(categoryList, 'name');
	
					_this2.setState({ categories: catList }, function () {
						if (x > 0) {
	
							_this2.fetchEvents(_this2.state.date, function (newEvents) {
								_this2.setState({ loading: false, events: newEvents });
							});
						}
					});
				});
			}
		}, {
			key: 'fetchEvents',
			value: function fetchEvents(week, callback) {
				var start = (0, _moment2.default)(week).startOf('isoWeek').format('X'),
				    end = (0, _moment2.default)(week).endOf('isoWeek').format('X'),
				    catFilter = this.state.catFilter;
	
				if (this.state.view == 'monthly') {
					start = (0, _moment2.default)(week).startOf('month').subtract(15, 'days').format('X');
					end = (0, _moment2.default)(week).endOf('month').add(15, 'days').format('X');
				}
	
				this.setState({ loading: true }, function () {
	
					_jquery2.default.ajax({
						method: 'GET',
						url: document.baseURI + '/events/?start=' + start + '&end=' + end,
						dataType: 'json'
					}).done(function (data) {
	
						if (Array.isArray(data)) {
	
							setTimeout(function () {
	
								data.forEach(function (ev) {
	
									ev['visible'] = true;
									if (catFilter.length > 0 && catFilter.indexOf(ev.category._id) == -1) ev.visible = false;
	
									if (ev.allday) {
										ev.start = (0, _moment2.default)(ev.start, 'X');
										if (ev.end) ev.end = (0, _moment2.default)(ev.end, 'X');
									} else {
										ev.start = (0, _moment2.default)(ev.start, 'X').subtract(2, 'hours');
										if (ev.end) ev.end = (0, _moment2.default)(ev.end, 'X').subtract(2, 'hours');
									}
								});
							}, 100);
	
							setTimeout(function () {
								callback(data);
							}, 300);
						} else {
							setTimeout(function () {
								callback([]);
							}, 300);
						}
					});
				});
			}
		}, {
			key: 'refreshEvents',
			value: function refreshEvents(e) {
				var _this3 = this;
	
				e.preventDefault();
	
				this.fetchEvents(this.state.date, function (newEvents) {
					_this3.cancelMessage();
					_this3.setState({ loading: false, events: newEvents });
				});
			}
		}, {
			key: 'handleEventChange',
			value: function handleEventChange(ev) {
				var _this4 = this;
	
				var events = this.state.events;
				this.fetchEvents(this.state.date, function (newEvents) {
					_this4.setState({ loading: false, events: newEvents });
				});
			}
		}, {
			key: 'handleDate',
			value: function handleDate(newDate) {
				var _this5 = this;
	
				if (this.state.view == 'weekly' && (0, _moment2.default)(newDate).isoWeekday() == 1) newDate = (0, _moment2.default)(newDate).add(1, 'days');
	
				this.fetchEvents(newDate, function (newEvents) {
					_this5.setState({ loading: false, date: newDate, events: newEvents }, function () {
	
						if (_this5.state.view == 'weekly') {
							document.title = (0, _moment2.default)(newDate).startOf('isoWeek').format('D') + '\u2013' + (0, _moment2.default)(newDate).endOf('isoWeek').format('D MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
						} else if (_this5.state.view == 'monthly') {
							document.title = (0, _moment2.default)(newDate).format('MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
						}
					});
				});
			}
		}, {
			key: 'handlePopup',
			value: function handlePopup(arg) {
				this.setState({ popup: { a: true, p: arg } });
			}
		}, {
			key: 'handleDetail',
			value: function handleDetail(arg) {
				this.setState({ detail: arg });
			}
		}, {
			key: 'cancelPopup',
			value: function cancelPopup() {
				var _this6 = this;
	
				var popup = this.state.popup;
				popup.a = false;
	
				this.setState({ popup: popup }, function () {
	
					setTimeout(function () {
						popup.p = false;
	
						_this6.setState({ popup: popup }, function () {
							if (_this6.state.message.o != 'success') _this6.cancelMessage();
						});
					}, 1);
				});
			}
		}, {
			key: 'cancelPopupClick',
			value: function cancelPopupClick(e) {
				var _this7 = this;
	
				e.preventDefault();
				var popup = this.state.popup;
	
				if (e.target.id == 'calendar-jacket' || e.target.id == 'close-popup') {
					popup.a = false;
	
					this.setState({ popup: popup }, function () {
	
						setTimeout(function () {
							popup.p = false;
	
							_this7.setState({ popup: popup, detail: false }, function () {
								if (_this7.state.message.o != 'success') {
									_this7.cancelMessage();
								}
							});
						}, 251);
					});
				}
			}
		}, {
			key: 'cancelMessage',
			value: function cancelMessage(e) {
				var _this8 = this;
	
				if (e) e.preventDefault();
				var message = this.state.message;
	
				message.a = false;
				this.setState({ message: message }, function () {
					setTimeout(function () {
						message.m = false;
						message.o = false;
						_this8.setState({ message: message, queue: [] });
					}, 251);
				});
			}
		}, {
			key: 'preventCancelPopup',
			value: function preventCancelPopup(e) {
				e.preventDefault();
			}
		}, {
			key: 'toggleFilter',
			value: function toggleFilter(arg) {
				var cat = Number(arg),
				    catFilter = this.state.catFilter,
				    events = this.state.events,
				    catIndex = catFilter.indexOf(cat);
	
				if (catIndex > -1) catFilter.splice(catIndex, 1);
				if (catIndex == -1) catFilter.push(cat);
				if (arg == 'clear') catFilter = [];
	
				events.forEach(function (ev) {
					ev.visible = true;
					if (catFilter.length > 0 && catFilter.indexOf(ev.category._id) == -1) ev.visible = false;
				});
	
				this.setState({ catFilter: catFilter, events: events }, function () {
					_reactCookie2.default.save('catFilter', catFilter);
				});
			}
		}, {
			key: 'viewToggle',
			value: function viewToggle(e) {
				var _this9 = this;
	
				e.preventDefault();
				var date = this.state.date,
				    newView = 'weekly';
	
				if (this.state.view == 'weekly') newView = 'monthly';
	
				this.setState({ view: newView }, function () {
					_this9.handleDate(date);
					_reactCookie2.default.save('view', newView);
				});
			}
		}, {
			key: 'render',
			value: function render() {
				var CalendarPopup = void 0;
	
				if (this.state.popup.p == 'detail') CalendarPopup = _react2.default.createElement(_calendarDetail2.default, {
					user: this.state.user,
					detail: this.state.detail,
					categories: this.state.categories,
					cancelPopup: this.cancelPopup,
					updateEvent: this.handleEventChange });
	
				if (this.state.popup.p == 'create') CalendarPopup = _react2.default.createElement(_calendarCreate2.default, {
					user: this.state.user,
					cancelPopup: this.cancelPopup,
					categories: this.state.categories,
					newEvent: this.handleEventChange });
	
				var CalendarMessage,
				    messageClasses = 'calendar-message ';
				if (this.state.message.m) {
					CalendarMessage = _react2.default.createElement(
						'span',
						null,
						_react2.default.createElement(
							'span',
							{ className: 'content' },
							this.state.message.m
						),
						_react2.default.createElement(
							'a',
							{ href: '', className: 'close', onClick: this.cancelMessage },
							'\xD7'
						)
					);
					messageClasses = messageClasses + this.state.message.o;
				}
	
				return _react2.default.createElement(
					'div',
					{ id: 'calendar-wrapper', className: this.state.message.a ? 'message' : '' },
					_react2.default.createElement(_calendarSidebar2.default, {
						date: this.state.date,
						view: this.state.view,
						catFilter: this.state.catFilter,
						categories: this.state.categories,
						toggleFilter: this.toggleFilter,
						setDate: this.handleDate,
						viewToggle: this.viewToggle }),
					_react2.default.createElement(_calendarBody2.default, {
						date: this.state.date,
						view: this.state.view,
						events: this.state.events,
						loading: this.state.loading,
						user: this.state.user,
						setDate: this.handleDate,
						setPopup: this.handlePopup,
						setDetail: this.handleDetail }),
					_react2.default.createElement(
						'div',
						{ id: 'calendar-jacket', onClick: this.cancelPopupClick, className: this.state.popup.a ? 'active' : '' },
						_react2.default.createElement(
							'div',
							{ className: 'calendar-popup ' + this.state.popup.p, onClick: this.preventCancelPopup },
							CalendarPopup
						)
					),
					_react2.default.createElement(
						'div',
						{ className: this.state.message.a ? messageClasses + ' active' : messageClasses },
						CalendarMessage
					)
				);
			}
		}]);
	
		return Calendar;
	}(_react2.default.Component);
	
	_reactDom2.default.render(_react2.default.createElement(Calendar, null), document.getElementById('calendar'));

/***/ },

/***/ 297:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _calendarControls = __webpack_require__(298);
	
	var _calendarControls2 = _interopRequireDefault(_calendarControls);
	
	var _calendarMonthly = __webpack_require__(299);
	
	var _calendarMonthly2 = _interopRequireDefault(_calendarMonthly);
	
	var _calendarStretch = __webpack_require__(302);
	
	var _calendarStretch2 = _interopRequireDefault(_calendarStretch);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarBody = function (_React$Component) {
		_inherits(CalendarBody, _React$Component);
	
		function CalendarBody() {
			_classCallCheck(this, CalendarBody);
	
			return _possibleConstructorReturn(this, (CalendarBody.__proto__ || Object.getPrototypeOf(CalendarBody)).apply(this, arguments));
		}
	
		_createClass(CalendarBody, [{
			key: 'render',
			value: function render() {
				var CalendarPeriod = void 0;
				if (this.props.view == 'weekly') {
	
					CalendarPeriod = _react2.default.createElement(_calendarStretch2.default, {
						loading: this.props.loading,
						date: this.props.date,
						events: this.props.events,
						setPopup: this.props.setPopup,
						setDetail: this.props.setDetail });
				} else if (this.props.view == 'monthly') {
	
					CalendarPeriod = _react2.default.createElement(_calendarMonthly2.default, {
						loading: this.props.loading,
						date: this.props.date,
						events: this.props.events,
						setPopup: this.props.setPopup,
						setDetail: this.props.setDetail });
				}
	
				return _react2.default.createElement(
					'section',
					{ id: 'calendar-body' },
					_react2.default.createElement(_calendarControls2.default, {
						date: this.props.date,
						view: this.props.view,
						user: this.props.user,
						setDate: this.props.setDate,
						setPopup: this.props.setPopup,
						handleAuth: this.props.handleAuth }),
					CalendarPeriod
				);
			}
		}]);
	
		return CalendarBody;
	}(_react2.default.Component);
	
	exports.default = CalendarBody;

/***/ },

/***/ 298:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarControls = function (_React$Component) {
		_inherits(CalendarControls, _React$Component);
	
		function CalendarControls(props) {
			_classCallCheck(this, CalendarControls);
	
			var _this = _possibleConstructorReturn(this, (CalendarControls.__proto__ || Object.getPrototypeOf(CalendarControls)).call(this, props));
	
			_this.setDate = _this.setDate.bind(_this);
			_this.setPopup = _this.setPopup.bind(_this);
			_this.handleLogout = _this.handleLogout.bind(_this);
			return _this;
		}
	
		_createClass(CalendarControls, [{
			key: 'setDate',
			value: function setDate(e) {
				e.preventDefault();
				this.props.setDate((0, _moment2.default)(e.target.dataset.date, 'YYYY-MM-DD'));
			}
		}, {
			key: 'setPopup',
			value: function setPopup(e) {
				e.preventDefault();
				this.props.setPopup(e.target.dataset.arg);
			}
		}, {
			key: 'handleLogout',
			value: function handleLogout(e) {
				e.preventDefault();
				this.props.handleAuth('logout');
			}
		}, {
			key: 'render',
			value: function render() {
				var prev = void 0,
				    next = void 0,
				    now = (0, _moment2.default)().format('YYYY-MM-DD'),
				    loginButton = void 0,
				    createButton = void 0,
				    settingsButton = void 0,
				    periodTitle = void 0,
				    periodNum = void 0,
				    periodNav = void 0,
				    styles = void 0;
	
				if (this.props.view == 'weekly') {
					var startWeek = (0, _moment2.default)(this.props.date).startOf('isoWeek'),
					    _next = (0, _moment2.default)(this.props.date).add(7, 'days').format('YYYY-MM-DD'),
					    _prev = (0, _moment2.default)(this.props.date).subtract(7, 'days').format('YYYY-MM-DD');
	
					periodTitle = _react2.default.createElement(
						'h1',
						null,
						(0, _moment2.default)(this.props.date).startOf('isoWeek').format('D') + ' \u2013 ' + (0, _moment2.default)(this.props.date).endOf('isoWeek').format('D MMM YYYY')
					);
	
					periodNum = _react2.default.createElement(
						'span',
						{ className: 'weekly-num', title: 'Week ' + (0, _moment2.default)(this.props.date).format('W') },
						_react2.default.createElement(
							'strong',
							null,
							(0, _moment2.default)(this.props.date).format('W')
						)
					);
	
					periodNav = _react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'a',
							{ href: '', onClick: this.setDate, className: 'material-icons prev', 'data-date': _prev, title: 'Go to week ' + (0, _moment2.default)(this.props.date).subtract(1, 'weeks').format('W') },
							'arrow_back'
						),
						periodTitle,
						' ',
						periodNum,
						_react2.default.createElement(
							'a',
							{ href: '', onClick: this.setDate, className: 'material-icons next', 'data-date': _next, title: 'Go to week ' + (0, _moment2.default)(this.props.date).add(1, 'weeks').format('W') },
							'arrow_forward'
						)
					);
	
					if ((0, _moment2.default)().startOf('isoWeek').isSame(startWeek, 'week')) styles = { display: 'none' };
				} else if (this.props.view == 'monthly') {
	
					var _next2 = (0, _moment2.default)(this.props.date).add(1, 'months').format('YYYY-MM-DD'),
					    _prev2 = (0, _moment2.default)(this.props.date).subtract(1, 'months').format('YYYY-MM-DD');
	
					periodTitle = _react2.default.createElement(
						'h1',
						null,
						(0, _moment2.default)(this.props.date).format('MMMM YYYY')
					);
	
					periodNav = _react2.default.createElement(
						'nav',
						{ className: 'weekly-nav' },
						_react2.default.createElement(
							'a',
							{ href: '', onClick: this.setDate, className: 'material-icons prev', 'data-date': _prev2, title: 'Go to ' + (0, _moment2.default)(this.props.date).subtract(1, 'months').format('MMMM YYYY') },
							'arrow_back'
						),
						periodTitle,
						' ',
						periodNum,
						_react2.default.createElement(
							'a',
							{ href: '', onClick: this.setDate, className: 'material-icons next', 'data-date': _next2, title: 'Go to ' + (0, _moment2.default)(this.props.date).add(1, 'months').format('MMMM YYYY') },
							'arrow_forward'
						)
					);
	
					if ((0, _moment2.default)().isSame(this.props.date, 'month')) styles = { display: 'none' };
				}
	
				if (!this.props.user) loginButton = _react2.default.createElement(
					'a',
					{ href: '', className: 'button', onClick: this.setPopup, 'data-arg': 'login' },
					'Login'
				);
				if (this.props.user) loginButton = _react2.default.createElement(
					'a',
					{ href: '', className: 'button', onClick: this.handleLogout },
					'Logout'
				);
				if ((0, _jquery2.default)('#header-user').hasClass('publisher')) createButton = _react2.default.createElement(
					'a',
					{ href: '', className: 'button', onClick: this.setPopup, 'data-arg': 'create' },
					'Add event'
				);
	
				return _react2.default.createElement(
					'header',
					{ id: 'calendar-controls' },
					_react2.default.createElement(
						'nav',
						{ className: 'weekly-nav' },
						periodNav
					),
					_react2.default.createElement(
						'div',
						{ className: 'weekly-options' },
						_react2.default.createElement(
							'a',
							{ href: '', className: 'button today', onClick: this.setDate, 'data-date': now, style: styles },
							'Today'
						),
						createButton,
						settingsButton
					)
				);
			}
		}]);
	
		return CalendarControls;
	}(_react2.default.Component);
	
	exports.default = CalendarControls;

/***/ },

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _underscore = __webpack_require__(189);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _calendarMonth = __webpack_require__(300);
	
	var _calendarMonth2 = _interopRequireDefault(_calendarMonth);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarMonthly = function (_React$Component) {
		_inherits(CalendarMonthly, _React$Component);
	
		function CalendarMonthly(props) {
			_classCallCheck(this, CalendarMonthly);
	
			var _this = _possibleConstructorReturn(this, (CalendarMonthly.__proto__ || Object.getPrototypeOf(CalendarMonthly)).call(this, props));
	
			_this.state = {
				dates: [],
				events: []
			};
			return _this;
		}
	
		_createClass(CalendarMonthly, [{
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				var _this2 = this;
	
				var dates = this.state.dates,
				    oldDate = this.props.date,
				    newDate = nextProps.date;
	
				if (_underscore2.default.isEqual(oldDate, newDate) && this.props.events == nextProps.events) return;
	
				if ((0, _moment2.default)(newDate).isSame(oldDate, 'month')) {
					newDate.position = ' same-month';
				} else if ((0, _moment2.default)(newDate).isBefore(oldDate)) {
					newDate.position = ' new-left';
				} else if ((0, _moment2.default)(newDate).isAfter(oldDate)) {
					newDate.position = ' new-right';
				}
	
				dates.push(newDate);
				this.setState({ dates: dates }, function () {
	
					if ((0, _moment2.default)(oldDate).isSame(newDate, 'month')) {
						var newDates = _underscore2.default.reject(_this2.state.dates, function (date) {
							return date.position == 0;
						});
						_this2.setState({ dates: newDates });
						return;
					}
	
					setTimeout(function () {
						if ((0, _moment2.default)(newDate).isBefore(oldDate)) {
							(0, _jquery2.default)('.calendar-month#' + (0, _moment2.default)(oldDate).format("YYYY-MM")).addClass('old-right');
							(0, _jquery2.default)('.calendar-month#' + (0, _moment2.default)(newDate).format("YYYY-MM")).removeClass('new-left old-left new-right old-right');
						}
						if ((0, _moment2.default)(newDate).isAfter(oldDate)) {
							(0, _jquery2.default)('.calendar-month#' + (0, _moment2.default)(oldDate).format("YYYY-MM")).addClass('old-left');
							(0, _jquery2.default)('.calendar-month#' + (0, _moment2.default)(newDate).format("YYYY-MM")).removeClass('new-left old-left new-right old-right');
						}
					}, 1);
	
					setTimeout(function () {
						var newDates = _underscore2.default.reject(_this2.state.dates, function (date) {
							return (0, _moment2.default)(oldDate).isSame(date, 'month');
						});
						_this2.setState({ dates: newDates });
					}, 400);
				});
			}
		}, {
			key: 'render',
			value: function render() {
				var _this3 = this;
	
				var monthList = this.state.dates.map(function (date, index) {
					var monthNum = (0, _moment2.default)(date).format('YYYY-MM');
	
					return _react2.default.createElement(_calendarMonth2.default, {
						date: date,
						events: _this3.props.events,
						key: monthNum,
						setPopup: _this3.props.setPopup,
						setDetail: _this3.props.setDetail });
				});
	
				return _react2.default.createElement(
					'div',
					{ id: 'calendar-monthly' },
					monthList,
					_react2.default.createElement(
						'div',
						{ className: this.props.loading ? 'loader active' : 'loader' },
						_react2.default.createElement('div', { className: 'spinner' })
					)
				);
			}
		}]);
	
		return CalendarMonthly;
	}(_react2.default.Component);
	
	exports.default = CalendarMonthly;

/***/ },

/***/ 300:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _underscore = __webpack_require__(189);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _fullcalendar = __webpack_require__(301);
	
	var _fullcalendar2 = _interopRequireDefault(_fullcalendar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarMonth = function (_React$Component) {
		_inherits(CalendarMonth, _React$Component);
	
		function CalendarMonth() {
			_classCallCheck(this, CalendarMonth);
	
			return _possibleConstructorReturn(this, (CalendarMonth.__proto__ || Object.getPrototypeOf(CalendarMonth)).apply(this, arguments));
		}
	
		_createClass(CalendarMonth, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				var that = this,
				    monthId = (0, _moment2.default)(this.props.date).format('YYYY-MM'),
				    now = (0, _moment2.default)();
	
				var correctedEvents = this.props.events;
				correctedEvents.forEach(function (ev) {
					if (ev.allday && ev.end) ev.end = (0, _moment2.default)(ev.end).add(1, 'days').format();
					if (!ev.allday) {
						ev.start = ev.start = (0, _moment2.default)(ev.start).format();
						if (ev.end) ev.end = ev.end = (0, _moment2.default)(ev.end).format();
					}
				});
	
				(0, _jquery2.default)('#' + monthId).fullCalendar({
					firstDay: 1,
					header: false,
					dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
					events: function events(start, end, timezone, callback) {
						var events = _underscore2.default.filter(correctedEvents, function (ev) {
							return ev.visible;
						});
						callback(events);
					},
					dayRender: function dayRender(date, cell) {
						(0, _jquery2.default)(cell).prepend('<span class="bling"></span>');
					},
					eventRender: function eventRender(event, element) {
						if (event.allday) {
							(0, _jquery2.default)(element).addClass('allday');
							(0, _jquery2.default)(element).css('background-color', event.category.color);
							(0, _jquery2.default)(element).attr('title', event.title);
						} else {
							var time = (0, _moment2.default)(event.start).format('HH:mm');
							if (event.end) time = (0, _moment2.default)(event.start).format('HH:mm') + ' \u2013 ' + (0, _moment2.default)(event.end).format('HH:mm');
	
							(0, _jquery2.default)(element).addClass('single');
							(0, _jquery2.default)(element).prepend('<span class="category" style="background-color:' + event.category.color + '"></span><time>' + time + '</time>');
							(0, _jquery2.default)(element).attr('title', time + ', ' + event.title);
						}
					},
					eventClick: function eventClick(event, jsEvent, view) {
						that.props.setDetail(event._id);
						that.props.setPopup('detail');
					}
				});
	
				(0, _jquery2.default)('#' + monthId).fullCalendar('gotoDate', that.props.date);
	
				setTimeout(function () {
					(0, _jquery2.default)('#calendar-monthly').css('min-height', (0, _jquery2.default)('#' + monthId).height());
				}, 1);
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				var monthId = (0, _moment2.default)(this.props.date).format('YYYY-MM');
				(0, _jquery2.default)('#' + monthId).fullCalendar('refetchEvents');
	
				setTimeout(function () {
					(0, _jquery2.default)('#calendar-monthly').css('min-height', (0, _jquery2.default)('#' + monthId).height());
				}, 1);
			}
		}, {
			key: 'render',
			value: function render() {
				return _react2.default.createElement('div', { className: 'calendar-month ' + this.props.date.position,
					id: (0, _moment2.default)(this.props.date).format('YYYY-MM') });
			}
		}]);
	
		return CalendarMonth;
	}(_react2.default.Component);
	
	exports.default = CalendarMonth;

/***/ },

/***/ 302:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _underscore = __webpack_require__(189);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _calendarWeek = __webpack_require__(303);
	
	var _calendarWeek2 = _interopRequireDefault(_calendarWeek);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarStretch = function (_React$Component) {
		_inherits(CalendarStretch, _React$Component);
	
		function CalendarStretch(props) {
			_classCallCheck(this, CalendarStretch);
	
			var _this = _possibleConstructorReturn(this, (CalendarStretch.__proto__ || Object.getPrototypeOf(CalendarStretch)).call(this, props));
	
			_this.state = {
				dates: [],
				events: []
			};
			return _this;
		}
	
		_createClass(CalendarStretch, [{
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				var _this2 = this;
	
				var dates = this.state.dates,
				    oldDate = this.props.date,
				    newDate = nextProps.date;
	
				if (_underscore2.default.isEqual(oldDate, newDate) && this.props.events == nextProps.events) return;
	
				if ((0, _moment2.default)(newDate).isSame(oldDate, 'isoWeek')) {
					newDate.position = ' same-week';
				} else if ((0, _moment2.default)(newDate).isBefore(oldDate)) {
					newDate.position = ' new-left';
				} else if ((0, _moment2.default)(newDate).isAfter(oldDate)) {
					newDate.position = ' new-right';
				}
	
				dates.push(newDate);
				this.setState({ dates: dates }, function () {
	
					if ((0, _moment2.default)(oldDate).isSame(newDate, 'isoWeek')) {
						var newDates = _underscore2.default.reject(_this2.state.dates, function (date) {
							return date.position == 0;
						});
						_this2.setState({ dates: newDates });
						return;
					}
	
					setTimeout(function () {
						if ((0, _moment2.default)(newDate).isBefore(oldDate)) {
							(0, _jquery2.default)('.week[data-week=' + (0, _moment2.default)(oldDate).startOf('isoweek').format("YYYY-ww") + ']').addClass('old-right');
							(0, _jquery2.default)('.week[data-week=' + (0, _moment2.default)(newDate).startOf('isoweek').format("YYYY-ww") + ']').removeClass('new-left old-left new-right old-right');
						}
						if ((0, _moment2.default)(newDate).isAfter(oldDate)) {
							(0, _jquery2.default)('.week[data-week=' + (0, _moment2.default)(oldDate).startOf('isoweek').format("YYYY-ww") + ']').addClass('old-left');
							(0, _jquery2.default)('.week[data-week=' + (0, _moment2.default)(newDate).startOf('isoweek').format("YYYY-ww") + ']').removeClass('new-left old-left new-right old-right');
						}
					}, 1);
	
					setTimeout(function () {
						var newDates = _underscore2.default.reject(_this2.state.dates, function (date) {
							return (0, _moment2.default)(oldDate).isSame(date, 'isoWeek');
						});
						_this2.setState({ dates: newDates });
					}, 400);
				});
			}
		}, {
			key: 'render',
			value: function render() {
				var _this3 = this;
	
				var weekList = this.state.dates.map(function (date) {
					var weekNum = (0, _moment2.default)(date).format('YYYY-ww');
					return _react2.default.createElement(_calendarWeek2.default, {
						date: date,
						events: _this3.props.events,
						key: weekNum,
						setPopup: _this3.props.setPopup,
						setDetail: _this3.props.setDetail });
				});
	
				return _react2.default.createElement(
					'div',
					{ id: 'calendar-weekly' },
					weekList,
					_react2.default.createElement(
						'div',
						{ className: this.props.loading ? 'loader active' : 'loading' },
						_react2.default.createElement('div', { className: 'spinner' })
					)
				);
			}
		}]);
	
		return CalendarStretch;
	}(_react2.default.Component);
	
	exports.default = CalendarStretch;

/***/ },

/***/ 303:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _underscore = __webpack_require__(189);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _calendarDay = __webpack_require__(304);
	
	var _calendarDay2 = _interopRequireDefault(_calendarDay);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarWeek = function (_React$Component) {
		_inherits(CalendarWeek, _React$Component);
	
		function CalendarWeek() {
			_classCallCheck(this, CalendarWeek);
	
			return _possibleConstructorReturn(this, (CalendarWeek.__proto__ || Object.getPrototypeOf(CalendarWeek)).apply(this, arguments));
		}
	
		_createClass(CalendarWeek, [{
			key: 'render',
			value: function render() {
				var _this2 = this;
	
				var startWeek = (0, _moment2.default)(this.props.date).startOf('isoWeek'),
				    weekdays = [{ name: 'mon', column: [] }, { name: 'tue', column: [] }, { name: 'wed', column: [] }, { name: 'thu', column: [] }, { name: 'fri', column: [] }, { name: 'wkd', column: [] }];
	
				function happensToday(ev, day) {
					if ((0, _moment2.default)(ev.start).isBetween(day.start, day.end)) return true;
					if (ev.end && (0, _moment2.default)(ev.end).isBetween(day.start, day.end)) return true;
					if (ev.end && (0, _moment2.default)(ev.start).isBefore(day.start) && (0, _moment2.default)(ev.end).isAfter(day.end)) return true;
					if (ev.end && (0, _moment2.default)(ev.end).isBefore(day.start)) return false;
					if ((0, _moment2.default)(ev.start).isAfter(day.end)) return false;
				}
	
				var events = _underscore2.default.filter(this.props.events, function (ev) {
					return ev.visible;
				});
				events = _underscore2.default.sortBy(events, 'start');
				var x = void 0;
	
				for (x in events) {
					if (events[x].allday == true) {
	
						events[x].pos = -1;
						var day = void 0,
						    i = void 0;
	
						for (i in weekdays) {
							day = {
								start: (0, _moment2.default)(startWeek).add(i, 'days').startOf('day').format(),
								end: (0, _moment2.default)(startWeek).add(i, 'days').endOf('day').format()
							};
							if (weekdays[i].name == 'wkd') day.end = (0, _moment2.default)(startWeek).add(6, 'days').endOf('day').format();
	
							if (events[x].pos > -1) {
	
								weekdays[i].column[events[x].pos] = happensToday(events[x], day) ? events[x]._id : 'empty';
							} else {
	
								if (happensToday(events[x], day)) {
									var fill = false,
									    j = void 0;
									for (j in weekdays[i].column) {
										if (events[x].pos == -1 && weekdays[i].column[j] == 'empty') {
											weekdays[i].column[j] = events[x]._id;
											events[x].pos = j;
											fill = true;
										}
									}
	
									if (fill == false) {
										weekdays[i].column.push(events[x]._id);
										events[x].pos = weekdays[i].column.indexOf(events[x]._id);
									}
								} else {
									weekdays[i].column.push('empty');
								}
							}
						}
					}
				};
				events = _underscore2.default.sortBy(events, 'pos');
	
				var dataset = weekdays.map(function (weekday, index) {
					var day = {
						start: (0, _moment2.default)(startWeek).add(index, 'days').startOf('day').format(),
						end: (0, _moment2.default)(startWeek).add(index, 'days').endOf('day').format(),
						weekday: weekday.name,
						alldays: [],
						singles: []
					};
	
					if (weekday.name == 'wkd') day.end = (0, _moment2.default)(startWeek).add(6, 'days').endOf('day').format();
	
					events.forEach(function (ev) {
						if ((0, _moment2.default)(ev.start).isBetween(day.start, day.end)) {
							if (ev.allday) day.alldays.push(ev);
							if (!ev.allday) day.singles.push(ev);
						}
	
						if (ev.allday && ev.end) {
							if ((0, _moment2.default)(ev.end).isBetween(day.start, day.end)) {
								day.alldays.push(ev);
							} else if ((0, _moment2.default)(ev.start).isBefore(day.start) && (0, _moment2.default)(ev.end).isAfter(day.end)) {
								day.alldays.push(ev);
							}
						}
					});
	
					return day;
				});
	
				var weekList = dataset.map(function (day, index) {
					return _react2.default.createElement(_calendarDay2.default, {
						dataset: day,
						key: (0, _moment2.default)(day.start).format(),
						setPopup: _this2.props.setPopup,
						setDetail: _this2.props.setDetail });
				});
	
				return _react2.default.createElement(
					'ul',
					{
						className: 'week ' + this.props.date.position,
						'data-week': (0, _moment2.default)(startWeek).format('YYYY-ww') },
					weekList
				);
			}
		}]);
	
		return CalendarWeek;
	}(_react2.default.Component);
	
	exports.default = CalendarWeek;

/***/ },

/***/ 304:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _underscore = __webpack_require__(189);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarDay = function (_React$Component) {
		_inherits(CalendarDay, _React$Component);
	
		function CalendarDay(props) {
			_classCallCheck(this, CalendarDay);
	
			var _this = _possibleConstructorReturn(this, (CalendarDay.__proto__ || Object.getPrototypeOf(CalendarDay)).call(this, props));
	
			_this.clickDay = _this.clickDay.bind(_this);
			_this.clickEvent = _this.clickEvent.bind(_this);
			_this.mouseEnterEvent = _this.mouseEnterEvent.bind(_this);
			_this.mouseLeaveEvent = _this.mouseLeaveEvent.bind(_this);
			return _this;
		}
	
		_createClass(CalendarDay, [{
			key: 'clickDay',
			value: function clickDay(e) {
				(0, _jquery2.default)('.day, .event').removeClass('active');
				(0, _jquery2.default)('.day[data-date=' + e.target.dataset.date + '], .event[data-date=' + e.target.dataset.date + ']').addClass('active');
			}
		}, {
			key: 'clickEvent',
			value: function clickEvent(e) {
				(0, _jquery2.default)('.day, .event').removeClass('active');
				(0, _jquery2.default)('.day[data-date=' + e.target.dataset.date + '], .event[data-date=' + e.target.dataset.date + ']').addClass('active');
				this.props.setPopup('detail');
				this.props.setDetail(e.target.dataset.eventid);
			}
		}, {
			key: 'mouseEnterEvent',
			value: function mouseEnterEvent(e) {
				(0, _jquery2.default)('.event.event-' + e.target.dataset.eventid).addClass('hover');
			}
		}, {
			key: 'mouseLeaveEvent',
			value: function mouseLeaveEvent(e) {
				(0, _jquery2.default)('.event').removeClass('hover');
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;
	
				var now = (0, _moment2.default)(),
				    dataset = this.props.dataset,
				    dayNumber = void 0;
	
				if (dataset.weekday == 'wkd') {
					var num = Number((0, _moment2.default)(dataset.start).format('D'));
					dayNumber = _react2.default.createElement(
						'span',
						{ className: 'sat-sun' },
						_react2.default.createElement(
							'span',
							{ className: 'saturday' },
							num
						),
						_react2.default.createElement(
							'span',
							{ className: 'seperator' },
							'/'
						),
						_react2.default.createElement(
							'span',
							{ className: 'sunday' },
							num + 1
						)
					);
				} else {
					dayNumber = _react2.default.createElement(
						'span',
						{ className: 'workday' },
						(0, _moment2.default)(dataset.start).format('D')
					);
				}
	
				dataset.alldays = _underscore2.default.sortBy(dataset.alldays, 'pos');
				var alldays = dataset.alldays.map(function (ev, index) {
					var style = { backgroundColor: ev.category.color };
					style.top = ev.pos * 25;
	
					var classes = 'event event-' + ev._id;
					if ((0, _moment2.default)(ev.start).isBefore(dataset.start)) classes = classes + ' yesterday';
					if (ev.end && (0, _moment2.default)(ev.end).isAfter(dataset.end)) classes = classes + ' tomorrow';
	
					return _react2.default.createElement(
						'li',
						{ className: classes,
							style: style,
							key: ev._id + (0, _moment2.default)(ev.start).format(),
							title: ev.title,
							onMouseEnter: _this2.mouseEnterEvent,
							onMouseLeave: _this2.mouseLeaveEvent,
							onClick: _this2.clickEvent,
							'data-eventid': ev._id,
							'data-date': (0, _moment2.default)(dataset.start).format('YYYY-MM-DD') },
						_react2.default.createElement(
							'span',
							{ className: 'event-title' },
							ev.title
						)
					);
				});
	
				var highestAllday = _underscore2.default.max(dataset.alldays, function (ev) {
					return ev.pos;
				});
	
				var alldaysHeight = { height: ((Number(highestAllday.pos) || 0) + 1) * 25 + 5 };
	
				var singles = dataset.singles.map(function (ev, index) {
	
					var time = _react2.default.createElement(
						'time',
						{ className: 'event-time', dateTime: ev.start },
						(0, _moment2.default)(ev.start).format('HH:mm')
					);
					if (ev.end) time = _react2.default.createElement(
						'time',
						{ className: 'event-time', dateTime: ev.start },
						(0, _moment2.default)(ev.start).format('HH:mm'),
						' \u2013 ',
						(0, _moment2.default)(ev.end).format('HH:mm')
					);
	
					var weekendDay = '';
					if (dataset.weekday == 'wkd') {
						weekendDay = _react2.default.createElement(
							'span',
							{ className: 'event-weekend' },
							(0, _moment2.default)(ev.start).format('ddd')
						);
					}
	
					return _react2.default.createElement(
						'li',
						{ className: 'event',
							key: ev._id + (0, _moment2.default)(ev.start).format(),
							title: ev.title,
							onClick: _this2.clickEvent,
							'data-eventid': ev._id,
							'data-date': (0, _moment2.default)(dataset.start).format('YYYY-MM-DD') },
						_react2.default.createElement('i', { style: { backgroundColor: ev.category.color } }),
						time,
						weekendDay,
						_react2.default.createElement(
							'span',
							{ className: 'event-title' },
							ev.title
						)
					);
				});
	
				return _react2.default.createElement(
					'li',
					{ className: (0, _moment2.default)(now).isBetween(dataset.start, dataset.end) ? 'today active day ' + dataset.weekday : 'day ' + dataset.weekday,
						onClick: this.clickDay,
						'data-date': (0, _moment2.default)(dataset.start).format('YYYY-MM-DD') },
					_react2.default.createElement(
						'div',
						{ className: 'day-number' },
						dayNumber
					),
					_react2.default.createElement(
						'div',
						{ className: 'day-name' },
						dataset.weekday
					),
					_react2.default.createElement(
						'div',
						{ className: 'event-container ' + dataset.weekday },
						_react2.default.createElement(
							'ul',
							{ className: 'alldays', style: alldaysHeight },
							alldays
						),
						_react2.default.createElement(
							'ul',
							{ className: 'singles' },
							singles
						)
					)
				);
			}
		}]);
	
		return CalendarDay;
	}(_react2.default.Component);
	
	exports.default = CalendarDay;

/***/ },

/***/ 305:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _calendarFilter = __webpack_require__(306);
	
	var _calendarFilter2 = _interopRequireDefault(_calendarFilter);
	
	var _calendarMinical = __webpack_require__(307);
	
	var _calendarMinical2 = _interopRequireDefault(_calendarMinical);
	
	var _calendarYearcal = __webpack_require__(308);
	
	var _calendarYearcal2 = _interopRequireDefault(_calendarYearcal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarSidebar = function (_React$Component) {
		_inherits(CalendarSidebar, _React$Component);
	
		function CalendarSidebar() {
			_classCallCheck(this, CalendarSidebar);
	
			return _possibleConstructorReturn(this, (CalendarSidebar.__proto__ || Object.getPrototypeOf(CalendarSidebar)).apply(this, arguments));
		}
	
		_createClass(CalendarSidebar, [{
			key: 'render',
			value: function render() {
				var miniView = void 0,
				    viewSwitch = void 0;
	
				if (this.props.view == 'weekly') {
					miniView = _react2.default.createElement(_calendarMinical2.default, {
						date: this.props.date,
						setDate: this.props.setDate });
	
					viewSwitch = _react2.default.createElement(
						'a',
						{ href: '', onClick: this.props.viewToggle },
						'Switch to ',
						_react2.default.createElement(
							'u',
							null,
							'Monthly view'
						)
					);
				} else if (this.props.view == 'monthly') {
					miniView = _react2.default.createElement(_calendarYearcal2.default, {
						date: this.props.date,
						setDate: this.props.setDate });
	
					viewSwitch = _react2.default.createElement(
						'a',
						{ href: '', onClick: this.props.viewToggle },
						'Switch to ',
						_react2.default.createElement(
							'u',
							null,
							'Weekly view'
						)
					);
				}
	
				return _react2.default.createElement(
					'aside',
					{ id: 'calendar-sidebar' },
					miniView,
					_react2.default.createElement(_calendarFilter2.default, {
						categories: this.props.categories,
						catFilter: this.props.catFilter,
						toggleFilter: this.props.toggleFilter }),
					_react2.default.createElement(
						'div',
						{ id: 'calendar-viewtoggle' },
						viewSwitch
					)
				);
			}
		}]);
	
		return CalendarSidebar;
	}(_react2.default.Component);
	
	exports.default = CalendarSidebar;

/***/ },

/***/ 306:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarFilter = function (_React$Component) {
		_inherits(CalendarFilter, _React$Component);
	
		function CalendarFilter(props) {
			_classCallCheck(this, CalendarFilter);
	
			var _this = _possibleConstructorReturn(this, (CalendarFilter.__proto__ || Object.getPrototypeOf(CalendarFilter)).call(this, props));
	
			_this.toggleFilter = _this.toggleFilter.bind(_this);
			return _this;
		}
	
		_createClass(CalendarFilter, [{
			key: 'toggleFilter',
			value: function toggleFilter(e) {
				e.preventDefault();
				this.props.toggleFilter(e.target.id);
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;
	
				var categoryList = this.props.categories.map(function (cat) {
					return _react2.default.createElement(
						'li',
						{ className: 'category', key: cat.id },
						_react2.default.createElement(
							'label',
							{ className: _this2.props.catFilter.indexOf(cat.id) > -1 ? 'checkbox active' : 'checkbox', onClick: _this2.toggleFilter, id: cat.id, title: cat.name, key: 'filter-' + cat.id },
							_react2.default.createElement('i', { style: { backgroundColor: cat.color } }),
							' ',
							cat.name
						)
					);
				});
	
				return _react2.default.createElement(
					'ul',
					{ id: 'calendar-filter' },
					categoryList,
					_react2.default.createElement(
						'li',
						{ className: 'clear-filter', style: this.props.catFilter.length > 0 ? {} : { display: 'none' } },
						_react2.default.createElement(
							'a',
							{ href: '', onClick: this.toggleFilter, id: 'clear' },
							'Clear filters'
						)
					)
				);
			}
		}]);
	
		return CalendarFilter;
	}(_react2.default.Component);
	
	exports.default = CalendarFilter;

/***/ },

/***/ 307:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _fullcalendar = __webpack_require__(301);
	
	var _fullcalendar2 = _interopRequireDefault(_fullcalendar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarMinical = function (_React$Component) {
		_inherits(CalendarMinical, _React$Component);
	
		function CalendarMinical() {
			_classCallCheck(this, CalendarMinical);
	
			return _possibleConstructorReturn(this, (CalendarMinical.__proto__ || Object.getPrototypeOf(CalendarMinical)).apply(this, arguments));
		}
	
		_createClass(CalendarMinical, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				var that = this,
				    now = (0, _moment2.default)();
	
				(0, _jquery2.default)('#calendar-minical').fullCalendar({
					firstDay: 1,
					header: {
						left: '',
						center: 'prev title next',
						right: ''
					},
					buttonIcons: false,
					buttonText: {
						prev: '\u2039',
						next: '\u203A'
					},
					dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
					dayClick: function dayClick(date, jsEvent, view) {
						(0, _jquery2.default)('thead tr').removeClass('display-week');
						(0, _jquery2.default)('thead td[data-date=' + (0, _moment2.default)(date).format('YYYY-MM-DD') + ']').parent().addClass('display-week');
						var clickDate = (0, _moment2.default)(date).format('YYYY-MM-DD');
						that.props.setDate((0, _moment2.default)(clickDate, 'YYYY-MM-DD'));
					},
					dayRender: function dayRender(date, cell) {
						if ((0, _moment2.default)(date).isSame(that.props.date, 'day')) (0, _jquery2.default)('thead td[data-date=' + (0, _moment2.default)(date).format('YYYY-MM-DD') + ']').parent().addClass('display-week');
						if ((0, _moment2.default)(date).isSame(now, 'day')) (0, _jquery2.default)('thead td[data-date=' + (0, _moment2.default)(date).format('YYYY-MM-DD') + ']').html('<span>' + (0, _moment2.default)(date).format('D') + '</span>');
					}
				});
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
	
				(0, _jquery2.default)('#calendar-minical').fullCalendar('gotoDate', nextProps.date);
				if (!(0, _moment2.default)(nextProps.date).isSame(this.props.date, 'week')) {
					(0, _jquery2.default)('thead tr').removeClass('display-week');
					(0, _jquery2.default)('thead td[data-date=' + (0, _moment2.default)(nextProps.date).format('YYYY-MM-DD') + ']').parent().addClass('display-week');
				}
			}
		}, {
			key: 'render',
			value: function render() {
				return _react2.default.createElement('div', { id: 'calendar-minical' });
			}
		}]);
	
		return CalendarMinical;
	}(_react2.default.Component);
	
	exports.default = CalendarMinical;

/***/ },

/***/ 308:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarYearcal = function (_React$Component) {
		_inherits(CalendarYearcal, _React$Component);
	
		function CalendarYearcal(props) {
			_classCallCheck(this, CalendarYearcal);
	
			var _this = _possibleConstructorReturn(this, (CalendarYearcal.__proto__ || Object.getPrototypeOf(CalendarYearcal)).call(this, props));
	
			_this.state = {
				year: '',
				month: ''
			};
	
			_this.navYear = _this.navYear.bind(_this);
			_this.clickMonth = _this.clickMonth.bind(_this);
			return _this;
		}
	
		_createClass(CalendarYearcal, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
	
				this.setState({
					year: (0, _moment2.default)(this.props.date).format('YYYY'),
					month: (0, _moment2.default)(this.props.date).format('MM')
				});
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
	
				this.setState({
					year: (0, _moment2.default)(nextProps.date).format('YYYY'),
					month: (0, _moment2.default)(nextProps.date).format('MM')
				});
			}
		}, {
			key: 'navYear',
			value: function navYear(e) {
				e.preventDefault();
	
				var newYear = (0, _moment2.default)(this.state.year, 'YYYY').add(1, 'years').format('YYYY');
				if (e.target.dataset.arg == 'prev') newYear = (0, _moment2.default)(this.state.year, 'YYYY').subtract(1, 'years').format('YYYY');
	
				this.setState({ year: newYear });
			}
		}, {
			key: 'clickMonth',
			value: function clickMonth(e) {
				e.preventDefault();
				this.props.setDate((0, _moment2.default)(e.target.dataset.month, 'YYYY-MM'));
			}
		}, {
			key: 'render',
			value: function render() {
				var viewYear = (0, _moment2.default)(this.props.date).format('YYYY'),
				    now = (0, _moment2.default)().format('YYYY-MM');
	
				return _react2.default.createElement(
					'div',
					{ id: 'calendar-yearcal' },
					_react2.default.createElement(
						'header',
						null,
						_react2.default.createElement(
							'a',
							{ href: '', onClick: this.navYear, 'data-arg': 'prev' },
							'\u2039'
						),
						this.state.year,
						_react2.default.createElement(
							'a',
							{ href: '', onClick: this.navYear, 'data-arg': 'next' },
							'\u203A'
						)
					),
					_react2.default.createElement(
						'ul',
						{ id: 'yearcal-months', className: this.state.year == viewYear ? 'this-year' : '' },
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '01' ? 'active' : '',
								'data-today': now == this.state.year + '-01' ? 'yay' : 'nope',
								'data-month': this.state.year + '-01',
								onClick: this.clickMonth },
							'JAN'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '02' ? 'active' : '',
								'data-today': now == this.state.year + '-02' ? 'yay' : 'nope',
								'data-month': this.state.year + '-02',
								onClick: this.clickMonth },
							'FEB'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '03' ? 'active' : '',
								'data-today': now == this.state.year + '-03' ? 'yay' : 'nope',
								'data-month': this.state.year + '-03',
								onClick: this.clickMonth },
							'MAR'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '04' ? 'active' : '',
								'data-today': now == this.state.year + '-04' ? 'yay' : 'nope',
								'data-month': this.state.year + '-04',
								onClick: this.clickMonth },
							'APR'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '05' ? 'active' : '',
								'data-today': now == this.state.year + '-05' ? 'yay' : 'nope',
								'data-month': this.state.year + '-05',
								onClick: this.clickMonth },
							'MAY'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '06' ? 'active' : '',
								'data-today': now == this.state.year + '-06' ? 'yay' : 'nope',
								'data-month': this.state.year + '-06',
								onClick: this.clickMonth },
							'JUN'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '07' ? 'active' : '',
								'data-today': now == this.state.year + '-07' ? 'yay' : 'nope',
								'data-month': this.state.year + '-07',
								onClick: this.clickMonth },
							'JUL'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '08' ? 'active' : '',
								'data-today': now == this.state.year + '-08' ? 'yay' : 'nope',
								'data-month': this.state.year + '-08',
								onClick: this.clickMonth },
							'AUG'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '09' ? 'active' : '',
								'data-today': now == this.state.year + '-09' ? 'yay' : 'nope',
								'data-month': this.state.year + '-09',
								onClick: this.clickMonth },
							'SEP'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '10' ? 'active' : '',
								'data-today': now == this.state.year + '-10' ? 'yay' : 'nope',
								'data-month': this.state.year + '-10',
								onClick: this.clickMonth },
							'OCT'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '11' ? 'active' : '',
								'data-today': now == this.state.year + '-11' ? 'yay' : 'nope',
								'data-month': this.state.year + '-11',
								onClick: this.clickMonth },
							'NOV'
						),
						_react2.default.createElement(
							'li',
							{ className: this.state.month == '12' ? 'active' : '',
								'data-today': now == this.state.year + '-12' ? 'yay' : 'nope',
								'data-month': this.state.year + '-12',
								onClick: this.clickMonth },
							'DEC'
						)
					)
				);
			}
		}]);
	
		return CalendarYearcal;
	}(_react2.default.Component);
	
	exports.default = CalendarYearcal;

/***/ },

/***/ 309:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _calendarUpdate = __webpack_require__(310);
	
	var _calendarUpdate2 = _interopRequireDefault(_calendarUpdate);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarDetail = function (_React$Component) {
		_inherits(CalendarDetail, _React$Component);
	
		function CalendarDetail(props) {
			_classCallCheck(this, CalendarDetail);
	
			var _this = _possibleConstructorReturn(this, (CalendarDetail.__proto__ || Object.getPrototypeOf(CalendarDetail)).call(this, props));
	
			_this.state = {
				view: 'detail',
				loading: false,
				detail: {
					title: '',
					start: '',
					end: '',
					allday: true,
					multiday: false,
					category: { name: '', color: '', _id: '' },
					user: { name: { first: '', last: '' }, username: '', _id: '' },
					recursion: 'once',
					note: ''
				}
			};
	
			_this.switchView = _this.switchView.bind(_this);
			return _this;
		}
	
		_createClass(CalendarDetail, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				var _this2 = this;
	
				this.setState({ loading: true }, function () {
	
					_jquery2.default.ajax({
						method: 'GET',
						url: document.baseURI + '/events/?detail=' + _this2.props.detail,
						dataType: 'json'
					}).done(function (ev) {
	
						if (ev.allday) {
							ev.start = (0, _moment2.default)(ev.start, 'X');
							if (ev.end) {
								ev.end = (0, _moment2.default)(ev.end, 'X');
								if (!(0, _moment2.default)(ev.start).isSame(ev.end, 'day')) ev['multiday'] = true;
							}
						} else {
							ev.start = (0, _moment2.default)(ev.start, 'X').subtract(2, 'hours');
							if (ev.end) ev.end = (0, _moment2.default)(ev.end, 'X').subtract(2, 'hours');
						}
						_this2.setState({ detail: ev, loading: false });
					});
				});
			}
		}, {
			key: 'switchView',
			value: function switchView(e) {
				e.preventDefault();
				this.setState({ view: e.target.dataset.arg });
			}
		}, {
			key: 'render',
			value: function render() {
				var detail = this.state.detail,
				    currentView = void 0,
				    updateButton = void 0,
				    dateString = void 0,
				    durationString = void 0;
	
				if (detail.start && detail.end && detail.allday) {
					dateString = _react2.default.createElement(
						'span',
						{ className: 'detail-time' },
						_react2.default.createElement(
							'time',
							null,
							(0, _moment2.default)(detail.start).format('ddd. D MMMM YYYY')
						),
						' \u2013 ',
						_react2.default.createElement(
							'time',
							null,
							(0, _moment2.default)(detail.end).format('ddd. D MMMM YYYY')
						)
					);
					durationString = _react2.default.createElement(
						'small',
						{ className: 'detail-duration' },
						(0, _moment2.default)(detail.end).diff(detail.start, 'days') + 1,
						' days'
					);
				} else if (detail.start && !detail.end && detail.allday) {
					dateString = _react2.default.createElement(
						'span',
						{ className: 'detail-time' },
						_react2.default.createElement(
							'time',
							null,
							(0, _moment2.default)(detail.start).format('ddd. D MMMM YYYY')
						)
					);
					durationString = _react2.default.createElement(
						'small',
						{ className: 'detail-duration' },
						'1 day'
					);
				} else if (detail.start && detail.end && !detail.allday) {
					dateString = _react2.default.createElement(
						'span',
						{ className: 'detail-time' },
						_react2.default.createElement(
							'time',
							null,
							(0, _moment2.default)(detail.start).format('ddd. D MMMM YYYY'),
							', ',
							(0, _moment2.default)(detail.start).format('H:mm'),
							' \u2013 ',
							(0, _moment2.default)(detail.end).format('H:mm')
						)
					);
	
					if ((0, _moment2.default)(detail.end).diff(detail.start, 'minutes') > 180) {
						durationString = _react2.default.createElement(
							'small',
							{ className: 'detail-duration' },
							(0, _moment2.default)(detail.end).diff(detail.start, 'hours'),
							' hours'
						);
					} else {
						durationString = _react2.default.createElement(
							'small',
							{ className: 'detail-duration' },
							(0, _moment2.default)(detail.end).diff(detail.start, 'minutes'),
							' minutes'
						);
					}
				} else if (detail.start && !detail.end && !detail.allday) {
					dateString = _react2.default.createElement(
						'span',
						{ className: 'detail-time' },
						_react2.default.createElement(
							'time',
							null,
							(0, _moment2.default)(detail.start).format('ddd. D MMMM YYYY'),
							', ',
							(0, _moment2.default)(detail.start).format('H:mm')
						)
					);
				}
	
				if (this.state.view == 'detail') {
					currentView = _react2.default.createElement(
						'div',
						{ className: 'popup-body', style: { paddingTop: '2em' } },
						_react2.default.createElement('div', { className: 'cat-stripe', style: { backgroundColor: detail.category.color } }),
						_react2.default.createElement(
							'dl',
							{ className: 'detail-list' },
							_react2.default.createElement(
								'div',
								{ className: 'dl-row' },
								_react2.default.createElement(
									'dd',
									null,
									'Title'
								),
								_react2.default.createElement(
									'dt',
									null,
									_react2.default.createElement(
										'strong',
										null,
										detail.title
									)
								)
							),
							_react2.default.createElement(
								'div',
								{ className: 'dl-row' },
								_react2.default.createElement(
									'dd',
									null,
									'Date'
								),
								_react2.default.createElement(
									'dt',
									null,
									dateString,
									' ',
									durationString
								)
							),
							_react2.default.createElement(
								'div',
								{ className: 'dl-row' },
								_react2.default.createElement(
									'dd',
									null,
									'Category'
								),
								_react2.default.createElement(
									'dt',
									null,
									_react2.default.createElement('i', { style: { backgroundColor: detail.category.color } }),
									' ',
									detail.category.name
								)
							),
							_react2.default.createElement(
								'div',
								{ className: detail.recursion != 'once' ? 'dl-row' : 'dl-row hide' },
								_react2.default.createElement(
									'dd',
									null,
									'Recursion'
								),
								_react2.default.createElement(
									'dt',
									{ style: { textTransform: 'capitalize' } },
									detail.recursion
								)
							),
							_react2.default.createElement(
								'div',
								{ className: detail.note ? 'dl-row' : 'dl-row hide' },
								_react2.default.createElement(
									'dd',
									null,
									'Note'
								),
								_react2.default.createElement(
									'dt',
									null,
									detail.note
								)
							),
							_react2.default.createElement(
								'div',
								{ className: 'dl-row' },
								_react2.default.createElement(
									'dd',
									null,
									'Author'
								),
								_react2.default.createElement(
									'dt',
									null,
									detail.user.name.first,
									' ',
									detail.user.name.last,
									' ',
									_react2.default.createElement(
										'small',
										null,
										(0, _moment2.default)(detail.added).fromNow()
									)
								)
							)
						)
					);
				}
	
				if (this.state.view == 'update') {
					currentView = _react2.default.createElement(_calendarUpdate2.default, {
						categories: this.props.categories,
						detail: this.state.detail,
						cancelPopup: this.props.cancelPopup,
						updateEvent: this.props.updateEvent });
				}
	
				if ((0, _jquery2.default)('#header-user').hasClass('publisher') || this.props.user._id == detail.user._id) {
					updateButton = _react2.default.createElement(
						'div',
						{ className: this.state.view == 'update' ? 'active' : '', onClick: this.switchView, 'data-arg': 'update' },
						'Update'
					);
				}
	
				return _react2.default.createElement(
					'div',
					{ id: 'calendar-settings' },
					_react2.default.createElement(
						'header',
						{ className: 'popup-header' },
						_react2.default.createElement(
							'div',
							{ className: this.state.view == 'detail' ? 'active' : '', onClick: this.switchView, 'data-arg': 'detail' },
							'Detail'
						),
						updateButton,
						_react2.default.createElement(
							'div',
							{ id: 'close-popup', onClick: this.props.cancelPopup },
							'\xD7'
						)
					),
					currentView,
					_react2.default.createElement(
						'div',
						{ className: this.state.loading ? 'loading active' : 'loading' },
						_react2.default.createElement('div', { className: 'spinner' })
					)
				);
			}
		}]);
	
		return CalendarDetail;
	}(_react2.default.Component);
	
	exports.default = CalendarDetail;

/***/ },

/***/ 310:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _fullcalendar = __webpack_require__(301);
	
	var _fullcalendar2 = _interopRequireDefault(_fullcalendar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarUpdate = function (_React$Component) {
		_inherits(CalendarUpdate, _React$Component);
	
		function CalendarUpdate(props) {
			_classCallCheck(this, CalendarUpdate);
	
			var _this = _possibleConstructorReturn(this, (CalendarUpdate.__proto__ || Object.getPrototypeOf(CalendarUpdate)).call(this, props));
	
			_this.state = {
				loading: false,
				detail: {
					title: '',
					start: '',
					end: '',
					allday: true,
					multiday: false,
					category: '',
					recursion: 'once',
					user: '',
					note: ''
				}
			};
	
			_this.setDate = _this.setDate.bind(_this);
			_this.handleChange = _this.handleChange.bind(_this);
			_this.handleCheckbox = _this.handleCheckbox.bind(_this);
			_this.handleTime = _this.handleTime.bind(_this);
			_this.handleEndTime = _this.handleEndTime.bind(_this);
			_this.handleSubmit = _this.handleSubmit.bind(_this);
			_this.handleRemove = _this.handleRemove.bind(_this);
			return _this;
		}
	
		_createClass(CalendarUpdate, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
	
				var that = this,
				    detail = this.props.detail;
				detail.category = detail.category._id;
				detail.start = (0, _moment2.default)(detail.start);
				if (detail.end) detail.end = (0, _moment2.default)(detail.end);
	
				this.setState({ detail: detail }, function () {
	
					(0, _jquery2.default)('.calendar-popupcal').fullCalendar({
						firstDay: 1,
						header: {
							left: '',
							center: 'prev title next',
							right: ''
						},
						buttonIcons: false,
						buttonText: {
							prev: '\u2039',
							next: '\u203A'
						},
						dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
						dayRender: function dayRender(date, cell) {
							(0, _jquery2.default)(cell).html('<span>' + (0, _moment2.default)(date).format('D') + '</span>');
							if (that.state.detail.multiday) {
								if ((0, _moment2.default)(date).isSame(that.state.detail.start, 'day')) (0, _jquery2.default)(cell).addClass('selected start');
								if ((0, _moment2.default)(date).isSame(that.state.detail.end, 'day')) (0, _jquery2.default)(cell).addClass('selected end');
								if ((0, _moment2.default)(date).isBetween(that.state.detail.start, that.state.detail.end)) (0, _jquery2.default)(cell).addClass('selected');
							} else {
								if ((0, _moment2.default)(that.state.detail.start).isSame(date, 'day')) (0, _jquery2.default)(cell).addClass('selected start end');
							}
						},
						dayClick: function dayClick(date, jsEvent, view) {
							that.setDate(date);
						}
					});
				});
			}
		}, {
			key: 'setDate',
			value: function setDate(date) {
				var _this2 = this;
	
				var detail = this.state.detail;
				(0, _jquery2.default)('.fc-day').removeClass('selected start end');
	
				if (this.state.detail.multiday) {
					if ((0, _moment2.default)(date).isBefore(this.state.detail.start)) {
						detail.start = (0, _moment2.default)(date);
					} else if ((0, _moment2.default)(date).isBetween(this.state.detail.start, this.state.detail.end)) {
						detail.start = (0, _moment2.default)(date);
					} else if ((0, _moment2.default)(date).isAfter(this.state.detail.start)) {
						detail.end = (0, _moment2.default)(date);
					}
	
					this.setState({ detail: detail }, function () {
						drawRange(_this2.state.detail.start, _this2.state.detail.end);
					});
				} else {
					(0, _jquery2.default)('.fc-day[data-date=' + (0, _moment2.default)(date).format('YYYY-MM-DD') + ']').addClass('selected start end');
					detail.start = (0, _moment2.default)(date);
					detail.end = '';
					this.setState({ detail: detail });
				}
	
				function drawRange(start, end) {
					var num = (0, _moment2.default)(end).diff(start, 'days');
					for (var i = 0; i <= num; i++) {
						(0, _jquery2.default)('.fc-day[data-date=' + (0, _moment2.default)(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('selected');
	
						if (i == 0) (0, _jquery2.default)('.fc-day[data-date=' + (0, _moment2.default)(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('start');
						if (i == num) (0, _jquery2.default)('.fc-day[data-date=' + (0, _moment2.default)(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('end');
					}
				}
			}
		}, {
			key: 'handleChange',
			value: function handleChange(e) {
				var detail = this.state.detail;
				detail[e.target.name] = e.target.value;
				this.setState({ detail: detail });
			}
		}, {
			key: 'handleCheckbox',
			value: function handleCheckbox(e) {
				var _this3 = this;
	
				var detail = this.state.detail;
				if ((0, _jquery2.default)(e.target).hasClass('active')) {
					detail[e.target.dataset.arg] = false;
				} else {
					detail[e.target.dataset.arg] = true;
				}
	
				if (detail.multiday == true || this.state.detail.multiday == true) detail['allday'] = true;
				if (detail.multiday == false || this.state.detail.multiday == false) detail['end'] = '';
				if (detail.allday == true) detail['start'] = (0, _moment2.default)(this.state.detail.start).set({ 'hour': 0, 'minute': 0 });
	
				this.setState({ detail: detail }, function () {
					if (detail.multiday == false) _this3.setDate(_this3.state.detail.start);
				});
			}
		}, {
			key: 'handleTime',
			value: function handleTime(e) {
				var detail = this.state.detail,
				    time = Number(e.target.value);
	
				if (e.target.dataset.arg == 'start-hours') detail.start = (0, _moment2.default)(detail.start).set('hour', time);
				if (e.target.dataset.arg == 'start-minutes') detail.start = (0, _moment2.default)(detail.start).set('minute', time);
				if (e.target.dataset.arg == 'end-hours') detail.end = (0, _moment2.default)(detail.end).set('hour', time);
				if (e.target.dataset.arg == 'end-minutes') detail.end = (0, _moment2.default)(detail.end).set('minute', time);
	
				if ((0, _moment2.default)(detail.end).isBefore(detail.start)) return alert('Invalid time');
	
				this.setState({ detail: detail });
			}
		}, {
			key: 'handleEndTime',
			value: function handleEndTime(e) {
				var detail = this.state.detail;
	
				if (detail.end == '' && detail.allday == false) {
					detail.end = (0, _moment2.default)(detail.start).add(1, 'hours');
				} else {
					detail.end = '';
				}
	
				this.setState({ detail: detail });
			}
		}, {
			key: 'handleSubmit',
			value: function handleSubmit(e) {
				var _this4 = this;
	
				e.preventDefault();
	
				if (this.state.detail.title == '') return alert('Please enter a title');
				if (this.state.detail.category == '') return alert('Please supply a category');
	
				this.setState({ loading: true }, function () {
	
					var ev = _this4.state.detail;
	
					if (!ev.allday) {
						ev.start = (0, _moment2.default)(ev.start).add(2, 'hours').format('X');
						if (ev.end) ev.end = (0, _moment2.default)(ev.end).add(2, 'hours').format('X');
					} else {
						ev.start = (0, _moment2.default)(ev.start).format('X');
						if (ev.end) ev.end = (0, _moment2.default)(ev.end).format('X');
					}
	
					ev['reason'] = 'update';
	
					_jquery2.default.ajax({
						method: 'POST',
						url: '/humphrey/events',
						data: ev,
						dataType: 'json'
					}).done(function (response) {
						_this4.setState({ loading: false }, function () {
							_this4.props.cancelPopup();
							_this4.props.updateEvent(response);
						});
					});
				});
			}
		}, {
			key: 'handleRemove',
			value: function handleRemove(e) {
				e.preventDefault();
	
				if (confirm('Are you sure?')) {}
			}
		}, {
			key: 'render',
			value: function render() {
				var ev = this.state.detail,
				    hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
				    minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
	
				var startHourList = hours.map(function (hour) {
					return _react2.default.createElement(
						'option',
						{ value: hour, key: 'sh-' + hour },
						hour
					);
				});
	
				var startMinuteList = minutes.map(function (minute) {
					return _react2.default.createElement(
						'option',
						{ value: minute, key: 'sm-' + minute },
						minute
					);
				});
	
				var endHourList = hours.map(function (hour) {
					if (hour >= (0, _moment2.default)(ev.start).format('HH')) {
						return _react2.default.createElement(
							'option',
							{ value: hour, key: 'eh-' + hour },
							hour
						);
					}
				});
	
				var endMinuteList = minutes.map(function (minute) {
					return _react2.default.createElement(
						'option',
						{ value: minute, key: 'em-' + minute },
						minute
					);
				});
	
				var catList = this.props.categories.map(function (cat) {
					return _react2.default.createElement(
						'option',
						{ value: cat.id, key: cat.id },
						cat.name
					);
				});
	
				return _react2.default.createElement(
					'div',
					{ className: 'popup-body' },
					_react2.default.createElement(
						'form',
						null,
						_react2.default.createElement(
							'div',
							{ className: 'form-row' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'update-title' },
								'Title'
							),
							_react2.default.createElement('input', { type: 'text', id: 'update-title', name: 'title', value: ev.title, onChange: this.handleChange })
						),
						_react2.default.createElement(
							'div',
							{ className: 'form-row' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'update-date' },
								'Date'
							),
							_react2.default.createElement(
								'div',
								{ className: 'calendar' },
								_react2.default.createElement('div', { className: 'calendar-popupcal' }),
								_react2.default.createElement(
									'div',
									{ className: 'calendar-options' },
									_react2.default.createElement(
										'label',
										{ className: ev.allday ? 'checkbox active' : 'checkbox', 'data-arg': 'allday', onClick: this.handleCheckbox },
										'All day'
									),
									_react2.default.createElement(
										'label',
										{ className: ev.multiday ? 'checkbox active' : 'checkbox', 'data-arg': 'multiday', onClick: this.handleCheckbox },
										'Date range'
									),
									_react2.default.createElement(
										'label',
										{ className: ev.allday ? 'update-time disabled' : 'update-time', htmlFor: 'update-time-start-hours' },
										'Start time'
									),
									_react2.default.createElement(
										'div',
										{ className: 'set-time' },
										_react2.default.createElement(
											'select',
											{ id: 'update-time-start-hours', onChange: this.handleTime, value: (0, _moment2.default)(ev.start).format('HH'), disabled: ev.allday, 'data-arg': 'start-hours' },
											startHourList
										),
										_react2.default.createElement(
											'select',
											{ id: 'update-time-start-minutes', onChange: this.handleTime, value: (0, _moment2.default)(ev.start).format('mm'), disabled: ev.allday, 'data-arg': 'start-minutes' },
											startMinuteList
										)
									),
									_react2.default.createElement(
										'label',
										{ className: ev.allday ? 'checkbox disabled' : ev.end != '' ? 'checkbox active' : 'checkbox', htmlFor: 'update-time-end-hours', onClick: this.handleEndTime },
										'End time'
									),
									_react2.default.createElement(
										'div',
										{ className: 'set-time' },
										_react2.default.createElement(
											'select',
											{ id: 'update-time-end-hours', onChange: this.handleTime, value: (0, _moment2.default)(ev.end).format('HH'), disabled: ev.allday == true || ev.end == '', 'data-arg': 'end-hours' },
											endHourList
										),
										_react2.default.createElement(
											'select',
											{ id: 'update-time-end-minutes', onChange: this.handleTime, value: (0, _moment2.default)(ev.end).format('mm'), disabled: ev.allday == true || ev.end == '', 'data-arg': 'end-minutes' },
											endMinuteList
										)
									),
									_react2.default.createElement(
										'label',
										{ className: 'update-time', htmlFor: 'update-recursion' },
										'Recursion'
									),
									_react2.default.createElement(
										'div',
										{ className: 'set-time' },
										_react2.default.createElement(
											'select',
											{ id: 'update-recursion', name: 'recursion', value: ev.recursion, onChange: this.handleChange },
											_react2.default.createElement(
												'option',
												{ value: 'once' },
												'Once'
											),
											_react2.default.createElement(
												'option',
												{ value: 'monthly' },
												'Monthly'
											),
											_react2.default.createElement(
												'option',
												{ value: 'yearly' },
												'Yearly'
											)
										)
									)
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'form-row' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'update-category' },
								'Category'
							),
							_react2.default.createElement(
								'select',
								{ id: 'update-category', name: 'category', value: ev.category, onChange: this.handleChange },
								catList
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'form-row' },
							_react2.default.createElement(
								'label',
								{ htmlFor: 'update-note' },
								'Note'
							),
							_react2.default.createElement('textarea', { id: 'update-note', name: 'note', value: ev.note, onChange: this.handleChange })
						),
						_react2.default.createElement(
							'button',
							{ className: 'button', type: 'submit', onClick: this.handleSubmit },
							'Update'
						),
						_react2.default.createElement(
							'a',
							{ href: '', className: 'link', onClick: this.handleRemove },
							'Remove'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: this.state.loading ? 'loading active' : 'loading' },
						_react2.default.createElement('div', { className: 'spinner' })
					)
				);
			}
		}]);
	
		return CalendarUpdate;
	}(_react2.default.Component);
	
	exports.default = CalendarUpdate;

/***/ },

/***/ 311:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(15);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _moment = __webpack_require__(190);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _jquery = __webpack_require__(188);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _fullcalendar = __webpack_require__(301);
	
	var _fullcalendar2 = _interopRequireDefault(_fullcalendar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarCreate = function (_React$Component) {
		_inherits(CalendarCreate, _React$Component);
	
		function CalendarCreate(props) {
			_classCallCheck(this, CalendarCreate);
	
			var _this = _possibleConstructorReturn(this, (CalendarCreate.__proto__ || Object.getPrototypeOf(CalendarCreate)).call(this, props));
	
			_this.state = {
				title: '',
				start: (0, _moment2.default)(),
				end: '',
				allday: true,
				multiday: false,
				category: '',
				recursion: 'once',
				note: '',
				loading: false
			};
	
			_this.setDate = _this.setDate.bind(_this);
			_this.handleChange = _this.handleChange.bind(_this);
			_this.handleCheckbox = _this.handleCheckbox.bind(_this);
			_this.handleTime = _this.handleTime.bind(_this);
			_this.handleEndTime = _this.handleEndTime.bind(_this);
			_this.handleSubmit = _this.handleSubmit.bind(_this);
			return _this;
		}
	
		_createClass(CalendarCreate, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
	
				var that = this;
	
				(0, _jquery2.default)('.calendar-popupcal').fullCalendar({
					firstDay: 1,
					header: {
						left: '',
						center: 'prev title next',
						right: ''
					},
					buttonIcons: false,
					buttonText: {
						prev: '\u2039',
						next: '\u203A'
					},
					dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
					dayRender: function dayRender(date, cell) {
						(0, _jquery2.default)(cell).html('<span>' + (0, _moment2.default)(date).format('D') + '</span>');
						if (that.state.multiday) {
							if ((0, _moment2.default)(date).isSame(that.state.start, 'day')) (0, _jquery2.default)(cell).addClass('selected start');
							if ((0, _moment2.default)(date).isSame(that.state.end, 'day')) (0, _jquery2.default)(cell).addClass('selected end');
							if ((0, _moment2.default)(date).isBetween(that.state.start, that.state.end)) (0, _jquery2.default)(cell).addClass('selected');
						} else {
							if ((0, _moment2.default)(that.state.start).isSame(date, 'day')) that.setDate(date);
						}
					},
					dayClick: function dayClick(date, jsEvent, view) {
						that.setDate(date);
					}
				});
			}
		}, {
			key: 'setDate',
			value: function setDate(date) {
				var _this2 = this;
	
				(0, _jquery2.default)('.fc-day').removeClass('selected start end');
	
				if (this.state.multiday) {
					if ((0, _moment2.default)(date).isBefore(this.state.start)) {
						if (this.state.end != '') {
							this.setState({ start: (0, _moment2.default)(date) }, function () {
								drawRange(_this2.state.start, _this2.state.end);
							});
						} else {
							this.setState({ start: (0, _moment2.default)(date), end: this.state.start }, function () {
								drawRange(_this2.state.start, _this2.state.end);
							});
						}
					} else if ((0, _moment2.default)(date).isBetween(this.state.start, this.state.end)) {
						this.setState({ start: (0, _moment2.default)(date) }, function () {
							drawRange(_this2.state.start, _this2.state.end);
						});
					} else if ((0, _moment2.default)(date).isAfter(this.state.start)) {
						this.setState({ end: (0, _moment2.default)(date) }, function () {
							drawRange(_this2.state.start, _this2.state.end);
						});
					}
				} else {
					(0, _jquery2.default)('.fc-day[data-date=' + (0, _moment2.default)(date).format('YYYY-MM-DD') + ']').addClass('selected start end');
					this.setState({ start: (0, _moment2.default)(date), end: '' });
				}
	
				function drawRange(start, end) {
					var num = end.diff(start, 'days');
					for (var i = 0; i <= num; i++) {
						(0, _jquery2.default)('.fc-day[data-date=' + (0, _moment2.default)(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('selected');
	
						if (i == 0) (0, _jquery2.default)('.fc-day[data-date=' + (0, _moment2.default)(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('start');
						if (i == num) (0, _jquery2.default)('.fc-day[data-date=' + (0, _moment2.default)(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('end');
					}
				}
			}
		}, {
			key: 'handleChange',
			value: function handleChange(e) {
				var obj = {};
				obj[e.target.name] = e.target.value;
				this.setState(obj);
			}
		}, {
			key: 'handleCheckbox',
			value: function handleCheckbox(e) {
				var _this3 = this;
	
				var obj = {};
				if ((0, _jquery2.default)(e.target).hasClass('active')) {
					obj[e.target.dataset.arg] = false;
				} else {
					obj[e.target.dataset.arg] = true;
				}
	
				if (obj.multiday == true || this.state.multiday == true) obj['allday'] = true;
				if (obj.multiday == false || this.state.multiday == false) obj['end'] = '';
				if (obj.allday == true) obj['start'] = (0, _moment2.default)(this.state.start).set({ 'hour': 0, 'minute': 0 });
	
				this.setState(obj, function () {
					if (obj.multiday == false) _this3.setDate(_this3.state.start);
				});
			}
		}, {
			key: 'handleTime',
			value: function handleTime(e) {
				var start = (0, _moment2.default)(this.state.start),
				    end = '',
				    time = Number(e.target.value);
	
				if (this.state.end != '') end = (0, _moment2.default)(this.state.end);
	
				if (e.target.dataset.arg == 'start-hours') start = (0, _moment2.default)(start).set('hour', time);
				if (e.target.dataset.arg == 'start-minutes') start = (0, _moment2.default)(start).set('minute', time);
				if (e.target.dataset.arg == 'end-hours') end = (0, _moment2.default)(end).set('hour', time);
				if (e.target.dataset.arg == 'end-minutes') end = (0, _moment2.default)(end).set('minute', time);
	
				if ((0, _moment2.default)(end).isBefore(start)) return alert('Invalid time');
	
				this.setState({ start: start, end: end });
			}
		}, {
			key: 'handleEndTime',
			value: function handleEndTime(e) {
				var start = this.state.start;
	
				if (this.state.end == '' && this.state.allday == false) {
					this.setState({ end: (0, _moment2.default)(start).add(1, 'hours') });
				} else {
					this.setState({ end: '' });
				}
			}
		}, {
			key: 'handleSubmit',
			value: function handleSubmit(e) {
				var _this4 = this;
	
				e.preventDefault();
	
				if (this.state.title == '') return alert('Please enter a title');
				if (this.state.category == '') return alert('Please supply a category');
	
				this.setState({ loading: true }, function () {
					var ev = _this4.state;
					ev.start = (0, _moment2.default)(ev.start).format('X');
					if (ev.end) ev.end = (0, _moment2.default)(ev.end).format('X');
	
					ev['reason'] = 'create';
	
					_jquery2.default.ajax({
						method: 'POST',
						url: document.baseURI + '/events',
						data: ev,
						dataType: 'json'
					}).done(function (response) {
						_this4.setState({ loading: false }, function () {
							_this4.props.cancelPopup();
							_this4.props.newEvent(response);
						});
					});
				});
			}
		}, {
			key: 'render',
			value: function render() {
				var ev = this.state,
				    hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
				    minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
	
				var startHourList = hours.map(function (hour) {
					return _react2.default.createElement(
						'option',
						{ value: hour, key: 'sh-' + hour },
						hour
					);
				});
	
				var startMinuteList = minutes.map(function (minute) {
					return _react2.default.createElement(
						'option',
						{ value: minute, key: 'sm-' + minute },
						minute
					);
				});
	
				var endHourList = hours.map(function (hour) {
					if (hour >= (0, _moment2.default)(ev.start).format('HH')) {
						return _react2.default.createElement(
							'option',
							{ value: hour, key: 'eh-' + hour },
							hour
						);
					}
				});
	
				var endMinuteList = minutes.map(function (minute) {
					return _react2.default.createElement(
						'option',
						{ value: minute, key: 'em-' + minute },
						minute
					);
				});
	
				var catList = this.props.categories.map(function (cat) {
					return _react2.default.createElement(
						'option',
						{ value: cat.id, key: cat.id },
						cat.name
					);
				});
	
				return _react2.default.createElement(
					'div',
					{ id: 'calendar-create' },
					_react2.default.createElement(
						'header',
						{ className: 'popup-header' },
						_react2.default.createElement(
							'div',
							{ className: 'active' },
							'Add'
						),
						_react2.default.createElement(
							'div',
							{ id: 'close-popup', onClick: this.props.cancelPopup },
							'\xD7'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'popup-body' },
						_react2.default.createElement(
							'form',
							null,
							_react2.default.createElement(
								'div',
								{ className: 'form-row' },
								_react2.default.createElement(
									'label',
									{ htmlFor: 'create-title' },
									'Title'
								),
								_react2.default.createElement('input', { type: 'text', id: 'create-title', name: 'title', value: ev.title, onChange: this.handleChange })
							),
							_react2.default.createElement(
								'div',
								{ className: 'form-row' },
								_react2.default.createElement(
									'label',
									{ htmlFor: 'create-date' },
									'Date'
								),
								_react2.default.createElement(
									'div',
									{ className: 'calendar' },
									_react2.default.createElement('div', { className: 'calendar-popupcal' }),
									_react2.default.createElement(
										'div',
										{ className: 'calendar-options' },
										_react2.default.createElement(
											'label',
											{ className: ev.allday ? 'checkbox active' : 'checkbox', 'data-arg': 'allday', onClick: this.handleCheckbox },
											'All day'
										),
										_react2.default.createElement(
											'label',
											{ className: ev.multiday ? 'checkbox active' : 'checkbox', 'data-arg': 'multiday', onClick: this.handleCheckbox },
											'Date range'
										),
										_react2.default.createElement(
											'label',
											{ className: ev.allday ? 'create-time disabled' : 'create-time', htmlFor: 'create-time-start-hours' },
											'Start time'
										),
										_react2.default.createElement(
											'div',
											{ className: 'set-time' },
											_react2.default.createElement(
												'select',
												{ id: 'create-time-start-hours', onChange: this.handleTime, value: (0, _moment2.default)(ev.start).format('HH'), disabled: ev.allday, 'data-arg': 'start-hours' },
												startHourList
											),
											_react2.default.createElement(
												'select',
												{ id: 'create-time-start-minutes', onChange: this.handleTime, value: (0, _moment2.default)(ev.start).format('mm'), disabled: ev.allday, 'data-arg': 'start-minutes' },
												startMinuteList
											)
										),
										_react2.default.createElement(
											'label',
											{ className: ev.allday ? 'checkbox disabled' : ev.end != '' ? 'checkbox active' : 'checkbox', htmlFor: 'create-time-end-hours', onClick: this.handleEndTime },
											'End time'
										),
										_react2.default.createElement(
											'div',
											{ className: 'set-time' },
											_react2.default.createElement(
												'select',
												{ id: 'create-time-end-hours', onChange: this.handleTime, value: (0, _moment2.default)(ev.end).format('HH'), disabled: ev.allday == true || ev.end == '', 'data-arg': 'end-hours' },
												endHourList
											),
											_react2.default.createElement(
												'select',
												{ id: 'create-time-end-minutes', onChange: this.handleTime, value: (0, _moment2.default)(ev.end).format('mm'), disabled: ev.allday == true || ev.end == '', 'data-arg': 'end-minutes' },
												endMinuteList
											)
										),
										_react2.default.createElement(
											'label',
											{ className: 'create-time', htmlFor: 'create-recursion' },
											'Recursion'
										),
										_react2.default.createElement(
											'div',
											{ className: 'set-time' },
											_react2.default.createElement(
												'select',
												{ id: 'create-recursion', name: 'recursion', value: ev.recursion, onChange: this.handleChange },
												_react2.default.createElement(
													'option',
													{ value: 'once' },
													'Once'
												),
												_react2.default.createElement(
													'option',
													{ value: 'monthly' },
													'Monthly'
												),
												_react2.default.createElement(
													'option',
													{ value: 'yearly' },
													'Yearly'
												)
											)
										)
									)
								)
							),
							_react2.default.createElement(
								'div',
								{ className: 'form-row' },
								_react2.default.createElement(
									'label',
									{ htmlFor: 'create-category' },
									'Category'
								),
								_react2.default.createElement(
									'select',
									{ id: 'create-category', name: 'category', value: ev.category, onChange: this.handleChange },
									_react2.default.createElement(
										'option',
										{ value: '', key: 'empty-cat' },
										' '
									),
									catList
								)
							),
							_react2.default.createElement(
								'div',
								{ className: 'form-row' },
								_react2.default.createElement(
									'label',
									{ htmlFor: 'create-note' },
									'Note'
								),
								_react2.default.createElement('textarea', { id: 'create-note', name: 'note', value: ev.note, onChange: this.handleChange })
							),
							_react2.default.createElement(
								'button',
								{ className: 'button', type: 'submit', onClick: this.handleSubmit },
								'Create'
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: this.state.loading ? 'loading active' : 'loading' },
						_react2.default.createElement('div', { className: 'spinner' })
					)
				);
			}
		}]);
	
		return CalendarCreate;
	}(_react2.default.Component);
	
	exports.default = CalendarCreate;

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9jYWxlbmRhci5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9jYWxlbmRhci1ib2R5LmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvc3JjL2NhbGVuZGFyLWNvbnRyb2xzLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvc3JjL2NhbGVuZGFyLW1vbnRobHkuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9zcmMvY2FsZW5kYXItbW9udGguanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9zcmMvY2FsZW5kYXItc3RyZXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9jYWxlbmRhci13ZWVrLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvc3JjL2NhbGVuZGFyLWRheS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9jYWxlbmRhci1zaWRlYmFyLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvc3JjL2NhbGVuZGFyLWZpbHRlci5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9jYWxlbmRhci1taW5pY2FsLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvc3JjL2NhbGVuZGFyLXllYXJjYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9zcmMvY2FsZW5kYXItZGV0YWlsLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvc3JjL2NhbGVuZGFyLXVwZGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL3NyYy9jYWxlbmRhci1jcmVhdGUuanMiXSwibmFtZXMiOlsiQ2FsZW5kYXIiLCJwcm9wcyIsIm5vdyIsImNvb2tpZVZpZXciLCJsb2FkIiwiY29va2llRmlsdGVyIiwic3RhdGUiLCJkYXRlIiwidmlldyIsImV2ZW50cyIsInF1ZXVlIiwicG9wdXAiLCJhIiwicCIsInVzZXIiLCJtZXNzYWdlIiwibSIsIm8iLCJsb2FkaW5nIiwiZGV0YWlsIiwiY2F0RmlsdGVyIiwiY2F0ZWdvcmllcyIsImZldGNoQ2F0ZWdvcmllcyIsImJpbmQiLCJmZXRjaEV2ZW50cyIsInJlZnJlc2hFdmVudHMiLCJoYW5kbGVFdmVudENoYW5nZSIsImhhbmRsZURhdGUiLCJoYW5kbGVQb3B1cCIsImhhbmRsZURldGFpbCIsImNhbmNlbFBvcHVwIiwiY2FuY2VsUG9wdXBDbGljayIsImNhbmNlbE1lc3NhZ2UiLCJwcmV2ZW50Q2FuY2VsUG9wdXAiLCJ0b2dnbGVGaWx0ZXIiLCJ2aWV3VG9nZ2xlIiwiZG9jdW1lbnQiLCJ0aXRsZSIsInN0YXJ0T2YiLCJmb3JtYXQiLCJlbmRPZiIsIngiLCJsZW5ndGgiLCJhamF4IiwibWV0aG9kIiwidXJsIiwiYmFzZVVSSSIsImRhdGFUeXBlIiwiZG9uZSIsImNhdExpc3QiLCJzb3J0QnkiLCJjYXRlZ29yeUxpc3QiLCJzZXRTdGF0ZSIsIm5ld0V2ZW50cyIsIndlZWsiLCJjYWxsYmFjayIsInN0YXJ0IiwiZW5kIiwic3VidHJhY3QiLCJhZGQiLCJBcnJheSIsImlzQXJyYXkiLCJkYXRhIiwic2V0VGltZW91dCIsImZvckVhY2giLCJldiIsImluZGV4T2YiLCJjYXRlZ29yeSIsIl9pZCIsInZpc2libGUiLCJhbGxkYXkiLCJlIiwicHJldmVudERlZmF1bHQiLCJuZXdEYXRlIiwiaXNvV2Vla2RheSIsImFyZyIsInRhcmdldCIsImlkIiwiY2F0IiwiTnVtYmVyIiwiY2F0SW5kZXgiLCJzcGxpY2UiLCJwdXNoIiwic2F2ZSIsIm5ld1ZpZXciLCJDYWxlbmRhclBvcHVwIiwiQ2FsZW5kYXJNZXNzYWdlIiwibWVzc2FnZUNsYXNzZXMiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJnZXRFbGVtZW50QnlJZCIsIkNhbGVuZGFyQm9keSIsIkNhbGVuZGFyUGVyaW9kIiwic2V0UG9wdXAiLCJzZXREZXRhaWwiLCJzZXREYXRlIiwiaGFuZGxlQXV0aCIsIkNhbGVuZGFyQ29udHJvbHMiLCJoYW5kbGVMb2dvdXQiLCJkYXRhc2V0IiwicHJldiIsIm5leHQiLCJsb2dpbkJ1dHRvbiIsImNyZWF0ZUJ1dHRvbiIsInNldHRpbmdzQnV0dG9uIiwicGVyaW9kVGl0bGUiLCJwZXJpb2ROdW0iLCJwZXJpb2ROYXYiLCJzdHlsZXMiLCJzdGFydFdlZWsiLCJpc1NhbWUiLCJkaXNwbGF5IiwiaGFzQ2xhc3MiLCJDYWxlbmRhck1vbnRobHkiLCJkYXRlcyIsIm5leHRQcm9wcyIsIm9sZERhdGUiLCJpc0VxdWFsIiwicG9zaXRpb24iLCJpc0JlZm9yZSIsImlzQWZ0ZXIiLCJuZXdEYXRlcyIsInJlamVjdCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJtb250aExpc3QiLCJtYXAiLCJpbmRleCIsIm1vbnRoTnVtIiwiQ2FsZW5kYXJNb250aCIsInRoYXQiLCJtb250aElkIiwiY29ycmVjdGVkRXZlbnRzIiwiZnVsbENhbGVuZGFyIiwiZmlyc3REYXkiLCJoZWFkZXIiLCJkYXlOYW1lc1Nob3J0IiwidGltZXpvbmUiLCJmaWx0ZXIiLCJkYXlSZW5kZXIiLCJjZWxsIiwicHJlcGVuZCIsImV2ZW50UmVuZGVyIiwiZXZlbnQiLCJlbGVtZW50IiwiY3NzIiwiY29sb3IiLCJhdHRyIiwidGltZSIsImV2ZW50Q2xpY2siLCJqc0V2ZW50IiwiaGVpZ2h0IiwiQ2FsZW5kYXJTdHJldGNoIiwid2Vla0xpc3QiLCJ3ZWVrTnVtIiwiQ2FsZW5kYXJXZWVrIiwid2Vla2RheXMiLCJuYW1lIiwiY29sdW1uIiwiaGFwcGVuc1RvZGF5IiwiZGF5IiwiaXNCZXR3ZWVuIiwicG9zIiwiaSIsImZpbGwiLCJqIiwid2Vla2RheSIsImFsbGRheXMiLCJzaW5nbGVzIiwiQ2FsZW5kYXJEYXkiLCJjbGlja0RheSIsImNsaWNrRXZlbnQiLCJtb3VzZUVudGVyRXZlbnQiLCJtb3VzZUxlYXZlRXZlbnQiLCJldmVudGlkIiwiZGF5TnVtYmVyIiwibnVtIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ0b3AiLCJjbGFzc2VzIiwiaGlnaGVzdEFsbGRheSIsIm1heCIsImFsbGRheXNIZWlnaHQiLCJ3ZWVrZW5kRGF5IiwiQ2FsZW5kYXJTaWRlYmFyIiwibWluaVZpZXciLCJ2aWV3U3dpdGNoIiwiQ2FsZW5kYXJGaWx0ZXIiLCJDYWxlbmRhck1pbmljYWwiLCJsZWZ0IiwiY2VudGVyIiwicmlnaHQiLCJidXR0b25JY29ucyIsImJ1dHRvblRleHQiLCJkYXlDbGljayIsInBhcmVudCIsImNsaWNrRGF0ZSIsImh0bWwiLCJDYWxlbmRhclllYXJjYWwiLCJ5ZWFyIiwibW9udGgiLCJuYXZZZWFyIiwiY2xpY2tNb250aCIsIm5ld1llYXIiLCJ2aWV3WWVhciIsIkNhbGVuZGFyRGV0YWlsIiwibXVsdGlkYXkiLCJmaXJzdCIsImxhc3QiLCJ1c2VybmFtZSIsInJlY3Vyc2lvbiIsIm5vdGUiLCJzd2l0Y2hWaWV3IiwiY3VycmVudFZpZXciLCJ1cGRhdGVCdXR0b24iLCJkYXRlU3RyaW5nIiwiZHVyYXRpb25TdHJpbmciLCJkaWZmIiwicGFkZGluZ1RvcCIsInRleHRUcmFuc2Zvcm0iLCJhZGRlZCIsImZyb21Ob3ciLCJ1cGRhdGVFdmVudCIsIkNhbGVuZGFyVXBkYXRlIiwiaGFuZGxlQ2hhbmdlIiwiaGFuZGxlQ2hlY2tib3giLCJoYW5kbGVUaW1lIiwiaGFuZGxlRW5kVGltZSIsImhhbmRsZVN1Ym1pdCIsImhhbmRsZVJlbW92ZSIsImRyYXdSYW5nZSIsInZhbHVlIiwic2V0IiwiYWxlcnQiLCJyZXNwb25zZSIsImNvbmZpcm0iLCJob3VycyIsIm1pbnV0ZXMiLCJzdGFydEhvdXJMaXN0IiwiaG91ciIsInN0YXJ0TWludXRlTGlzdCIsIm1pbnV0ZSIsImVuZEhvdXJMaXN0IiwiZW5kTWludXRlTGlzdCIsIkNhbGVuZGFyQ3JlYXRlIiwib2JqIiwibmV3RXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7S0FFTUEsUTs7O0FBRUwsb0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxtSEFFWkEsS0FGWTs7QUFJbEIsT0FBSUMsTUFBTSx1QkFBVjtBQUFBLE9BQ0NDLGFBQWEsc0JBQVlDLElBQVosQ0FBaUIsTUFBakIsS0FBNEIsUUFEMUM7QUFBQSxPQUVDQyxlQUFlLHNCQUFZRCxJQUFaLENBQWlCLFdBQWpCLEtBQWlDLEVBRmpEOztBQUlBRixPQUFJLFVBQUosSUFBa0IsQ0FBbEI7O0FBRUEsU0FBS0ksS0FBTCxHQUFhO0FBQ1pDLFVBQU1MLEdBRE07QUFFWk0sVUFBTUwsVUFGTTtBQUdaTSxZQUFRLEVBSEk7QUFJWkMsV0FBTyxFQUpLO0FBS1pDLFdBQU8sRUFBRUMsR0FBRyxLQUFMLEVBQVlDLEdBQUcsS0FBZixFQUxLO0FBTVpDLFVBQU0sS0FOTTtBQU9aQyxhQUFTLEVBQUVILEdBQUcsS0FBTCxFQUFZSSxHQUFHLEtBQWYsRUFBc0JDLEdBQUcsS0FBekIsRUFQRztBQVFaQyxhQUFTLEtBUkc7QUFTWkMsWUFBUSxLQVRJO0FBVVpDLGVBQVdmLFlBVkM7QUFXWmdCLGdCQUFZO0FBWEEsSUFBYjs7QUFjQSxTQUFLQyxlQUFMLEdBQXVCLE1BQUtBLGVBQUwsQ0FBcUJDLElBQXJCLE9BQXZCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCRCxJQUFqQixPQUFuQjtBQUNBLFNBQUtFLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQkYsSUFBbkIsT0FBckI7QUFDQSxTQUFLRyxpQkFBTCxHQUF5QixNQUFLQSxpQkFBTCxDQUF1QkgsSUFBdkIsT0FBekI7QUFDQSxTQUFLSSxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0JKLElBQWhCLE9BQWxCO0FBQ0EsU0FBS0ssV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCTCxJQUFqQixPQUFuQjtBQUNBLFNBQUtNLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQk4sSUFBbEIsT0FBcEI7QUFDQSxTQUFLTyxXQUFMLEdBQW1CLE1BQUtBLFdBQUwsQ0FBaUJQLElBQWpCLE9BQW5CO0FBQ0EsU0FBS1EsZ0JBQUwsR0FBd0IsTUFBS0EsZ0JBQUwsQ0FBc0JSLElBQXRCLE9BQXhCO0FBQ0EsU0FBS1MsYUFBTCxHQUFxQixNQUFLQSxhQUFMLENBQW1CVCxJQUFuQixPQUFyQjtBQUNBLFNBQUtVLGtCQUFMLEdBQTBCLE1BQUtBLGtCQUFMLENBQXdCVixJQUF4QixPQUExQjtBQUNBLFNBQUtXLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQlgsSUFBbEIsT0FBcEI7QUFDQSxTQUFLWSxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0JaLElBQWhCLE9BQWxCO0FBcENrQjtBQXFDbEI7Ozs7dUNBRW1CO0FBQ25CLFFBQUlyQixNQUFNLHVCQUFWOztBQUVBLFNBQUtvQixlQUFMO0FBQ0EsU0FBS0ssVUFBTCxDQUFnQnpCLEdBQWhCOztBQUVBLFFBQUksS0FBS0ksS0FBTCxDQUFXRSxJQUFYLElBQW1CLFFBQXZCLEVBQWlDO0FBQ2hDNEIsY0FBU0MsS0FBVCxHQUFpQixzQkFBTyxLQUFLL0IsS0FBTCxDQUFXQyxJQUFsQixFQUF3QitCLE9BQXhCLENBQWdDLFNBQWhDLEVBQTJDQyxNQUEzQyxDQUFrRCxHQUFsRCxJQUF5RCxRQUF6RCxHQUFvRSxzQkFBTyxLQUFLakMsS0FBTCxDQUFXQyxJQUFsQixFQUF3QmlDLEtBQXhCLENBQThCLFNBQTlCLEVBQXlDRCxNQUF6QyxDQUFnRCxhQUFoRCxDQUFwRSxHQUFxSSxrQ0FBdEo7QUFDQSxLQUZELE1BRU8sSUFBSSxLQUFLakMsS0FBTCxDQUFXRSxJQUFYLElBQW1CLFNBQXZCLEVBQWtDO0FBQ3hDNEIsY0FBU0MsS0FBVCxHQUFpQixzQkFBTyxLQUFLL0IsS0FBTCxDQUFXQyxJQUFsQixFQUF3QmdDLE1BQXhCLENBQStCLFdBQS9CLElBQThDLGtDQUEvRDtBQUNBO0FBQ0Q7OztxQ0FFaUI7QUFBQTs7QUFDakIsUUFBSUUsSUFBSSxLQUFLbkMsS0FBTCxDQUFXZSxVQUFYLENBQXNCcUIsTUFBOUI7O0FBRUEscUJBQUVDLElBQUYsQ0FBTztBQUNOQyxhQUFRLEtBREY7QUFFTkMsVUFBS1QsU0FBU1UsT0FBVCxHQUFtQix1QkFGbEI7QUFHTkMsZUFBVTtBQUhKLEtBQVAsRUFJR0MsSUFKSCxDQUlRLHdCQUFnQjs7QUFFdkIsU0FBSUMsVUFBVSxxQkFBRUMsTUFBRixDQUFTQyxZQUFULEVBQXVCLE1BQXZCLENBQWQ7O0FBRUEsWUFBS0MsUUFBTCxDQUFjLEVBQUUvQixZQUFZNEIsT0FBZCxFQUFkLEVBQXVDLFlBQU07QUFDNUMsVUFBSVIsSUFBSSxDQUFSLEVBQVc7O0FBRVYsY0FBS2pCLFdBQUwsQ0FBaUIsT0FBS2xCLEtBQUwsQ0FBV0MsSUFBNUIsRUFBa0MscUJBQWE7QUFDOUMsZUFBSzZDLFFBQUwsQ0FBYyxFQUFFbEMsU0FBUyxLQUFYLEVBQWtCVCxRQUFRNEMsU0FBMUIsRUFBZDtBQUNBLFFBRkQ7QUFHQTtBQUNELE1BUEQ7QUFRQSxLQWhCRDtBQWtCQTs7OytCQUVXQyxJLEVBQU1DLFEsRUFBVTtBQUMzQixRQUFJQyxRQUFRLHNCQUFPRixJQUFQLEVBQWFoQixPQUFiLENBQXFCLFNBQXJCLEVBQWdDQyxNQUFoQyxDQUF1QyxHQUF2QyxDQUFaO0FBQUEsUUFDQ2tCLE1BQU0sc0JBQU9ILElBQVAsRUFBYWQsS0FBYixDQUFtQixTQUFuQixFQUE4QkQsTUFBOUIsQ0FBcUMsR0FBckMsQ0FEUDtBQUFBLFFBRUNuQixZQUFZLEtBQUtkLEtBQUwsQ0FBV2MsU0FGeEI7O0FBSUEsUUFBSSxLQUFLZCxLQUFMLENBQVdFLElBQVgsSUFBbUIsU0FBdkIsRUFBa0M7QUFDakNnRCxhQUFRLHNCQUFPRixJQUFQLEVBQWFoQixPQUFiLENBQXFCLE9BQXJCLEVBQThCb0IsUUFBOUIsQ0FBdUMsRUFBdkMsRUFBMkMsTUFBM0MsRUFBbURuQixNQUFuRCxDQUEwRCxHQUExRCxDQUFSO0FBQ0FrQixXQUFNLHNCQUFPSCxJQUFQLEVBQWFkLEtBQWIsQ0FBbUIsT0FBbkIsRUFBNEJtQixHQUE1QixDQUFnQyxFQUFoQyxFQUFvQyxNQUFwQyxFQUE0Q3BCLE1BQTVDLENBQW1ELEdBQW5ELENBQU47QUFDQTs7QUFFRCxTQUFLYSxRQUFMLENBQWMsRUFBRWxDLFNBQVMsSUFBWCxFQUFkLEVBQWlDLFlBQU07O0FBRXRDLHNCQUFFeUIsSUFBRixDQUFPO0FBQ05DLGNBQVEsS0FERjtBQUVOQyxXQUFLVCxTQUFTVSxPQUFULEdBQW1CLGlCQUFuQixHQUF1Q1UsS0FBdkMsR0FBK0MsT0FBL0MsR0FBeURDLEdBRnhEO0FBR05WLGdCQUFVO0FBSEosTUFBUCxFQUlHQyxJQUpILENBSVEsZ0JBQVE7O0FBRWYsVUFBSVksTUFBTUMsT0FBTixDQUFjQyxJQUFkLENBQUosRUFBeUI7O0FBRXhCQyxrQkFBVyxZQUFNOztBQUVoQkQsYUFBS0UsT0FBTCxDQUFhLGNBQU07O0FBRWxCQyxZQUFHLFNBQUgsSUFBZ0IsSUFBaEI7QUFDQSxhQUFJN0MsVUFBVXNCLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0J0QixVQUFVOEMsT0FBVixDQUFrQkQsR0FBR0UsUUFBSCxDQUFZQyxHQUE5QixLQUFzQyxDQUFDLENBQW5FLEVBQXNFSCxHQUFHSSxPQUFILEdBQWEsS0FBYjs7QUFFdEUsYUFBSUosR0FBR0ssTUFBUCxFQUFlO0FBQ2RMLGFBQUdULEtBQUgsR0FBVyxzQkFBT1MsR0FBR1QsS0FBVixFQUFpQixHQUFqQixDQUFYO0FBQ0EsY0FBSVMsR0FBR1IsR0FBUCxFQUFZUSxHQUFHUixHQUFILEdBQVMsc0JBQU9RLEdBQUdSLEdBQVYsRUFBZSxHQUFmLENBQVQ7QUFDWixVQUhELE1BR087QUFDTlEsYUFBR1QsS0FBSCxHQUFXLHNCQUFPUyxHQUFHVCxLQUFWLEVBQWlCLEdBQWpCLEVBQXNCRSxRQUF0QixDQUErQixDQUEvQixFQUFrQyxPQUFsQyxDQUFYO0FBQ0EsY0FBSU8sR0FBR1IsR0FBUCxFQUFZUSxHQUFHUixHQUFILEdBQVMsc0JBQU9RLEdBQUdSLEdBQVYsRUFBZSxHQUFmLEVBQW9CQyxRQUFwQixDQUE2QixDQUE3QixFQUFnQyxPQUFoQyxDQUFUO0FBQ1o7QUFDRCxTQVpEO0FBYUEsUUFmRCxFQWVHLEdBZkg7O0FBaUJBSyxrQkFBVyxZQUFZO0FBQUVSLGlCQUFTTyxJQUFUO0FBQWlCLFFBQTFDLEVBQTRDLEdBQTVDO0FBQ0EsT0FwQkQsTUFvQk87QUFDTkMsa0JBQVcsWUFBWTtBQUFFUixpQkFBUyxFQUFUO0FBQWUsUUFBeEMsRUFBMEMsR0FBMUM7QUFDQTtBQUNELE1BN0JEO0FBOEJBLEtBaENEO0FBa0NBOzs7aUNBRWFnQixDLEVBQUc7QUFBQTs7QUFDaEJBLE1BQUVDLGNBQUY7O0FBRUEsU0FBS2hELFdBQUwsQ0FBaUIsS0FBS2xCLEtBQUwsQ0FBV0MsSUFBNUIsRUFBa0MscUJBQWE7QUFDOUMsWUFBS3lCLGFBQUw7QUFDQSxZQUFLb0IsUUFBTCxDQUFjLEVBQUVsQyxTQUFTLEtBQVgsRUFBa0JULFFBQVE0QyxTQUExQixFQUFkO0FBQ0EsS0FIRDtBQUlBOzs7cUNBRWlCWSxFLEVBQUk7QUFBQTs7QUFDckIsUUFBSXhELFNBQVMsS0FBS0gsS0FBTCxDQUFXRyxNQUF4QjtBQUNBLFNBQUtlLFdBQUwsQ0FBaUIsS0FBS2xCLEtBQUwsQ0FBV0MsSUFBNUIsRUFBa0MscUJBQWE7QUFDOUMsWUFBSzZDLFFBQUwsQ0FBYyxFQUFFbEMsU0FBUyxLQUFYLEVBQWtCVCxRQUFRNEMsU0FBMUIsRUFBZDtBQUNBLEtBRkQ7QUFHQTs7OzhCQUVVb0IsTyxFQUFTO0FBQUE7O0FBRW5CLFFBQUksS0FBS25FLEtBQUwsQ0FBV0UsSUFBWCxJQUFtQixRQUFuQixJQUErQixzQkFBT2lFLE9BQVAsRUFBZ0JDLFVBQWhCLE1BQWdDLENBQW5FLEVBQXNFRCxVQUFVLHNCQUFPQSxPQUFQLEVBQWdCZCxHQUFoQixDQUFvQixDQUFwQixFQUF1QixNQUF2QixDQUFWOztBQUV0RSxTQUFLbkMsV0FBTCxDQUFpQmlELE9BQWpCLEVBQTBCLHFCQUFhO0FBQ3RDLFlBQUtyQixRQUFMLENBQWMsRUFBRWxDLFNBQVMsS0FBWCxFQUFrQlgsTUFBTWtFLE9BQXhCLEVBQWlDaEUsUUFBUTRDLFNBQXpDLEVBQWQsRUFBb0UsWUFBTTs7QUFFekUsVUFBSSxPQUFLL0MsS0FBTCxDQUFXRSxJQUFYLElBQW1CLFFBQXZCLEVBQWlDO0FBQ2hDNEIsZ0JBQVNDLEtBQVQsR0FBaUIsc0JBQU9vQyxPQUFQLEVBQWdCbkMsT0FBaEIsQ0FBd0IsU0FBeEIsRUFBbUNDLE1BQW5DLENBQTBDLEdBQTFDLElBQWlELFFBQWpELEdBQTRELHNCQUFPa0MsT0FBUCxFQUFnQmpDLEtBQWhCLENBQXNCLFNBQXRCLEVBQWlDRCxNQUFqQyxDQUF3QyxhQUF4QyxDQUE1RCxHQUFxSCxrQ0FBdEk7QUFDQSxPQUZELE1BRU8sSUFBSSxPQUFLakMsS0FBTCxDQUFXRSxJQUFYLElBQW1CLFNBQXZCLEVBQWtDO0FBQ3hDNEIsZ0JBQVNDLEtBQVQsR0FBaUIsc0JBQU9vQyxPQUFQLEVBQWdCbEMsTUFBaEIsQ0FBdUIsV0FBdkIsSUFBc0Msa0NBQXZEO0FBQ0E7QUFDRCxNQVBEO0FBUUEsS0FURDtBQVVBOzs7K0JBRVdvQyxHLEVBQUs7QUFDaEIsU0FBS3ZCLFFBQUwsQ0FBYyxFQUFFekMsT0FBTyxFQUFFQyxHQUFHLElBQUwsRUFBV0MsR0FBRzhELEdBQWQsRUFBVCxFQUFkO0FBQ0E7OztnQ0FFWUEsRyxFQUFLO0FBQ2pCLFNBQUt2QixRQUFMLENBQWMsRUFBRWpDLFFBQVF3RCxHQUFWLEVBQWQ7QUFDQTs7O2lDQUVhO0FBQUE7O0FBQ2IsUUFBSWhFLFFBQVEsS0FBS0wsS0FBTCxDQUFXSyxLQUF2QjtBQUNBQSxVQUFNQyxDQUFOLEdBQVUsS0FBVjs7QUFFQSxTQUFLd0MsUUFBTCxDQUFjLEVBQUV6QyxPQUFPQSxLQUFULEVBQWQsRUFBZ0MsWUFBTTs7QUFFckNvRCxnQkFBVyxZQUFNO0FBQ2hCcEQsWUFBTUUsQ0FBTixHQUFVLEtBQVY7O0FBRUEsYUFBS3VDLFFBQUwsQ0FBYyxFQUFFekMsT0FBT0EsS0FBVCxFQUFkLEVBQWdDLFlBQU07QUFDckMsV0FBSSxPQUFLTCxLQUFMLENBQVdTLE9BQVgsQ0FBbUJFLENBQW5CLElBQXdCLFNBQTVCLEVBQXVDLE9BQUtlLGFBQUw7QUFDdkMsT0FGRDtBQUdBLE1BTkQsRUFNRyxDQU5IO0FBT0EsS0FURDtBQVVBOzs7b0NBRWdCdUMsQyxFQUFHO0FBQUE7O0FBQ25CQSxNQUFFQyxjQUFGO0FBQ0EsUUFBSTdELFFBQVEsS0FBS0wsS0FBTCxDQUFXSyxLQUF2Qjs7QUFFQSxRQUFJNEQsRUFBRUssTUFBRixDQUFTQyxFQUFULElBQWUsaUJBQWYsSUFBb0NOLEVBQUVLLE1BQUYsQ0FBU0MsRUFBVCxJQUFlLGFBQXZELEVBQXNFO0FBQ3JFbEUsV0FBTUMsQ0FBTixHQUFVLEtBQVY7O0FBRUEsVUFBS3dDLFFBQUwsQ0FBYyxFQUFFekMsT0FBT0EsS0FBVCxFQUFkLEVBQWdDLFlBQU07O0FBRXJDb0QsaUJBQVcsWUFBTTtBQUNoQnBELGFBQU1FLENBQU4sR0FBVSxLQUFWOztBQUVBLGNBQUt1QyxRQUFMLENBQWMsRUFBRXpDLE9BQU9BLEtBQVQsRUFBZ0JRLFFBQVEsS0FBeEIsRUFBZCxFQUErQyxZQUFNO0FBQ3BELFlBQUksT0FBS2IsS0FBTCxDQUFXUyxPQUFYLENBQW1CRSxDQUFuQixJQUF3QixTQUE1QixFQUF1QztBQUN0QyxnQkFBS2UsYUFBTDtBQUNBO0FBQ0QsUUFKRDtBQUtBLE9BUkQsRUFRRyxHQVJIO0FBU0EsTUFYRDtBQVlBO0FBQ0Q7OztpQ0FFYXVDLEMsRUFBRztBQUFBOztBQUNoQixRQUFJQSxDQUFKLEVBQU9BLEVBQUVDLGNBQUY7QUFDUCxRQUFJekQsVUFBVSxLQUFLVCxLQUFMLENBQVdTLE9BQXpCOztBQUVBQSxZQUFRSCxDQUFSLEdBQVksS0FBWjtBQUNBLFNBQUt3QyxRQUFMLENBQWMsRUFBRXJDLFNBQVNBLE9BQVgsRUFBZCxFQUFvQyxZQUFNO0FBQ3pDZ0QsZ0JBQVcsWUFBTTtBQUNoQmhELGNBQVFDLENBQVIsR0FBWSxLQUFaO0FBQ0FELGNBQVFFLENBQVIsR0FBWSxLQUFaO0FBQ0EsYUFBS21DLFFBQUwsQ0FBYyxFQUFFckMsU0FBU0EsT0FBWCxFQUFvQkwsT0FBTyxFQUEzQixFQUFkO0FBQ0EsTUFKRCxFQUlHLEdBSkg7QUFLQSxLQU5EO0FBT0E7OztzQ0FFa0I2RCxDLEVBQUc7QUFBRUEsTUFBRUMsY0FBRjtBQUFxQjs7O2dDQUVoQ0csRyxFQUFLO0FBQ2pCLFFBQUlHLE1BQU1DLE9BQU9KLEdBQVAsQ0FBVjtBQUFBLFFBQ0N2RCxZQUFZLEtBQUtkLEtBQUwsQ0FBV2MsU0FEeEI7QUFBQSxRQUVDWCxTQUFTLEtBQUtILEtBQUwsQ0FBV0csTUFGckI7QUFBQSxRQUdDdUUsV0FBVzVELFVBQVU4QyxPQUFWLENBQWtCWSxHQUFsQixDQUhaOztBQUtBLFFBQUlFLFdBQVcsQ0FBQyxDQUFoQixFQUFtQjVELFVBQVU2RCxNQUFWLENBQWlCRCxRQUFqQixFQUEyQixDQUEzQjtBQUNuQixRQUFJQSxZQUFZLENBQUMsQ0FBakIsRUFBb0I1RCxVQUFVOEQsSUFBVixDQUFlSixHQUFmO0FBQ3BCLFFBQUlILE9BQU8sT0FBWCxFQUFvQnZELFlBQVksRUFBWjs7QUFFcEJYLFdBQU91RCxPQUFQLENBQWUsY0FBTTtBQUNwQkMsUUFBR0ksT0FBSCxHQUFhLElBQWI7QUFDQSxTQUFJakQsVUFBVXNCLE1BQVYsR0FBbUIsQ0FBbkIsSUFBeUJ0QixVQUFVOEMsT0FBVixDQUFrQkQsR0FBR0UsUUFBSCxDQUFZQyxHQUE5QixLQUFzQyxDQUFDLENBQXBFLEVBQXVFSCxHQUFHSSxPQUFILEdBQWEsS0FBYjtBQUN2RSxLQUhEOztBQUtBLFNBQUtqQixRQUFMLENBQWMsRUFBRWhDLFdBQVdBLFNBQWIsRUFBd0JYLFFBQVFBLE1BQWhDLEVBQWQsRUFBd0QsWUFBTTtBQUM3RCwyQkFBWTBFLElBQVosQ0FBaUIsV0FBakIsRUFBOEIvRCxTQUE5QjtBQUNBLEtBRkQ7QUFHQTs7OzhCQUVVbUQsQyxFQUFHO0FBQUE7O0FBQ2JBLE1BQUVDLGNBQUY7QUFDQSxRQUFJakUsT0FBTyxLQUFLRCxLQUFMLENBQVdDLElBQXRCO0FBQUEsUUFBNEI2RSxVQUFVLFFBQXRDOztBQUVBLFFBQUksS0FBSzlFLEtBQUwsQ0FBV0UsSUFBWCxJQUFtQixRQUF2QixFQUFpQzRFLFVBQVUsU0FBVjs7QUFFakMsU0FBS2hDLFFBQUwsQ0FBYyxFQUFFNUMsTUFBTTRFLE9BQVIsRUFBZCxFQUFpQyxZQUFNO0FBQ3RDLFlBQUt6RCxVQUFMLENBQWdCcEIsSUFBaEI7QUFDQSwyQkFBWTRFLElBQVosQ0FBaUIsTUFBakIsRUFBeUJDLE9BQXpCO0FBQ0EsS0FIRDtBQUlBOzs7NEJBRVE7QUFDUixRQUFJQyxzQkFBSjs7QUFFQSxRQUFJLEtBQUsvRSxLQUFMLENBQVdLLEtBQVgsQ0FBaUJFLENBQWpCLElBQXNCLFFBQTFCLEVBQW9Dd0UsZ0JBQWdCO0FBQ25ELFdBQU0sS0FBSy9FLEtBQUwsQ0FBV1EsSUFEa0M7QUFFbkQsYUFBUSxLQUFLUixLQUFMLENBQVdhLE1BRmdDO0FBR25ELGlCQUFZLEtBQUtiLEtBQUwsQ0FBV2UsVUFINEI7QUFJbkQsa0JBQWEsS0FBS1MsV0FKaUM7QUFLbkQsa0JBQWEsS0FBS0osaUJBTGlDLEdBQWhCOztBQU9wQyxRQUFJLEtBQUtwQixLQUFMLENBQVdLLEtBQVgsQ0FBaUJFLENBQWpCLElBQXNCLFFBQTFCLEVBQW9Dd0UsZ0JBQWdCO0FBQ25ELFdBQU0sS0FBSy9FLEtBQUwsQ0FBV1EsSUFEa0M7QUFFbkQsa0JBQWEsS0FBS2dCLFdBRmlDO0FBR25ELGlCQUFZLEtBQUt4QixLQUFMLENBQVdlLFVBSDRCO0FBSW5ELGVBQVUsS0FBS0ssaUJBSm9DLEdBQWhCOztBQU1wQyxRQUFJNEQsZUFBSjtBQUFBLFFBQXFCQyxpQkFBaUIsbUJBQXRDO0FBQ0EsUUFBSSxLQUFLakYsS0FBTCxDQUFXUyxPQUFYLENBQW1CQyxDQUF2QixFQUEwQjtBQUN6QnNFLHVCQUNDO0FBQUE7QUFBQTtBQUNDO0FBQUE7QUFBQSxTQUFNLFdBQVUsU0FBaEI7QUFBMkIsWUFBS2hGLEtBQUwsQ0FBV1MsT0FBWCxDQUFtQkM7QUFBOUMsT0FERDtBQUVDO0FBQUE7QUFBQSxTQUFHLE1BQUssRUFBUixFQUFXLFdBQVUsT0FBckIsRUFBNkIsU0FBUyxLQUFLZ0IsYUFBM0M7QUFBQTtBQUFBO0FBRkQsTUFERDtBQU1BdUQsc0JBQWlCQSxpQkFBaUIsS0FBS2pGLEtBQUwsQ0FBV1MsT0FBWCxDQUFtQkUsQ0FBckQ7QUFDQTs7QUFFRCxXQUNDO0FBQUE7QUFBQSxPQUFLLElBQUcsa0JBQVIsRUFBMkIsV0FBVyxLQUFLWCxLQUFMLENBQVdTLE9BQVgsQ0FBbUJILENBQW5CLEdBQXVCLFNBQXZCLEdBQW1DLEVBQXpFO0FBRUM7QUFDQyxZQUFNLEtBQUtOLEtBQUwsQ0FBV0MsSUFEbEI7QUFFQyxZQUFNLEtBQUtELEtBQUwsQ0FBV0UsSUFGbEI7QUFHQyxpQkFBVyxLQUFLRixLQUFMLENBQVdjLFNBSHZCO0FBSUMsa0JBQVksS0FBS2QsS0FBTCxDQUFXZSxVQUp4QjtBQUtDLG9CQUFjLEtBQUthLFlBTHBCO0FBTUMsZUFBUyxLQUFLUCxVQU5mO0FBT0Msa0JBQVksS0FBS1EsVUFQbEIsR0FGRDtBQVdDO0FBQ0MsWUFBTSxLQUFLN0IsS0FBTCxDQUFXQyxJQURsQjtBQUVDLFlBQU0sS0FBS0QsS0FBTCxDQUFXRSxJQUZsQjtBQUdDLGNBQVEsS0FBS0YsS0FBTCxDQUFXRyxNQUhwQjtBQUlDLGVBQVMsS0FBS0gsS0FBTCxDQUFXWSxPQUpyQjtBQUtDLFlBQU0sS0FBS1osS0FBTCxDQUFXUSxJQUxsQjtBQU1DLGVBQVMsS0FBS2EsVUFOZjtBQU9DLGdCQUFVLEtBQUtDLFdBUGhCO0FBUUMsaUJBQVcsS0FBS0MsWUFSakIsR0FYRDtBQXFCQztBQUFBO0FBQUEsUUFBSyxJQUFHLGlCQUFSLEVBQTBCLFNBQVMsS0FBS0UsZ0JBQXhDLEVBQTBELFdBQVcsS0FBS3pCLEtBQUwsQ0FBV0ssS0FBWCxDQUFpQkMsQ0FBakIsR0FBcUIsUUFBckIsR0FBZ0MsRUFBckc7QUFDQztBQUFBO0FBQUEsU0FBSyxXQUFXLG9CQUFvQixLQUFLTixLQUFMLENBQVdLLEtBQVgsQ0FBaUJFLENBQXJELEVBQXdELFNBQVMsS0FBS29CLGtCQUF0RTtBQUNFb0Q7QUFERjtBQURELE1BckJEO0FBMkJDO0FBQUE7QUFBQSxRQUFLLFdBQVcsS0FBSy9FLEtBQUwsQ0FBV1MsT0FBWCxDQUFtQkgsQ0FBbkIsR0FBdUIyRSxpQkFBaUIsU0FBeEMsR0FBb0RBLGNBQXBFO0FBQ0VEO0FBREY7QUEzQkQsS0FERDtBQWlDQTs7OztHQXJUcUIsZ0JBQU1FLFM7O0FBd1Q3QixvQkFBU0MsTUFBVCxDQUFnQiw4QkFBQyxRQUFELE9BQWhCLEVBQThCckQsU0FBU3NELGNBQVQsQ0FBd0IsVUFBeEIsQ0FBOUIsRTs7Ozs7Ozs7Ozs7Ozs7OztBQ3BVQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0tBRXFCQyxZOzs7Ozs7Ozs7Ozs0QkFFWDtBQUNSLFFBQUlDLHVCQUFKO0FBQ0EsUUFBSSxLQUFLM0YsS0FBTCxDQUFXTyxJQUFYLElBQW1CLFFBQXZCLEVBQWlDOztBQUVoQ29GLHNCQUNDO0FBQ0MsZUFBUyxLQUFLM0YsS0FBTCxDQUFXaUIsT0FEckI7QUFFQyxZQUFNLEtBQUtqQixLQUFMLENBQVdNLElBRmxCO0FBR0MsY0FBUSxLQUFLTixLQUFMLENBQVdRLE1BSHBCO0FBSUMsZ0JBQVUsS0FBS1IsS0FBTCxDQUFXNEYsUUFKdEI7QUFLQyxpQkFBVyxLQUFLNUYsS0FBTCxDQUFXNkYsU0FMdkIsR0FERDtBQVNBLEtBWEQsTUFXTyxJQUFJLEtBQUs3RixLQUFMLENBQVdPLElBQVgsSUFBbUIsU0FBdkIsRUFBa0M7O0FBRXhDb0Ysc0JBQ0M7QUFDQyxlQUFTLEtBQUszRixLQUFMLENBQVdpQixPQURyQjtBQUVDLFlBQU0sS0FBS2pCLEtBQUwsQ0FBV00sSUFGbEI7QUFHQyxjQUFRLEtBQUtOLEtBQUwsQ0FBV1EsTUFIcEI7QUFJQyxnQkFBVSxLQUFLUixLQUFMLENBQVc0RixRQUp0QjtBQUtDLGlCQUFXLEtBQUs1RixLQUFMLENBQVc2RixTQUx2QixHQUREO0FBU0E7O0FBRUQsV0FDQztBQUFBO0FBQUEsT0FBUyxJQUFHLGVBQVo7QUFDQztBQUNDLFlBQU0sS0FBSzdGLEtBQUwsQ0FBV00sSUFEbEI7QUFFQyxZQUFNLEtBQUtOLEtBQUwsQ0FBV08sSUFGbEI7QUFHQyxZQUFNLEtBQUtQLEtBQUwsQ0FBV2EsSUFIbEI7QUFJQyxlQUFTLEtBQUtiLEtBQUwsQ0FBVzhGLE9BSnJCO0FBS0MsZ0JBQVUsS0FBSzlGLEtBQUwsQ0FBVzRGLFFBTHRCO0FBTUMsa0JBQVksS0FBSzVGLEtBQUwsQ0FBVytGLFVBTnhCLEdBREQ7QUFTRUo7QUFURixLQUREO0FBYUE7Ozs7R0F6Q3dDLGdCQUFNSixTOzttQkFBM0JHLFk7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOckI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7S0FFcUJNLGdCOzs7QUFDcEIsNEJBQVloRyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsbUlBQ1pBLEtBRFk7O0FBR2xCLFNBQUs4RixPQUFMLEdBQWUsTUFBS0EsT0FBTCxDQUFheEUsSUFBYixPQUFmO0FBQ0EsU0FBS3NFLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjdEUsSUFBZCxPQUFoQjtBQUNBLFNBQUsyRSxZQUFMLEdBQW9CLE1BQUtBLFlBQUwsQ0FBa0IzRSxJQUFsQixPQUFwQjtBQUxrQjtBQU1sQjs7OzsyQkFFT2dELEMsRUFBRztBQUNWQSxNQUFFQyxjQUFGO0FBQ0EsU0FBS3ZFLEtBQUwsQ0FBVzhGLE9BQVgsQ0FBbUIsc0JBQU94QixFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCNUYsSUFBeEIsRUFBOEIsWUFBOUIsQ0FBbkI7QUFDQTs7OzRCQUVRZ0UsQyxFQUFHO0FBQ1hBLE1BQUVDLGNBQUY7QUFDQSxTQUFLdkUsS0FBTCxDQUFXNEYsUUFBWCxDQUFvQnRCLEVBQUVLLE1BQUYsQ0FBU3VCLE9BQVQsQ0FBaUJ4QixHQUFyQztBQUNBOzs7Z0NBRVlKLEMsRUFBRztBQUNmQSxNQUFFQyxjQUFGO0FBQ0EsU0FBS3ZFLEtBQUwsQ0FBVytGLFVBQVgsQ0FBc0IsUUFBdEI7QUFDQTs7OzRCQUVRO0FBQ1IsUUFBSUksYUFBSjtBQUFBLFFBQVVDLGFBQVY7QUFBQSxRQUFnQm5HLE1BQU0sd0JBQVNxQyxNQUFULENBQWdCLFlBQWhCLENBQXRCO0FBQUEsUUFDQytELG9CQUREO0FBQUEsUUFDY0MscUJBRGQ7QUFBQSxRQUM0QkMsdUJBRDVCO0FBQUEsUUFFQ0Msb0JBRkQ7QUFBQSxRQUVjQyxrQkFGZDtBQUFBLFFBRXlCQyxrQkFGekI7QUFBQSxRQUdDQyxlQUhEOztBQUtBLFFBQUksS0FBSzNHLEtBQUwsQ0FBV08sSUFBWCxJQUFtQixRQUF2QixFQUFpQztBQUNoQyxTQUFJcUcsWUFBWSxzQkFBTyxLQUFLNUcsS0FBTCxDQUFXTSxJQUFsQixFQUF3QitCLE9BQXhCLENBQWdDLFNBQWhDLENBQWhCO0FBQUEsU0FDQytELFFBQU8sc0JBQU8sS0FBS3BHLEtBQUwsQ0FBV00sSUFBbEIsRUFBd0JvRCxHQUF4QixDQUE0QixDQUE1QixFQUErQixNQUEvQixFQUF1Q3BCLE1BQXZDLENBQThDLFlBQTlDLENBRFI7QUFBQSxTQUVDNkQsUUFBTyxzQkFBTyxLQUFLbkcsS0FBTCxDQUFXTSxJQUFsQixFQUF3Qm1ELFFBQXhCLENBQWlDLENBQWpDLEVBQW9DLE1BQXBDLEVBQTRDbkIsTUFBNUMsQ0FBbUQsWUFBbkQsQ0FGUjs7QUFJQWtFLG1CQUNDO0FBQUE7QUFBQTtBQUFLLDRCQUFPLEtBQUt4RyxLQUFMLENBQVdNLElBQWxCLEVBQXdCK0IsT0FBeEIsQ0FBZ0MsU0FBaEMsRUFBMkNDLE1BQTNDLENBQWtELEdBQWxELElBQXlELFVBQXpELEdBQXNFLHNCQUFPLEtBQUt0QyxLQUFMLENBQVdNLElBQWxCLEVBQXdCaUMsS0FBeEIsQ0FBOEIsU0FBOUIsRUFBeUNELE1BQXpDLENBQWdELFlBQWhEO0FBQTNFLE1BREQ7O0FBSUFtRSxpQkFDQztBQUFBO0FBQUEsUUFBTSxXQUFVLFlBQWhCLEVBQTZCLE9BQU8sVUFBVSxzQkFBTyxLQUFLekcsS0FBTCxDQUFXTSxJQUFsQixFQUF3QmdDLE1BQXhCLENBQStCLEdBQS9CLENBQTlDO0FBQ0M7QUFBQTtBQUFBO0FBQVMsNkJBQU8sS0FBS3RDLEtBQUwsQ0FBV00sSUFBbEIsRUFBd0JnQyxNQUF4QixDQUErQixHQUEvQjtBQUFUO0FBREQsTUFERDs7QUFNQW9FLGlCQUNDO0FBQUE7QUFBQTtBQUNDO0FBQUE7QUFBQSxTQUFHLE1BQUssRUFBUixFQUFXLFNBQVMsS0FBS1osT0FBekIsRUFBa0MsV0FBVSxxQkFBNUMsRUFBa0UsYUFBV0ssS0FBN0UsRUFBbUYsT0FBTyxnQkFBZ0Isc0JBQU8sS0FBS25HLEtBQUwsQ0FBV00sSUFBbEIsRUFBd0JtRCxRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxPQUFwQyxFQUE2Q25CLE1BQTdDLENBQW9ELEdBQXBELENBQTFHO0FBQUE7QUFBQSxPQUREO0FBRUVrRSxpQkFGRjtBQUFBO0FBRWdCQyxlQUZoQjtBQUdDO0FBQUE7QUFBQSxTQUFHLE1BQUssRUFBUixFQUFXLFNBQVMsS0FBS1gsT0FBekIsRUFBa0MsV0FBVSxxQkFBNUMsRUFBa0UsYUFBV00sS0FBN0UsRUFBbUYsT0FBTyxnQkFBZ0Isc0JBQU8sS0FBS3BHLEtBQUwsQ0FBV00sSUFBbEIsRUFBd0JvRCxHQUF4QixDQUE0QixDQUE1QixFQUErQixPQUEvQixFQUF3Q3BCLE1BQXhDLENBQStDLEdBQS9DLENBQTFHO0FBQUE7QUFBQTtBQUhELE1BREQ7O0FBUUEsU0FBSSx3QkFBU0QsT0FBVCxDQUFpQixTQUFqQixFQUE0QndFLE1BQTVCLENBQW1DRCxTQUFuQyxFQUE4QyxNQUE5QyxDQUFKLEVBQTJERCxTQUFTLEVBQUVHLFNBQVMsTUFBWCxFQUFUO0FBRTNELEtBekJELE1BeUJPLElBQUksS0FBSzlHLEtBQUwsQ0FBV08sSUFBWCxJQUFtQixTQUF2QixFQUFrQzs7QUFFeEMsU0FBSTZGLFNBQU8sc0JBQU8sS0FBS3BHLEtBQUwsQ0FBV00sSUFBbEIsRUFBd0JvRCxHQUF4QixDQUE0QixDQUE1QixFQUErQixRQUEvQixFQUF5Q3BCLE1BQXpDLENBQWdELFlBQWhELENBQVg7QUFBQSxTQUNDNkQsU0FBTyxzQkFBTyxLQUFLbkcsS0FBTCxDQUFXTSxJQUFsQixFQUF3Qm1ELFFBQXhCLENBQWlDLENBQWpDLEVBQW9DLFFBQXBDLEVBQThDbkIsTUFBOUMsQ0FBcUQsWUFBckQsQ0FEUjs7QUFHQWtFLG1CQUFjO0FBQUE7QUFBQTtBQUFLLDRCQUFPLEtBQUt4RyxLQUFMLENBQVdNLElBQWxCLEVBQXdCZ0MsTUFBeEIsQ0FBK0IsV0FBL0I7QUFBTCxNQUFkOztBQUVBb0UsaUJBQ0M7QUFBQTtBQUFBLFFBQUssV0FBVSxZQUFmO0FBQ0M7QUFBQTtBQUFBLFNBQUcsTUFBSyxFQUFSLEVBQVcsU0FBUyxLQUFLWixPQUF6QixFQUFrQyxXQUFVLHFCQUE1QyxFQUFrRSxhQUFXSyxNQUE3RSxFQUFtRixPQUFPLFdBQVcsc0JBQU8sS0FBS25HLEtBQUwsQ0FBV00sSUFBbEIsRUFBd0JtRCxRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxRQUFwQyxFQUE4Q25CLE1BQTlDLENBQXFELFdBQXJELENBQXJHO0FBQUE7QUFBQSxPQUREO0FBRUVrRSxpQkFGRjtBQUFBO0FBRWdCQyxlQUZoQjtBQUdDO0FBQUE7QUFBQSxTQUFHLE1BQUssRUFBUixFQUFXLFNBQVMsS0FBS1gsT0FBekIsRUFBa0MsV0FBVSxxQkFBNUMsRUFBa0UsYUFBV00sTUFBN0UsRUFBbUYsT0FBTyxXQUFXLHNCQUFPLEtBQUtwRyxLQUFMLENBQVdNLElBQWxCLEVBQXdCb0QsR0FBeEIsQ0FBNEIsQ0FBNUIsRUFBK0IsUUFBL0IsRUFBeUNwQixNQUF6QyxDQUFnRCxXQUFoRCxDQUFyRztBQUFBO0FBQUE7QUFIRCxNQUREOztBQVFBLFNBQUksd0JBQVN1RSxNQUFULENBQWdCLEtBQUs3RyxLQUFMLENBQVdNLElBQTNCLEVBQWlDLE9BQWpDLENBQUosRUFBK0NxRyxTQUFTLEVBQUVHLFNBQVMsTUFBWCxFQUFUO0FBQy9DOztBQUdELFFBQUksQ0FBQyxLQUFLOUcsS0FBTCxDQUFXYSxJQUFoQixFQUFzQndGLGNBQWM7QUFBQTtBQUFBLE9BQUcsTUFBSyxFQUFSLEVBQVcsV0FBVSxRQUFyQixFQUE4QixTQUFTLEtBQUtULFFBQTVDLEVBQXNELFlBQVMsT0FBL0Q7QUFBQTtBQUFBLEtBQWQ7QUFDdEIsUUFBSSxLQUFLNUYsS0FBTCxDQUFXYSxJQUFmLEVBQXFCd0YsY0FBYztBQUFBO0FBQUEsT0FBRyxNQUFLLEVBQVIsRUFBVyxXQUFVLFFBQXJCLEVBQThCLFNBQVMsS0FBS0osWUFBNUM7QUFBQTtBQUFBLEtBQWQ7QUFDckIsUUFBSSxzQkFBRSxjQUFGLEVBQWtCYyxRQUFsQixDQUEyQixXQUEzQixDQUFKLEVBQTZDVCxlQUFlO0FBQUE7QUFBQSxPQUFHLE1BQUssRUFBUixFQUFXLFdBQVUsUUFBckIsRUFBOEIsU0FBUyxLQUFLVixRQUE1QyxFQUFzRCxZQUFTLFFBQS9EO0FBQUE7QUFBQSxLQUFmOztBQUU3QyxXQUNDO0FBQUE7QUFBQSxPQUFRLElBQUcsbUJBQVg7QUFFQztBQUFBO0FBQUEsUUFBSyxXQUFVLFlBQWY7QUFDRWM7QUFERixNQUZEO0FBTUM7QUFBQTtBQUFBLFFBQUssV0FBVSxnQkFBZjtBQUNDO0FBQUE7QUFBQSxTQUFHLE1BQUssRUFBUixFQUFXLFdBQVUsY0FBckIsRUFBb0MsU0FBUyxLQUFLWixPQUFsRCxFQUEyRCxhQUFXN0YsR0FBdEUsRUFBMkUsT0FBTzBHLE1BQWxGO0FBQUE7QUFBQSxPQUREO0FBRUVMLGtCQUZGO0FBR0VDO0FBSEY7QUFORCxLQUREO0FBY0E7Ozs7R0E1RjRDLGdCQUFNaEIsUzs7bUJBQS9CUyxnQjs7Ozs7Ozs7Ozs7Ozs7OztBQ0pyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7Ozs7S0FFcUJnQixlOzs7QUFFcEIsMkJBQVloSCxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsaUlBQ1pBLEtBRFk7O0FBR2xCLFNBQUtLLEtBQUwsR0FBYTtBQUNaNEcsV0FBTyxFQURLO0FBRVp6RyxZQUFRO0FBRkksSUFBYjtBQUhrQjtBQU9sQjs7Ozs2Q0FFeUIwRyxTLEVBQVc7QUFBQTs7QUFDcEMsUUFBSUQsUUFBUSxLQUFLNUcsS0FBTCxDQUFXNEcsS0FBdkI7QUFBQSxRQUNDRSxVQUFVLEtBQUtuSCxLQUFMLENBQVdNLElBRHRCO0FBQUEsUUFFQ2tFLFVBQVUwQyxVQUFVNUcsSUFGckI7O0FBSUEsUUFBSSxxQkFBRThHLE9BQUYsQ0FBVUQsT0FBVixFQUFtQjNDLE9BQW5CLEtBQStCLEtBQUt4RSxLQUFMLENBQVdRLE1BQVgsSUFBcUIwRyxVQUFVMUcsTUFBbEUsRUFBMEU7O0FBRTFFLFFBQUksc0JBQU9nRSxPQUFQLEVBQWdCcUMsTUFBaEIsQ0FBdUJNLE9BQXZCLEVBQWdDLE9BQWhDLENBQUosRUFBOEM7QUFDN0MzQyxhQUFRNkMsUUFBUixHQUFtQixhQUFuQjtBQUNBLEtBRkQsTUFFTyxJQUFJLHNCQUFPN0MsT0FBUCxFQUFnQjhDLFFBQWhCLENBQXlCSCxPQUF6QixDQUFKLEVBQXVDO0FBQzdDM0MsYUFBUTZDLFFBQVIsR0FBbUIsV0FBbkI7QUFDQSxLQUZNLE1BRUEsSUFBSSxzQkFBTzdDLE9BQVAsRUFBZ0IrQyxPQUFoQixDQUF3QkosT0FBeEIsQ0FBSixFQUFzQztBQUM1QzNDLGFBQVE2QyxRQUFSLEdBQW1CLFlBQW5CO0FBQ0E7O0FBRURKLFVBQU1oQyxJQUFOLENBQVdULE9BQVg7QUFDQSxTQUFLckIsUUFBTCxDQUFjLEVBQUU4RCxPQUFPQSxLQUFULEVBQWQsRUFBZ0MsWUFBTTs7QUFFckMsU0FBSSxzQkFBT0UsT0FBUCxFQUFnQk4sTUFBaEIsQ0FBdUJyQyxPQUF2QixFQUFnQyxPQUFoQyxDQUFKLEVBQThDO0FBQzdDLFVBQUlnRCxXQUFXLHFCQUFFQyxNQUFGLENBQVMsT0FBS3BILEtBQUwsQ0FBVzRHLEtBQXBCLEVBQTJCLGdCQUFRO0FBQ2pELGNBQU8zRyxLQUFLK0csUUFBTCxJQUFpQixDQUF4QjtBQUNBLE9BRmMsQ0FBZjtBQUdBLGFBQUtsRSxRQUFMLENBQWMsRUFBRThELE9BQU9PLFFBQVQsRUFBZDtBQUNBO0FBQ0E7O0FBRUQxRCxnQkFBVyxZQUFNO0FBQ2hCLFVBQUksc0JBQU9VLE9BQVAsRUFBZ0I4QyxRQUFoQixDQUF5QkgsT0FBekIsQ0FBSixFQUF1QztBQUN0Qyw2QkFBRSxxQkFBb0Isc0JBQU9BLE9BQVAsRUFBZ0I3RSxNQUFoQixDQUF1QixTQUF2QixDQUF0QixFQUF5RG9GLFFBQXpELENBQWtFLFdBQWxFO0FBQ0EsNkJBQUUscUJBQW9CLHNCQUFPbEQsT0FBUCxFQUFnQmxDLE1BQWhCLENBQXVCLFNBQXZCLENBQXRCLEVBQXlEcUYsV0FBekQsQ0FBcUUsdUNBQXJFO0FBQ0E7QUFDRCxVQUFJLHNCQUFPbkQsT0FBUCxFQUFnQitDLE9BQWhCLENBQXdCSixPQUF4QixDQUFKLEVBQXNDO0FBQ3JDLDZCQUFFLHFCQUFvQixzQkFBT0EsT0FBUCxFQUFnQjdFLE1BQWhCLENBQXVCLFNBQXZCLENBQXRCLEVBQXlEb0YsUUFBekQsQ0FBa0UsVUFBbEU7QUFDQSw2QkFBRSxxQkFBb0Isc0JBQU9sRCxPQUFQLEVBQWdCbEMsTUFBaEIsQ0FBdUIsU0FBdkIsQ0FBdEIsRUFBeURxRixXQUF6RCxDQUFxRSx1Q0FBckU7QUFDQTtBQUNELE1BVEQsRUFTRyxDQVRIOztBQVdBN0QsZ0JBQVcsWUFBTTtBQUNoQixVQUFJMEQsV0FBVyxxQkFBRUMsTUFBRixDQUFTLE9BQUtwSCxLQUFMLENBQVc0RyxLQUFwQixFQUEyQixnQkFBUTtBQUNqRCxjQUFPLHNCQUFPRSxPQUFQLEVBQWdCTixNQUFoQixDQUF1QnZHLElBQXZCLEVBQTZCLE9BQTdCLENBQVA7QUFDQSxPQUZjLENBQWY7QUFHQSxhQUFLNkMsUUFBTCxDQUFjLEVBQUU4RCxPQUFPTyxRQUFULEVBQWQ7QUFDQSxNQUxELEVBS0csR0FMSDtBQU1BLEtBM0JEO0FBNEJBOzs7NEJBRVE7QUFBQTs7QUFDUixRQUFJSSxZQUFZLEtBQUt2SCxLQUFMLENBQVc0RyxLQUFYLENBQWlCWSxHQUFqQixDQUFxQixVQUFDdkgsSUFBRCxFQUFPd0gsS0FBUCxFQUFpQjtBQUNyRCxTQUFJQyxXQUFXLHNCQUFPekgsSUFBUCxFQUFhZ0MsTUFBYixDQUFvQixTQUFwQixDQUFmOztBQUVBLFlBQ0M7QUFDQyxZQUFNaEMsSUFEUDtBQUVDLGNBQVEsT0FBS04sS0FBTCxDQUFXUSxNQUZwQjtBQUdDLFdBQUt1SCxRQUhOO0FBSUMsZ0JBQVUsT0FBSy9ILEtBQUwsQ0FBVzRGLFFBSnRCO0FBS0MsaUJBQVcsT0FBSzVGLEtBQUwsQ0FBVzZGLFNBTHZCLEdBREQ7QUFRQSxLQVhlLENBQWhCOztBQWFBLFdBQ0M7QUFBQTtBQUFBLE9BQUssSUFBRyxrQkFBUjtBQUNFK0IsY0FERjtBQUVDO0FBQUE7QUFBQSxRQUFLLFdBQVcsS0FBSzVILEtBQUwsQ0FBV2lCLE9BQVgsR0FBcUIsZUFBckIsR0FBdUMsUUFBdkQ7QUFDQyw2Q0FBSyxXQUFVLFNBQWY7QUFERDtBQUZELEtBREQ7QUFRQTs7OztHQS9FMkMsZ0JBQU1zRSxTOzttQkFBOUJ5QixlOzs7Ozs7Ozs7Ozs7Ozs7O0FDUHJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztLQUVxQmdCLGE7Ozs7Ozs7Ozs7O3VDQUVBO0FBQ25CLFFBQUlDLE9BQU8sSUFBWDtBQUFBLFFBQWlCQyxVQUFVLHNCQUFPLEtBQUtsSSxLQUFMLENBQVdNLElBQWxCLEVBQXdCZ0MsTUFBeEIsQ0FBK0IsU0FBL0IsQ0FBM0I7QUFBQSxRQUFzRXJDLE1BQU0sdUJBQTVFOztBQUVBLFFBQUlrSSxrQkFBa0IsS0FBS25JLEtBQUwsQ0FBV1EsTUFBakM7QUFDQTJILG9CQUFnQnBFLE9BQWhCLENBQXdCLGNBQU07QUFDN0IsU0FBSUMsR0FBR0ssTUFBSCxJQUFhTCxHQUFHUixHQUFwQixFQUF5QlEsR0FBR1IsR0FBSCxHQUFTLHNCQUFPUSxHQUFHUixHQUFWLEVBQWVFLEdBQWYsQ0FBbUIsQ0FBbkIsRUFBc0IsTUFBdEIsRUFBOEJwQixNQUE5QixFQUFUO0FBQ3pCLFNBQUksQ0FBQzBCLEdBQUdLLE1BQVIsRUFBZ0I7QUFDZkwsU0FBR1QsS0FBSCxHQUFXUyxHQUFHVCxLQUFILEdBQVcsc0JBQU9TLEdBQUdULEtBQVYsRUFBaUJqQixNQUFqQixFQUF0QjtBQUNBLFVBQUkwQixHQUFHUixHQUFQLEVBQVlRLEdBQUdSLEdBQUgsR0FBU1EsR0FBR1IsR0FBSCxHQUFTLHNCQUFPUSxHQUFHUixHQUFWLEVBQWVsQixNQUFmLEVBQWxCO0FBQ1o7QUFDRCxLQU5EOztBQVFBLDBCQUFFLE1BQU00RixPQUFSLEVBQWlCRSxZQUFqQixDQUE4QjtBQUM3QkMsZUFBVSxDQURtQjtBQUU3QkMsYUFBUSxLQUZxQjtBQUc3QkMsb0JBQWUsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsS0FBN0IsRUFBb0MsS0FBcEMsRUFBMkMsS0FBM0MsQ0FIYztBQUk3Qi9ILFdBSjZCLGtCQUl0QitDLEtBSnNCLEVBSWZDLEdBSmUsRUFJVmdGLFFBSlUsRUFJQWxGLFFBSkEsRUFJVTtBQUN0QyxVQUFJOUMsU0FBUyxxQkFBRWlJLE1BQUYsQ0FBU04sZUFBVCxFQUEwQixVQUFVbkUsRUFBVixFQUFjO0FBQUUsY0FBT0EsR0FBR0ksT0FBVjtBQUFvQixPQUE5RCxDQUFiO0FBQ0FkLGVBQVM5QyxNQUFUO0FBQ0EsTUFQNEI7QUFRN0JrSSxjQVI2QixxQkFRbkJwSSxJQVJtQixFQVFicUksSUFSYSxFQVFQO0FBQ3JCLDRCQUFFQSxJQUFGLEVBQVFDLE9BQVIsQ0FBZ0IsNkJBQWhCO0FBQ0EsTUFWNEI7QUFXN0JDLGdCQVg2Qix1QkFXakJDLEtBWGlCLEVBV1ZDLE9BWFUsRUFXRDtBQUMzQixVQUFJRCxNQUFNekUsTUFBVixFQUFrQjtBQUNqQiw2QkFBRTBFLE9BQUYsRUFBV3JCLFFBQVgsQ0FBb0IsUUFBcEI7QUFDQSw2QkFBRXFCLE9BQUYsRUFBV0MsR0FBWCxDQUFlLGtCQUFmLEVBQW1DRixNQUFNNUUsUUFBTixDQUFlK0UsS0FBbEQ7QUFDQSw2QkFBRUYsT0FBRixFQUFXRyxJQUFYLENBQWdCLE9BQWhCLEVBQXlCSixNQUFNMUcsS0FBL0I7QUFDQSxPQUpELE1BSU87QUFDTixXQUFJK0csT0FBTyxzQkFBT0wsTUFBTXZGLEtBQWIsRUFBb0JqQixNQUFwQixDQUEyQixPQUEzQixDQUFYO0FBQ0EsV0FBSXdHLE1BQU10RixHQUFWLEVBQWUyRixPQUFPLHNCQUFPTCxNQUFNdkYsS0FBYixFQUFvQmpCLE1BQXBCLENBQTJCLE9BQTNCLElBQXNDLFVBQXRDLEdBQW9ELHNCQUFPd0csTUFBTXRGLEdBQWIsRUFBa0JsQixNQUFsQixDQUF5QixPQUF6QixDQUEzRDs7QUFFZiw2QkFBRXlHLE9BQUYsRUFBV3JCLFFBQVgsQ0FBb0IsUUFBcEI7QUFDQSw2QkFBRXFCLE9BQUYsRUFBV0gsT0FBWCxDQUFtQixvREFBb0RFLE1BQU01RSxRQUFOLENBQWUrRSxLQUFuRSxHQUEwRSxpQkFBMUUsR0FBOEZFLElBQTlGLEdBQXFHLFNBQXhIO0FBQ0EsNkJBQUVKLE9BQUYsRUFBV0csSUFBWCxDQUFnQixPQUFoQixFQUF5QkMsT0FBTyxJQUFQLEdBQWNMLE1BQU0xRyxLQUE3QztBQUNBO0FBQ0QsTUF4QjRCO0FBeUI3QmdILGVBekI2QixzQkF5QmxCTixLQXpCa0IsRUF5QlhPLE9BekJXLEVBeUJGOUksSUF6QkUsRUF5Qkk7QUFDaEMwSCxXQUFLakksS0FBTCxDQUFXNkYsU0FBWCxDQUFxQmlELE1BQU0zRSxHQUEzQjtBQUNBOEQsV0FBS2pJLEtBQUwsQ0FBVzRGLFFBQVgsQ0FBb0IsUUFBcEI7QUFDQTtBQTVCNEIsS0FBOUI7O0FBK0JBLDBCQUFFLE1BQU1zQyxPQUFSLEVBQWlCRSxZQUFqQixDQUE4QixVQUE5QixFQUEwQ0gsS0FBS2pJLEtBQUwsQ0FBV00sSUFBckQ7O0FBRUF3RCxlQUFXLFlBQU07QUFDaEIsMkJBQUUsbUJBQUYsRUFBdUJrRixHQUF2QixDQUEyQixZQUEzQixFQUF5QyxzQkFBRSxNQUFNZCxPQUFSLEVBQWlCb0IsTUFBakIsRUFBekM7QUFDQSxLQUZELEVBRUcsQ0FGSDtBQUdBOzs7NkNBRXlCcEMsUyxFQUFXO0FBQ3BDLFFBQUlnQixVQUFVLHNCQUFPLEtBQUtsSSxLQUFMLENBQVdNLElBQWxCLEVBQXdCZ0MsTUFBeEIsQ0FBK0IsU0FBL0IsQ0FBZDtBQUNBLDBCQUFFLE1BQU00RixPQUFSLEVBQWlCRSxZQUFqQixDQUE4QixlQUE5Qjs7QUFFQXRFLGVBQVcsWUFBTTtBQUNoQiwyQkFBRSxtQkFBRixFQUF1QmtGLEdBQXZCLENBQTJCLFlBQTNCLEVBQXlDLHNCQUFFLE1BQU1kLE9BQVIsRUFBaUJvQixNQUFqQixFQUF6QztBQUNBLEtBRkQsRUFFRyxDQUZIO0FBR0E7Ozs0QkFFUTtBQUNSLFdBQ0MsdUNBQUssV0FBVyxvQkFBb0IsS0FBS3RKLEtBQUwsQ0FBV00sSUFBWCxDQUFnQitHLFFBQXBEO0FBQ0MsU0FBSSxzQkFBTyxLQUFLckgsS0FBTCxDQUFXTSxJQUFsQixFQUF3QmdDLE1BQXhCLENBQStCLFNBQS9CLENBREwsR0FERDtBQUlBOzs7O0dBbEV5QyxnQkFBTWlELFM7O21CQUE1QnlDLGE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOckI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0tBRXFCdUIsZTs7O0FBRXBCLDJCQUFZdkosS0FBWixFQUFtQjtBQUFBOztBQUFBLGlJQUNaQSxLQURZOztBQUdsQixTQUFLSyxLQUFMLEdBQWE7QUFDWjRHLFdBQU8sRUFESztBQUVaekcsWUFBUTtBQUZJLElBQWI7QUFIa0I7QUFPbEI7Ozs7NkNBRXlCMEcsUyxFQUFXO0FBQUE7O0FBRXBDLFFBQUlELFFBQVEsS0FBSzVHLEtBQUwsQ0FBVzRHLEtBQXZCO0FBQUEsUUFDQ0UsVUFBVSxLQUFLbkgsS0FBTCxDQUFXTSxJQUR0QjtBQUFBLFFBRUNrRSxVQUFVMEMsVUFBVTVHLElBRnJCOztBQUlBLFFBQUkscUJBQUU4RyxPQUFGLENBQVVELE9BQVYsRUFBbUIzQyxPQUFuQixLQUErQixLQUFLeEUsS0FBTCxDQUFXUSxNQUFYLElBQXFCMEcsVUFBVTFHLE1BQWxFLEVBQTBFOztBQUUxRSxRQUFJLHNCQUFPZ0UsT0FBUCxFQUFnQnFDLE1BQWhCLENBQXVCTSxPQUF2QixFQUFnQyxTQUFoQyxDQUFKLEVBQWdEO0FBQy9DM0MsYUFBUTZDLFFBQVIsR0FBbUIsWUFBbkI7QUFDQSxLQUZELE1BRU8sSUFBSSxzQkFBTzdDLE9BQVAsRUFBZ0I4QyxRQUFoQixDQUF5QkgsT0FBekIsQ0FBSixFQUF1QztBQUM3QzNDLGFBQVE2QyxRQUFSLEdBQW1CLFdBQW5CO0FBQ0EsS0FGTSxNQUVBLElBQUksc0JBQU83QyxPQUFQLEVBQWdCK0MsT0FBaEIsQ0FBd0JKLE9BQXhCLENBQUosRUFBc0M7QUFDNUMzQyxhQUFRNkMsUUFBUixHQUFtQixZQUFuQjtBQUNBOztBQUVESixVQUFNaEMsSUFBTixDQUFXVCxPQUFYO0FBQ0EsU0FBS3JCLFFBQUwsQ0FBYyxFQUFFOEQsWUFBRixFQUFkLEVBQXlCLFlBQU07O0FBRTlCLFNBQUksc0JBQU9FLE9BQVAsRUFBZ0JOLE1BQWhCLENBQXVCckMsT0FBdkIsRUFBZ0MsU0FBaEMsQ0FBSixFQUFnRDtBQUMvQyxVQUFJZ0QsV0FBVyxxQkFBRUMsTUFBRixDQUFTLE9BQUtwSCxLQUFMLENBQVc0RyxLQUFwQixFQUEyQixnQkFBUTtBQUNqRCxjQUFPM0csS0FBSytHLFFBQUwsSUFBaUIsQ0FBeEI7QUFDQSxPQUZjLENBQWY7QUFHQSxhQUFLbEUsUUFBTCxDQUFjLEVBQUU4RCxPQUFPTyxRQUFULEVBQWQ7QUFDQTtBQUNBOztBQUVEMUQsZ0JBQVcsWUFBTTtBQUNoQixVQUFJLHNCQUFPVSxPQUFQLEVBQWdCOEMsUUFBaEIsQ0FBeUJILE9BQXpCLENBQUosRUFBdUM7QUFDdEMsNkJBQUUscUJBQW9CLHNCQUFPQSxPQUFQLEVBQWdCOUUsT0FBaEIsQ0FBd0IsU0FBeEIsRUFBbUNDLE1BQW5DLENBQTBDLFNBQTFDLENBQXBCLEdBQTBFLEdBQTVFLEVBQWlGb0YsUUFBakYsQ0FBMEYsV0FBMUY7QUFDQSw2QkFBRSxxQkFBb0Isc0JBQU9sRCxPQUFQLEVBQWdCbkMsT0FBaEIsQ0FBd0IsU0FBeEIsRUFBbUNDLE1BQW5DLENBQTBDLFNBQTFDLENBQXBCLEdBQTBFLEdBQTVFLEVBQWlGcUYsV0FBakYsQ0FBNkYsdUNBQTdGO0FBQ0E7QUFDRCxVQUFJLHNCQUFPbkQsT0FBUCxFQUFnQitDLE9BQWhCLENBQXdCSixPQUF4QixDQUFKLEVBQXNDO0FBQ3JDLDZCQUFFLHFCQUFvQixzQkFBT0EsT0FBUCxFQUFnQjlFLE9BQWhCLENBQXdCLFNBQXhCLEVBQW1DQyxNQUFuQyxDQUEwQyxTQUExQyxDQUFwQixHQUEwRSxHQUE1RSxFQUFpRm9GLFFBQWpGLENBQTBGLFVBQTFGO0FBQ0EsNkJBQUUscUJBQW9CLHNCQUFPbEQsT0FBUCxFQUFnQm5DLE9BQWhCLENBQXdCLFNBQXhCLEVBQW1DQyxNQUFuQyxDQUEwQyxTQUExQyxDQUFwQixHQUEwRSxHQUE1RSxFQUFpRnFGLFdBQWpGLENBQTZGLHVDQUE3RjtBQUVBO0FBQ0QsTUFWRCxFQVVHLENBVkg7O0FBWUE3RCxnQkFBVyxZQUFNO0FBQ2hCLFVBQUkwRCxXQUFXLHFCQUFFQyxNQUFGLENBQVMsT0FBS3BILEtBQUwsQ0FBVzRHLEtBQXBCLEVBQTJCLGdCQUFRO0FBQ2pELGNBQU8sc0JBQU9FLE9BQVAsRUFBZ0JOLE1BQWhCLENBQXVCdkcsSUFBdkIsRUFBNkIsU0FBN0IsQ0FBUDtBQUNBLE9BRmMsQ0FBZjtBQUdBLGFBQUs2QyxRQUFMLENBQWMsRUFBRThELE9BQU9PLFFBQVQsRUFBZDtBQUNBLE1BTEQsRUFLRyxHQUxIO0FBTUEsS0E1QkQ7QUE2QkE7Ozs0QkFFUTtBQUFBOztBQUNSLFFBQUlnQyxXQUFXLEtBQUtuSixLQUFMLENBQVc0RyxLQUFYLENBQWlCWSxHQUFqQixDQUFxQixnQkFBUTtBQUMzQyxTQUFJNEIsVUFBVSxzQkFBT25KLElBQVAsRUFBYWdDLE1BQWIsQ0FBb0IsU0FBcEIsQ0FBZDtBQUNBLFlBQ0M7QUFDQyxZQUFNaEMsSUFEUDtBQUVDLGNBQVEsT0FBS04sS0FBTCxDQUFXUSxNQUZwQjtBQUdDLFdBQUtpSixPQUhOO0FBSUMsZ0JBQVUsT0FBS3pKLEtBQUwsQ0FBVzRGLFFBSnRCO0FBS0MsaUJBQVcsT0FBSzVGLEtBQUwsQ0FBVzZGLFNBTHZCLEdBREQ7QUFRQSxLQVZjLENBQWY7O0FBWUEsV0FDQztBQUFBO0FBQUEsT0FBSyxJQUFHLGlCQUFSO0FBQ0UyRCxhQURGO0FBRUM7QUFBQTtBQUFBLFFBQUssV0FBVyxLQUFLeEosS0FBTCxDQUFXaUIsT0FBWCxHQUFxQixlQUFyQixHQUF1QyxTQUF2RDtBQUNDLDZDQUFLLFdBQVUsU0FBZjtBQUREO0FBRkQsS0FERDtBQVFBOzs7O0dBaEYyQyxnQkFBTXNFLFM7O21CQUE5QmdFLGU7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQckI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7OztLQUVxQkcsWTs7Ozs7Ozs7Ozs7NEJBRVg7QUFBQTs7QUFDUixRQUFJOUMsWUFBWSxzQkFBTyxLQUFLNUcsS0FBTCxDQUFXTSxJQUFsQixFQUF3QitCLE9BQXhCLENBQWdDLFNBQWhDLENBQWhCO0FBQUEsUUFDQ3NILFdBQVcsQ0FDVixFQUFFQyxNQUFNLEtBQVIsRUFBZUMsUUFBUSxFQUF2QixFQURVLEVBRVYsRUFBRUQsTUFBTSxLQUFSLEVBQWVDLFFBQVEsRUFBdkIsRUFGVSxFQUdWLEVBQUVELE1BQU0sS0FBUixFQUFlQyxRQUFRLEVBQXZCLEVBSFUsRUFJVixFQUFFRCxNQUFNLEtBQVIsRUFBZUMsUUFBUSxFQUF2QixFQUpVLEVBS1YsRUFBRUQsTUFBTSxLQUFSLEVBQWVDLFFBQVEsRUFBdkIsRUFMVSxFQU1WLEVBQUVELE1BQU0sS0FBUixFQUFlQyxRQUFRLEVBQXZCLEVBTlUsQ0FEWjs7QUFVQSxhQUFTQyxZQUFULENBQXVCOUYsRUFBdkIsRUFBMkIrRixHQUEzQixFQUFnQztBQUMvQixTQUFJLHNCQUFPL0YsR0FBR1QsS0FBVixFQUFpQnlHLFNBQWpCLENBQTJCRCxJQUFJeEcsS0FBL0IsRUFBc0N3RyxJQUFJdkcsR0FBMUMsQ0FBSixFQUFvRCxPQUFPLElBQVA7QUFDcEQsU0FBSVEsR0FBR1IsR0FBSCxJQUFVLHNCQUFPUSxHQUFHUixHQUFWLEVBQWV3RyxTQUFmLENBQXlCRCxJQUFJeEcsS0FBN0IsRUFBb0N3RyxJQUFJdkcsR0FBeEMsQ0FBZCxFQUE0RCxPQUFPLElBQVA7QUFDNUQsU0FBSVEsR0FBR1IsR0FBSCxJQUFVLHNCQUFPUSxHQUFHVCxLQUFWLEVBQWlCK0QsUUFBakIsQ0FBMEJ5QyxJQUFJeEcsS0FBOUIsQ0FBVixJQUFrRCxzQkFBT1MsR0FBR1IsR0FBVixFQUFlK0QsT0FBZixDQUF1QndDLElBQUl2RyxHQUEzQixDQUF0RCxFQUF1RixPQUFPLElBQVA7QUFDdkYsU0FBSVEsR0FBR1IsR0FBSCxJQUFVLHNCQUFPUSxHQUFHUixHQUFWLEVBQWU4RCxRQUFmLENBQXdCeUMsSUFBSXhHLEtBQTVCLENBQWQsRUFBa0QsT0FBTyxLQUFQO0FBQ2xELFNBQUksc0JBQU9TLEdBQUdULEtBQVYsRUFBaUJnRSxPQUFqQixDQUF5QndDLElBQUl2RyxHQUE3QixDQUFKLEVBQXVDLE9BQU8sS0FBUDtBQUN2Qzs7QUFFRCxRQUFJaEQsU0FBUyxxQkFBRWlJLE1BQUYsQ0FBUyxLQUFLekksS0FBTCxDQUFXUSxNQUFwQixFQUE0QixjQUFNO0FBQUUsWUFBT3dELEdBQUdJLE9BQVY7QUFBbUIsS0FBdkQsQ0FBYjtBQUNBNUQsYUFBUyxxQkFBRXlDLE1BQUYsQ0FBU3pDLE1BQVQsRUFBaUIsT0FBakIsQ0FBVDtBQUNBLFFBQUlnQyxVQUFKOztBQUVBLFNBQUtBLENBQUwsSUFBVWhDLE1BQVYsRUFBa0I7QUFDakIsU0FBSUEsT0FBT2dDLENBQVAsRUFBVTZCLE1BQVYsSUFBb0IsSUFBeEIsRUFBOEI7O0FBRTdCN0QsYUFBT2dDLENBQVAsRUFBVXlILEdBQVYsR0FBZ0IsQ0FBQyxDQUFqQjtBQUNBLFVBQUlGLFlBQUo7QUFBQSxVQUFTRyxVQUFUOztBQUVBLFdBQUtBLENBQUwsSUFBVVAsUUFBVixFQUFvQjtBQUNuQkksYUFBTTtBQUNMeEcsZUFBTyxzQkFBT3FELFNBQVAsRUFBa0JsRCxHQUFsQixDQUFzQndHLENBQXRCLEVBQXlCLE1BQXpCLEVBQWlDN0gsT0FBakMsQ0FBeUMsS0FBekMsRUFBZ0RDLE1BQWhELEVBREY7QUFFTGtCLGFBQUssc0JBQU9vRCxTQUFQLEVBQWtCbEQsR0FBbEIsQ0FBc0J3RyxDQUF0QixFQUF5QixNQUF6QixFQUFpQzNILEtBQWpDLENBQXVDLEtBQXZDLEVBQThDRCxNQUE5QztBQUZBLFFBQU47QUFJQSxXQUFJcUgsU0FBU08sQ0FBVCxFQUFZTixJQUFaLElBQW9CLEtBQXhCLEVBQStCRyxJQUFJdkcsR0FBSixHQUFVLHNCQUFPb0QsU0FBUCxFQUFrQmxELEdBQWxCLENBQXNCLENBQXRCLEVBQXlCLE1BQXpCLEVBQWlDbkIsS0FBakMsQ0FBdUMsS0FBdkMsRUFBOENELE1BQTlDLEVBQVY7O0FBRS9CLFdBQUk5QixPQUFPZ0MsQ0FBUCxFQUFVeUgsR0FBVixHQUFnQixDQUFDLENBQXJCLEVBQXdCOztBQUV2Qk4saUJBQVNPLENBQVQsRUFBWUwsTUFBWixDQUFtQnJKLE9BQU9nQyxDQUFQLEVBQVV5SCxHQUE3QixJQUFxQ0gsYUFBYXRKLE9BQU9nQyxDQUFQLENBQWIsRUFBd0J1SCxHQUF4QixDQUFELEdBQWlDdkosT0FBT2dDLENBQVAsRUFBVTJCLEdBQTNDLEdBQWlELE9BQXJGO0FBRUEsUUFKRCxNQUlPOztBQUVOLFlBQUkyRixhQUFhdEosT0FBT2dDLENBQVAsQ0FBYixFQUF3QnVILEdBQXhCLENBQUosRUFBa0M7QUFDakMsYUFBSUksT0FBTyxLQUFYO0FBQUEsYUFBa0JDLFVBQWxCO0FBQ0EsY0FBS0EsQ0FBTCxJQUFVVCxTQUFTTyxDQUFULEVBQVlMLE1BQXRCLEVBQThCO0FBQzdCLGNBQUlySixPQUFPZ0MsQ0FBUCxFQUFVeUgsR0FBVixJQUFpQixDQUFDLENBQWxCLElBQXVCTixTQUFTTyxDQUFULEVBQVlMLE1BQVosQ0FBbUJPLENBQW5CLEtBQXlCLE9BQXBELEVBQTZEO0FBQzVEVCxvQkFBU08sQ0FBVCxFQUFZTCxNQUFaLENBQW1CTyxDQUFuQixJQUF3QjVKLE9BQU9nQyxDQUFQLEVBQVUyQixHQUFsQztBQUNBM0Qsa0JBQU9nQyxDQUFQLEVBQVV5SCxHQUFWLEdBQWdCRyxDQUFoQjtBQUNBRCxrQkFBTyxJQUFQO0FBQ0E7QUFDRDs7QUFFRCxhQUFJQSxRQUFRLEtBQVosRUFBbUI7QUFDbEJSLG1CQUFTTyxDQUFULEVBQVlMLE1BQVosQ0FBbUI1RSxJQUFuQixDQUF3QnpFLE9BQU9nQyxDQUFQLEVBQVUyQixHQUFsQztBQUNBM0QsaUJBQU9nQyxDQUFQLEVBQVV5SCxHQUFWLEdBQWdCTixTQUFTTyxDQUFULEVBQVlMLE1BQVosQ0FBbUI1RixPQUFuQixDQUEyQnpELE9BQU9nQyxDQUFQLEVBQVUyQixHQUFyQyxDQUFoQjtBQUNBO0FBQ0QsU0FkRCxNQWNPO0FBQ053RixrQkFBU08sQ0FBVCxFQUFZTCxNQUFaLENBQW1CNUUsSUFBbkIsQ0FBd0IsT0FBeEI7QUFDQTtBQUNEO0FBQ0Q7QUFDRDtBQUNEO0FBQ0R6RSxhQUFTLHFCQUFFeUMsTUFBRixDQUFTekMsTUFBVCxFQUFpQixLQUFqQixDQUFUOztBQUVBLFFBQUkwRixVQUFVeUQsU0FBUzlCLEdBQVQsQ0FBYSxVQUFDd0MsT0FBRCxFQUFVdkMsS0FBVixFQUFvQjtBQUM5QyxTQUFJaUMsTUFBTTtBQUNUeEcsYUFBTyxzQkFBT3FELFNBQVAsRUFBa0JsRCxHQUFsQixDQUFzQm9FLEtBQXRCLEVBQTZCLE1BQTdCLEVBQXFDekYsT0FBckMsQ0FBNkMsS0FBN0MsRUFBb0RDLE1BQXBELEVBREU7QUFFVGtCLFdBQUssc0JBQU9vRCxTQUFQLEVBQWtCbEQsR0FBbEIsQ0FBc0JvRSxLQUF0QixFQUE2QixNQUE3QixFQUFxQ3ZGLEtBQXJDLENBQTJDLEtBQTNDLEVBQWtERCxNQUFsRCxFQUZJO0FBR1QrSCxlQUFTQSxRQUFRVCxJQUhSO0FBSVRVLGVBQVMsRUFKQTtBQUtUQyxlQUFTO0FBTEEsTUFBVjs7QUFRQSxTQUFJRixRQUFRVCxJQUFSLElBQWdCLEtBQXBCLEVBQTJCRyxJQUFJdkcsR0FBSixHQUFVLHNCQUFPb0QsU0FBUCxFQUFrQmxELEdBQWxCLENBQXNCLENBQXRCLEVBQXlCLE1BQXpCLEVBQWlDbkIsS0FBakMsQ0FBdUMsS0FBdkMsRUFBOENELE1BQTlDLEVBQVY7O0FBRTNCOUIsWUFBT3VELE9BQVAsQ0FBZSxjQUFNO0FBQ3BCLFVBQUksc0JBQU9DLEdBQUdULEtBQVYsRUFBaUJ5RyxTQUFqQixDQUEyQkQsSUFBSXhHLEtBQS9CLEVBQXNDd0csSUFBSXZHLEdBQTFDLENBQUosRUFBb0Q7QUFDbkQsV0FBSVEsR0FBR0ssTUFBUCxFQUFlMEYsSUFBSU8sT0FBSixDQUFZckYsSUFBWixDQUFpQmpCLEVBQWpCO0FBQ2YsV0FBSSxDQUFDQSxHQUFHSyxNQUFSLEVBQWdCMEYsSUFBSVEsT0FBSixDQUFZdEYsSUFBWixDQUFpQmpCLEVBQWpCO0FBQ2hCOztBQUVELFVBQUlBLEdBQUdLLE1BQUgsSUFBYUwsR0FBR1IsR0FBcEIsRUFBeUI7QUFDeEIsV0FBSSxzQkFBT1EsR0FBR1IsR0FBVixFQUFld0csU0FBZixDQUF5QkQsSUFBSXhHLEtBQTdCLEVBQW9Dd0csSUFBSXZHLEdBQXhDLENBQUosRUFBa0Q7QUFDakR1RyxZQUFJTyxPQUFKLENBQVlyRixJQUFaLENBQWlCakIsRUFBakI7QUFDQSxRQUZELE1BRU8sSUFBSSxzQkFBT0EsR0FBR1QsS0FBVixFQUFpQitELFFBQWpCLENBQTBCeUMsSUFBSXhHLEtBQTlCLEtBQXdDLHNCQUFPUyxHQUFHUixHQUFWLEVBQWUrRCxPQUFmLENBQXVCd0MsSUFBSXZHLEdBQTNCLENBQTVDLEVBQTZFO0FBQ25GdUcsWUFBSU8sT0FBSixDQUFZckYsSUFBWixDQUFpQmpCLEVBQWpCO0FBQ0E7QUFDRDtBQUNELE1BYkQ7O0FBZUEsWUFBTytGLEdBQVA7QUFDQSxLQTNCYSxDQUFkOztBQTZCQSxRQUFJUCxXQUFXdEQsUUFBUTJCLEdBQVIsQ0FBWSxVQUFDa0MsR0FBRCxFQUFNakMsS0FBTixFQUFnQjtBQUMxQyxZQUNDO0FBQ0MsZUFBU2lDLEdBRFY7QUFFQyxXQUFLLHNCQUFPQSxJQUFJeEcsS0FBWCxFQUFrQmpCLE1BQWxCLEVBRk47QUFHQyxnQkFBVSxPQUFLdEMsS0FBTCxDQUFXNEYsUUFIdEI7QUFJQyxpQkFBVyxPQUFLNUYsS0FBTCxDQUFXNkYsU0FKdkIsR0FERDtBQU9BLEtBUmMsQ0FBZjs7QUFVQSxXQUNDO0FBQUE7QUFBQTtBQUNDLGlCQUFXLFVBQVUsS0FBSzdGLEtBQUwsQ0FBV00sSUFBWCxDQUFnQitHLFFBRHRDO0FBRUMsbUJBQVcsc0JBQU9ULFNBQVAsRUFBa0J0RSxNQUFsQixDQUF5QixTQUF6QixDQUZaO0FBR0drSDtBQUhILEtBREQ7QUFPQTs7OztHQWpId0MsZ0JBQU1qRSxTOzttQkFBM0JtRSxZOzs7Ozs7Ozs7Ozs7Ozs7O0FDTnJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7S0FFcUJjLFc7OztBQUVwQix1QkFBWXhLLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx5SEFDWkEsS0FEWTs7QUFHbEIsU0FBS3lLLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjbkosSUFBZCxPQUFoQjtBQUNBLFNBQUtvSixVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0JwSixJQUFoQixPQUFsQjtBQUNBLFNBQUtxSixlQUFMLEdBQXVCLE1BQUtBLGVBQUwsQ0FBcUJySixJQUFyQixPQUF2QjtBQUNBLFNBQUtzSixlQUFMLEdBQXVCLE1BQUtBLGVBQUwsQ0FBcUJ0SixJQUFyQixPQUF2QjtBQU5rQjtBQU9sQjs7Ozs0QkFFUWdELEMsRUFBRztBQUNYLDBCQUFFLGNBQUYsRUFBa0JxRCxXQUFsQixDQUE4QixRQUE5QjtBQUNBLDBCQUFFLG9CQUFvQnJELEVBQUVLLE1BQUYsQ0FBU3VCLE9BQVQsQ0FBaUI1RixJQUFyQyxHQUE0QyxzQkFBNUMsR0FBcUVnRSxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCNUYsSUFBdEYsR0FBNkYsR0FBL0YsRUFBb0dvSCxRQUFwRyxDQUE2RyxRQUE3RztBQUNBOzs7OEJBRVVwRCxDLEVBQUc7QUFDYiwwQkFBRSxjQUFGLEVBQWtCcUQsV0FBbEIsQ0FBOEIsUUFBOUI7QUFDQSwwQkFBRSxvQkFBb0JyRCxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCNUYsSUFBckMsR0FBNEMsc0JBQTVDLEdBQXFFZ0UsRUFBRUssTUFBRixDQUFTdUIsT0FBVCxDQUFpQjVGLElBQXRGLEdBQTZGLEdBQS9GLEVBQW9Hb0gsUUFBcEcsQ0FBNkcsUUFBN0c7QUFDQSxTQUFLMUgsS0FBTCxDQUFXNEYsUUFBWCxDQUFvQixRQUFwQjtBQUNBLFNBQUs1RixLQUFMLENBQVc2RixTQUFYLENBQXFCdkIsRUFBRUssTUFBRixDQUFTdUIsT0FBVCxDQUFpQjJFLE9BQXRDO0FBQ0E7OzttQ0FFZXZHLEMsRUFBRztBQUNsQiwwQkFBRSxrQkFBa0JBLEVBQUVLLE1BQUYsQ0FBU3VCLE9BQVQsQ0FBaUIyRSxPQUFyQyxFQUE4Q25ELFFBQTlDLENBQXVELE9BQXZEO0FBQ0E7OzttQ0FFZXBELEMsRUFBRztBQUNsQiwwQkFBRSxRQUFGLEVBQVlxRCxXQUFaLENBQXdCLE9BQXhCO0FBQ0E7Ozs0QkFFUTtBQUFBOztBQUNSLFFBQUkxSCxNQUFNLHVCQUFWO0FBQUEsUUFDQ2lHLFVBQVUsS0FBS2xHLEtBQUwsQ0FBV2tHLE9BRHRCO0FBQUEsUUFFQzRFLGtCQUZEOztBQUlBLFFBQUk1RSxRQUFRbUUsT0FBUixJQUFtQixLQUF2QixFQUE4QjtBQUM3QixTQUFJVSxNQUFNakcsT0FBTyxzQkFBT29CLFFBQVEzQyxLQUFmLEVBQXNCakIsTUFBdEIsQ0FBNkIsR0FBN0IsQ0FBUCxDQUFWO0FBQ0F3SSxpQkFDQztBQUFBO0FBQUEsUUFBTSxXQUFVLFNBQWhCO0FBQ0M7QUFBQTtBQUFBLFNBQU0sV0FBVSxVQUFoQjtBQUE0QkM7QUFBNUIsT0FERDtBQUVDO0FBQUE7QUFBQSxTQUFNLFdBQVUsV0FBaEI7QUFBQTtBQUFBLE9BRkQ7QUFHQztBQUFBO0FBQUEsU0FBTSxXQUFVLFFBQWhCO0FBQTBCQSxhQUFNO0FBQWhDO0FBSEQsTUFERDtBQU9BLEtBVEQsTUFTTztBQUNORCxpQkFBWTtBQUFBO0FBQUEsUUFBTSxXQUFVLFNBQWhCO0FBQTJCLDRCQUFPNUUsUUFBUTNDLEtBQWYsRUFBc0JqQixNQUF0QixDQUE2QixHQUE3QjtBQUEzQixNQUFaO0FBQ0E7O0FBRUQ0RCxZQUFRb0UsT0FBUixHQUFrQixxQkFBRXJILE1BQUYsQ0FBU2lELFFBQVFvRSxPQUFqQixFQUEwQixLQUExQixDQUFsQjtBQUNBLFFBQUlBLFVBQVVwRSxRQUFRb0UsT0FBUixDQUFnQnpDLEdBQWhCLENBQW9CLFVBQUM3RCxFQUFELEVBQUs4RCxLQUFMLEVBQWU7QUFDaEQsU0FBSWtELFFBQVEsRUFBRUMsaUJBQWlCakgsR0FBR0UsUUFBSCxDQUFZK0UsS0FBL0IsRUFBWjtBQUNBK0IsV0FBTUUsR0FBTixHQUFhbEgsR0FBR2lHLEdBQUgsR0FBUyxFQUF0Qjs7QUFFQSxTQUFJa0IsVUFBVSxpQkFBaUJuSCxHQUFHRyxHQUFsQztBQUNBLFNBQUksc0JBQU9ILEdBQUdULEtBQVYsRUFBaUIrRCxRQUFqQixDQUEwQnBCLFFBQVEzQyxLQUFsQyxDQUFKLEVBQThDNEgsVUFBVUEsVUFBVSxZQUFwQjtBQUM5QyxTQUFJbkgsR0FBR1IsR0FBSCxJQUFVLHNCQUFPUSxHQUFHUixHQUFWLEVBQWUrRCxPQUFmLENBQXVCckIsUUFBUTFDLEdBQS9CLENBQWQsRUFBbUQySCxVQUFVQSxVQUFVLFdBQXBCOztBQUVuRCxZQUNDO0FBQUE7QUFBQSxRQUFJLFdBQVdBLE9BQWY7QUFDQyxjQUFPSCxLQURSO0FBRUMsWUFBS2hILEdBQUdHLEdBQUgsR0FBUyxzQkFBT0gsR0FBR1QsS0FBVixFQUFpQmpCLE1BQWpCLEVBRmY7QUFHQyxjQUFPMEIsR0FBRzVCLEtBSFg7QUFJQyxxQkFBYyxPQUFLdUksZUFKcEI7QUFLQyxxQkFBYyxPQUFLQyxlQUxwQjtBQU1DLGdCQUFTLE9BQUtGLFVBTmY7QUFPQyx1QkFBYzFHLEdBQUdHLEdBUGxCO0FBUUMsb0JBQVcsc0JBQU8rQixRQUFRM0MsS0FBZixFQUFzQmpCLE1BQXRCLENBQTZCLFlBQTdCLENBUlo7QUFVQztBQUFBO0FBQUEsU0FBTSxXQUFVLGFBQWhCO0FBQStCMEIsVUFBRzVCO0FBQWxDO0FBVkQsTUFERDtBQWNBLEtBdEJhLENBQWQ7O0FBd0JBLFFBQUlnSixnQkFBZ0IscUJBQUVDLEdBQUYsQ0FBTW5GLFFBQVFvRSxPQUFkLEVBQXVCLGNBQU07QUFBRSxZQUFPdEcsR0FBR2lHLEdBQVY7QUFBZSxLQUE5QyxDQUFwQjs7QUFFQSxRQUFJcUIsZ0JBQWdCLEVBQUVoQyxRQUFTLENBQUMsQ0FBQ3hFLE9BQU9zRyxjQUFjbkIsR0FBckIsS0FBNkIsQ0FBOUIsSUFBbUMsQ0FBcEMsSUFBMEMsRUFBM0MsR0FBaUQsQ0FBM0QsRUFBcEI7O0FBRUEsUUFBSU0sVUFBVXJFLFFBQVFxRSxPQUFSLENBQWdCMUMsR0FBaEIsQ0FBb0IsVUFBQzdELEVBQUQsRUFBSzhELEtBQUwsRUFBZTs7QUFFaEQsU0FBSXFCLE9BQU87QUFBQTtBQUFBLFFBQU0sV0FBVSxZQUFoQixFQUE2QixVQUFVbkYsR0FBR1QsS0FBMUM7QUFBa0QsNEJBQU9TLEdBQUdULEtBQVYsRUFBaUJqQixNQUFqQixDQUF3QixPQUF4QjtBQUFsRCxNQUFYO0FBQ0EsU0FBSTBCLEdBQUdSLEdBQVAsRUFBWTJGLE9BQU87QUFBQTtBQUFBLFFBQU0sV0FBVSxZQUFoQixFQUE2QixVQUFVbkYsR0FBR1QsS0FBMUM7QUFBa0QsNEJBQU9TLEdBQUdULEtBQVYsRUFBaUJqQixNQUFqQixDQUF3QixPQUF4QixDQUFsRDtBQUFBO0FBQTZGLDRCQUFPMEIsR0FBR1IsR0FBVixFQUFlbEIsTUFBZixDQUFzQixPQUF0QjtBQUE3RixNQUFQOztBQUVaLFNBQUlpSixhQUFhLEVBQWpCO0FBQ0EsU0FBSXJGLFFBQVFtRSxPQUFSLElBQW1CLEtBQXZCLEVBQThCO0FBQzdCa0IsbUJBQWE7QUFBQTtBQUFBLFNBQU0sV0FBVSxlQUFoQjtBQUFpQyw2QkFBT3ZILEdBQUdULEtBQVYsRUFBaUJqQixNQUFqQixDQUF3QixLQUF4QjtBQUFqQyxPQUFiO0FBQ0E7O0FBRUQsWUFDQztBQUFBO0FBQUEsUUFBSSxXQUFVLE9BQWQ7QUFDQyxZQUFLMEIsR0FBR0csR0FBSCxHQUFTLHNCQUFPSCxHQUFHVCxLQUFWLEVBQWlCakIsTUFBakIsRUFEZjtBQUVDLGNBQU8wQixHQUFHNUIsS0FGWDtBQUdDLGdCQUFTLE9BQUtzSSxVQUhmO0FBSUMsdUJBQWMxRyxHQUFHRyxHQUpsQjtBQUtDLG9CQUFXLHNCQUFPK0IsUUFBUTNDLEtBQWYsRUFBc0JqQixNQUF0QixDQUE2QixZQUE3QixDQUxaO0FBTUMsMkNBQUcsT0FBTyxFQUFFMkksaUJBQWlCakgsR0FBR0UsUUFBSCxDQUFZK0UsS0FBL0IsRUFBVixHQU5EO0FBT0VFLFVBUEY7QUFPUW9DLGdCQVBSO0FBUUM7QUFBQTtBQUFBLFNBQU0sV0FBVSxhQUFoQjtBQUErQnZILFVBQUc1QjtBQUFsQztBQVJELE1BREQ7QUFZQSxLQXRCYSxDQUFkOztBQXdCQSxXQUNDO0FBQUE7QUFBQSxPQUFJLFdBQVcsc0JBQU9uQyxHQUFQLEVBQVkrSixTQUFaLENBQXNCOUQsUUFBUTNDLEtBQTlCLEVBQXFDMkMsUUFBUTFDLEdBQTdDLElBQW9ELHNCQUFzQjBDLFFBQVFtRSxPQUFsRixHQUE0RixTQUFTbkUsUUFBUW1FLE9BQTVIO0FBQ0MsZUFBUyxLQUFLSSxRQURmO0FBRUMsbUJBQVcsc0JBQU92RSxRQUFRM0MsS0FBZixFQUFzQmpCLE1BQXRCLENBQTZCLFlBQTdCLENBRlo7QUFHQztBQUFBO0FBQUEsUUFBSyxXQUFVLFlBQWY7QUFDRXdJO0FBREYsTUFIRDtBQU1DO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZjtBQUEyQjVFLGNBQVFtRTtBQUFuQyxNQU5EO0FBUUM7QUFBQTtBQUFBLFFBQUssV0FBVyxxQkFBcUJuRSxRQUFRbUUsT0FBN0M7QUFDQztBQUFBO0FBQUEsU0FBSSxXQUFVLFNBQWQsRUFBd0IsT0FBT2lCLGFBQS9CO0FBQStDaEI7QUFBL0MsT0FERDtBQUVDO0FBQUE7QUFBQSxTQUFJLFdBQVUsU0FBZDtBQUF5QkM7QUFBekI7QUFGRDtBQVJELEtBREQ7QUFlQTs7OztHQXJIdUMsZ0JBQU1oRixTOzttQkFBMUJpRixXOzs7Ozs7Ozs7Ozs7Ozs7O0FDTHJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0tBRXFCZ0IsZTs7Ozs7Ozs7Ozs7NEJBRVg7QUFDUixRQUFJQyxpQkFBSjtBQUFBLFFBQWNDLG1CQUFkOztBQUVBLFFBQUksS0FBSzFMLEtBQUwsQ0FBV08sSUFBWCxJQUFtQixRQUF2QixFQUFpQztBQUNoQ2tMLGdCQUFXO0FBQ1YsWUFBTSxLQUFLekwsS0FBTCxDQUFXTSxJQURQO0FBRVYsZUFBUyxLQUFLTixLQUFMLENBQVc4RixPQUZWLEdBQVg7O0FBSUE0RixrQkFBYTtBQUFBO0FBQUEsUUFBRyxNQUFLLEVBQVIsRUFBVyxTQUFTLEtBQUsxTCxLQUFMLENBQVdrQyxVQUEvQjtBQUFBO0FBQXFEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBckQsTUFBYjtBQUNBLEtBTkQsTUFNTyxJQUFJLEtBQUtsQyxLQUFMLENBQVdPLElBQVgsSUFBbUIsU0FBdkIsRUFBa0M7QUFDeENrTCxnQkFBVztBQUNWLFlBQU0sS0FBS3pMLEtBQUwsQ0FBV00sSUFEUDtBQUVWLGVBQVMsS0FBS04sS0FBTCxDQUFXOEYsT0FGVixHQUFYOztBQUlBNEYsa0JBQWE7QUFBQTtBQUFBLFFBQUcsTUFBSyxFQUFSLEVBQVcsU0FBUyxLQUFLMUwsS0FBTCxDQUFXa0MsVUFBL0I7QUFBQTtBQUFxRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXJELE1BQWI7QUFDQTs7QUFFRCxXQUNDO0FBQUE7QUFBQSxPQUFPLElBQUcsa0JBQVY7QUFDRXVKLGFBREY7QUFHQztBQUNDLGtCQUFZLEtBQUt6TCxLQUFMLENBQVdvQixVQUR4QjtBQUVDLGlCQUFXLEtBQUtwQixLQUFMLENBQVdtQixTQUZ2QjtBQUdDLG9CQUFjLEtBQUtuQixLQUFMLENBQVdpQyxZQUgxQixHQUhEO0FBUUM7QUFBQTtBQUFBLFFBQUssSUFBRyxxQkFBUjtBQUNFeUo7QUFERjtBQVJELEtBREQ7QUFlQTs7OztHQWxDMkMsZ0JBQU1uRyxTOzttQkFBOUJpRyxlOzs7Ozs7Ozs7Ozs7Ozs7O0FDUnJCOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztLQUVxQkcsYzs7O0FBRXBCLDBCQUFZM0wsS0FBWixFQUFtQjtBQUFBOztBQUFBLCtIQUNaQSxLQURZOztBQUdsQixTQUFLaUMsWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCWCxJQUFsQixPQUFwQjtBQUhrQjtBQUlsQjs7OztnQ0FFWWdELEMsRUFBRztBQUNmQSxNQUFFQyxjQUFGO0FBQ0EsU0FBS3ZFLEtBQUwsQ0FBV2lDLFlBQVgsQ0FBd0JxQyxFQUFFSyxNQUFGLENBQVNDLEVBQWpDO0FBQ0E7Ozs0QkFFUTtBQUFBOztBQUNSLFFBQUkxQixlQUFlLEtBQUtsRCxLQUFMLENBQVdvQixVQUFYLENBQXNCeUcsR0FBdEIsQ0FBMEIsZUFBTztBQUNuRCxZQUNDO0FBQUE7QUFBQSxRQUFJLFdBQVUsVUFBZCxFQUF5QixLQUFLaEQsSUFBSUQsRUFBbEM7QUFDQztBQUFBO0FBQUEsU0FBTyxXQUFXLE9BQUs1RSxLQUFMLENBQVdtQixTQUFYLENBQXFCOEMsT0FBckIsQ0FBNkJZLElBQUlELEVBQWpDLElBQXVDLENBQUMsQ0FBeEMsR0FBNEMsaUJBQTVDLEdBQWdFLFVBQWxGLEVBQThGLFNBQVMsT0FBSzNDLFlBQTVHLEVBQTBILElBQUk0QyxJQUFJRCxFQUFsSSxFQUFzSSxPQUFPQyxJQUFJK0UsSUFBakosRUFBdUosS0FBSyxZQUFZL0UsSUFBSUQsRUFBNUs7QUFDQyw0Q0FBRyxPQUFPLEVBQUNxRyxpQkFBaUJwRyxJQUFJb0UsS0FBdEIsRUFBVixHQUREO0FBQUE7QUFDK0NwRSxXQUFJK0U7QUFEbkQ7QUFERCxNQUREO0FBT0EsS0FSa0IsQ0FBbkI7O0FBVUEsV0FDQztBQUFBO0FBQUEsT0FBSSxJQUFHLGlCQUFQO0FBQ0UxRyxpQkFERjtBQUVDO0FBQUE7QUFBQSxRQUFJLFdBQVUsY0FBZCxFQUE2QixPQUFPLEtBQUtsRCxLQUFMLENBQVdtQixTQUFYLENBQXFCc0IsTUFBckIsR0FBOEIsQ0FBOUIsR0FBa0MsRUFBbEMsR0FBdUMsRUFBRXFFLFNBQVMsTUFBWCxFQUEzRTtBQUNDO0FBQUE7QUFBQSxTQUFHLE1BQUssRUFBUixFQUFXLFNBQVMsS0FBSzdFLFlBQXpCLEVBQXVDLElBQUcsT0FBMUM7QUFBQTtBQUFBO0FBREQ7QUFGRCxLQUREO0FBUUE7Ozs7R0FoQzBDLGdCQUFNc0QsUzs7bUJBQTdCb0csYzs7Ozs7Ozs7Ozs7Ozs7OztBQ0hyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0tBRXFCQyxlOzs7Ozs7Ozs7Ozt1Q0FDQTtBQUNuQixRQUFJM0QsT0FBTyxJQUFYO0FBQUEsUUFBaUJoSSxNQUFNLHVCQUF2Qjs7QUFFQSwwQkFBRSxtQkFBRixFQUF1Qm1JLFlBQXZCLENBQW9DO0FBQ25DQyxlQUFVLENBRHlCO0FBRW5DQyxhQUFRO0FBQ1B1RCxZQUFNLEVBREM7QUFFUEMsY0FBUSxpQkFGRDtBQUdQQyxhQUFPO0FBSEEsTUFGMkI7QUFPbkNDLGtCQUFhLEtBUHNCO0FBUW5DQyxpQkFBWTtBQUNYOUYsWUFBTSxRQURLO0FBRVhDLFlBQU07QUFGSyxNQVJ1QjtBQVluQ21DLG9CQUFlLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEdBQTFCLEVBQStCLEdBQS9CLENBWm9CO0FBYW5DMkQsYUFibUMsb0JBYTFCNUwsSUFiMEIsRUFhcEIrSSxPQWJvQixFQWFYOUksSUFiVyxFQWFMO0FBQzdCLDRCQUFFLFVBQUYsRUFBY29ILFdBQWQsQ0FBMEIsY0FBMUI7QUFDQSw0QkFBRSx3QkFBd0Isc0JBQU9ySCxJQUFQLEVBQWFnQyxNQUFiLENBQW9CLFlBQXBCLENBQXhCLEdBQTRELEdBQTlELEVBQW1FNkosTUFBbkUsR0FBNEV6RSxRQUE1RSxDQUFxRixjQUFyRjtBQUNBLFVBQUkwRSxZQUFZLHNCQUFPOUwsSUFBUCxFQUFhZ0MsTUFBYixDQUFvQixZQUFwQixDQUFoQjtBQUNBMkYsV0FBS2pJLEtBQUwsQ0FBVzhGLE9BQVgsQ0FBbUIsc0JBQU9zRyxTQUFQLEVBQWtCLFlBQWxCLENBQW5CO0FBQ0EsTUFsQmtDO0FBbUJuQzFELGNBbkJtQyxxQkFtQnpCcEksSUFuQnlCLEVBbUJuQnFJLElBbkJtQixFQW1CYjtBQUNyQixVQUFJLHNCQUFPckksSUFBUCxFQUFhdUcsTUFBYixDQUFvQm9CLEtBQUtqSSxLQUFMLENBQVdNLElBQS9CLEVBQXFDLEtBQXJDLENBQUosRUFBaUQsc0JBQUUsd0JBQXdCLHNCQUFPQSxJQUFQLEVBQWFnQyxNQUFiLENBQW9CLFlBQXBCLENBQXhCLEdBQTRELEdBQTlELEVBQW1FNkosTUFBbkUsR0FBNEV6RSxRQUE1RSxDQUFxRixjQUFyRjtBQUNqRCxVQUFJLHNCQUFPcEgsSUFBUCxFQUFhdUcsTUFBYixDQUFvQjVHLEdBQXBCLEVBQXlCLEtBQXpCLENBQUosRUFBcUMsc0JBQUUsd0JBQXdCLHNCQUFPSyxJQUFQLEVBQWFnQyxNQUFiLENBQW9CLFlBQXBCLENBQXhCLEdBQTRELEdBQTlELEVBQW1FK0osSUFBbkUsQ0FBd0UsV0FBVyxzQkFBTy9MLElBQVAsRUFBYWdDLE1BQWIsQ0FBb0IsR0FBcEIsQ0FBWCxHQUFzQyxTQUE5RztBQUNyQztBQXRCa0MsS0FBcEM7QUF5QkE7Ozs2Q0FFeUI0RSxTLEVBQVc7O0FBRXBDLDBCQUFFLG1CQUFGLEVBQXVCa0IsWUFBdkIsQ0FBb0MsVUFBcEMsRUFBZ0RsQixVQUFVNUcsSUFBMUQ7QUFDQSxRQUFJLENBQUMsc0JBQU80RyxVQUFVNUcsSUFBakIsRUFBdUJ1RyxNQUF2QixDQUE4QixLQUFLN0csS0FBTCxDQUFXTSxJQUF6QyxFQUErQyxNQUEvQyxDQUFMLEVBQTZEO0FBQzVELDJCQUFFLFVBQUYsRUFBY3FILFdBQWQsQ0FBMEIsY0FBMUI7QUFDQSwyQkFBRSx3QkFBd0Isc0JBQU9ULFVBQVU1RyxJQUFqQixFQUF1QmdDLE1BQXZCLENBQThCLFlBQTlCLENBQXhCLEdBQXNFLEdBQXhFLEVBQTZFNkosTUFBN0UsR0FBc0Z6RSxRQUF0RixDQUErRixjQUEvRjtBQUNBO0FBQ0Q7Ozs0QkFFUTtBQUNSLFdBQ0MsdUNBQUssSUFBRyxrQkFBUixHQUREO0FBR0E7Ozs7R0E1QzJDLGdCQUFNbkMsUzs7bUJBQTlCcUcsZTs7Ozs7Ozs7Ozs7Ozs7OztBQ0xyQjs7OztBQUNBOzs7Ozs7Ozs7Ozs7S0FFcUJVLGU7OztBQUVwQiwyQkFBWXRNLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxpSUFDWkEsS0FEWTs7QUFHbEIsU0FBS0ssS0FBTCxHQUFhO0FBQ1prTSxVQUFNLEVBRE07QUFFWkMsV0FBTztBQUZLLElBQWI7O0FBS0EsU0FBS0MsT0FBTCxHQUFlLE1BQUtBLE9BQUwsQ0FBYW5MLElBQWIsT0FBZjtBQUNBLFNBQUtvTCxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0JwTCxJQUFoQixPQUFsQjtBQVRrQjtBQVVsQjs7Ozt1Q0FFbUI7O0FBRW5CLFNBQUs2QixRQUFMLENBQWM7QUFDYm9KLFdBQU0sc0JBQU8sS0FBS3ZNLEtBQUwsQ0FBV00sSUFBbEIsRUFBd0JnQyxNQUF4QixDQUErQixNQUEvQixDQURPO0FBRWJrSyxZQUFPLHNCQUFPLEtBQUt4TSxLQUFMLENBQVdNLElBQWxCLEVBQXdCZ0MsTUFBeEIsQ0FBK0IsSUFBL0I7QUFGTSxLQUFkO0FBSUE7Ozs2Q0FFeUI0RSxTLEVBQVc7O0FBRXBDLFNBQUsvRCxRQUFMLENBQWM7QUFDYm9KLFdBQU0sc0JBQU9yRixVQUFVNUcsSUFBakIsRUFBdUJnQyxNQUF2QixDQUE4QixNQUE5QixDQURPO0FBRWJrSyxZQUFPLHNCQUFPdEYsVUFBVTVHLElBQWpCLEVBQXVCZ0MsTUFBdkIsQ0FBOEIsSUFBOUI7QUFGTSxLQUFkO0FBSUE7OzsyQkFFT2dDLEMsRUFBRztBQUNWQSxNQUFFQyxjQUFGOztBQUVBLFFBQUlvSSxVQUFVLHNCQUFPLEtBQUt0TSxLQUFMLENBQVdrTSxJQUFsQixFQUF3QixNQUF4QixFQUFnQzdJLEdBQWhDLENBQW9DLENBQXBDLEVBQXVDLE9BQXZDLEVBQWdEcEIsTUFBaEQsQ0FBdUQsTUFBdkQsQ0FBZDtBQUNBLFFBQUlnQyxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCeEIsR0FBakIsSUFBd0IsTUFBNUIsRUFBb0NpSSxVQUFVLHNCQUFPLEtBQUt0TSxLQUFMLENBQVdrTSxJQUFsQixFQUF3QixNQUF4QixFQUFnQzlJLFFBQWhDLENBQXlDLENBQXpDLEVBQTRDLE9BQTVDLEVBQXFEbkIsTUFBckQsQ0FBNEQsTUFBNUQsQ0FBVjs7QUFFcEMsU0FBS2EsUUFBTCxDQUFjLEVBQUVvSixNQUFNSSxPQUFSLEVBQWQ7QUFDQTs7OzhCQUVVckksQyxFQUFHO0FBQ2JBLE1BQUVDLGNBQUY7QUFDQSxTQUFLdkUsS0FBTCxDQUFXOEYsT0FBWCxDQUFtQixzQkFBT3hCLEVBQUVLLE1BQUYsQ0FBU3VCLE9BQVQsQ0FBaUJzRyxLQUF4QixFQUErQixTQUEvQixDQUFuQjtBQUNBOzs7NEJBRVE7QUFDUixRQUFJSSxXQUFXLHNCQUFPLEtBQUs1TSxLQUFMLENBQVdNLElBQWxCLEVBQXdCZ0MsTUFBeEIsQ0FBK0IsTUFBL0IsQ0FBZjtBQUFBLFFBQ0NyQyxNQUFNLHdCQUFTcUMsTUFBVCxDQUFnQixTQUFoQixDQURQOztBQUdBLFdBQ0M7QUFBQTtBQUFBLE9BQUssSUFBRyxrQkFBUjtBQUNDO0FBQUE7QUFBQTtBQUNDO0FBQUE7QUFBQSxTQUFHLE1BQUssRUFBUixFQUFXLFNBQVMsS0FBS21LLE9BQXpCLEVBQWtDLFlBQVMsTUFBM0M7QUFBbUQ7QUFBbkQsT0FERDtBQUVFLFdBQUtwTSxLQUFMLENBQVdrTSxJQUZiO0FBR0M7QUFBQTtBQUFBLFNBQUcsTUFBSyxFQUFSLEVBQVcsU0FBUyxLQUFLRSxPQUF6QixFQUFrQyxZQUFTLE1BQTNDO0FBQW1EO0FBQW5EO0FBSEQsTUFERDtBQU1DO0FBQUE7QUFBQSxRQUFJLElBQUcsZ0JBQVAsRUFBd0IsV0FBVyxLQUFLcE0sS0FBTCxDQUFXa00sSUFBWCxJQUFvQkssUUFBcEIsR0FBK0IsV0FBL0IsR0FBNkMsRUFBaEY7QUFFQztBQUFBO0FBQUEsU0FBSSxXQUFXLEtBQUt2TSxLQUFMLENBQVdtTSxLQUFYLElBQW9CLElBQXBCLEdBQTJCLFFBQTNCLEdBQXNDLEVBQXJEO0FBQ0Msc0JBQVl2TSxPQUFPLEtBQUtJLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FBekIsR0FBaUMsS0FBakMsR0FBeUMsTUFEdEQ7QUFFQyxzQkFBWSxLQUFLbE0sS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUYvQjtBQUdDLGlCQUFTLEtBQUtHLFVBSGY7QUFBQTtBQUFBLE9BRkQ7QUFNQztBQUFBO0FBQUEsU0FBSSxXQUFXLEtBQUtyTSxLQUFMLENBQVdtTSxLQUFYLElBQW9CLElBQXBCLEdBQTJCLFFBQTNCLEdBQXNDLEVBQXJEO0FBQ0Msc0JBQVl2TSxPQUFPLEtBQUtJLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FBekIsR0FBaUMsS0FBakMsR0FBeUMsTUFEdEQ7QUFFQyxzQkFBWSxLQUFLbE0sS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUYvQjtBQUdDLGlCQUFTLEtBQUtHLFVBSGY7QUFBQTtBQUFBLE9BTkQ7QUFVQztBQUFBO0FBQUEsU0FBSSxXQUFXLEtBQUtyTSxLQUFMLENBQVdtTSxLQUFYLElBQW9CLElBQXBCLEdBQTJCLFFBQTNCLEdBQXNDLEVBQXJEO0FBQ0Msc0JBQVl2TSxPQUFPLEtBQUtJLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FBekIsR0FBaUMsS0FBakMsR0FBeUMsTUFEdEQ7QUFFQyxzQkFBWSxLQUFLbE0sS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUYvQjtBQUdDLGlCQUFTLEtBQUtHLFVBSGY7QUFBQTtBQUFBLE9BVkQ7QUFjQztBQUFBO0FBQUEsU0FBSSxXQUFXLEtBQUtyTSxLQUFMLENBQVdtTSxLQUFYLElBQW9CLElBQXBCLEdBQTJCLFFBQTNCLEdBQXNDLEVBQXJEO0FBQ0Msc0JBQVl2TSxPQUFPLEtBQUtJLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FBekIsR0FBaUMsS0FBakMsR0FBeUMsTUFEdEQ7QUFFQyxzQkFBWSxLQUFLbE0sS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUYvQjtBQUdDLGlCQUFTLEtBQUtHLFVBSGY7QUFBQTtBQUFBLE9BZEQ7QUFrQkM7QUFBQTtBQUFBLFNBQUksV0FBVyxLQUFLck0sS0FBTCxDQUFXbU0sS0FBWCxJQUFvQixJQUFwQixHQUEyQixRQUEzQixHQUFzQyxFQUFyRDtBQUNDLHNCQUFZdk0sT0FBTyxLQUFLSSxLQUFMLENBQVdrTSxJQUFYLEdBQWtCLEtBQXpCLEdBQWlDLEtBQWpDLEdBQXlDLE1BRHREO0FBRUMsc0JBQVksS0FBS2xNLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FGL0I7QUFHQyxpQkFBUyxLQUFLRyxVQUhmO0FBQUE7QUFBQSxPQWxCRDtBQXNCQztBQUFBO0FBQUEsU0FBSSxXQUFXLEtBQUtyTSxLQUFMLENBQVdtTSxLQUFYLElBQW9CLElBQXBCLEdBQTJCLFFBQTNCLEdBQXNDLEVBQXJEO0FBQ0Msc0JBQVl2TSxPQUFPLEtBQUtJLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FBekIsR0FBaUMsS0FBakMsR0FBeUMsTUFEdEQ7QUFFQyxzQkFBWSxLQUFLbE0sS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUYvQjtBQUdDLGlCQUFTLEtBQUtHLFVBSGY7QUFBQTtBQUFBLE9BdEJEO0FBMEJDO0FBQUE7QUFBQSxTQUFJLFdBQVcsS0FBS3JNLEtBQUwsQ0FBV21NLEtBQVgsSUFBb0IsSUFBcEIsR0FBMkIsUUFBM0IsR0FBc0MsRUFBckQ7QUFDQyxzQkFBWXZNLE9BQU8sS0FBS0ksS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUF6QixHQUFpQyxLQUFqQyxHQUF5QyxNQUR0RDtBQUVDLHNCQUFZLEtBQUtsTSxLQUFMLENBQVdrTSxJQUFYLEdBQWtCLEtBRi9CO0FBR0MsaUJBQVMsS0FBS0csVUFIZjtBQUFBO0FBQUEsT0ExQkQ7QUE4QkM7QUFBQTtBQUFBLFNBQUksV0FBVyxLQUFLck0sS0FBTCxDQUFXbU0sS0FBWCxJQUFvQixJQUFwQixHQUEyQixRQUEzQixHQUFzQyxFQUFyRDtBQUNDLHNCQUFZdk0sT0FBTyxLQUFLSSxLQUFMLENBQVdrTSxJQUFYLEdBQWtCLEtBQXpCLEdBQWlDLEtBQWpDLEdBQXlDLE1BRHREO0FBRUMsc0JBQVksS0FBS2xNLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FGL0I7QUFHQyxpQkFBUyxLQUFLRyxVQUhmO0FBQUE7QUFBQSxPQTlCRDtBQWtDQztBQUFBO0FBQUEsU0FBSSxXQUFXLEtBQUtyTSxLQUFMLENBQVdtTSxLQUFYLElBQW9CLElBQXBCLEdBQTJCLFFBQTNCLEdBQXNDLEVBQXJEO0FBQ0Msc0JBQVl2TSxPQUFPLEtBQUtJLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FBekIsR0FBaUMsS0FBakMsR0FBeUMsTUFEdEQ7QUFFQyxzQkFBWSxLQUFLbE0sS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUYvQjtBQUdDLGlCQUFTLEtBQUtHLFVBSGY7QUFBQTtBQUFBLE9BbENEO0FBc0NDO0FBQUE7QUFBQSxTQUFJLFdBQVcsS0FBS3JNLEtBQUwsQ0FBV21NLEtBQVgsSUFBb0IsSUFBcEIsR0FBMkIsUUFBM0IsR0FBc0MsRUFBckQ7QUFDQyxzQkFBWXZNLE9BQU8sS0FBS0ksS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUF6QixHQUFpQyxLQUFqQyxHQUF5QyxNQUR0RDtBQUVDLHNCQUFZLEtBQUtsTSxLQUFMLENBQVdrTSxJQUFYLEdBQWtCLEtBRi9CO0FBR0MsaUJBQVMsS0FBS0csVUFIZjtBQUFBO0FBQUEsT0F0Q0Q7QUEwQ0M7QUFBQTtBQUFBLFNBQUksV0FBVyxLQUFLck0sS0FBTCxDQUFXbU0sS0FBWCxJQUFvQixJQUFwQixHQUEyQixRQUEzQixHQUFzQyxFQUFyRDtBQUNDLHNCQUFZdk0sT0FBTyxLQUFLSSxLQUFMLENBQVdrTSxJQUFYLEdBQWtCLEtBQXpCLEdBQWlDLEtBQWpDLEdBQXlDLE1BRHREO0FBRUMsc0JBQVksS0FBS2xNLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FGL0I7QUFHQyxpQkFBUyxLQUFLRyxVQUhmO0FBQUE7QUFBQSxPQTFDRDtBQThDQztBQUFBO0FBQUEsU0FBSSxXQUFXLEtBQUtyTSxLQUFMLENBQVdtTSxLQUFYLElBQW9CLElBQXBCLEdBQTJCLFFBQTNCLEdBQXNDLEVBQXJEO0FBQ0Msc0JBQVl2TSxPQUFPLEtBQUtJLEtBQUwsQ0FBV2tNLElBQVgsR0FBa0IsS0FBekIsR0FBaUMsS0FBakMsR0FBeUMsTUFEdEQ7QUFFQyxzQkFBWSxLQUFLbE0sS0FBTCxDQUFXa00sSUFBWCxHQUFrQixLQUYvQjtBQUdDLGlCQUFTLEtBQUtHLFVBSGY7QUFBQTtBQUFBO0FBOUNEO0FBTkQsS0FERDtBQTZEQTs7OztHQTdHMkMsZ0JBQU1uSCxTOzttQkFBOUIrRyxlOzs7Ozs7Ozs7Ozs7Ozs7O0FDSHJCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7Ozs7S0FFcUJPLGM7OztBQUVwQiwwQkFBWTdNLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrSEFDWkEsS0FEWTs7QUFHbEIsU0FBS0ssS0FBTCxHQUFhO0FBQ1pFLFVBQU0sUUFETTtBQUVaVSxhQUFTLEtBRkc7QUFHWkMsWUFBUTtBQUNQa0IsWUFBTyxFQURBO0FBRVBtQixZQUFPLEVBRkE7QUFHUEMsVUFBSyxFQUhFO0FBSVBhLGFBQVEsSUFKRDtBQUtQeUksZUFBVSxLQUxIO0FBTVA1SSxlQUFVLEVBQUUwRixNQUFNLEVBQVIsRUFBWVgsT0FBTyxFQUFuQixFQUF1QjlFLEtBQUssRUFBNUIsRUFOSDtBQU9QdEQsV0FBTSxFQUFFK0ksTUFBTSxFQUFFbUQsT0FBTyxFQUFULEVBQWFDLE1BQU0sRUFBbkIsRUFBUixFQUFpQ0MsVUFBVSxFQUEzQyxFQUErQzlJLEtBQUssRUFBcEQsRUFQQztBQVFQK0ksZ0JBQVcsTUFSSjtBQVNQQyxXQUFNO0FBVEM7QUFISSxJQUFiOztBQWdCQSxTQUFLQyxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0I5TCxJQUFoQixPQUFsQjtBQW5Ca0I7QUFvQmxCOzs7O3VDQUVtQjtBQUFBOztBQUNuQixTQUFLNkIsUUFBTCxDQUFjLEVBQUVsQyxTQUFTLElBQVgsRUFBZCxFQUFpQyxZQUFNOztBQUV0QyxzQkFBRXlCLElBQUYsQ0FBTztBQUNOQyxjQUFRLEtBREY7QUFFTkMsV0FBS1QsU0FBU1UsT0FBVCxHQUFtQixrQkFBbkIsR0FBd0MsT0FBSzdDLEtBQUwsQ0FBV2tCLE1BRmxEO0FBR040QixnQkFBVTtBQUhKLE1BQVAsRUFJR0MsSUFKSCxDQUlRLGNBQU07O0FBRWIsVUFBSWlCLEdBQUdLLE1BQVAsRUFBZTtBQUNkTCxVQUFHVCxLQUFILEdBQVcsc0JBQU9TLEdBQUdULEtBQVYsRUFBaUIsR0FBakIsQ0FBWDtBQUNBLFdBQUlTLEdBQUdSLEdBQVAsRUFBWTtBQUNYUSxXQUFHUixHQUFILEdBQVMsc0JBQU9RLEdBQUdSLEdBQVYsRUFBZSxHQUFmLENBQVQ7QUFDQSxZQUFJLENBQUMsc0JBQU9RLEdBQUdULEtBQVYsRUFBaUJzRCxNQUFqQixDQUF3QjdDLEdBQUdSLEdBQTNCLEVBQWdDLEtBQWhDLENBQUwsRUFBNkNRLEdBQUcsVUFBSCxJQUFpQixJQUFqQjtBQUM3QztBQUNELE9BTkQsTUFNTztBQUNOQSxVQUFHVCxLQUFILEdBQVcsc0JBQU9TLEdBQUdULEtBQVYsRUFBaUIsR0FBakIsRUFBc0JFLFFBQXRCLENBQStCLENBQS9CLEVBQWtDLE9BQWxDLENBQVg7QUFDQSxXQUFJTyxHQUFHUixHQUFQLEVBQVlRLEdBQUdSLEdBQUgsR0FBUyxzQkFBT1EsR0FBR1IsR0FBVixFQUFlLEdBQWYsRUFBb0JDLFFBQXBCLENBQTZCLENBQTdCLEVBQWdDLE9BQWhDLENBQVQ7QUFDWjtBQUNELGFBQUtOLFFBQUwsQ0FBYyxFQUFFakMsUUFBUThDLEVBQVYsRUFBYy9DLFNBQVMsS0FBdkIsRUFBZDtBQUNBLE1BakJEO0FBbUJBLEtBckJEO0FBc0JBOzs7OEJBRVVxRCxDLEVBQUc7QUFDYkEsTUFBRUMsY0FBRjtBQUNBLFNBQUtwQixRQUFMLENBQWMsRUFBRTVDLE1BQU0rRCxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCeEIsR0FBekIsRUFBZDtBQUNBOzs7NEJBRVE7QUFDUixRQUFJeEQsU0FBUyxLQUFLYixLQUFMLENBQVdhLE1BQXhCO0FBQUEsUUFDQ21NLG9CQUREO0FBQUEsUUFDY0MscUJBRGQ7QUFBQSxRQUVDQyxtQkFGRDtBQUFBLFFBRWFDLHVCQUZiOztBQUlBLFFBQUl0TSxPQUFPcUMsS0FBUCxJQUFnQnJDLE9BQU9zQyxHQUF2QixJQUE4QnRDLE9BQU9tRCxNQUF6QyxFQUFpRDtBQUNoRGtKLGtCQUNDO0FBQUE7QUFBQSxRQUFNLFdBQVUsYUFBaEI7QUFDQztBQUFBO0FBQUE7QUFBTyw2QkFBT3JNLE9BQU9xQyxLQUFkLEVBQXFCakIsTUFBckIsQ0FBNEIsa0JBQTVCO0FBQVAsT0FERDtBQUFBO0FBQ3dFO0FBQUE7QUFBQTtBQUFPLDZCQUFPcEIsT0FBT3NDLEdBQWQsRUFBbUJsQixNQUFuQixDQUEwQixrQkFBMUI7QUFBUDtBQUR4RSxNQUREO0FBS0FrTCxzQkFDQztBQUFBO0FBQUEsUUFBTyxXQUFVLGlCQUFqQjtBQUNFLDRCQUFPdE0sT0FBT3NDLEdBQWQsRUFBbUJpSyxJQUFuQixDQUF3QnZNLE9BQU9xQyxLQUEvQixFQUFzQyxNQUF0QyxJQUFnRCxDQURsRDtBQUFBO0FBQUEsTUFERDtBQUtBLEtBWEQsTUFXTyxJQUFJckMsT0FBT3FDLEtBQVAsSUFBZ0IsQ0FBQ3JDLE9BQU9zQyxHQUF4QixJQUErQnRDLE9BQU9tRCxNQUExQyxFQUFrRDtBQUN4RGtKLGtCQUNDO0FBQUE7QUFBQSxRQUFNLFdBQVUsYUFBaEI7QUFDQztBQUFBO0FBQUE7QUFBTyw2QkFBT3JNLE9BQU9xQyxLQUFkLEVBQXFCakIsTUFBckIsQ0FBNEIsa0JBQTVCO0FBQVA7QUFERCxNQUREO0FBS0FrTCxzQkFDQztBQUFBO0FBQUEsUUFBTyxXQUFVLGlCQUFqQjtBQUFBO0FBQUEsTUFERDtBQUdBLEtBVE0sTUFTQSxJQUFJdE0sT0FBT3FDLEtBQVAsSUFBZ0JyQyxPQUFPc0MsR0FBdkIsSUFBOEIsQ0FBQ3RDLE9BQU9tRCxNQUExQyxFQUFrRDtBQUN4RGtKLGtCQUNDO0FBQUE7QUFBQSxRQUFNLFdBQVUsYUFBaEI7QUFDQztBQUFBO0FBQUE7QUFBTyw2QkFBT3JNLE9BQU9xQyxLQUFkLEVBQXFCakIsTUFBckIsQ0FBNEIsa0JBQTVCLENBQVA7QUFBQTtBQUEwRCw2QkFBT3BCLE9BQU9xQyxLQUFkLEVBQXFCakIsTUFBckIsQ0FBNEIsTUFBNUIsQ0FBMUQ7QUFBQTtBQUF3Ryw2QkFBT3BCLE9BQU9zQyxHQUFkLEVBQW1CbEIsTUFBbkIsQ0FBMEIsTUFBMUI7QUFBeEc7QUFERCxNQUREOztBQU1BLFNBQUksc0JBQU9wQixPQUFPc0MsR0FBZCxFQUFtQmlLLElBQW5CLENBQXdCdk0sT0FBT3FDLEtBQS9CLEVBQXNDLFNBQXRDLElBQW1ELEdBQXZELEVBQTREO0FBQzNEaUssdUJBQ0M7QUFBQTtBQUFBLFNBQU8sV0FBVSxpQkFBakI7QUFBb0MsNkJBQU90TSxPQUFPc0MsR0FBZCxFQUFtQmlLLElBQW5CLENBQXdCdk0sT0FBT3FDLEtBQS9CLEVBQXNDLE9BQXRDLENBQXBDO0FBQUE7QUFBQSxPQUREO0FBR0EsTUFKRCxNQUlPO0FBQ05pSyx1QkFDQztBQUFBO0FBQUEsU0FBTyxXQUFVLGlCQUFqQjtBQUFvQyw2QkFBT3RNLE9BQU9zQyxHQUFkLEVBQW1CaUssSUFBbkIsQ0FBd0J2TSxPQUFPcUMsS0FBL0IsRUFBc0MsU0FBdEMsQ0FBcEM7QUFBQTtBQUFBLE9BREQ7QUFHQTtBQUNELEtBaEJNLE1BZ0JBLElBQUlyQyxPQUFPcUMsS0FBUCxJQUFnQixDQUFDckMsT0FBT3NDLEdBQXhCLElBQStCLENBQUN0QyxPQUFPbUQsTUFBM0MsRUFBbUQ7QUFDekRrSixrQkFDQztBQUFBO0FBQUEsUUFBTSxXQUFVLGFBQWhCO0FBQ0M7QUFBQTtBQUFBO0FBQU8sNkJBQU9yTSxPQUFPcUMsS0FBZCxFQUFxQmpCLE1BQXJCLENBQTRCLGtCQUE1QixDQUFQO0FBQUE7QUFBMEQsNkJBQU9wQixPQUFPcUMsS0FBZCxFQUFxQmpCLE1BQXJCLENBQTRCLE1BQTVCO0FBQTFEO0FBREQsTUFERDtBQUtBOztBQUVELFFBQUksS0FBS2pDLEtBQUwsQ0FBV0UsSUFBWCxJQUFtQixRQUF2QixFQUFpQztBQUNoQzhNLG1CQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsWUFBZixFQUE0QixPQUFPLEVBQUNLLFlBQVksS0FBYixFQUFuQztBQUNDLDZDQUFLLFdBQVUsWUFBZixFQUE0QixPQUFPLEVBQUN6QyxpQkFBaUIvSixPQUFPZ0QsUUFBUCxDQUFnQitFLEtBQWxDLEVBQW5DLEdBREQ7QUFHQztBQUFBO0FBQUEsU0FBSSxXQUFVLGFBQWQ7QUFFQztBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDQztBQUFBO0FBQUE7QUFBQTtBQUFBLFNBREQ7QUFFQztBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUE7QUFBUy9ILGlCQUFPa0I7QUFBaEI7QUFBSjtBQUZELFFBRkQ7QUFPQztBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDQztBQUFBO0FBQUE7QUFBQTtBQUFBLFNBREQ7QUFFQztBQUFBO0FBQUE7QUFBS21MLG1CQUFMO0FBQUE7QUFBa0JDO0FBQWxCO0FBRkQsUUFQRDtBQVlDO0FBQUE7QUFBQSxVQUFLLFdBQVUsUUFBZjtBQUNDO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERDtBQUVDO0FBQUE7QUFBQTtBQUFJLDhDQUFHLE9BQU8sRUFBQ3ZDLGlCQUFpQi9KLE9BQU9nRCxRQUFQLENBQWdCK0UsS0FBbEMsRUFBVixHQUFKO0FBQUE7QUFBOEQvSCxnQkFBT2dELFFBQVAsQ0FBZ0IwRjtBQUE5RTtBQUZELFFBWkQ7QUFpQkM7QUFBQTtBQUFBLFVBQUssV0FBVzFJLE9BQU9nTSxTQUFQLElBQW9CLE1BQXBCLEdBQTZCLFFBQTdCLEdBQXdDLGFBQXhEO0FBQ0M7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUREO0FBRUM7QUFBQTtBQUFBLFdBQUksT0FBTyxFQUFFUyxlQUFlLFlBQWpCLEVBQVg7QUFBNkN6TSxnQkFBT2dNO0FBQXBEO0FBRkQsUUFqQkQ7QUFzQkM7QUFBQTtBQUFBLFVBQUssV0FBV2hNLE9BQU9pTSxJQUFQLEdBQWMsUUFBZCxHQUF5QixhQUF6QztBQUNDO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERDtBQUVDO0FBQUE7QUFBQTtBQUFLak0sZ0JBQU9pTTtBQUFaO0FBRkQsUUF0QkQ7QUEyQkM7QUFBQTtBQUFBLFVBQUssV0FBVSxRQUFmO0FBQ0M7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUREO0FBRUM7QUFBQTtBQUFBO0FBQ0VqTSxnQkFBT0wsSUFBUCxDQUFZK0ksSUFBWixDQUFpQm1ELEtBRG5CO0FBQUE7QUFDMkI3TCxnQkFBT0wsSUFBUCxDQUFZK0ksSUFBWixDQUFpQm9ELElBRDVDO0FBQUE7QUFDa0Q7QUFBQTtBQUFBO0FBQVEsZ0NBQU85TCxPQUFPME0sS0FBZCxFQUFxQkMsT0FBckI7QUFBUjtBQURsRDtBQUZEO0FBM0JEO0FBSEQsTUFERDtBQXdDQTs7QUFFRCxRQUFJLEtBQUt4TixLQUFMLENBQVdFLElBQVgsSUFBbUIsUUFBdkIsRUFBaUM7QUFDaEM4TSxtQkFBYztBQUNiLGtCQUFZLEtBQUtyTixLQUFMLENBQVdvQixVQURWO0FBRWIsY0FBUSxLQUFLZixLQUFMLENBQVdhLE1BRk47QUFHYixtQkFBYSxLQUFLbEIsS0FBTCxDQUFXNkIsV0FIWDtBQUliLG1CQUFhLEtBQUs3QixLQUFMLENBQVc4TixXQUpYLEdBQWQ7QUFLQTs7QUFFRCxRQUFJLHNCQUFFLGNBQUYsRUFBa0IvRyxRQUFsQixDQUEyQixXQUEzQixLQUEyQyxLQUFLL0csS0FBTCxDQUFXYSxJQUFYLENBQWdCc0QsR0FBaEIsSUFBdUJqRCxPQUFPTCxJQUFQLENBQVlzRCxHQUFsRixFQUF1RjtBQUN0Rm1KLG9CQUFlO0FBQUE7QUFBQSxRQUFLLFdBQVcsS0FBS2pOLEtBQUwsQ0FBV0UsSUFBWCxJQUFtQixRQUFuQixHQUE4QixRQUE5QixHQUF5QyxFQUF6RCxFQUE2RCxTQUFTLEtBQUs2TSxVQUEzRSxFQUF1RixZQUFTLFFBQWhHO0FBQUE7QUFBQSxNQUFmO0FBQ0E7O0FBRUQsV0FDQztBQUFBO0FBQUEsT0FBSyxJQUFHLG1CQUFSO0FBQ0M7QUFBQTtBQUFBLFFBQVEsV0FBVSxjQUFsQjtBQUNDO0FBQUE7QUFBQSxTQUFLLFdBQVcsS0FBSy9NLEtBQUwsQ0FBV0UsSUFBWCxJQUFtQixRQUFuQixHQUE4QixRQUE5QixHQUF5QyxFQUF6RCxFQUE2RCxTQUFTLEtBQUs2TSxVQUEzRSxFQUF1RixZQUFTLFFBQWhHO0FBQUE7QUFBQSxPQUREO0FBRUVFLGtCQUZGO0FBR0M7QUFBQTtBQUFBLFNBQUssSUFBRyxhQUFSLEVBQXNCLFNBQVMsS0FBS3ROLEtBQUwsQ0FBVzZCLFdBQTFDO0FBQUE7QUFBQTtBQUhELE1BREQ7QUFNRXdMLGdCQU5GO0FBT0M7QUFBQTtBQUFBLFFBQUssV0FBVyxLQUFLaE4sS0FBTCxDQUFXWSxPQUFYLEdBQXFCLGdCQUFyQixHQUF3QyxTQUF4RDtBQUNDLDZDQUFLLFdBQVUsU0FBZjtBQUREO0FBUEQsS0FERDtBQWFBOzs7O0dBM0swQyxnQkFBTXNFLFM7O21CQUE3QnNILGM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOckI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztLQUVxQmtCLGM7OztBQUVwQiwwQkFBWS9OLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrSEFDWkEsS0FEWTs7QUFHbEIsU0FBS0ssS0FBTCxHQUFhO0FBQ1pZLGFBQVMsS0FERztBQUVaQyxZQUFRO0FBQ1BrQixZQUFPLEVBREE7QUFFUG1CLFlBQU8sRUFGQTtBQUdQQyxVQUFLLEVBSEU7QUFJUGEsYUFBUSxJQUpEO0FBS1B5SSxlQUFVLEtBTEg7QUFNUDVJLGVBQVUsRUFOSDtBQU9QZ0osZ0JBQVcsTUFQSjtBQVFQck0sV0FBTSxFQVJDO0FBU1BzTSxXQUFNO0FBVEM7QUFGSSxJQUFiOztBQWVBLFNBQUtySCxPQUFMLEdBQWUsTUFBS0EsT0FBTCxDQUFheEUsSUFBYixPQUFmO0FBQ0EsU0FBSzBNLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQjFNLElBQWxCLE9BQXBCO0FBQ0EsU0FBSzJNLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQjNNLElBQXBCLE9BQXRCO0FBQ0EsU0FBSzRNLFVBQUwsR0FBa0IsTUFBS0EsVUFBTCxDQUFnQjVNLElBQWhCLE9BQWxCO0FBQ0EsU0FBSzZNLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQjdNLElBQW5CLE9BQXJCO0FBQ0EsU0FBSzhNLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQjlNLElBQWxCLE9BQXBCO0FBQ0EsU0FBSytNLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQi9NLElBQWxCLE9BQXBCO0FBeEJrQjtBQXlCbEI7Ozs7dUNBRW1COztBQUVuQixRQUFJMkcsT0FBTyxJQUFYO0FBQUEsUUFBaUIvRyxTQUFTLEtBQUtsQixLQUFMLENBQVdrQixNQUFyQztBQUNBQSxXQUFPZ0QsUUFBUCxHQUFrQmhELE9BQU9nRCxRQUFQLENBQWdCQyxHQUFsQztBQUNBakQsV0FBT3FDLEtBQVAsR0FBZSxzQkFBT3JDLE9BQU9xQyxLQUFkLENBQWY7QUFDQSxRQUFJckMsT0FBT3NDLEdBQVgsRUFBZ0J0QyxPQUFPc0MsR0FBUCxHQUFhLHNCQUFPdEMsT0FBT3NDLEdBQWQsQ0FBYjs7QUFFaEIsU0FBS0wsUUFBTCxDQUFjLEVBQUVqQyxjQUFGLEVBQWQsRUFBMEIsWUFBTTs7QUFFL0IsMkJBQUUsb0JBQUYsRUFBd0JrSCxZQUF4QixDQUFxQztBQUNwQ0MsZ0JBQVUsQ0FEMEI7QUFFcENDLGNBQVE7QUFDUHVELGFBQU0sRUFEQztBQUVQQyxlQUFRLGlCQUZEO0FBR1BDLGNBQU87QUFIQSxPQUY0QjtBQU9wQ0MsbUJBQWEsS0FQdUI7QUFRcENDLGtCQUFZO0FBQ1g5RixhQUFNLFFBREs7QUFFWEMsYUFBTTtBQUZLLE9BUndCO0FBWXBDbUMscUJBQWUsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsRUFBK0IsR0FBL0IsQ0FacUI7QUFhcENHLGVBYm9DLHFCQWExQnBJLElBYjBCLEVBYXBCcUksSUFib0IsRUFhZDtBQUNyQiw2QkFBRUEsSUFBRixFQUFRMEQsSUFBUixDQUFhLFdBQVcsc0JBQU8vTCxJQUFQLEVBQWFnQyxNQUFiLENBQW9CLEdBQXBCLENBQVgsR0FBc0MsU0FBbkQ7QUFDQSxXQUFJMkYsS0FBSzVILEtBQUwsQ0FBV2EsTUFBWCxDQUFrQjRMLFFBQXRCLEVBQWdDO0FBQy9CLFlBQUksc0JBQU94TSxJQUFQLEVBQWF1RyxNQUFiLENBQW9Cb0IsS0FBSzVILEtBQUwsQ0FBV2EsTUFBWCxDQUFrQnFDLEtBQXRDLEVBQTZDLEtBQTdDLENBQUosRUFBeUQsc0JBQUVvRixJQUFGLEVBQVFqQixRQUFSLENBQWlCLGdCQUFqQjtBQUN6RCxZQUFJLHNCQUFPcEgsSUFBUCxFQUFhdUcsTUFBYixDQUFvQm9CLEtBQUs1SCxLQUFMLENBQVdhLE1BQVgsQ0FBa0JzQyxHQUF0QyxFQUEyQyxLQUEzQyxDQUFKLEVBQXVELHNCQUFFbUYsSUFBRixFQUFRakIsUUFBUixDQUFpQixjQUFqQjtBQUN2RCxZQUFJLHNCQUFPcEgsSUFBUCxFQUFhMEosU0FBYixDQUF1Qi9CLEtBQUs1SCxLQUFMLENBQVdhLE1BQVgsQ0FBa0JxQyxLQUF6QyxFQUFnRDBFLEtBQUs1SCxLQUFMLENBQVdhLE1BQVgsQ0FBa0JzQyxHQUFsRSxDQUFKLEVBQTRFLHNCQUFFbUYsSUFBRixFQUFRakIsUUFBUixDQUFpQixVQUFqQjtBQUM1RSxRQUpELE1BSU87QUFDTixZQUFJLHNCQUFPTyxLQUFLNUgsS0FBTCxDQUFXYSxNQUFYLENBQWtCcUMsS0FBekIsRUFBZ0NzRCxNQUFoQyxDQUF1Q3ZHLElBQXZDLEVBQTZDLEtBQTdDLENBQUosRUFBeUQsc0JBQUVxSSxJQUFGLEVBQVFqQixRQUFSLENBQWlCLG9CQUFqQjtBQUN6RDtBQUNELE9BdEJtQztBQXVCcEN3RSxjQXZCb0Msb0JBdUIzQjVMLElBdkIyQixFQXVCckIrSSxPQXZCcUIsRUF1Qlo5SSxJQXZCWSxFQXVCTjtBQUM3QjBILFlBQUtuQyxPQUFMLENBQWF4RixJQUFiO0FBQ0E7QUF6Qm1DLE1BQXJDO0FBMkJBLEtBN0JEO0FBOEJBOzs7MkJBRU9BLEksRUFBTTtBQUFBOztBQUNiLFFBQUlZLFNBQVMsS0FBS2IsS0FBTCxDQUFXYSxNQUF4QjtBQUNBLDBCQUFFLFNBQUYsRUFBYXlHLFdBQWIsQ0FBeUIsb0JBQXpCOztBQUVBLFFBQUksS0FBS3RILEtBQUwsQ0FBV2EsTUFBWCxDQUFrQjRMLFFBQXRCLEVBQWdDO0FBQy9CLFNBQUksc0JBQU94TSxJQUFQLEVBQWFnSCxRQUFiLENBQXNCLEtBQUtqSCxLQUFMLENBQVdhLE1BQVgsQ0FBa0JxQyxLQUF4QyxDQUFKLEVBQW9EO0FBQ25EckMsYUFBT3FDLEtBQVAsR0FBZSxzQkFBT2pELElBQVAsQ0FBZjtBQUNBLE1BRkQsTUFFTyxJQUFJLHNCQUFPQSxJQUFQLEVBQWEwSixTQUFiLENBQXVCLEtBQUszSixLQUFMLENBQVdhLE1BQVgsQ0FBa0JxQyxLQUF6QyxFQUFnRCxLQUFLbEQsS0FBTCxDQUFXYSxNQUFYLENBQWtCc0MsR0FBbEUsQ0FBSixFQUE0RTtBQUNsRnRDLGFBQU9xQyxLQUFQLEdBQWUsc0JBQU9qRCxJQUFQLENBQWY7QUFDQSxNQUZNLE1BRUEsSUFBSSxzQkFBT0EsSUFBUCxFQUFhaUgsT0FBYixDQUFxQixLQUFLbEgsS0FBTCxDQUFXYSxNQUFYLENBQWtCcUMsS0FBdkMsQ0FBSixFQUFtRDtBQUN6RHJDLGFBQU9zQyxHQUFQLEdBQWEsc0JBQU9sRCxJQUFQLENBQWI7QUFDQTs7QUFFRCxVQUFLNkMsUUFBTCxDQUFjLEVBQUVqQyxRQUFRQSxNQUFWLEVBQWQsRUFBa0MsWUFBTTtBQUN2Q29OLGdCQUFVLE9BQUtqTyxLQUFMLENBQVdhLE1BQVgsQ0FBa0JxQyxLQUE1QixFQUFtQyxPQUFLbEQsS0FBTCxDQUFXYSxNQUFYLENBQWtCc0MsR0FBckQ7QUFDQSxNQUZEO0FBR0EsS0FaRCxNQVlPO0FBQ04sMkJBQUUsdUJBQXVCLHNCQUFPbEQsSUFBUCxFQUFhZ0MsTUFBYixDQUFvQixZQUFwQixDQUF2QixHQUEyRCxHQUE3RCxFQUFrRW9GLFFBQWxFLENBQTJFLG9CQUEzRTtBQUNBeEcsWUFBT3FDLEtBQVAsR0FBZSxzQkFBT2pELElBQVAsQ0FBZjtBQUNBWSxZQUFPc0MsR0FBUCxHQUFhLEVBQWI7QUFDQSxVQUFLTCxRQUFMLENBQWMsRUFBRWpDLFFBQVFBLE1BQVYsRUFBZDtBQUNBOztBQUVELGFBQVNvTixTQUFULENBQW9CL0ssS0FBcEIsRUFBMkJDLEdBQTNCLEVBQWdDO0FBQy9CLFNBQUl1SCxNQUFNLHNCQUFPdkgsR0FBUCxFQUFZaUssSUFBWixDQUFpQmxLLEtBQWpCLEVBQXdCLE1BQXhCLENBQVY7QUFDQSxVQUFLLElBQUkyRyxJQUFJLENBQWIsRUFBZ0JBLEtBQUthLEdBQXJCLEVBQTBCYixHQUExQixFQUErQjtBQUM5Qiw0QkFBRSx1QkFBdUIsc0JBQU8zRyxLQUFQLEVBQWNHLEdBQWQsQ0FBa0J3RyxDQUFsQixFQUFxQixNQUFyQixFQUE2QjVILE1BQTdCLENBQW9DLFlBQXBDLENBQXZCLEdBQTJFLEdBQTdFLEVBQWtGb0YsUUFBbEYsQ0FBMkYsVUFBM0Y7O0FBRUEsVUFBSXdDLEtBQUssQ0FBVCxFQUFZLHNCQUFFLHVCQUF1QixzQkFBTzNHLEtBQVAsRUFBY0csR0FBZCxDQUFrQndHLENBQWxCLEVBQXFCLE1BQXJCLEVBQTZCNUgsTUFBN0IsQ0FBb0MsWUFBcEMsQ0FBdkIsR0FBMkUsR0FBN0UsRUFBa0ZvRixRQUFsRixDQUEyRixPQUEzRjtBQUNaLFVBQUl3QyxLQUFLYSxHQUFULEVBQWMsc0JBQUUsdUJBQXVCLHNCQUFPeEgsS0FBUCxFQUFjRyxHQUFkLENBQWtCd0csQ0FBbEIsRUFBcUIsTUFBckIsRUFBNkI1SCxNQUE3QixDQUFvQyxZQUFwQyxDQUF2QixHQUEyRSxHQUE3RSxFQUFrRm9GLFFBQWxGLENBQTJGLEtBQTNGO0FBQ2Q7QUFDRDtBQUNEOzs7Z0NBRVlwRCxDLEVBQUc7QUFDZixRQUFJcEQsU0FBUyxLQUFLYixLQUFMLENBQVdhLE1BQXhCO0FBQ0FBLFdBQU9vRCxFQUFFSyxNQUFGLENBQVNpRixJQUFoQixJQUF3QnRGLEVBQUVLLE1BQUYsQ0FBUzRKLEtBQWpDO0FBQ0EsU0FBS3BMLFFBQUwsQ0FBYyxFQUFFakMsUUFBUUEsTUFBVixFQUFkO0FBQ0E7OztrQ0FFY29ELEMsRUFBRztBQUFBOztBQUNqQixRQUFJcEQsU0FBUyxLQUFLYixLQUFMLENBQVdhLE1BQXhCO0FBQ0EsUUFBSSxzQkFBRW9ELEVBQUVLLE1BQUosRUFBWW9DLFFBQVosQ0FBcUIsUUFBckIsQ0FBSixFQUFvQztBQUNuQzdGLFlBQU9vRCxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCeEIsR0FBeEIsSUFBK0IsS0FBL0I7QUFDQSxLQUZELE1BRU87QUFBRXhELFlBQU9vRCxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCeEIsR0FBeEIsSUFBK0IsSUFBL0I7QUFBdUM7O0FBRWhELFFBQUl4RCxPQUFPNEwsUUFBUCxJQUFtQixJQUFuQixJQUEyQixLQUFLek0sS0FBTCxDQUFXYSxNQUFYLENBQWtCNEwsUUFBbEIsSUFBOEIsSUFBN0QsRUFBbUU1TCxPQUFPLFFBQVAsSUFBbUIsSUFBbkI7QUFDbkUsUUFBSUEsT0FBTzRMLFFBQVAsSUFBbUIsS0FBbkIsSUFBNEIsS0FBS3pNLEtBQUwsQ0FBV2EsTUFBWCxDQUFrQjRMLFFBQWxCLElBQThCLEtBQTlELEVBQXFFNUwsT0FBTyxLQUFQLElBQWdCLEVBQWhCO0FBQ3JFLFFBQUlBLE9BQU9tRCxNQUFQLElBQWlCLElBQXJCLEVBQTJCbkQsT0FBTyxPQUFQLElBQWtCLHNCQUFPLEtBQUtiLEtBQUwsQ0FBV2EsTUFBWCxDQUFrQnFDLEtBQXpCLEVBQWdDaUwsR0FBaEMsQ0FBb0MsRUFBQyxRQUFRLENBQVQsRUFBWSxVQUFVLENBQXRCLEVBQXBDLENBQWxCOztBQUUzQixTQUFLckwsUUFBTCxDQUFjLEVBQUVqQyxRQUFRQSxNQUFWLEVBQWQsRUFBa0MsWUFBTTtBQUN2QyxTQUFJQSxPQUFPNEwsUUFBUCxJQUFtQixLQUF2QixFQUE4QixPQUFLaEgsT0FBTCxDQUFhLE9BQUt6RixLQUFMLENBQVdhLE1BQVgsQ0FBa0JxQyxLQUEvQjtBQUM5QixLQUZEO0FBR0E7Ozs4QkFFVWUsQyxFQUFHO0FBQ2IsUUFBSXBELFNBQVMsS0FBS2IsS0FBTCxDQUFXYSxNQUF4QjtBQUFBLFFBQ0NpSSxPQUFPckUsT0FBT1IsRUFBRUssTUFBRixDQUFTNEosS0FBaEIsQ0FEUjs7QUFHQSxRQUFJakssRUFBRUssTUFBRixDQUFTdUIsT0FBVCxDQUFpQnhCLEdBQWpCLElBQXdCLGFBQTVCLEVBQTJDeEQsT0FBT3FDLEtBQVAsR0FBZSxzQkFBT3JDLE9BQU9xQyxLQUFkLEVBQXFCaUwsR0FBckIsQ0FBeUIsTUFBekIsRUFBaUNyRixJQUFqQyxDQUFmO0FBQzNDLFFBQUk3RSxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCeEIsR0FBakIsSUFBd0IsZUFBNUIsRUFBNkN4RCxPQUFPcUMsS0FBUCxHQUFlLHNCQUFPckMsT0FBT3FDLEtBQWQsRUFBcUJpTCxHQUFyQixDQUF5QixRQUF6QixFQUFtQ3JGLElBQW5DLENBQWY7QUFDN0MsUUFBSTdFLEVBQUVLLE1BQUYsQ0FBU3VCLE9BQVQsQ0FBaUJ4QixHQUFqQixJQUF3QixXQUE1QixFQUF5Q3hELE9BQU9zQyxHQUFQLEdBQWEsc0JBQU90QyxPQUFPc0MsR0FBZCxFQUFtQmdMLEdBQW5CLENBQXVCLE1BQXZCLEVBQStCckYsSUFBL0IsQ0FBYjtBQUN6QyxRQUFJN0UsRUFBRUssTUFBRixDQUFTdUIsT0FBVCxDQUFpQnhCLEdBQWpCLElBQXdCLGFBQTVCLEVBQTJDeEQsT0FBT3NDLEdBQVAsR0FBYSxzQkFBT3RDLE9BQU9zQyxHQUFkLEVBQW1CZ0wsR0FBbkIsQ0FBdUIsUUFBdkIsRUFBaUNyRixJQUFqQyxDQUFiOztBQUUzQyxRQUFJLHNCQUFPakksT0FBT3NDLEdBQWQsRUFBbUI4RCxRQUFuQixDQUE0QnBHLE9BQU9xQyxLQUFuQyxDQUFKLEVBQStDLE9BQU9rTCxNQUFNLGNBQU4sQ0FBUDs7QUFFL0MsU0FBS3RMLFFBQUwsQ0FBYyxFQUFFakMsUUFBUUEsTUFBVixFQUFkO0FBQ0E7OztpQ0FFYW9ELEMsRUFBRztBQUNoQixRQUFJcEQsU0FBUyxLQUFLYixLQUFMLENBQVdhLE1BQXhCOztBQUVBLFFBQUlBLE9BQU9zQyxHQUFQLElBQWMsRUFBZCxJQUFvQnRDLE9BQU9tRCxNQUFQLElBQWlCLEtBQXpDLEVBQWdEO0FBQy9DbkQsWUFBT3NDLEdBQVAsR0FBYSxzQkFBT3RDLE9BQU9xQyxLQUFkLEVBQXFCRyxHQUFyQixDQUF5QixDQUF6QixFQUE0QixPQUE1QixDQUFiO0FBQ0EsS0FGRCxNQUVPO0FBQ054QyxZQUFPc0MsR0FBUCxHQUFhLEVBQWI7QUFDQTs7QUFFRCxTQUFLTCxRQUFMLENBQWMsRUFBRWpDLFFBQVFBLE1BQVYsRUFBZDtBQUNBOzs7Z0NBRVlvRCxDLEVBQUc7QUFBQTs7QUFDZkEsTUFBRUMsY0FBRjs7QUFFQSxRQUFJLEtBQUtsRSxLQUFMLENBQVdhLE1BQVgsQ0FBa0JrQixLQUFsQixJQUEyQixFQUEvQixFQUFtQyxPQUFPcU0sTUFBTSxzQkFBTixDQUFQO0FBQ25DLFFBQUksS0FBS3BPLEtBQUwsQ0FBV2EsTUFBWCxDQUFrQmdELFFBQWxCLElBQThCLEVBQWxDLEVBQXNDLE9BQU91SyxNQUFNLDBCQUFOLENBQVA7O0FBRXRDLFNBQUt0TCxRQUFMLENBQWMsRUFBRWxDLFNBQVMsSUFBWCxFQUFkLEVBQWlDLFlBQU07O0FBRXRDLFNBQUkrQyxLQUFLLE9BQUszRCxLQUFMLENBQVdhLE1BQXBCOztBQUVBLFNBQUksQ0FBQzhDLEdBQUdLLE1BQVIsRUFBZ0I7QUFDZkwsU0FBR1QsS0FBSCxHQUFXLHNCQUFPUyxHQUFHVCxLQUFWLEVBQWlCRyxHQUFqQixDQUFxQixDQUFyQixFQUF3QixPQUF4QixFQUFpQ3BCLE1BQWpDLENBQXdDLEdBQXhDLENBQVg7QUFDQSxVQUFJMEIsR0FBR1IsR0FBUCxFQUFZUSxHQUFHUixHQUFILEdBQVMsc0JBQU9RLEdBQUdSLEdBQVYsRUFBZUUsR0FBZixDQUFtQixDQUFuQixFQUFzQixPQUF0QixFQUErQnBCLE1BQS9CLENBQXNDLEdBQXRDLENBQVQ7QUFDWixNQUhELE1BR087QUFDTjBCLFNBQUdULEtBQUgsR0FBVyxzQkFBT1MsR0FBR1QsS0FBVixFQUFpQmpCLE1BQWpCLENBQXdCLEdBQXhCLENBQVg7QUFDQSxVQUFJMEIsR0FBR1IsR0FBUCxFQUFZUSxHQUFHUixHQUFILEdBQVMsc0JBQU9RLEdBQUdSLEdBQVYsRUFBZWxCLE1BQWYsQ0FBc0IsR0FBdEIsQ0FBVDtBQUNaOztBQUVEMEIsUUFBRyxRQUFILElBQWUsUUFBZjs7QUFFQSxzQkFBRXRCLElBQUYsQ0FBTztBQUNOQyxjQUFRLE1BREY7QUFFTkMsV0FBSyxrQkFGQztBQUdOaUIsWUFBTUcsRUFIQTtBQUlObEIsZ0JBQVU7QUFKSixNQUFQLEVBS0dDLElBTEgsQ0FLUSxvQkFBWTtBQUNuQixhQUFLSSxRQUFMLENBQWMsRUFBRWxDLFNBQVMsS0FBWCxFQUFkLEVBQWtDLFlBQU07QUFDdkMsY0FBS2pCLEtBQUwsQ0FBVzZCLFdBQVg7QUFDQSxjQUFLN0IsS0FBTCxDQUFXOE4sV0FBWCxDQUF1QlksUUFBdkI7QUFDQSxPQUhEO0FBSUEsTUFWRDtBQVdBLEtBekJEO0FBMEJBOzs7Z0NBRVlwSyxDLEVBQUc7QUFDZkEsTUFBRUMsY0FBRjs7QUFFQSxRQUFJb0ssUUFBUSxlQUFSLENBQUosRUFBOEIsQ0FFN0I7QUFDRDs7OzRCQUVRO0FBQ1IsUUFBSTNLLEtBQUssS0FBSzNELEtBQUwsQ0FBV2EsTUFBcEI7QUFBQSxRQUNDME4sUUFBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxFQUFpRCxJQUFqRCxFQUF1RCxJQUF2RCxFQUE2RCxJQUE3RCxFQUFtRSxJQUFuRSxFQUF5RSxJQUF6RSxFQUErRSxJQUEvRSxFQUFxRixJQUFyRixFQUEyRixJQUEzRixFQUFpRyxJQUFqRyxFQUF1RyxJQUF2RyxFQUE2RyxJQUE3RyxFQUFtSCxJQUFuSCxFQUF5SCxJQUF6SCxFQUErSCxJQUEvSCxFQUFxSSxJQUFySSxFQUEySSxJQUEzSSxFQUFpSixJQUFqSixDQURUO0FBQUEsUUFFQ0MsVUFBVSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxFQUFpRCxJQUFqRCxFQUF1RCxJQUF2RCxFQUE2RCxJQUE3RCxFQUFtRSxJQUFuRSxDQUZYOztBQUlBLFFBQUlDLGdCQUFnQkYsTUFBTS9HLEdBQU4sQ0FBVSxnQkFBUTtBQUNyQyxZQUFTO0FBQUE7QUFBQSxRQUFRLE9BQU9rSCxJQUFmLEVBQXFCLEtBQUssUUFBUUEsSUFBbEM7QUFBeUNBO0FBQXpDLE1BQVQ7QUFDQSxLQUZtQixDQUFwQjs7QUFJQSxRQUFJQyxrQkFBa0JILFFBQVFoSCxHQUFSLENBQVksa0JBQVU7QUFDM0MsWUFBUztBQUFBO0FBQUEsUUFBUSxPQUFPb0gsTUFBZixFQUF1QixLQUFLLFFBQVFBLE1BQXBDO0FBQTZDQTtBQUE3QyxNQUFUO0FBQ0EsS0FGcUIsQ0FBdEI7O0FBSUEsUUFBSUMsY0FBY04sTUFBTS9HLEdBQU4sQ0FBVSxnQkFBUTtBQUNuQyxTQUFJa0gsUUFBUSxzQkFBTy9LLEdBQUdULEtBQVYsRUFBaUJqQixNQUFqQixDQUF3QixJQUF4QixDQUFaLEVBQTJDO0FBQzFDLGFBQVM7QUFBQTtBQUFBLFNBQVEsT0FBT3lNLElBQWYsRUFBcUIsS0FBSyxRQUFRQSxJQUFsQztBQUF5Q0E7QUFBekMsT0FBVDtBQUNBO0FBQ0QsS0FKaUIsQ0FBbEI7O0FBTUEsUUFBSUksZ0JBQWdCTixRQUFRaEgsR0FBUixDQUFZLGtCQUFVO0FBQ3pDLFlBQVM7QUFBQTtBQUFBLFFBQVEsT0FBT29ILE1BQWYsRUFBdUIsS0FBSyxRQUFRQSxNQUFwQztBQUE2Q0E7QUFBN0MsTUFBVDtBQUNBLEtBRm1CLENBQXBCOztBQUlBLFFBQUlqTSxVQUFVLEtBQUtoRCxLQUFMLENBQVdvQixVQUFYLENBQXNCeUcsR0FBdEIsQ0FBMEIsZUFBTztBQUM5QyxZQUFTO0FBQUE7QUFBQSxRQUFRLE9BQU9oRCxJQUFJRCxFQUFuQixFQUF1QixLQUFLQyxJQUFJRCxFQUFoQztBQUFxQ0MsVUFBSStFO0FBQXpDLE1BQVQ7QUFDQSxLQUZhLENBQWQ7O0FBSUEsV0FDQztBQUFBO0FBQUEsT0FBSyxXQUFVLFlBQWY7QUFDQztBQUFBO0FBQUE7QUFFQztBQUFBO0FBQUEsU0FBSyxXQUFVLFVBQWY7QUFDQztBQUFBO0FBQUEsVUFBTyxTQUFRLGNBQWY7QUFBQTtBQUFBLFFBREQ7QUFFQyxnREFBTyxNQUFLLE1BQVosRUFBbUIsSUFBRyxjQUF0QixFQUFxQyxNQUFLLE9BQTFDLEVBQWtELE9BQU81RixHQUFHNUIsS0FBNUQsRUFBbUUsVUFBVSxLQUFLNEwsWUFBbEY7QUFGRCxPQUZEO0FBT0M7QUFBQTtBQUFBLFNBQUssV0FBVSxVQUFmO0FBQ0M7QUFBQTtBQUFBLFVBQU8sU0FBUSxhQUFmO0FBQUE7QUFBQSxRQUREO0FBRUM7QUFBQTtBQUFBLFVBQUssV0FBVSxVQUFmO0FBQ0MsK0NBQUssV0FBVSxtQkFBZixHQUREO0FBRUM7QUFBQTtBQUFBLFdBQUssV0FBVSxrQkFBZjtBQUVDO0FBQUE7QUFBQSxZQUFPLFdBQVdoSyxHQUFHSyxNQUFILEdBQVksaUJBQVosR0FBZ0MsVUFBbEQsRUFBOEQsWUFBUyxRQUF2RSxFQUFnRixTQUFTLEtBQUs0SixjQUE5RjtBQUFBO0FBQUEsVUFGRDtBQUdDO0FBQUE7QUFBQSxZQUFPLFdBQVdqSyxHQUFHOEksUUFBSCxHQUFjLGlCQUFkLEdBQWtDLFVBQXBELEVBQWdFLFlBQVMsVUFBekUsRUFBb0YsU0FBUyxLQUFLbUIsY0FBbEc7QUFBQTtBQUFBLFVBSEQ7QUFLQztBQUFBO0FBQUEsWUFBTyxXQUFXakssR0FBR0ssTUFBSCxHQUFZLHNCQUFaLEdBQXFDLGFBQXZELEVBQXNFLFNBQVEseUJBQTlFO0FBQUE7QUFBQSxVQUxEO0FBTUM7QUFBQTtBQUFBLFlBQUssV0FBVSxVQUFmO0FBQ0M7QUFBQTtBQUFBLGFBQVEsSUFBRyx5QkFBWCxFQUFxQyxVQUFVLEtBQUs2SixVQUFwRCxFQUFnRSxPQUFPLHNCQUFPbEssR0FBR1QsS0FBVixFQUFpQmpCLE1BQWpCLENBQXdCLElBQXhCLENBQXZFLEVBQXNHLFVBQVUwQixHQUFHSyxNQUFuSCxFQUEySCxZQUFTLGFBQXBJO0FBQ0V5SztBQURGLFdBREQ7QUFJQztBQUFBO0FBQUEsYUFBUSxJQUFHLDJCQUFYLEVBQXVDLFVBQVUsS0FBS1osVUFBdEQsRUFBa0UsT0FBTyxzQkFBT2xLLEdBQUdULEtBQVYsRUFBaUJqQixNQUFqQixDQUF3QixJQUF4QixDQUF6RSxFQUF3RyxVQUFVMEIsR0FBR0ssTUFBckgsRUFBNkgsWUFBUyxlQUF0STtBQUNFMks7QUFERjtBQUpELFVBTkQ7QUFlQztBQUFBO0FBQUEsWUFBTyxXQUFXaEwsR0FBR0ssTUFBSCxHQUFZLG1CQUFaLEdBQWtDTCxHQUFHUixHQUFILElBQVUsRUFBVixHQUFlLGlCQUFmLEdBQW1DLFVBQXZGLEVBQW1HLFNBQVEsdUJBQTNHLEVBQW1JLFNBQVMsS0FBSzJLLGFBQWpKO0FBQUE7QUFBQSxVQWZEO0FBZ0JDO0FBQUE7QUFBQSxZQUFLLFdBQVUsVUFBZjtBQUNDO0FBQUE7QUFBQSxhQUFRLElBQUcsdUJBQVgsRUFBbUMsVUFBVSxLQUFLRCxVQUFsRCxFQUE4RCxPQUFPLHNCQUFPbEssR0FBR1IsR0FBVixFQUFlbEIsTUFBZixDQUFzQixJQUF0QixDQUFyRSxFQUFrRyxVQUFVMEIsR0FBR0ssTUFBSCxJQUFhLElBQWIsSUFBcUJMLEdBQUdSLEdBQUgsSUFBVSxFQUEzSSxFQUErSSxZQUFTLFdBQXhKO0FBQ0UwTDtBQURGLFdBREQ7QUFJQztBQUFBO0FBQUEsYUFBUSxJQUFHLHlCQUFYLEVBQXFDLFVBQVUsS0FBS2hCLFVBQXBELEVBQWdFLE9BQU8sc0JBQU9sSyxHQUFHUixHQUFWLEVBQWVsQixNQUFmLENBQXNCLElBQXRCLENBQXZFLEVBQW9HLFVBQVUwQixHQUFHSyxNQUFILElBQWEsSUFBYixJQUFxQkwsR0FBR1IsR0FBSCxJQUFVLEVBQTdJLEVBQWlKLFlBQVMsYUFBMUo7QUFDRTJMO0FBREY7QUFKRCxVQWhCRDtBQXlCQztBQUFBO0FBQUEsWUFBTyxXQUFVLGFBQWpCLEVBQStCLFNBQVEsa0JBQXZDO0FBQUE7QUFBQSxVQXpCRDtBQTBCQztBQUFBO0FBQUEsWUFBSyxXQUFVLFVBQWY7QUFDQztBQUFBO0FBQUEsYUFBUSxJQUFHLGtCQUFYLEVBQThCLE1BQUssV0FBbkMsRUFBK0MsT0FBT25MLEdBQUdrSixTQUF6RCxFQUFvRSxVQUFVLEtBQUtjLFlBQW5GO0FBQ0M7QUFBQTtBQUFBLGNBQVEsT0FBTSxNQUFkO0FBQUE7QUFBQSxZQUREO0FBRUM7QUFBQTtBQUFBLGNBQVEsT0FBTSxTQUFkO0FBQUE7QUFBQSxZQUZEO0FBR0M7QUFBQTtBQUFBLGNBQVEsT0FBTSxRQUFkO0FBQUE7QUFBQTtBQUhEO0FBREQ7QUExQkQ7QUFGRDtBQUZELE9BUEQ7QUFnREM7QUFBQTtBQUFBLFNBQUssV0FBVSxVQUFmO0FBQ0M7QUFBQTtBQUFBLFVBQU8sU0FBUSxpQkFBZjtBQUFBO0FBQUEsUUFERDtBQUVDO0FBQUE7QUFBQSxVQUFRLElBQUcsaUJBQVgsRUFBNkIsTUFBSyxVQUFsQyxFQUE2QyxPQUFPaEssR0FBR0UsUUFBdkQsRUFBaUUsVUFBVSxLQUFLOEosWUFBaEY7QUFDRWhMO0FBREY7QUFGRCxPQWhERDtBQXVEQztBQUFBO0FBQUEsU0FBSyxXQUFVLFVBQWY7QUFDQztBQUFBO0FBQUEsVUFBTyxTQUFRLGFBQWY7QUFBQTtBQUFBLFFBREQ7QUFFQyxtREFBVSxJQUFHLGFBQWIsRUFBMkIsTUFBSyxNQUFoQyxFQUF1QyxPQUFPZ0IsR0FBR21KLElBQWpELEVBQXVELFVBQVUsS0FBS2EsWUFBdEU7QUFGRCxPQXZERDtBQTREQztBQUFBO0FBQUEsU0FBUSxXQUFVLFFBQWxCLEVBQTJCLE1BQUssUUFBaEMsRUFBeUMsU0FBUyxLQUFLSSxZQUF2RDtBQUFBO0FBQUEsT0E1REQ7QUE2REM7QUFBQTtBQUFBLFNBQUcsTUFBSyxFQUFSLEVBQVcsV0FBVSxNQUFyQixFQUE0QixTQUFTLEtBQUtDLFlBQTFDO0FBQUE7QUFBQTtBQTdERCxNQUREO0FBaUVDO0FBQUE7QUFBQSxRQUFLLFdBQVcsS0FBS2hPLEtBQUwsQ0FBV1ksT0FBWCxHQUFxQixnQkFBckIsR0FBd0MsU0FBeEQ7QUFDQyw2Q0FBSyxXQUFVLFNBQWY7QUFERDtBQWpFRCxLQUREO0FBdUVBOzs7O0dBalMwQyxnQkFBTXNFLFM7O21CQUE3QndJLGM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMckI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztLQUVxQnFCLGM7OztBQUVwQiwwQkFBWXBQLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrSEFDWkEsS0FEWTs7QUFHbEIsU0FBS0ssS0FBTCxHQUFhO0FBQ1orQixXQUFPLEVBREs7QUFFWm1CLFdBQU8sdUJBRks7QUFHWkMsU0FBSyxFQUhPO0FBSVphLFlBQVEsSUFKSTtBQUtaeUksY0FBVSxLQUxFO0FBTVo1SSxjQUFVLEVBTkU7QUFPWmdKLGVBQVcsTUFQQztBQVFaQyxVQUFNLEVBUk07QUFTWmxNLGFBQVM7QUFURyxJQUFiOztBQVlBLFNBQUs2RSxPQUFMLEdBQWUsTUFBS0EsT0FBTCxDQUFheEUsSUFBYixPQUFmO0FBQ0EsU0FBSzBNLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQjFNLElBQWxCLE9BQXBCO0FBQ0EsU0FBSzJNLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQjNNLElBQXBCLE9BQXRCO0FBQ0EsU0FBSzRNLFVBQUwsR0FBa0IsTUFBS0EsVUFBTCxDQUFnQjVNLElBQWhCLE9BQWxCO0FBQ0EsU0FBSzZNLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQjdNLElBQW5CLE9BQXJCO0FBQ0EsU0FBSzhNLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQjlNLElBQWxCLE9BQXBCO0FBcEJrQjtBQXFCbEI7Ozs7dUNBQ21COztBQUVuQixRQUFJMkcsT0FBTyxJQUFYOztBQUVBLDBCQUFFLG9CQUFGLEVBQXdCRyxZQUF4QixDQUFxQztBQUNwQ0MsZUFBVSxDQUQwQjtBQUVwQ0MsYUFBUTtBQUNQdUQsWUFBTSxFQURDO0FBRVBDLGNBQVEsaUJBRkQ7QUFHUEMsYUFBTztBQUhBLE1BRjRCO0FBT3BDQyxrQkFBYSxLQVB1QjtBQVFwQ0MsaUJBQVk7QUFDWDlGLFlBQU0sUUFESztBQUVYQyxZQUFNO0FBRkssTUFSd0I7QUFZcENtQyxvQkFBZSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixHQUExQixFQUErQixHQUEvQixDQVpxQjtBQWFwQ0csY0Fib0MscUJBYTFCcEksSUFiMEIsRUFhcEJxSSxJQWJvQixFQWFkO0FBQ3JCLDRCQUFFQSxJQUFGLEVBQVEwRCxJQUFSLENBQWEsV0FBVyxzQkFBTy9MLElBQVAsRUFBYWdDLE1BQWIsQ0FBb0IsR0FBcEIsQ0FBWCxHQUFzQyxTQUFuRDtBQUNBLFVBQUkyRixLQUFLNUgsS0FBTCxDQUFXeU0sUUFBZixFQUF5QjtBQUN4QixXQUFJLHNCQUFPeE0sSUFBUCxFQUFhdUcsTUFBYixDQUFvQm9CLEtBQUs1SCxLQUFMLENBQVdrRCxLQUEvQixFQUFzQyxLQUF0QyxDQUFKLEVBQWtELHNCQUFFb0YsSUFBRixFQUFRakIsUUFBUixDQUFpQixnQkFBakI7QUFDbEQsV0FBSSxzQkFBT3BILElBQVAsRUFBYXVHLE1BQWIsQ0FBb0JvQixLQUFLNUgsS0FBTCxDQUFXbUQsR0FBL0IsRUFBb0MsS0FBcEMsQ0FBSixFQUFnRCxzQkFBRW1GLElBQUYsRUFBUWpCLFFBQVIsQ0FBaUIsY0FBakI7QUFDaEQsV0FBSSxzQkFBT3BILElBQVAsRUFBYTBKLFNBQWIsQ0FBdUIvQixLQUFLNUgsS0FBTCxDQUFXa0QsS0FBbEMsRUFBeUMwRSxLQUFLNUgsS0FBTCxDQUFXbUQsR0FBcEQsQ0FBSixFQUE4RCxzQkFBRW1GLElBQUYsRUFBUWpCLFFBQVIsQ0FBaUIsVUFBakI7QUFDOUQsT0FKRCxNQUlPO0FBQ04sV0FBSSxzQkFBT08sS0FBSzVILEtBQUwsQ0FBV2tELEtBQWxCLEVBQXlCc0QsTUFBekIsQ0FBZ0N2RyxJQUFoQyxFQUFzQyxLQUF0QyxDQUFKLEVBQWtEMkgsS0FBS25DLE9BQUwsQ0FBYXhGLElBQWI7QUFDbEQ7QUFDRCxNQXRCbUM7QUF1QnBDNEwsYUF2Qm9DLG9CQXVCM0I1TCxJQXZCMkIsRUF1QnJCK0ksT0F2QnFCLEVBdUJaOUksSUF2QlksRUF1Qk47QUFDN0IwSCxXQUFLbkMsT0FBTCxDQUFheEYsSUFBYjtBQUNBO0FBekJtQyxLQUFyQztBQTJCQTs7OzJCQUVPQSxJLEVBQU07QUFBQTs7QUFFYiwwQkFBRSxTQUFGLEVBQWFxSCxXQUFiLENBQXlCLG9CQUF6Qjs7QUFFQSxRQUFJLEtBQUt0SCxLQUFMLENBQVd5TSxRQUFmLEVBQXlCO0FBQ3hCLFNBQUksc0JBQU94TSxJQUFQLEVBQWFnSCxRQUFiLENBQXNCLEtBQUtqSCxLQUFMLENBQVdrRCxLQUFqQyxDQUFKLEVBQTZDO0FBQzVDLFVBQUksS0FBS2xELEtBQUwsQ0FBV21ELEdBQVgsSUFBa0IsRUFBdEIsRUFBMEI7QUFDekIsWUFBS0wsUUFBTCxDQUFjLEVBQUVJLE9BQU8sc0JBQU9qRCxJQUFQLENBQVQsRUFBZCxFQUF1QyxZQUFNO0FBQzVDZ08sa0JBQVUsT0FBS2pPLEtBQUwsQ0FBV2tELEtBQXJCLEVBQTRCLE9BQUtsRCxLQUFMLENBQVdtRCxHQUF2QztBQUNBLFFBRkQ7QUFHQSxPQUpELE1BSU87QUFDTixZQUFLTCxRQUFMLENBQWMsRUFBRUksT0FBTyxzQkFBT2pELElBQVAsQ0FBVCxFQUF1QmtELEtBQUssS0FBS25ELEtBQUwsQ0FBV2tELEtBQXZDLEVBQWQsRUFBOEQsWUFBTTtBQUNuRStLLGtCQUFVLE9BQUtqTyxLQUFMLENBQVdrRCxLQUFyQixFQUE0QixPQUFLbEQsS0FBTCxDQUFXbUQsR0FBdkM7QUFDQSxRQUZEO0FBR0E7QUFDRCxNQVZELE1BVU8sSUFBSSxzQkFBT2xELElBQVAsRUFBYTBKLFNBQWIsQ0FBdUIsS0FBSzNKLEtBQUwsQ0FBV2tELEtBQWxDLEVBQXlDLEtBQUtsRCxLQUFMLENBQVdtRCxHQUFwRCxDQUFKLEVBQThEO0FBQ3BFLFdBQUtMLFFBQUwsQ0FBYyxFQUFFSSxPQUFPLHNCQUFPakQsSUFBUCxDQUFULEVBQWQsRUFBdUMsWUFBTTtBQUM1Q2dPLGlCQUFVLE9BQUtqTyxLQUFMLENBQVdrRCxLQUFyQixFQUE0QixPQUFLbEQsS0FBTCxDQUFXbUQsR0FBdkM7QUFDQSxPQUZEO0FBR0EsTUFKTSxNQUlBLElBQUksc0JBQU9sRCxJQUFQLEVBQWFpSCxPQUFiLENBQXFCLEtBQUtsSCxLQUFMLENBQVdrRCxLQUFoQyxDQUFKLEVBQTRDO0FBQ2xELFdBQUtKLFFBQUwsQ0FBYyxFQUFFSyxLQUFLLHNCQUFPbEQsSUFBUCxDQUFQLEVBQWQsRUFBcUMsWUFBTTtBQUMxQ2dPLGlCQUFVLE9BQUtqTyxLQUFMLENBQVdrRCxLQUFyQixFQUE0QixPQUFLbEQsS0FBTCxDQUFXbUQsR0FBdkM7QUFDQSxPQUZEO0FBR0E7QUFDRCxLQXBCRCxNQW9CTztBQUNOLDJCQUFFLHVCQUF1QixzQkFBT2xELElBQVAsRUFBYWdDLE1BQWIsQ0FBb0IsWUFBcEIsQ0FBdkIsR0FBMkQsR0FBN0QsRUFBa0VvRixRQUFsRSxDQUEyRSxvQkFBM0U7QUFDQSxVQUFLdkUsUUFBTCxDQUFjLEVBQUVJLE9BQU8sc0JBQU9qRCxJQUFQLENBQVQsRUFBdUJrRCxLQUFLLEVBQTVCLEVBQWQ7QUFDQTs7QUFFRCxhQUFTOEssU0FBVCxDQUFvQi9LLEtBQXBCLEVBQTJCQyxHQUEzQixFQUFnQztBQUMvQixTQUFJdUgsTUFBTXZILElBQUlpSyxJQUFKLENBQVNsSyxLQUFULEVBQWdCLE1BQWhCLENBQVY7QUFDQSxVQUFLLElBQUkyRyxJQUFJLENBQWIsRUFBZ0JBLEtBQUthLEdBQXJCLEVBQTBCYixHQUExQixFQUErQjtBQUM5Qiw0QkFBRSx1QkFBdUIsc0JBQU8zRyxLQUFQLEVBQWNHLEdBQWQsQ0FBa0J3RyxDQUFsQixFQUFxQixNQUFyQixFQUE2QjVILE1BQTdCLENBQW9DLFlBQXBDLENBQXZCLEdBQTJFLEdBQTdFLEVBQWtGb0YsUUFBbEYsQ0FBMkYsVUFBM0Y7O0FBRUEsVUFBSXdDLEtBQUssQ0FBVCxFQUFZLHNCQUFFLHVCQUF1QixzQkFBTzNHLEtBQVAsRUFBY0csR0FBZCxDQUFrQndHLENBQWxCLEVBQXFCLE1BQXJCLEVBQTZCNUgsTUFBN0IsQ0FBb0MsWUFBcEMsQ0FBdkIsR0FBMkUsR0FBN0UsRUFBa0ZvRixRQUFsRixDQUEyRixPQUEzRjtBQUNaLFVBQUl3QyxLQUFLYSxHQUFULEVBQWMsc0JBQUUsdUJBQXVCLHNCQUFPeEgsS0FBUCxFQUFjRyxHQUFkLENBQWtCd0csQ0FBbEIsRUFBcUIsTUFBckIsRUFBNkI1SCxNQUE3QixDQUFvQyxZQUFwQyxDQUF2QixHQUEyRSxHQUE3RSxFQUFrRm9GLFFBQWxGLENBQTJGLEtBQTNGO0FBQ2Q7QUFDRDtBQUNEOzs7Z0NBRVlwRCxDLEVBQUc7QUFDZixRQUFJK0ssTUFBTSxFQUFWO0FBQ0FBLFFBQUkvSyxFQUFFSyxNQUFGLENBQVNpRixJQUFiLElBQXFCdEYsRUFBRUssTUFBRixDQUFTNEosS0FBOUI7QUFDQSxTQUFLcEwsUUFBTCxDQUFja00sR0FBZDtBQUNBOzs7a0NBRWMvSyxDLEVBQUc7QUFBQTs7QUFDakIsUUFBSStLLE1BQU0sRUFBVjtBQUNBLFFBQUksc0JBQUUvSyxFQUFFSyxNQUFKLEVBQVlvQyxRQUFaLENBQXFCLFFBQXJCLENBQUosRUFBb0M7QUFDbkNzSSxTQUFJL0ssRUFBRUssTUFBRixDQUFTdUIsT0FBVCxDQUFpQnhCLEdBQXJCLElBQTRCLEtBQTVCO0FBQ0EsS0FGRCxNQUVPO0FBQUUySyxTQUFJL0ssRUFBRUssTUFBRixDQUFTdUIsT0FBVCxDQUFpQnhCLEdBQXJCLElBQTRCLElBQTVCO0FBQW9DOztBQUU3QyxRQUFJMkssSUFBSXZDLFFBQUosSUFBZ0IsSUFBaEIsSUFBd0IsS0FBS3pNLEtBQUwsQ0FBV3lNLFFBQVgsSUFBdUIsSUFBbkQsRUFBeUR1QyxJQUFJLFFBQUosSUFBZ0IsSUFBaEI7QUFDekQsUUFBSUEsSUFBSXZDLFFBQUosSUFBZ0IsS0FBaEIsSUFBeUIsS0FBS3pNLEtBQUwsQ0FBV3lNLFFBQVgsSUFBdUIsS0FBcEQsRUFBMkR1QyxJQUFJLEtBQUosSUFBYSxFQUFiO0FBQzNELFFBQUlBLElBQUloTCxNQUFKLElBQWMsSUFBbEIsRUFBd0JnTCxJQUFJLE9BQUosSUFBZSxzQkFBTyxLQUFLaFAsS0FBTCxDQUFXa0QsS0FBbEIsRUFBeUJpTCxHQUF6QixDQUE2QixFQUFDLFFBQVEsQ0FBVCxFQUFZLFVBQVUsQ0FBdEIsRUFBN0IsQ0FBZjs7QUFFeEIsU0FBS3JMLFFBQUwsQ0FBY2tNLEdBQWQsRUFBbUIsWUFBTTtBQUN4QixTQUFJQSxJQUFJdkMsUUFBSixJQUFnQixLQUFwQixFQUEyQixPQUFLaEgsT0FBTCxDQUFhLE9BQUt6RixLQUFMLENBQVdrRCxLQUF4QjtBQUMzQixLQUZEO0FBR0E7Ozs4QkFFVWUsQyxFQUFHO0FBQ2IsUUFBSWYsUUFBUSxzQkFBTyxLQUFLbEQsS0FBTCxDQUFXa0QsS0FBbEIsQ0FBWjtBQUFBLFFBQ0NDLE1BQU0sRUFEUDtBQUFBLFFBRUMyRixPQUFPckUsT0FBT1IsRUFBRUssTUFBRixDQUFTNEosS0FBaEIsQ0FGUjs7QUFJQSxRQUFJLEtBQUtsTyxLQUFMLENBQVdtRCxHQUFYLElBQWtCLEVBQXRCLEVBQTBCQSxNQUFNLHNCQUFPLEtBQUtuRCxLQUFMLENBQVdtRCxHQUFsQixDQUFOOztBQUUxQixRQUFJYyxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCeEIsR0FBakIsSUFBd0IsYUFBNUIsRUFBMkNuQixRQUFRLHNCQUFPQSxLQUFQLEVBQWNpTCxHQUFkLENBQWtCLE1BQWxCLEVBQTBCckYsSUFBMUIsQ0FBUjtBQUMzQyxRQUFJN0UsRUFBRUssTUFBRixDQUFTdUIsT0FBVCxDQUFpQnhCLEdBQWpCLElBQXdCLGVBQTVCLEVBQTZDbkIsUUFBUSxzQkFBT0EsS0FBUCxFQUFjaUwsR0FBZCxDQUFrQixRQUFsQixFQUE0QnJGLElBQTVCLENBQVI7QUFDN0MsUUFBSTdFLEVBQUVLLE1BQUYsQ0FBU3VCLE9BQVQsQ0FBaUJ4QixHQUFqQixJQUF3QixXQUE1QixFQUF5Q2xCLE1BQU0sc0JBQU9BLEdBQVAsRUFBWWdMLEdBQVosQ0FBZ0IsTUFBaEIsRUFBd0JyRixJQUF4QixDQUFOO0FBQ3pDLFFBQUk3RSxFQUFFSyxNQUFGLENBQVN1QixPQUFULENBQWlCeEIsR0FBakIsSUFBd0IsYUFBNUIsRUFBMkNsQixNQUFNLHNCQUFPQSxHQUFQLEVBQVlnTCxHQUFaLENBQWdCLFFBQWhCLEVBQTBCckYsSUFBMUIsQ0FBTjs7QUFFM0MsUUFBSSxzQkFBTzNGLEdBQVAsRUFBWThELFFBQVosQ0FBcUIvRCxLQUFyQixDQUFKLEVBQWlDLE9BQU9rTCxNQUFNLGNBQU4sQ0FBUDs7QUFFakMsU0FBS3RMLFFBQUwsQ0FBYyxFQUFFSSxPQUFPQSxLQUFULEVBQWdCQyxLQUFLQSxHQUFyQixFQUFkO0FBQ0E7OztpQ0FFYWMsQyxFQUFHO0FBQ2hCLFFBQUlmLFFBQVEsS0FBS2xELEtBQUwsQ0FBV2tELEtBQXZCOztBQUVBLFFBQUksS0FBS2xELEtBQUwsQ0FBV21ELEdBQVgsSUFBa0IsRUFBbEIsSUFBd0IsS0FBS25ELEtBQUwsQ0FBV2dFLE1BQVgsSUFBcUIsS0FBakQsRUFBd0Q7QUFDdkQsVUFBS2xCLFFBQUwsQ0FBYyxFQUFFSyxLQUFLLHNCQUFPRCxLQUFQLEVBQWNHLEdBQWQsQ0FBa0IsQ0FBbEIsRUFBcUIsT0FBckIsQ0FBUCxFQUFkO0FBQ0EsS0FGRCxNQUVPO0FBQ04sVUFBS1AsUUFBTCxDQUFjLEVBQUVLLEtBQUssRUFBUCxFQUFkO0FBQ0E7QUFDRDs7O2dDQUVZYyxDLEVBQUc7QUFBQTs7QUFDZkEsTUFBRUMsY0FBRjs7QUFFQSxRQUFJLEtBQUtsRSxLQUFMLENBQVcrQixLQUFYLElBQW9CLEVBQXhCLEVBQTRCLE9BQU9xTSxNQUFNLHNCQUFOLENBQVA7QUFDNUIsUUFBSSxLQUFLcE8sS0FBTCxDQUFXNkQsUUFBWCxJQUF1QixFQUEzQixFQUErQixPQUFPdUssTUFBTSwwQkFBTixDQUFQOztBQUUvQixTQUFLdEwsUUFBTCxDQUFjLEVBQUVsQyxTQUFTLElBQVgsRUFBZCxFQUFpQyxZQUFNO0FBQ3RDLFNBQUkrQyxLQUFLLE9BQUszRCxLQUFkO0FBQ0EyRCxRQUFHVCxLQUFILEdBQVcsc0JBQU9TLEdBQUdULEtBQVYsRUFBaUJqQixNQUFqQixDQUF3QixHQUF4QixDQUFYO0FBQ0EsU0FBSTBCLEdBQUdSLEdBQVAsRUFBWVEsR0FBR1IsR0FBSCxHQUFTLHNCQUFPUSxHQUFHUixHQUFWLEVBQWVsQixNQUFmLENBQXNCLEdBQXRCLENBQVQ7O0FBRVowQixRQUFHLFFBQUgsSUFBZSxRQUFmOztBQUVBLHNCQUFFdEIsSUFBRixDQUFPO0FBQ05DLGNBQVEsTUFERjtBQUVOQyxXQUFLVCxTQUFTVSxPQUFULEdBQW1CLFNBRmxCO0FBR05nQixZQUFNRyxFQUhBO0FBSU5sQixnQkFBVTtBQUpKLE1BQVAsRUFLR0MsSUFMSCxDQUtRLG9CQUFZO0FBQ25CLGFBQUtJLFFBQUwsQ0FBYyxFQUFFbEMsU0FBUyxLQUFYLEVBQWQsRUFBa0MsWUFBTTtBQUN2QyxjQUFLakIsS0FBTCxDQUFXNkIsV0FBWDtBQUNBLGNBQUs3QixLQUFMLENBQVdzUCxRQUFYLENBQW9CWixRQUFwQjtBQUNBLE9BSEQ7QUFJQSxNQVZEO0FBV0EsS0FsQkQ7QUFtQkE7Ozs0QkFFUTtBQUNSLFFBQUkxSyxLQUFLLEtBQUszRCxLQUFkO0FBQUEsUUFDQ3VPLFFBQVEsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFBMkMsSUFBM0MsRUFBaUQsSUFBakQsRUFBdUQsSUFBdkQsRUFBNkQsSUFBN0QsRUFBbUUsSUFBbkUsRUFBeUUsSUFBekUsRUFBK0UsSUFBL0UsRUFBcUYsSUFBckYsRUFBMkYsSUFBM0YsRUFBaUcsSUFBakcsRUFBdUcsSUFBdkcsRUFBNkcsSUFBN0csRUFBbUgsSUFBbkgsRUFBeUgsSUFBekgsRUFBK0gsSUFBL0gsRUFBcUksSUFBckksRUFBMkksSUFBM0ksRUFBaUosSUFBakosQ0FEVDtBQUFBLFFBRUNDLFVBQVUsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFBMkMsSUFBM0MsRUFBaUQsSUFBakQsRUFBdUQsSUFBdkQsRUFBNkQsSUFBN0QsRUFBbUUsSUFBbkUsQ0FGWDs7QUFJQSxRQUFJQyxnQkFBZ0JGLE1BQU0vRyxHQUFOLENBQVUsZ0JBQVE7QUFDckMsWUFBUztBQUFBO0FBQUEsUUFBUSxPQUFPa0gsSUFBZixFQUFxQixLQUFLLFFBQVFBLElBQWxDO0FBQXlDQTtBQUF6QyxNQUFUO0FBQ0EsS0FGbUIsQ0FBcEI7O0FBSUEsUUFBSUMsa0JBQWtCSCxRQUFRaEgsR0FBUixDQUFZLGtCQUFVO0FBQzNDLFlBQVM7QUFBQTtBQUFBLFFBQVEsT0FBT29ILE1BQWYsRUFBdUIsS0FBSyxRQUFRQSxNQUFwQztBQUE2Q0E7QUFBN0MsTUFBVDtBQUNBLEtBRnFCLENBQXRCOztBQUlBLFFBQUlDLGNBQWNOLE1BQU0vRyxHQUFOLENBQVUsZ0JBQVE7QUFDbkMsU0FBSWtILFFBQVEsc0JBQU8vSyxHQUFHVCxLQUFWLEVBQWlCakIsTUFBakIsQ0FBd0IsSUFBeEIsQ0FBWixFQUEyQztBQUMxQyxhQUFTO0FBQUE7QUFBQSxTQUFRLE9BQU95TSxJQUFmLEVBQXFCLEtBQUssUUFBUUEsSUFBbEM7QUFBeUNBO0FBQXpDLE9BQVQ7QUFDQTtBQUNELEtBSmlCLENBQWxCOztBQU1BLFFBQUlJLGdCQUFnQk4sUUFBUWhILEdBQVIsQ0FBWSxrQkFBVTtBQUN6QyxZQUFTO0FBQUE7QUFBQSxRQUFRLE9BQU9vSCxNQUFmLEVBQXVCLEtBQUssUUFBUUEsTUFBcEM7QUFBNkNBO0FBQTdDLE1BQVQ7QUFDQSxLQUZtQixDQUFwQjs7QUFJQSxRQUFJak0sVUFBVSxLQUFLaEQsS0FBTCxDQUFXb0IsVUFBWCxDQUFzQnlHLEdBQXRCLENBQTBCLGVBQU87QUFDOUMsWUFBUztBQUFBO0FBQUEsUUFBUSxPQUFPaEQsSUFBSUQsRUFBbkIsRUFBdUIsS0FBS0MsSUFBSUQsRUFBaEM7QUFBcUNDLFVBQUkrRTtBQUF6QyxNQUFUO0FBQ0EsS0FGYSxDQUFkOztBQUlBLFdBQ0M7QUFBQTtBQUFBLE9BQUssSUFBRyxpQkFBUjtBQUNDO0FBQUE7QUFBQSxRQUFRLFdBQVUsY0FBbEI7QUFDQztBQUFBO0FBQUEsU0FBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLE9BREQ7QUFFQztBQUFBO0FBQUEsU0FBSyxJQUFHLGFBQVIsRUFBc0IsU0FBUyxLQUFLNUosS0FBTCxDQUFXNkIsV0FBMUM7QUFBQTtBQUFBO0FBRkQsTUFERDtBQUtDO0FBQUE7QUFBQSxRQUFLLFdBQVUsWUFBZjtBQUNDO0FBQUE7QUFBQTtBQUVDO0FBQUE7QUFBQSxVQUFLLFdBQVUsVUFBZjtBQUNDO0FBQUE7QUFBQSxXQUFPLFNBQVEsY0FBZjtBQUFBO0FBQUEsU0FERDtBQUVDLGlEQUFPLE1BQUssTUFBWixFQUFtQixJQUFHLGNBQXRCLEVBQXFDLE1BQUssT0FBMUMsRUFBa0QsT0FBT21DLEdBQUc1QixLQUE1RCxFQUFtRSxVQUFVLEtBQUs0TCxZQUFsRjtBQUZELFFBRkQ7QUFPQztBQUFBO0FBQUEsVUFBSyxXQUFVLFVBQWY7QUFDQztBQUFBO0FBQUEsV0FBTyxTQUFRLGFBQWY7QUFBQTtBQUFBLFNBREQ7QUFFQztBQUFBO0FBQUEsV0FBSyxXQUFVLFVBQWY7QUFDQyxnREFBSyxXQUFVLG1CQUFmLEdBREQ7QUFFQztBQUFBO0FBQUEsWUFBSyxXQUFVLGtCQUFmO0FBRUM7QUFBQTtBQUFBLGFBQU8sV0FBV2hLLEdBQUdLLE1BQUgsR0FBWSxpQkFBWixHQUFnQyxVQUFsRCxFQUE4RCxZQUFTLFFBQXZFLEVBQWdGLFNBQVMsS0FBSzRKLGNBQTlGO0FBQUE7QUFBQSxXQUZEO0FBR0M7QUFBQTtBQUFBLGFBQU8sV0FBV2pLLEdBQUc4SSxRQUFILEdBQWMsaUJBQWQsR0FBa0MsVUFBcEQsRUFBZ0UsWUFBUyxVQUF6RSxFQUFvRixTQUFTLEtBQUttQixjQUFsRztBQUFBO0FBQUEsV0FIRDtBQUtDO0FBQUE7QUFBQSxhQUFPLFdBQVdqSyxHQUFHSyxNQUFILEdBQVksc0JBQVosR0FBcUMsYUFBdkQsRUFBc0UsU0FBUSx5QkFBOUU7QUFBQTtBQUFBLFdBTEQ7QUFNQztBQUFBO0FBQUEsYUFBSyxXQUFVLFVBQWY7QUFDQztBQUFBO0FBQUEsY0FBUSxJQUFHLHlCQUFYLEVBQXFDLFVBQVUsS0FBSzZKLFVBQXBELEVBQWdFLE9BQU8sc0JBQU9sSyxHQUFHVCxLQUFWLEVBQWlCakIsTUFBakIsQ0FBd0IsSUFBeEIsQ0FBdkUsRUFBc0csVUFBVTBCLEdBQUdLLE1BQW5ILEVBQTJILFlBQVMsYUFBcEk7QUFDRXlLO0FBREYsWUFERDtBQUlDO0FBQUE7QUFBQSxjQUFRLElBQUcsMkJBQVgsRUFBdUMsVUFBVSxLQUFLWixVQUF0RCxFQUFrRSxPQUFPLHNCQUFPbEssR0FBR1QsS0FBVixFQUFpQmpCLE1BQWpCLENBQXdCLElBQXhCLENBQXpFLEVBQXdHLFVBQVUwQixHQUFHSyxNQUFySCxFQUE2SCxZQUFTLGVBQXRJO0FBQ0UySztBQURGO0FBSkQsV0FORDtBQWVDO0FBQUE7QUFBQSxhQUFPLFdBQVdoTCxHQUFHSyxNQUFILEdBQVksbUJBQVosR0FBa0NMLEdBQUdSLEdBQUgsSUFBVSxFQUFWLEdBQWUsaUJBQWYsR0FBbUMsVUFBdkYsRUFBbUcsU0FBUSx1QkFBM0csRUFBbUksU0FBUyxLQUFLMkssYUFBako7QUFBQTtBQUFBLFdBZkQ7QUFnQkM7QUFBQTtBQUFBLGFBQUssV0FBVSxVQUFmO0FBQ0M7QUFBQTtBQUFBLGNBQVEsSUFBRyx1QkFBWCxFQUFtQyxVQUFVLEtBQUtELFVBQWxELEVBQThELE9BQU8sc0JBQU9sSyxHQUFHUixHQUFWLEVBQWVsQixNQUFmLENBQXNCLElBQXRCLENBQXJFLEVBQWtHLFVBQVUwQixHQUFHSyxNQUFILElBQWEsSUFBYixJQUFxQkwsR0FBR1IsR0FBSCxJQUFVLEVBQTNJLEVBQStJLFlBQVMsV0FBeEo7QUFDRTBMO0FBREYsWUFERDtBQUlDO0FBQUE7QUFBQSxjQUFRLElBQUcseUJBQVgsRUFBcUMsVUFBVSxLQUFLaEIsVUFBcEQsRUFBZ0UsT0FBTyxzQkFBT2xLLEdBQUdSLEdBQVYsRUFBZWxCLE1BQWYsQ0FBc0IsSUFBdEIsQ0FBdkUsRUFBb0csVUFBVTBCLEdBQUdLLE1BQUgsSUFBYSxJQUFiLElBQXFCTCxHQUFHUixHQUFILElBQVUsRUFBN0ksRUFBaUosWUFBUyxhQUExSjtBQUNFMkw7QUFERjtBQUpELFdBaEJEO0FBeUJDO0FBQUE7QUFBQSxhQUFPLFdBQVUsYUFBakIsRUFBK0IsU0FBUSxrQkFBdkM7QUFBQTtBQUFBLFdBekJEO0FBMEJDO0FBQUE7QUFBQSxhQUFLLFdBQVUsVUFBZjtBQUNDO0FBQUE7QUFBQSxjQUFRLElBQUcsa0JBQVgsRUFBOEIsTUFBSyxXQUFuQyxFQUErQyxPQUFPbkwsR0FBR2tKLFNBQXpELEVBQW9FLFVBQVUsS0FBS2MsWUFBbkY7QUFDQztBQUFBO0FBQUEsZUFBUSxPQUFNLE1BQWQ7QUFBQTtBQUFBLGFBREQ7QUFFQztBQUFBO0FBQUEsZUFBUSxPQUFNLFNBQWQ7QUFBQTtBQUFBLGFBRkQ7QUFHQztBQUFBO0FBQUEsZUFBUSxPQUFNLFFBQWQ7QUFBQTtBQUFBO0FBSEQ7QUFERDtBQTFCRDtBQUZEO0FBRkQsUUFQRDtBQWdEQztBQUFBO0FBQUEsVUFBSyxXQUFVLFVBQWY7QUFDQztBQUFBO0FBQUEsV0FBTyxTQUFRLGlCQUFmO0FBQUE7QUFBQSxTQUREO0FBRUM7QUFBQTtBQUFBLFdBQVEsSUFBRyxpQkFBWCxFQUE2QixNQUFLLFVBQWxDLEVBQTZDLE9BQU9oSyxHQUFHRSxRQUF2RCxFQUFpRSxVQUFVLEtBQUs4SixZQUFoRjtBQUNDO0FBQUE7QUFBQSxZQUFRLE9BQU0sRUFBZCxFQUFpQixLQUFJLFdBQXJCO0FBQUE7QUFBQSxVQUREO0FBRUVoTDtBQUZGO0FBRkQsUUFoREQ7QUF3REM7QUFBQTtBQUFBLFVBQUssV0FBVSxVQUFmO0FBQ0M7QUFBQTtBQUFBLFdBQU8sU0FBUSxhQUFmO0FBQUE7QUFBQSxTQUREO0FBRUMsb0RBQVUsSUFBRyxhQUFiLEVBQTJCLE1BQUssTUFBaEMsRUFBdUMsT0FBT2dCLEdBQUdtSixJQUFqRCxFQUF1RCxVQUFVLEtBQUthLFlBQXRFO0FBRkQsUUF4REQ7QUE2REM7QUFBQTtBQUFBLFVBQVEsV0FBVSxRQUFsQixFQUEyQixNQUFLLFFBQWhDLEVBQXlDLFNBQVMsS0FBS0ksWUFBdkQ7QUFBQTtBQUFBO0FBN0REO0FBREQsTUFMRDtBQXNFQztBQUFBO0FBQUEsUUFBSyxXQUFXLEtBQUsvTixLQUFMLENBQVdZLE9BQVgsR0FBcUIsZ0JBQXJCLEdBQXdDLFNBQXhEO0FBQ0MsNkNBQUssV0FBVSxTQUFmO0FBREQ7QUF0RUQsS0FERDtBQTRFQTs7OztHQW5SMEMsZ0JBQU1zRSxTOzttQkFBN0I2SixjIiwiZmlsZSI6ImNhbGVuZGFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCBSZWFjdENvb2tpZSBmcm9tICdyZWFjdC1jb29raWUnO1xyXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuaW1wb3J0IENhbGVuZGFyQm9keSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xyXG5pbXBvcnQgQ2FsZW5kYXJTaWRlYmFyIGZyb20gJy4vY2FsZW5kYXItc2lkZWJhcic7XHJcbmltcG9ydCBDYWxlbmRhckRldGFpbCBmcm9tICcuL2NhbGVuZGFyLWRldGFpbCc7XHJcbmltcG9ydCBDYWxlbmRhckNyZWF0ZSBmcm9tICcuL2NhbGVuZGFyLWNyZWF0ZSc7XHJcblxyXG5jbGFzcyBDYWxlbmRhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblxyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cclxuXHRcdGxldCBub3cgPSBtb21lbnQoKSxcclxuXHRcdFx0Y29va2llVmlldyA9IFJlYWN0Q29va2llLmxvYWQoJ3ZpZXcnKSB8fCAnd2Vla2x5JyxcclxuXHRcdFx0Y29va2llRmlsdGVyID0gUmVhY3RDb29raWUubG9hZCgnY2F0RmlsdGVyJykgfHwgW107XHJcblxyXG5cdFx0bm93Wydwb3NpdGlvbiddID0gMDtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRkYXRlOiBub3csXHJcblx0XHRcdHZpZXc6IGNvb2tpZVZpZXcsXHJcblx0XHRcdGV2ZW50czogW10sXHJcblx0XHRcdHF1ZXVlOiBbXSxcclxuXHRcdFx0cG9wdXA6IHsgYTogZmFsc2UsIHA6IGZhbHNlIH0sXHJcblx0XHRcdHVzZXI6IGZhbHNlLFxyXG5cdFx0XHRtZXNzYWdlOiB7IGE6IGZhbHNlLCBtOiBmYWxzZSwgbzogZmFsc2UgfSxcclxuXHRcdFx0bG9hZGluZzogZmFsc2UsXHJcblx0XHRcdGRldGFpbDogZmFsc2UsXHJcblx0XHRcdGNhdEZpbHRlcjogY29va2llRmlsdGVyLFxyXG5cdFx0XHRjYXRlZ29yaWVzOiBbXVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZmV0Y2hDYXRlZ29yaWVzID0gdGhpcy5mZXRjaENhdGVnb3JpZXMuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMuZmV0Y2hFdmVudHMgPSB0aGlzLmZldGNoRXZlbnRzLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLnJlZnJlc2hFdmVudHMgPSB0aGlzLnJlZnJlc2hFdmVudHMuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMuaGFuZGxlRXZlbnRDaGFuZ2UgPSB0aGlzLmhhbmRsZUV2ZW50Q2hhbmdlLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmhhbmRsZURhdGUgPSB0aGlzLmhhbmRsZURhdGUuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMuaGFuZGxlUG9wdXAgPSB0aGlzLmhhbmRsZVBvcHVwLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmhhbmRsZURldGFpbCA9IHRoaXMuaGFuZGxlRGV0YWlsLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmNhbmNlbFBvcHVwID0gdGhpcy5jYW5jZWxQb3B1cC5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5jYW5jZWxQb3B1cENsaWNrID0gdGhpcy5jYW5jZWxQb3B1cENsaWNrLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmNhbmNlbE1lc3NhZ2UgPSB0aGlzLmNhbmNlbE1lc3NhZ2UuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMucHJldmVudENhbmNlbFBvcHVwID0gdGhpcy5wcmV2ZW50Q2FuY2VsUG9wdXAuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMudG9nZ2xlRmlsdGVyID0gdGhpcy50b2dnbGVGaWx0ZXIuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMudmlld1RvZ2dsZSA9IHRoaXMudmlld1RvZ2dsZS5iaW5kKHRoaXMpO1xyXG5cdH1cclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XHJcblx0XHRsZXQgbm93ID0gbW9tZW50KCk7XHJcblxyXG5cdFx0dGhpcy5mZXRjaENhdGVnb3JpZXMoKTtcclxuXHRcdHRoaXMuaGFuZGxlRGF0ZShub3cpO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5zdGF0ZS52aWV3ID09ICd3ZWVrbHknKSB7XHJcblx0XHRcdGRvY3VtZW50LnRpdGxlID0gbW9tZW50KHRoaXMuc3RhdGUuZGF0ZSkuc3RhcnRPZignaXNvV2VlaycpLmZvcm1hdCgnRCcpICsgJ1xcdTIwMTMnICsgbW9tZW50KHRoaXMuc3RhdGUuZGF0ZSkuZW5kT2YoJ2lzb1dlZWsnKS5mb3JtYXQoJ0QgTU1NTSBZWVlZJykgKyAnIFxcdTIwMzkgQ2FsZW5kYXIgXFx1MjAxMyBIdW1waHJleSc7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PSAnbW9udGhseScpIHtcclxuXHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBtb21lbnQodGhpcy5zdGF0ZS5kYXRlKS5mb3JtYXQoJ01NTU0gWVlZWScpICsgJyBcXHUyMDM5IENhbGVuZGFyIFxcdTIwMTMgSHVtcGhyZXknO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZmV0Y2hDYXRlZ29yaWVzKCkge1xyXG5cdFx0bGV0IHggPSB0aGlzLnN0YXRlLmNhdGVnb3JpZXMubGVuZ3RoO1xyXG5cclxuXHRcdCQuYWpheCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogZG9jdW1lbnQuYmFzZVVSSSArICcvZXZlbnRzLz9jYXRlZ29yaWVzPTEnLFxyXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nXHJcblx0XHR9KS5kb25lKGNhdGVnb3J5TGlzdCA9PiB7XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgY2F0TGlzdCA9IF8uc29ydEJ5KGNhdGVnb3J5TGlzdCwgJ25hbWUnKTtcclxuXHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBjYXRlZ29yaWVzOiBjYXRMaXN0IH0sICgpID0+IHtcclxuXHRcdFx0XHRpZiAoeCA+IDApIHtcclxuXHJcblx0XHRcdFx0XHR0aGlzLmZldGNoRXZlbnRzKHRoaXMuc3RhdGUuZGF0ZSwgbmV3RXZlbnRzID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IGZhbHNlLCBldmVudHM6IG5ld0V2ZW50cyB9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmZXRjaEV2ZW50cyh3ZWVrLCBjYWxsYmFjaykge1xyXG5cdFx0bGV0IHN0YXJ0ID0gbW9tZW50KHdlZWspLnN0YXJ0T2YoJ2lzb1dlZWsnKS5mb3JtYXQoJ1gnKSwgXHJcblx0XHRcdGVuZCA9IG1vbWVudCh3ZWVrKS5lbmRPZignaXNvV2VlaycpLmZvcm1hdCgnWCcpLFxyXG5cdFx0XHRjYXRGaWx0ZXIgPSB0aGlzLnN0YXRlLmNhdEZpbHRlcjtcclxuXHJcblx0XHRpZiAodGhpcy5zdGF0ZS52aWV3ID09ICdtb250aGx5Jykge1xyXG5cdFx0XHRzdGFydCA9IG1vbWVudCh3ZWVrKS5zdGFydE9mKCdtb250aCcpLnN1YnRyYWN0KDE1LCAnZGF5cycpLmZvcm1hdCgnWCcpO1xyXG5cdFx0XHRlbmQgPSBtb21lbnQod2VlaykuZW5kT2YoJ21vbnRoJykuYWRkKDE1LCAnZGF5cycpLmZvcm1hdCgnWCcpO1xyXG5cdFx0fSBcclxuXHJcblx0XHR0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogdHJ1ZSB9LCAoKSA9PiB7XHJcblxyXG5cdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdFx0dXJsOiBkb2N1bWVudC5iYXNlVVJJICsgJy9ldmVudHMvP3N0YXJ0PScgKyBzdGFydCArICcmZW5kPScgKyBlbmQsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJ1xyXG5cdFx0XHR9KS5kb25lKGRhdGEgPT4ge1xyXG5cclxuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xyXG5cclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cclxuXHRcdFx0XHRcdFx0ZGF0YS5mb3JFYWNoKGV2ID0+IHtcclxuXHJcblx0XHRcdFx0XHRcdFx0ZXZbJ3Zpc2libGUnXSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGNhdEZpbHRlci5sZW5ndGggPiAwICYmIGNhdEZpbHRlci5pbmRleE9mKGV2LmNhdGVnb3J5Ll9pZCkgPT0gLTEpIGV2LnZpc2libGUgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGV2LmFsbGRheSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZXYuc3RhcnQgPSBtb21lbnQoZXYuc3RhcnQsICdYJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZXYuZW5kKSBldi5lbmQgPSBtb21lbnQoZXYuZW5kLCAnWCcpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRldi5zdGFydCA9IG1vbWVudChldi5zdGFydCwgJ1gnKS5zdWJ0cmFjdCgyLCAnaG91cnMnKTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChldi5lbmQpIGV2LmVuZCA9IG1vbWVudChldi5lbmQsICdYJykuc3VidHJhY3QoMiwgJ2hvdXJzJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0sIDEwMCk7XHJcblxyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGNhbGxiYWNrKGRhdGEpOyB9LCAzMDApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgY2FsbGJhY2soW10pOyB9LCAzMDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdH1cclxuXHJcblx0cmVmcmVzaEV2ZW50cyhlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dGhpcy5mZXRjaEV2ZW50cyh0aGlzLnN0YXRlLmRhdGUsIG5ld0V2ZW50cyA9PiB7XHJcblx0XHRcdHRoaXMuY2FuY2VsTWVzc2FnZSgpO1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogZmFsc2UsIGV2ZW50czogbmV3RXZlbnRzfSk7IFxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGhhbmRsZUV2ZW50Q2hhbmdlKGV2KSB7XHJcblx0XHRsZXQgZXZlbnRzID0gdGhpcy5zdGF0ZS5ldmVudHM7XHRcclxuXHRcdHRoaXMuZmV0Y2hFdmVudHModGhpcy5zdGF0ZS5kYXRlLCBuZXdFdmVudHMgPT4ge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogZmFsc2UsIGV2ZW50czogbmV3RXZlbnRzIH0pO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGhhbmRsZURhdGUobmV3RGF0ZSkge1xyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLnZpZXcgPT0gJ3dlZWtseScgJiYgbW9tZW50KG5ld0RhdGUpLmlzb1dlZWtkYXkoKSA9PSAxKSBuZXdEYXRlID0gbW9tZW50KG5ld0RhdGUpLmFkZCgxLCAnZGF5cycpO1xyXG5cclxuXHRcdHRoaXMuZmV0Y2hFdmVudHMobmV3RGF0ZSwgbmV3RXZlbnRzID0+IHtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IGZhbHNlLCBkYXRlOiBuZXdEYXRlLCBldmVudHM6IG5ld0V2ZW50cyB9LCAoKSA9PiB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKHRoaXMuc3RhdGUudmlldyA9PSAnd2Vla2x5Jykge1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBtb21lbnQobmV3RGF0ZSkuc3RhcnRPZignaXNvV2VlaycpLmZvcm1hdCgnRCcpICsgJ1xcdTIwMTMnICsgbW9tZW50KG5ld0RhdGUpLmVuZE9mKCdpc29XZWVrJykuZm9ybWF0KCdEIE1NTU0gWVlZWScpICsgJyBcXHUyMDM5IENhbGVuZGFyIFxcdTIwMTMgSHVtcGhyZXknO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09ICdtb250aGx5Jykge1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSBtb21lbnQobmV3RGF0ZSkuZm9ybWF0KCdNTU1NIFlZWVknKSArICcgXFx1MjAzOSBDYWxlbmRhciBcXHUyMDEzIEh1bXBocmV5JztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRoYW5kbGVQb3B1cChhcmcpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBwb3B1cDogeyBhOiB0cnVlLCBwOiBhcmcgfX0pO1xyXG5cdH1cclxuXHJcblx0aGFuZGxlRGV0YWlsKGFyZykge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGRldGFpbDogYXJnIH0pO1xyXG5cdH1cclxuXHJcblx0Y2FuY2VsUG9wdXAoKSB7XHJcblx0XHRsZXQgcG9wdXAgPSB0aGlzLnN0YXRlLnBvcHVwO1xyXG5cdFx0cG9wdXAuYSA9IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBwb3B1cDogcG9wdXAgfSwgKCkgPT4ge1xyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0cG9wdXAucCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgcG9wdXA6IHBvcHVwIH0sICgpID0+IHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnN0YXRlLm1lc3NhZ2UubyAhPSAnc3VjY2VzcycpIHRoaXMuY2FuY2VsTWVzc2FnZSgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCAxKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Y2FuY2VsUG9wdXBDbGljayhlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRsZXQgcG9wdXAgPSB0aGlzLnN0YXRlLnBvcHVwO1xyXG5cclxuXHRcdGlmIChlLnRhcmdldC5pZCA9PSAnY2FsZW5kYXItamFja2V0JyB8fCBlLnRhcmdldC5pZCA9PSAnY2xvc2UtcG9wdXAnKSB7XHJcblx0XHRcdHBvcHVwLmEgPSBmYWxzZTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBwb3B1cDogcG9wdXAgfSwgKCkgPT4ge1xyXG5cclxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdHBvcHVwLnAgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHBvcHVwOiBwb3B1cCwgZGV0YWlsOiBmYWxzZSB9LCAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLnN0YXRlLm1lc3NhZ2UubyAhPSAnc3VjY2VzcycpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNhbmNlbE1lc3NhZ2UoKTtcdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LCAyNTEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gXHJcblx0fVxyXG5cclxuXHRjYW5jZWxNZXNzYWdlKGUpIHtcclxuXHRcdGlmIChlKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRsZXQgbWVzc2FnZSA9IHRoaXMuc3RhdGUubWVzc2FnZTtcclxuXHJcblx0XHRtZXNzYWdlLmEgPSBmYWxzZTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBtZXNzYWdlOiBtZXNzYWdlIH0sICgpID0+IHtcclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0bWVzc2FnZS5tID0gZmFsc2U7XHJcblx0XHRcdFx0bWVzc2FnZS5vID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG1lc3NhZ2U6IG1lc3NhZ2UsIHF1ZXVlOiBbXSB9KTtcclxuXHRcdFx0fSwgMjUxKVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwcmV2ZW50Q2FuY2VsUG9wdXAoZSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IH1cclxuXHJcblx0dG9nZ2xlRmlsdGVyKGFyZykge1xyXG5cdFx0bGV0IGNhdCA9IE51bWJlcihhcmcpLFxyXG5cdFx0XHRjYXRGaWx0ZXIgPSB0aGlzLnN0YXRlLmNhdEZpbHRlcixcclxuXHRcdFx0ZXZlbnRzID0gdGhpcy5zdGF0ZS5ldmVudHMsXHJcblx0XHRcdGNhdEluZGV4ID0gY2F0RmlsdGVyLmluZGV4T2YoY2F0KTtcclxuXHJcblx0XHRpZiAoY2F0SW5kZXggPiAtMSkgY2F0RmlsdGVyLnNwbGljZShjYXRJbmRleCwgMSk7XHJcblx0XHRpZiAoY2F0SW5kZXggPT0gLTEpIGNhdEZpbHRlci5wdXNoKGNhdCk7XHJcblx0XHRpZiAoYXJnID09ICdjbGVhcicpIGNhdEZpbHRlciA9IFtdO1xyXG5cclxuXHRcdGV2ZW50cy5mb3JFYWNoKGV2ID0+IHtcclxuXHRcdFx0ZXYudmlzaWJsZSA9IHRydWU7XHJcblx0XHRcdGlmIChjYXRGaWx0ZXIubGVuZ3RoID4gMCAgJiYgY2F0RmlsdGVyLmluZGV4T2YoZXYuY2F0ZWdvcnkuX2lkKSA9PSAtMSkgZXYudmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGNhdEZpbHRlcjogY2F0RmlsdGVyLCBldmVudHM6IGV2ZW50cyB9LCAoKSA9PiB7XHJcblx0XHRcdFJlYWN0Q29va2llLnNhdmUoJ2NhdEZpbHRlcicsIGNhdEZpbHRlcik7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHZpZXdUb2dnbGUoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0bGV0IGRhdGUgPSB0aGlzLnN0YXRlLmRhdGUsIG5ld1ZpZXcgPSAnd2Vla2x5JztcclxuXHJcblx0XHRpZiAodGhpcy5zdGF0ZS52aWV3ID09ICd3ZWVrbHknKSBuZXdWaWV3ID0gJ21vbnRobHknO1xyXG5cdFx0XHRcdFxyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZpZXc6IG5ld1ZpZXcgfSwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmhhbmRsZURhdGUoZGF0ZSk7XHJcblx0XHRcdFJlYWN0Q29va2llLnNhdmUoJ3ZpZXcnLCBuZXdWaWV3KTtcclxuXHRcdH0pO1x0XHRcclxuXHR9XHJcblx0XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0bGV0IENhbGVuZGFyUG9wdXA7XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUucG9wdXAucCA9PSAnZGV0YWlsJykgQ2FsZW5kYXJQb3B1cCA9IDxDYWxlbmRhckRldGFpbCBcclxuXHRcdFx0dXNlcj17dGhpcy5zdGF0ZS51c2VyfVxyXG5cdFx0XHRkZXRhaWw9e3RoaXMuc3RhdGUuZGV0YWlsfVxyXG5cdFx0XHRjYXRlZ29yaWVzPXt0aGlzLnN0YXRlLmNhdGVnb3JpZXN9XHJcblx0XHRcdGNhbmNlbFBvcHVwPXt0aGlzLmNhbmNlbFBvcHVwfSBcclxuXHRcdFx0dXBkYXRlRXZlbnQ9e3RoaXMuaGFuZGxlRXZlbnRDaGFuZ2V9IC8+O1xyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLnBvcHVwLnAgPT0gJ2NyZWF0ZScpIENhbGVuZGFyUG9wdXAgPSA8Q2FsZW5kYXJDcmVhdGUgXHJcblx0XHRcdHVzZXI9e3RoaXMuc3RhdGUudXNlcn1cclxuXHRcdFx0Y2FuY2VsUG9wdXA9e3RoaXMuY2FuY2VsUG9wdXB9XHJcblx0XHRcdGNhdGVnb3JpZXM9e3RoaXMuc3RhdGUuY2F0ZWdvcmllc30gXHJcblx0XHRcdG5ld0V2ZW50PXt0aGlzLmhhbmRsZUV2ZW50Q2hhbmdlfSAvPjtcclxuXHJcblx0XHR2YXIgQ2FsZW5kYXJNZXNzYWdlLCBtZXNzYWdlQ2xhc3NlcyA9ICdjYWxlbmRhci1tZXNzYWdlICc7XHJcblx0XHRpZiAodGhpcy5zdGF0ZS5tZXNzYWdlLm0pIHtcclxuXHRcdFx0Q2FsZW5kYXJNZXNzYWdlID0gKFxyXG5cdFx0XHRcdDxzcGFuPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdjb250ZW50Jz57dGhpcy5zdGF0ZS5tZXNzYWdlLm19PC9zcGFuPlxyXG5cdFx0XHRcdFx0PGEgaHJlZj0nJyBjbGFzc05hbWU9J2Nsb3NlJyBvbkNsaWNrPXt0aGlzLmNhbmNlbE1lc3NhZ2V9PiZ0aW1lczs8L2E+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHQpO1xyXG5cdFx0XHRtZXNzYWdlQ2xhc3NlcyA9IG1lc3NhZ2VDbGFzc2VzICsgdGhpcy5zdGF0ZS5tZXNzYWdlLm87XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBpZD0nY2FsZW5kYXItd3JhcHBlcicgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLm1lc3NhZ2UuYSA/ICdtZXNzYWdlJyA6ICcnfT5cclxuXHJcblx0XHRcdFx0PENhbGVuZGFyU2lkZWJhclxyXG5cdFx0XHRcdFx0ZGF0ZT17dGhpcy5zdGF0ZS5kYXRlfVxyXG5cdFx0XHRcdFx0dmlldz17dGhpcy5zdGF0ZS52aWV3fVxyXG5cdFx0XHRcdFx0Y2F0RmlsdGVyPXt0aGlzLnN0YXRlLmNhdEZpbHRlcn1cclxuXHRcdFx0XHRcdGNhdGVnb3JpZXM9e3RoaXMuc3RhdGUuY2F0ZWdvcmllc31cclxuXHRcdFx0XHRcdHRvZ2dsZUZpbHRlcj17dGhpcy50b2dnbGVGaWx0ZXJ9XHJcblx0XHRcdFx0XHRzZXREYXRlPXt0aGlzLmhhbmRsZURhdGV9XHJcblx0XHRcdFx0XHR2aWV3VG9nZ2xlPXt0aGlzLnZpZXdUb2dnbGV9IC8+XHJcblxyXG5cdFx0XHRcdDxDYWxlbmRhckJvZHlcclxuXHRcdFx0XHRcdGRhdGU9e3RoaXMuc3RhdGUuZGF0ZX1cclxuXHRcdFx0XHRcdHZpZXc9e3RoaXMuc3RhdGUudmlld31cclxuXHRcdFx0XHRcdGV2ZW50cz17dGhpcy5zdGF0ZS5ldmVudHN9XHJcblx0XHRcdFx0XHRsb2FkaW5nPXt0aGlzLnN0YXRlLmxvYWRpbmd9XHJcblx0XHRcdFx0XHR1c2VyPXt0aGlzLnN0YXRlLnVzZXJ9IFxyXG5cdFx0XHRcdFx0c2V0RGF0ZT17dGhpcy5oYW5kbGVEYXRlfVxyXG5cdFx0XHRcdFx0c2V0UG9wdXA9e3RoaXMuaGFuZGxlUG9wdXB9XHJcblx0XHRcdFx0XHRzZXREZXRhaWw9e3RoaXMuaGFuZGxlRGV0YWlsfSAvPlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGlkPSdjYWxlbmRhci1qYWNrZXQnIG9uQ2xpY2s9e3RoaXMuY2FuY2VsUG9wdXBDbGlja30gY2xhc3NOYW1lPXt0aGlzLnN0YXRlLnBvcHVwLmEgPyAnYWN0aXZlJyA6ICcnfT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXsnY2FsZW5kYXItcG9wdXAgJyArIHRoaXMuc3RhdGUucG9wdXAucH0gb25DbGljaz17dGhpcy5wcmV2ZW50Q2FuY2VsUG9wdXB9PlxyXG5cdFx0XHRcdFx0XHR7Q2FsZW5kYXJQb3B1cH1cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tZXNzYWdlLmEgPyBtZXNzYWdlQ2xhc3NlcyArICcgYWN0aXZlJyA6IG1lc3NhZ2VDbGFzc2VzfT5cclxuXHRcdFx0XHRcdHtDYWxlbmRhck1lc3NhZ2V9XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KVxyXG5cdH1cclxufVxyXG5cclxuUmVhY3RET00ucmVuZGVyKDxDYWxlbmRhciAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbGVuZGFyJykpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvc3JjL2NhbGVuZGFyLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBDYWxlbmRhckNvbnRyb2xzIGZyb20gJy4vY2FsZW5kYXItY29udHJvbHMnO1xyXG5pbXBvcnQgQ2FsZW5kYXJNb250aGx5IGZyb20gJy4vY2FsZW5kYXItbW9udGhseSc7XHJcbmltcG9ydCBDYWxlbmRhclN0cmV0Y2ggZnJvbSAnLi9jYWxlbmRhci1zdHJldGNoJztcclxuXHRcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsZW5kYXJCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0bGV0IENhbGVuZGFyUGVyaW9kO1xyXG5cdFx0aWYgKHRoaXMucHJvcHMudmlldyA9PSAnd2Vla2x5Jykge1xyXG5cclxuXHRcdFx0Q2FsZW5kYXJQZXJpb2QgPSAoXHJcblx0XHRcdFx0PENhbGVuZGFyU3RyZXRjaCBcclxuXHRcdFx0XHRcdGxvYWRpbmc9e3RoaXMucHJvcHMubG9hZGluZ31cclxuXHRcdFx0XHRcdGRhdGU9e3RoaXMucHJvcHMuZGF0ZX1cclxuXHRcdFx0XHRcdGV2ZW50cz17dGhpcy5wcm9wcy5ldmVudHN9XHJcblx0XHRcdFx0XHRzZXRQb3B1cD17dGhpcy5wcm9wcy5zZXRQb3B1cH1cclxuXHRcdFx0XHRcdHNldERldGFpbD17dGhpcy5wcm9wcy5zZXREZXRhaWx9IC8+XHJcblx0XHRcdClcclxuXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMucHJvcHMudmlldyA9PSAnbW9udGhseScpIHtcclxuXHJcblx0XHRcdENhbGVuZGFyUGVyaW9kID0gKFxyXG5cdFx0XHRcdDxDYWxlbmRhck1vbnRobHkgXHJcblx0XHRcdFx0XHRsb2FkaW5nPXt0aGlzLnByb3BzLmxvYWRpbmd9XHJcblx0XHRcdFx0XHRkYXRlPXt0aGlzLnByb3BzLmRhdGV9XHJcblx0XHRcdFx0XHRldmVudHM9e3RoaXMucHJvcHMuZXZlbnRzfVxyXG5cdFx0XHRcdFx0c2V0UG9wdXA9e3RoaXMucHJvcHMuc2V0UG9wdXB9XHJcblx0XHRcdFx0XHRzZXREZXRhaWw9e3RoaXMucHJvcHMuc2V0RGV0YWlsfSAvPlxyXG5cdFx0XHQpXHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxzZWN0aW9uIGlkPSdjYWxlbmRhci1ib2R5Jz5cclxuXHRcdFx0XHQ8Q2FsZW5kYXJDb250cm9scyBcclxuXHRcdFx0XHRcdGRhdGU9e3RoaXMucHJvcHMuZGF0ZX1cclxuXHRcdFx0XHRcdHZpZXc9e3RoaXMucHJvcHMudmlld31cclxuXHRcdFx0XHRcdHVzZXI9e3RoaXMucHJvcHMudXNlcn1cclxuXHRcdFx0XHRcdHNldERhdGU9e3RoaXMucHJvcHMuc2V0RGF0ZX1cclxuXHRcdFx0XHRcdHNldFBvcHVwPXt0aGlzLnByb3BzLnNldFBvcHVwfVxyXG5cdFx0XHRcdFx0aGFuZGxlQXV0aD17dGhpcy5wcm9wcy5oYW5kbGVBdXRofSAvPlxyXG5cclxuXHRcdFx0XHR7Q2FsZW5kYXJQZXJpb2R9XHJcblx0XHRcdDwvc2VjdGlvbj5cclxuXHRcdClcclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL3NyYy9jYWxlbmRhci1ib2R5LmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsZW5kYXJDb250cm9scyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5zZXREYXRlID0gdGhpcy5zZXREYXRlLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLnNldFBvcHVwID0gdGhpcy5zZXRQb3B1cC5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5oYW5kbGVMb2dvdXQgPSB0aGlzLmhhbmRsZUxvZ291dC5iaW5kKHRoaXMpO1xyXG5cdH1cclxuXHJcblx0c2V0RGF0ZShlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR0aGlzLnByb3BzLnNldERhdGUobW9tZW50KGUudGFyZ2V0LmRhdGFzZXQuZGF0ZSwgJ1lZWVktTU0tREQnKSk7XHJcblx0fVxyXG5cclxuXHRzZXRQb3B1cChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR0aGlzLnByb3BzLnNldFBvcHVwKGUudGFyZ2V0LmRhdGFzZXQuYXJnKTtcclxuXHR9XHJcblxyXG5cdGhhbmRsZUxvZ291dChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR0aGlzLnByb3BzLmhhbmRsZUF1dGgoJ2xvZ291dCcpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0bGV0IHByZXYsXHRuZXh0LFx0bm93ID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJyksXHJcblx0XHRcdGxvZ2luQnV0dG9uLCBjcmVhdGVCdXR0b24sIHNldHRpbmdzQnV0dG9uLFxyXG5cdFx0XHRwZXJpb2RUaXRsZSwgcGVyaW9kTnVtLCBwZXJpb2ROYXYsXHJcblx0XHRcdHN0eWxlcztcclxuXHJcblx0XHRpZiAodGhpcy5wcm9wcy52aWV3ID09ICd3ZWVrbHknKSB7XHJcblx0XHRcdGxldCBzdGFydFdlZWsgPSBtb21lbnQodGhpcy5wcm9wcy5kYXRlKS5zdGFydE9mKCdpc29XZWVrJyksXHJcblx0XHRcdFx0bmV4dCA9IG1vbWVudCh0aGlzLnByb3BzLmRhdGUpLmFkZCg3LCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxyXG5cdFx0XHRcdHByZXYgPSBtb21lbnQodGhpcy5wcm9wcy5kYXRlKS5zdWJ0cmFjdCg3LCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG5cclxuXHRcdFx0cGVyaW9kVGl0bGUgPSAoXHJcblx0XHRcdFx0PGgxPnttb21lbnQodGhpcy5wcm9wcy5kYXRlKS5zdGFydE9mKCdpc29XZWVrJykuZm9ybWF0KCdEJykgKyAnIFxcdTIwMTMgJyArIG1vbWVudCh0aGlzLnByb3BzLmRhdGUpLmVuZE9mKCdpc29XZWVrJykuZm9ybWF0KCdEIE1NTSBZWVlZJyl9PC9oMT5cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdHBlcmlvZE51bSA9IChcclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3dlZWtseS1udW0nIHRpdGxlPXsnV2VlayAnICsgbW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuZm9ybWF0KCdXJyl9PlxyXG5cdFx0XHRcdFx0PHN0cm9uZz57bW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuZm9ybWF0KCdXJyl9PC9zdHJvbmc+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0cGVyaW9kTmF2ID0gKFxyXG5cdFx0XHRcdDxkaXY+XHJcblx0XHRcdFx0XHQ8YSBocmVmPScnIG9uQ2xpY2s9e3RoaXMuc2V0RGF0ZX0gY2xhc3NOYW1lPSdtYXRlcmlhbC1pY29ucyBwcmV2JyBkYXRhLWRhdGU9e3ByZXZ9IHRpdGxlPXsnR28gdG8gd2VlayAnICsgbW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuc3VidHJhY3QoMSwgJ3dlZWtzJykuZm9ybWF0KCdXJyl9PmFycm93X2JhY2s8L2E+XHJcblx0XHRcdFx0XHR7cGVyaW9kVGl0bGV9IHtwZXJpb2ROdW19XHJcblx0XHRcdFx0XHQ8YSBocmVmPScnIG9uQ2xpY2s9e3RoaXMuc2V0RGF0ZX0gY2xhc3NOYW1lPSdtYXRlcmlhbC1pY29ucyBuZXh0JyBkYXRhLWRhdGU9e25leHR9IHRpdGxlPXsnR28gdG8gd2VlayAnICsgbW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuYWRkKDEsICd3ZWVrcycpLmZvcm1hdCgnVycpfT5hcnJvd19mb3J3YXJkPC9hPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHRpZiAobW9tZW50KCkuc3RhcnRPZignaXNvV2VlaycpLmlzU2FtZShzdGFydFdlZWssICd3ZWVrJykpIHN0eWxlcyA9IHsgZGlzcGxheTogJ25vbmUnfVxyXG5cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5wcm9wcy52aWV3ID09ICdtb250aGx5Jykge1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG5leHQgPSBtb21lbnQodGhpcy5wcm9wcy5kYXRlKS5hZGQoMSwgJ21vbnRocycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpLFxyXG5cdFx0XHRcdHByZXYgPSBtb21lbnQodGhpcy5wcm9wcy5kYXRlKS5zdWJ0cmFjdCgxLCAnbW9udGhzJykuZm9ybWF0KCdZWVlZLU1NLUREJyk7XHJcblxyXG5cdFx0XHRwZXJpb2RUaXRsZSA9IDxoMT57bW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuZm9ybWF0KCdNTU1NIFlZWVknKX08L2gxPlxyXG5cclxuXHRcdFx0cGVyaW9kTmF2ID0gKFxyXG5cdFx0XHRcdDxuYXYgY2xhc3NOYW1lPSd3ZWVrbHktbmF2Jz5cclxuXHRcdFx0XHRcdDxhIGhyZWY9Jycgb25DbGljaz17dGhpcy5zZXREYXRlfSBjbGFzc05hbWU9J21hdGVyaWFsLWljb25zIHByZXYnIGRhdGEtZGF0ZT17cHJldn0gdGl0bGU9eydHbyB0byAnICsgbW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuc3VidHJhY3QoMSwgJ21vbnRocycpLmZvcm1hdCgnTU1NTSBZWVlZJyl9PmFycm93X2JhY2s8L2E+XHJcblx0XHRcdFx0XHR7cGVyaW9kVGl0bGV9IHtwZXJpb2ROdW19XHJcblx0XHRcdFx0XHQ8YSBocmVmPScnIG9uQ2xpY2s9e3RoaXMuc2V0RGF0ZX0gY2xhc3NOYW1lPSdtYXRlcmlhbC1pY29ucyBuZXh0JyBkYXRhLWRhdGU9e25leHR9IHRpdGxlPXsnR28gdG8gJyArIG1vbWVudCh0aGlzLnByb3BzLmRhdGUpLmFkZCgxLCAnbW9udGhzJykuZm9ybWF0KCdNTU1NIFlZWVknKX0+YXJyb3dfZm9yd2FyZDwvYT5cclxuXHRcdFx0XHQ8L25hdj5cclxuXHRcdFx0KVxyXG5cdFx0XHJcblx0XHRcdGlmIChtb21lbnQoKS5pc1NhbWUodGhpcy5wcm9wcy5kYXRlLCAnbW9udGgnKSkgc3R5bGVzID0geyBkaXNwbGF5OiAnbm9uZSd9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGlmICghdGhpcy5wcm9wcy51c2VyKSBsb2dpbkJ1dHRvbiA9IDxhIGhyZWY9JycgY2xhc3NOYW1lPSdidXR0b24nIG9uQ2xpY2s9e3RoaXMuc2V0UG9wdXB9IGRhdGEtYXJnPSdsb2dpbic+TG9naW48L2E+O1xyXG5cdFx0aWYgKHRoaXMucHJvcHMudXNlcikgbG9naW5CdXR0b24gPSA8YSBocmVmPScnIGNsYXNzTmFtZT0nYnV0dG9uJyBvbkNsaWNrPXt0aGlzLmhhbmRsZUxvZ291dH0+TG9nb3V0PC9hPjtcclxuXHRcdGlmICgkKCcjaGVhZGVyLXVzZXInKS5oYXNDbGFzcygncHVibGlzaGVyJykpIGNyZWF0ZUJ1dHRvbiA9IDxhIGhyZWY9JycgY2xhc3NOYW1lPSdidXR0b24nIG9uQ2xpY2s9e3RoaXMuc2V0UG9wdXB9IGRhdGEtYXJnPSdjcmVhdGUnPkFkZCBldmVudDwvYT47XHJcblx0XHRcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxoZWFkZXIgaWQ9J2NhbGVuZGFyLWNvbnRyb2xzJz5cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQ8bmF2IGNsYXNzTmFtZT0nd2Vla2x5LW5hdic+XHJcblx0XHRcdFx0XHR7cGVyaW9kTmF2fVxyXG5cdFx0XHRcdDwvbmF2PlxyXG5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nd2Vla2x5LW9wdGlvbnMnPlxyXG5cdFx0XHRcdFx0PGEgaHJlZj0nJyBjbGFzc05hbWU9J2J1dHRvbiB0b2RheScgb25DbGljaz17dGhpcy5zZXREYXRlfSBkYXRhLWRhdGU9e25vd30gc3R5bGU9e3N0eWxlc30+VG9kYXk8L2E+XHJcblx0XHRcdFx0XHR7Y3JlYXRlQnV0dG9ufVxyXG5cdFx0XHRcdFx0e3NldHRpbmdzQnV0dG9ufVxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2hlYWRlcj5cclxuXHRcdClcclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL3NyYy9jYWxlbmRhci1jb250cm9scy5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5pbXBvcnQgQ2FsZW5kYXJNb250aCBmcm9tICcuL2NhbGVuZGFyLW1vbnRoJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGVuZGFyTW9udGhseSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHRcclxuXHRcdHRoaXMuc3RhdGUgPSB7IFxyXG5cdFx0XHRkYXRlczogW10sXHJcblx0XHRcdGV2ZW50czogW10gXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG5cdFx0bGV0IGRhdGVzID0gdGhpcy5zdGF0ZS5kYXRlcyxcclxuXHRcdFx0b2xkRGF0ZSA9IHRoaXMucHJvcHMuZGF0ZSxcclxuXHRcdFx0bmV3RGF0ZSA9IG5leHRQcm9wcy5kYXRlO1xyXG5cclxuXHRcdGlmIChfLmlzRXF1YWwob2xkRGF0ZSwgbmV3RGF0ZSkgJiYgdGhpcy5wcm9wcy5ldmVudHMgPT0gbmV4dFByb3BzLmV2ZW50cykgcmV0dXJuO1xyXG5cclxuXHRcdGlmIChtb21lbnQobmV3RGF0ZSkuaXNTYW1lKG9sZERhdGUsICdtb250aCcpKSB7XHJcblx0XHRcdG5ld0RhdGUucG9zaXRpb24gPSAnIHNhbWUtbW9udGgnO1xyXG5cdFx0fSBlbHNlIGlmIChtb21lbnQobmV3RGF0ZSkuaXNCZWZvcmUob2xkRGF0ZSkpIHtcclxuXHRcdFx0bmV3RGF0ZS5wb3NpdGlvbiA9ICcgbmV3LWxlZnQnO1xyXG5cdFx0fSBlbHNlIGlmIChtb21lbnQobmV3RGF0ZSkuaXNBZnRlcihvbGREYXRlKSkge1xyXG5cdFx0XHRuZXdEYXRlLnBvc2l0aW9uID0gJyBuZXctcmlnaHQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRhdGVzLnB1c2gobmV3RGF0ZSk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHsgZGF0ZXM6IGRhdGVzIH0sICgpID0+IHtcclxuXHJcblx0XHRcdGlmIChtb21lbnQob2xkRGF0ZSkuaXNTYW1lKG5ld0RhdGUsICdtb250aCcpKSB7XHJcblx0XHRcdFx0bGV0IG5ld0RhdGVzID0gXy5yZWplY3QodGhpcy5zdGF0ZS5kYXRlcywgZGF0ZSA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZGF0ZS5wb3NpdGlvbiA9PSAwO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBkYXRlczogbmV3RGF0ZXMgfSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRpZiAobW9tZW50KG5ld0RhdGUpLmlzQmVmb3JlKG9sZERhdGUpKSB7XHJcblx0XHRcdFx0XHQkKCcuY2FsZW5kYXItbW9udGgjJysgbW9tZW50KG9sZERhdGUpLmZvcm1hdChcIllZWVktTU1cIikpLmFkZENsYXNzKCdvbGQtcmlnaHQnKTtcclxuXHRcdFx0XHRcdCQoJy5jYWxlbmRhci1tb250aCMnKyBtb21lbnQobmV3RGF0ZSkuZm9ybWF0KFwiWVlZWS1NTVwiKSkucmVtb3ZlQ2xhc3MoJ25ldy1sZWZ0IG9sZC1sZWZ0IG5ldy1yaWdodCBvbGQtcmlnaHQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1vbWVudChuZXdEYXRlKS5pc0FmdGVyKG9sZERhdGUpKSB7XHJcblx0XHRcdFx0XHQkKCcuY2FsZW5kYXItbW9udGgjJysgbW9tZW50KG9sZERhdGUpLmZvcm1hdChcIllZWVktTU1cIikpLmFkZENsYXNzKCdvbGQtbGVmdCcpO1xyXG5cdFx0XHRcdFx0JCgnLmNhbGVuZGFyLW1vbnRoIycrIG1vbWVudChuZXdEYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpKS5yZW1vdmVDbGFzcygnbmV3LWxlZnQgb2xkLWxlZnQgbmV3LXJpZ2h0IG9sZC1yaWdodCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgMSk7XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRsZXQgbmV3RGF0ZXMgPSBfLnJlamVjdCh0aGlzLnN0YXRlLmRhdGVzLCBkYXRlID0+IHtcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQob2xkRGF0ZSkuaXNTYW1lKGRhdGUsICdtb250aCcpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGRhdGVzOiBuZXdEYXRlcyB9KTtcclxuXHRcdFx0fSwgNDAwKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRyZW5kZXIoKSB7XHRcclxuXHRcdGxldFx0bW9udGhMaXN0ID0gdGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRhdGUsIGluZGV4KSA9PiB7XHJcblx0XHRcdGxldCBtb250aE51bSA9IG1vbWVudChkYXRlKS5mb3JtYXQoJ1lZWVktTU0nKTtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0PENhbGVuZGFyTW9udGggXHJcblx0XHRcdFx0XHRkYXRlPXtkYXRlfSBcclxuXHRcdFx0XHRcdGV2ZW50cz17dGhpcy5wcm9wcy5ldmVudHN9XHJcblx0XHRcdFx0XHRrZXk9e21vbnRoTnVtfVxyXG5cdFx0XHRcdFx0c2V0UG9wdXA9e3RoaXMucHJvcHMuc2V0UG9wdXB9XHJcblx0XHRcdFx0XHRzZXREZXRhaWw9e3RoaXMucHJvcHMuc2V0RGV0YWlsfSAvPlxyXG5cdFx0XHQpXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGlkPSdjYWxlbmRhci1tb250aGx5Jz5cclxuXHRcdFx0XHR7bW9udGhMaXN0fVxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmxvYWRpbmcgPyAnbG9hZGVyIGFjdGl2ZScgOiAnbG9hZGVyJ30+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nc3Bpbm5lcic+PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+IFxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdClcclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL3NyYy9jYWxlbmRhci1tb250aGx5LmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IGZ1bGxDYWxlbmRhciBmcm9tICdmdWxsY2FsZW5kYXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsZW5kYXJNb250aCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cdFx0bGV0IHRoYXQgPSB0aGlzLCBtb250aElkID0gbW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuZm9ybWF0KCdZWVlZLU1NJyksIG5vdyA9IG1vbWVudCgpO1xyXG5cclxuXHRcdGxldCBjb3JyZWN0ZWRFdmVudHMgPSB0aGlzLnByb3BzLmV2ZW50cztcclxuXHRcdGNvcnJlY3RlZEV2ZW50cy5mb3JFYWNoKGV2ID0+IHtcclxuXHRcdFx0aWYgKGV2LmFsbGRheSAmJiBldi5lbmQpIGV2LmVuZCA9IG1vbWVudChldi5lbmQpLmFkZCgxLCAnZGF5cycpLmZvcm1hdCgpO1xyXG5cdFx0XHRpZiAoIWV2LmFsbGRheSkge1xyXG5cdFx0XHRcdGV2LnN0YXJ0ID0gZXYuc3RhcnQgPSBtb21lbnQoZXYuc3RhcnQpLmZvcm1hdCgpO1xyXG5cdFx0XHRcdGlmIChldi5lbmQpIGV2LmVuZCA9IGV2LmVuZCA9IG1vbWVudChldi5lbmQpLmZvcm1hdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTsgXHJcblxyXG5cdFx0JCgnIycgKyBtb250aElkKS5mdWxsQ2FsZW5kYXIoe1xyXG5cdFx0XHRmaXJzdERheTogMSxcclxuXHRcdFx0aGVhZGVyOiBmYWxzZSxcclxuXHRcdFx0ZGF5TmFtZXNTaG9ydDogWydTVU4nLCAnTU9OJywgJ1RVRScsICdXRUQnLCAnVEhVJywgJ0ZSSScsICdTQVQnXSxcclxuXHRcdFx0ZXZlbnRzKHN0YXJ0LCBlbmQsIHRpbWV6b25lLCBjYWxsYmFjaykge1xyXG5cdFx0XHRcdGxldCBldmVudHMgPSBfLmZpbHRlcihjb3JyZWN0ZWRFdmVudHMsIGZ1bmN0aW9uIChldikgeyByZXR1cm4gZXYudmlzaWJsZTsgfSk7XHJcblx0XHRcdFx0Y2FsbGJhY2soZXZlbnRzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGF5UmVuZGVyKGRhdGUsIGNlbGwpIHtcclxuXHRcdFx0XHQkKGNlbGwpLnByZXBlbmQoJzxzcGFuIGNsYXNzPVwiYmxpbmdcIj48L3NwYW4+JylcclxuXHRcdFx0fSxcclxuXHRcdFx0ZXZlbnRSZW5kZXIoZXZlbnQsIGVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAoZXZlbnQuYWxsZGF5KSB7XHJcblx0XHRcdFx0XHQkKGVsZW1lbnQpLmFkZENsYXNzKCdhbGxkYXknKTtcclxuXHRcdFx0XHRcdCQoZWxlbWVudCkuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgZXZlbnQuY2F0ZWdvcnkuY29sb3IpO1xyXG5cdFx0XHRcdFx0JChlbGVtZW50KS5hdHRyKCd0aXRsZScsIGV2ZW50LnRpdGxlKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bGV0IHRpbWUgPSBtb21lbnQoZXZlbnQuc3RhcnQpLmZvcm1hdCgnSEg6bW0nKTtcclxuXHRcdFx0XHRcdGlmIChldmVudC5lbmQpIHRpbWUgPSBtb21lbnQoZXZlbnQuc3RhcnQpLmZvcm1hdCgnSEg6bW0nKSArICcgXFx1MjAxMyAnICArIG1vbWVudChldmVudC5lbmQpLmZvcm1hdCgnSEg6bW0nKTtcclxuXHJcblx0XHRcdFx0XHQkKGVsZW1lbnQpLmFkZENsYXNzKCdzaW5nbGUnKTtcclxuXHRcdFx0XHRcdCQoZWxlbWVudCkucHJlcGVuZCgnPHNwYW4gY2xhc3M9XCJjYXRlZ29yeVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjonICsgZXZlbnQuY2F0ZWdvcnkuY29sb3IgKydcIj48L3NwYW4+PHRpbWU+JyArIHRpbWUgKyAnPC90aW1lPicpO1xyXG5cdFx0XHRcdFx0JChlbGVtZW50KS5hdHRyKCd0aXRsZScsIHRpbWUgKyAnLCAnICsgZXZlbnQudGl0bGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0ZXZlbnRDbGljayhldmVudCwganNFdmVudCwgdmlldykge1xyXG5cdFx0XHRcdHRoYXQucHJvcHMuc2V0RGV0YWlsKGV2ZW50Ll9pZCk7XHJcblx0XHRcdFx0dGhhdC5wcm9wcy5zZXRQb3B1cCgnZGV0YWlsJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHQkKCcjJyArIG1vbnRoSWQpLmZ1bGxDYWxlbmRhcignZ290b0RhdGUnLCB0aGF0LnByb3BzLmRhdGUpO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHQkKCcjY2FsZW5kYXItbW9udGhseScpLmNzcygnbWluLWhlaWdodCcsICQoJyMnICsgbW9udGhJZCkuaGVpZ2h0KCkpO1xyXG5cdFx0fSwgMSk7XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG5cdFx0bGV0IG1vbnRoSWQgPSBtb21lbnQodGhpcy5wcm9wcy5kYXRlKS5mb3JtYXQoJ1lZWVktTU0nKTtcclxuXHRcdCQoJyMnICsgbW9udGhJZCkuZnVsbENhbGVuZGFyKCdyZWZldGNoRXZlbnRzJyk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdCQoJyNjYWxlbmRhci1tb250aGx5JykuY3NzKCdtaW4taGVpZ2h0JywgJCgnIycgKyBtb250aElkKS5oZWlnaHQoKSk7XHJcblx0XHR9LCAxKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXsnY2FsZW5kYXItbW9udGggJyArIHRoaXMucHJvcHMuZGF0ZS5wb3NpdGlvbn1cclxuXHRcdFx0XHRpZD17bW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuZm9ybWF0KCdZWVlZLU1NJyl9IC8+XHJcblx0XHQpXHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9zcmMvY2FsZW5kYXItbW9udGguanMiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuaW1wb3J0IENhbGVuZGFyV2VlayBmcm9tICcuL2NhbGVuZGFyLXdlZWsnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsZW5kYXJTdHJldGNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHRcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cdFx0XHJcblx0XHR0aGlzLnN0YXRlID0geyBcclxuXHRcdFx0ZGF0ZXM6IFtdLFxyXG5cdFx0XHRldmVudHM6IFtdIFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuXHJcblx0XHRsZXQgZGF0ZXMgPSB0aGlzLnN0YXRlLmRhdGVzLFxyXG5cdFx0XHRvbGREYXRlID0gdGhpcy5wcm9wcy5kYXRlLFxyXG5cdFx0XHRuZXdEYXRlID0gbmV4dFByb3BzLmRhdGU7XHJcblxyXG5cdFx0aWYgKF8uaXNFcXVhbChvbGREYXRlLCBuZXdEYXRlKSAmJiB0aGlzLnByb3BzLmV2ZW50cyA9PSBuZXh0UHJvcHMuZXZlbnRzKSByZXR1cm47XHJcblxyXG5cdFx0aWYgKG1vbWVudChuZXdEYXRlKS5pc1NhbWUob2xkRGF0ZSwgJ2lzb1dlZWsnKSkge1xyXG5cdFx0XHRuZXdEYXRlLnBvc2l0aW9uID0gJyBzYW1lLXdlZWsnO1xyXG5cdFx0fSBlbHNlIGlmIChtb21lbnQobmV3RGF0ZSkuaXNCZWZvcmUob2xkRGF0ZSkpIHtcclxuXHRcdFx0bmV3RGF0ZS5wb3NpdGlvbiA9ICcgbmV3LWxlZnQnO1xyXG5cdFx0fSBlbHNlIGlmIChtb21lbnQobmV3RGF0ZSkuaXNBZnRlcihvbGREYXRlKSkge1xyXG5cdFx0XHRuZXdEYXRlLnBvc2l0aW9uID0gJyBuZXctcmlnaHQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRhdGVzLnB1c2gobmV3RGF0ZSk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHsgZGF0ZXMgfSwgKCkgPT4ge1xyXG5cclxuXHRcdFx0aWYgKG1vbWVudChvbGREYXRlKS5pc1NhbWUobmV3RGF0ZSwgJ2lzb1dlZWsnKSkge1xyXG5cdFx0XHRcdHZhciBuZXdEYXRlcyA9IF8ucmVqZWN0KHRoaXMuc3RhdGUuZGF0ZXMsIGRhdGUgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGRhdGUucG9zaXRpb24gPT0gMDtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgZGF0ZXM6IG5ld0RhdGVzIH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0aWYgKG1vbWVudChuZXdEYXRlKS5pc0JlZm9yZShvbGREYXRlKSkge1xyXG5cdFx0XHRcdFx0JCgnLndlZWtbZGF0YS13ZWVrPScrIG1vbWVudChvbGREYXRlKS5zdGFydE9mKCdpc293ZWVrJykuZm9ybWF0KFwiWVlZWS13d1wiKSArJ10nKS5hZGRDbGFzcygnb2xkLXJpZ2h0Jyk7XHJcblx0XHRcdFx0XHQkKCcud2Vla1tkYXRhLXdlZWs9JysgbW9tZW50KG5ld0RhdGUpLnN0YXJ0T2YoJ2lzb3dlZWsnKS5mb3JtYXQoXCJZWVlZLXd3XCIpICsnXScpLnJlbW92ZUNsYXNzKCduZXctbGVmdCBvbGQtbGVmdCBuZXctcmlnaHQgb2xkLXJpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChtb21lbnQobmV3RGF0ZSkuaXNBZnRlcihvbGREYXRlKSkge1xyXG5cdFx0XHRcdFx0JCgnLndlZWtbZGF0YS13ZWVrPScrIG1vbWVudChvbGREYXRlKS5zdGFydE9mKCdpc293ZWVrJykuZm9ybWF0KFwiWVlZWS13d1wiKSArJ10nKS5hZGRDbGFzcygnb2xkLWxlZnQnKTtcclxuXHRcdFx0XHRcdCQoJy53ZWVrW2RhdGEtd2Vlaz0nKyBtb21lbnQobmV3RGF0ZSkuc3RhcnRPZignaXNvd2VlaycpLmZvcm1hdChcIllZWVktd3dcIikgKyddJykucmVtb3ZlQ2xhc3MoJ25ldy1sZWZ0IG9sZC1sZWZ0IG5ldy1yaWdodCBvbGQtcmlnaHQnKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCAxKTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHZhciBuZXdEYXRlcyA9IF8ucmVqZWN0KHRoaXMuc3RhdGUuZGF0ZXMsIGRhdGUgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1vbWVudChvbGREYXRlKS5pc1NhbWUoZGF0ZSwgJ2lzb1dlZWsnKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBkYXRlczogbmV3RGF0ZXMgfSk7XHJcblx0XHRcdH0sIDQwMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcdFxyXG5cdFx0bGV0IHdlZWtMaXN0ID0gdGhpcy5zdGF0ZS5kYXRlcy5tYXAoZGF0ZSA9PiB7XHJcblx0XHRcdGxldCB3ZWVrTnVtID0gbW9tZW50KGRhdGUpLmZvcm1hdCgnWVlZWS13dycpO1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdDxDYWxlbmRhcldlZWsgXHJcblx0XHRcdFx0XHRkYXRlPXtkYXRlfSBcclxuXHRcdFx0XHRcdGV2ZW50cz17dGhpcy5wcm9wcy5ldmVudHN9XHJcblx0XHRcdFx0XHRrZXk9e3dlZWtOdW19XHJcblx0XHRcdFx0XHRzZXRQb3B1cD17dGhpcy5wcm9wcy5zZXRQb3B1cH1cclxuXHRcdFx0XHRcdHNldERldGFpbD17dGhpcy5wcm9wcy5zZXREZXRhaWx9IC8+XHJcblx0XHRcdClcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgaWQ9J2NhbGVuZGFyLXdlZWtseSc+XHJcblx0XHRcdFx0e3dlZWtMaXN0fVxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmxvYWRpbmcgPyAnbG9hZGVyIGFjdGl2ZScgOiAnbG9hZGluZyd9PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3NwaW5uZXInPjwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PiBcclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpXHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9zcmMvY2FsZW5kYXItc3RyZXRjaC5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XHJcblxyXG5pbXBvcnQgQ2FsZW5kYXJEYXkgZnJvbSAnLi9jYWxlbmRhci1kYXknO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsZW5kYXJXZWVrIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0bGV0IHN0YXJ0V2VlayA9IG1vbWVudCh0aGlzLnByb3BzLmRhdGUpLnN0YXJ0T2YoJ2lzb1dlZWsnKSxcclxuXHRcdFx0d2Vla2RheXMgPSBbXHJcblx0XHRcdFx0eyBuYW1lOiAnbW9uJywgY29sdW1uOiBbXSB9LFxyXG5cdFx0XHRcdHsgbmFtZTogJ3R1ZScsIGNvbHVtbjogW10gfSxcclxuXHRcdFx0XHR7IG5hbWU6ICd3ZWQnLCBjb2x1bW46IFtdIH0sXHRcclxuXHRcdFx0XHR7IG5hbWU6ICd0aHUnLCBjb2x1bW46IFtdIH0sXHJcblx0XHRcdFx0eyBuYW1lOiAnZnJpJywgY29sdW1uOiBbXSB9LFxyXG5cdFx0XHRcdHsgbmFtZTogJ3drZCcsIGNvbHVtbjogW10gfVxyXG5cdFx0XHRdO1xyXG5cdFx0XHRcclxuXHRcdGZ1bmN0aW9uIGhhcHBlbnNUb2RheSAoZXYsIGRheSkge1xyXG5cdFx0XHRpZiAobW9tZW50KGV2LnN0YXJ0KS5pc0JldHdlZW4oZGF5LnN0YXJ0LCBkYXkuZW5kKSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdGlmIChldi5lbmQgJiYgbW9tZW50KGV2LmVuZCkuaXNCZXR3ZWVuKGRheS5zdGFydCwgZGF5LmVuZCkpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRpZiAoZXYuZW5kICYmIG1vbWVudChldi5zdGFydCkuaXNCZWZvcmUoZGF5LnN0YXJ0KSAmJiBtb21lbnQoZXYuZW5kKS5pc0FmdGVyKGRheS5lbmQpKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0aWYgKGV2LmVuZCAmJiBtb21lbnQoZXYuZW5kKS5pc0JlZm9yZShkYXkuc3RhcnQpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChtb21lbnQoZXYuc3RhcnQpLmlzQWZ0ZXIoZGF5LmVuZCkpIHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZXZlbnRzID0gXy5maWx0ZXIodGhpcy5wcm9wcy5ldmVudHMsIGV2ID0+IHsgcmV0dXJuIGV2LnZpc2libGUgfSk7XHJcblx0XHRldmVudHMgPSBfLnNvcnRCeShldmVudHMsICdzdGFydCcpO1xyXG5cdFx0bGV0IHg7XHJcblxyXG5cdFx0Zm9yICh4IGluIGV2ZW50cykge1xyXG5cdFx0XHRpZiAoZXZlbnRzW3hdLmFsbGRheSA9PSB0cnVlKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0ZXZlbnRzW3hdLnBvcyA9IC0xO1xyXG5cdFx0XHRcdGxldCBkYXksIGk7XHJcblxyXG5cdFx0XHRcdGZvciAoaSBpbiB3ZWVrZGF5cykge1xyXG5cdFx0XHRcdFx0ZGF5ID0ge1xyXG5cdFx0XHRcdFx0XHRzdGFydDogbW9tZW50KHN0YXJ0V2VlaykuYWRkKGksICdkYXlzJykuc3RhcnRPZignZGF5JykuZm9ybWF0KCksXHJcblx0XHRcdFx0XHRcdGVuZDogbW9tZW50KHN0YXJ0V2VlaykuYWRkKGksICdkYXlzJykuZW5kT2YoJ2RheScpLmZvcm1hdCgpLFxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGlmICh3ZWVrZGF5c1tpXS5uYW1lID09ICd3a2QnKSBkYXkuZW5kID0gbW9tZW50KHN0YXJ0V2VlaykuYWRkKDYsICdkYXlzJykuZW5kT2YoJ2RheScpLmZvcm1hdCgpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChldmVudHNbeF0ucG9zID4gLTEpIHtcclxuXHJcblx0XHRcdFx0XHRcdHdlZWtkYXlzW2ldLmNvbHVtbltldmVudHNbeF0ucG9zXSA9IChoYXBwZW5zVG9kYXkoZXZlbnRzW3hdLCBkYXkpKSA/IGV2ZW50c1t4XS5faWQgOiAnZW1wdHknO1xyXG5cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoaGFwcGVuc1RvZGF5KGV2ZW50c1t4XSwgZGF5KSkge1xyXG5cdFx0XHRcdFx0XHRcdGxldCBmaWxsID0gZmFsc2UsIGo7XHJcblx0XHRcdFx0XHRcdFx0Zm9yIChqIGluIHdlZWtkYXlzW2ldLmNvbHVtbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGV2ZW50c1t4XS5wb3MgPT0gLTEgJiYgd2Vla2RheXNbaV0uY29sdW1uW2pdID09ICdlbXB0eScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0d2Vla2RheXNbaV0uY29sdW1uW2pdID0gZXZlbnRzW3hdLl9pZDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZXZlbnRzW3hdLnBvcyA9IGo7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZpbGwgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGZpbGwgPT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdlZWtkYXlzW2ldLmNvbHVtbi5wdXNoKGV2ZW50c1t4XS5faWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnRzW3hdLnBvcyA9IHdlZWtkYXlzW2ldLmNvbHVtbi5pbmRleE9mKGV2ZW50c1t4XS5faWQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR3ZWVrZGF5c1tpXS5jb2x1bW4ucHVzaCgnZW1wdHknKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0ZXZlbnRzID0gXy5zb3J0QnkoZXZlbnRzLCAncG9zJyk7XHJcblxyXG5cdFx0bGV0IGRhdGFzZXQgPSB3ZWVrZGF5cy5tYXAoKHdlZWtkYXksIGluZGV4KSA9PiB7XHJcblx0XHRcdGxldCBkYXkgPSB7XHJcblx0XHRcdFx0c3RhcnQ6IG1vbWVudChzdGFydFdlZWspLmFkZChpbmRleCwgJ2RheXMnKS5zdGFydE9mKCdkYXknKS5mb3JtYXQoKSxcclxuXHRcdFx0XHRlbmQ6IG1vbWVudChzdGFydFdlZWspLmFkZChpbmRleCwgJ2RheXMnKS5lbmRPZignZGF5JykuZm9ybWF0KCksXHJcblx0XHRcdFx0d2Vla2RheTogd2Vla2RheS5uYW1lLFxyXG5cdFx0XHRcdGFsbGRheXM6IFtdLFxyXG5cdFx0XHRcdHNpbmdsZXM6IFtdXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAod2Vla2RheS5uYW1lID09ICd3a2QnKSBkYXkuZW5kID0gbW9tZW50KHN0YXJ0V2VlaykuYWRkKDYsICdkYXlzJykuZW5kT2YoJ2RheScpLmZvcm1hdCgpO1xyXG5cclxuXHRcdFx0ZXZlbnRzLmZvckVhY2goZXYgPT4ge1xyXG5cdFx0XHRcdGlmIChtb21lbnQoZXYuc3RhcnQpLmlzQmV0d2VlbihkYXkuc3RhcnQsIGRheS5lbmQpKSB7XHJcblx0XHRcdFx0XHRpZiAoZXYuYWxsZGF5KSBkYXkuYWxsZGF5cy5wdXNoKGV2KTsgXHJcblx0XHRcdFx0XHRpZiAoIWV2LmFsbGRheSkgZGF5LnNpbmdsZXMucHVzaChldik7IFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGV2LmFsbGRheSAmJiBldi5lbmQpIHtcclxuXHRcdFx0XHRcdGlmIChtb21lbnQoZXYuZW5kKS5pc0JldHdlZW4oZGF5LnN0YXJ0LCBkYXkuZW5kKSkge1xyXG5cdFx0XHRcdFx0XHRkYXkuYWxsZGF5cy5wdXNoKGV2KTtcclxuXHRcdFx0XHRcdH0gZWxzZVx0aWYgKG1vbWVudChldi5zdGFydCkuaXNCZWZvcmUoZGF5LnN0YXJ0KSAmJiBtb21lbnQoZXYuZW5kKS5pc0FmdGVyKGRheS5lbmQpKSB7XHJcblx0XHRcdFx0XHRcdGRheS5hbGxkYXlzLnB1c2goZXYpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZGF5O1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IHdlZWtMaXN0ID0gZGF0YXNldC5tYXAoKGRheSwgaW5kZXgpID0+IHtcclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHQ8Q2FsZW5kYXJEYXkgXHJcblx0XHRcdFx0XHRkYXRhc2V0PXtkYXl9XHJcblx0XHRcdFx0XHRrZXk9e21vbWVudChkYXkuc3RhcnQpLmZvcm1hdCgpfVxyXG5cdFx0XHRcdFx0c2V0UG9wdXA9e3RoaXMucHJvcHMuc2V0UG9wdXB9IFxyXG5cdFx0XHRcdFx0c2V0RGV0YWlsPXt0aGlzLnByb3BzLnNldERldGFpbH0gLz5cclxuXHRcdFx0KVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIFxyXG5cdFx0XHRcdGNsYXNzTmFtZT17J3dlZWsgJyArIHRoaXMucHJvcHMuZGF0ZS5wb3NpdGlvbn0gXHJcblx0XHRcdFx0ZGF0YS13ZWVrPXttb21lbnQoc3RhcnRXZWVrKS5mb3JtYXQoJ1lZWVktd3cnKX0+XHJcblx0XHRcdFx0XHR7d2Vla0xpc3R9XHJcblx0XHRcdDwvdWw+XHJcblx0XHQpXHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9zcmMvY2FsZW5kYXItd2Vlay5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxlbmRhckRheSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHRcclxuXHRcdHRoaXMuY2xpY2tEYXkgPSB0aGlzLmNsaWNrRGF5LmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmNsaWNrRXZlbnQgPSB0aGlzLmNsaWNrRXZlbnQuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMubW91c2VFbnRlckV2ZW50ID0gdGhpcy5tb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMubW91c2VMZWF2ZUV2ZW50ID0gdGhpcy5tb3VzZUxlYXZlRXZlbnQuYmluZCh0aGlzKTtcclxuXHR9XHJcblxyXG5cdGNsaWNrRGF5KGUpIHtcclxuXHRcdCQoJy5kYXksIC5ldmVudCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdCQoJy5kYXlbZGF0YS1kYXRlPScgKyBlLnRhcmdldC5kYXRhc2V0LmRhdGUgKyAnXSwgLmV2ZW50W2RhdGEtZGF0ZT0nICsgZS50YXJnZXQuZGF0YXNldC5kYXRlICsgJ10nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0fVxyXG5cclxuXHRjbGlja0V2ZW50KGUpIHtcclxuXHRcdCQoJy5kYXksIC5ldmVudCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdCQoJy5kYXlbZGF0YS1kYXRlPScgKyBlLnRhcmdldC5kYXRhc2V0LmRhdGUgKyAnXSwgLmV2ZW50W2RhdGEtZGF0ZT0nICsgZS50YXJnZXQuZGF0YXNldC5kYXRlICsgJ10nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHR0aGlzLnByb3BzLnNldFBvcHVwKCdkZXRhaWwnKTtcclxuXHRcdHRoaXMucHJvcHMuc2V0RGV0YWlsKGUudGFyZ2V0LmRhdGFzZXQuZXZlbnRpZCk7XHJcblx0fVxyXG5cclxuXHRtb3VzZUVudGVyRXZlbnQoZSkge1xyXG5cdFx0JCgnLmV2ZW50LmV2ZW50LScgKyBlLnRhcmdldC5kYXRhc2V0LmV2ZW50aWQpLmFkZENsYXNzKCdob3ZlcicpO1xyXG5cdH1cclxuXHJcblx0bW91c2VMZWF2ZUV2ZW50KGUpIHtcclxuXHRcdCQoJy5ldmVudCcpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0bGV0IG5vdyA9IG1vbWVudCgpLFxyXG5cdFx0XHRkYXRhc2V0ID0gdGhpcy5wcm9wcy5kYXRhc2V0LFxyXG5cdFx0XHRkYXlOdW1iZXI7XHJcblxyXG5cdFx0aWYgKGRhdGFzZXQud2Vla2RheSA9PSAnd2tkJykge1xyXG5cdFx0XHRsZXQgbnVtID0gTnVtYmVyKG1vbWVudChkYXRhc2V0LnN0YXJ0KS5mb3JtYXQoJ0QnKSlcclxuXHRcdFx0ZGF5TnVtYmVyID0gKFxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nc2F0LXN1bic+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J3NhdHVyZGF5Jz57bnVtfTwvc3Bhbj5cclxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nc2VwZXJhdG9yJz4vPC9zcGFuPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdzdW5kYXknPntudW0gKyAxfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRheU51bWJlciA9IDxzcGFuIGNsYXNzTmFtZT0nd29ya2RheSc+e21vbWVudChkYXRhc2V0LnN0YXJ0KS5mb3JtYXQoJ0QnKX08L3NwYW4+XHJcblx0XHR9XHJcblxyXG5cdFx0ZGF0YXNldC5hbGxkYXlzID0gXy5zb3J0QnkoZGF0YXNldC5hbGxkYXlzLCAncG9zJyk7XHJcblx0XHRsZXQgYWxsZGF5cyA9IGRhdGFzZXQuYWxsZGF5cy5tYXAoKGV2LCBpbmRleCkgPT4ge1xyXG5cdFx0XHRsZXQgc3R5bGUgPSB7IGJhY2tncm91bmRDb2xvcjogZXYuY2F0ZWdvcnkuY29sb3IgfVxyXG5cdFx0XHRzdHlsZS50b3AgPSAoZXYucG9zICogMjUpO1xyXG5cclxuXHRcdFx0bGV0IGNsYXNzZXMgPSAnZXZlbnQgZXZlbnQtJyArIGV2Ll9pZDtcclxuXHRcdFx0aWYgKG1vbWVudChldi5zdGFydCkuaXNCZWZvcmUoZGF0YXNldC5zdGFydCkpIGNsYXNzZXMgPSBjbGFzc2VzICsgJyB5ZXN0ZXJkYXknO1xyXG5cdFx0XHRpZiAoZXYuZW5kICYmIG1vbWVudChldi5lbmQpLmlzQWZ0ZXIoZGF0YXNldC5lbmQpKSBjbGFzc2VzID0gY2xhc3NlcyArICcgdG9tb3Jyb3cnO1xyXG5cclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPXtjbGFzc2VzfSBcclxuXHRcdFx0XHRcdHN0eWxlPXtzdHlsZX1cclxuXHRcdFx0XHRcdGtleT17ZXYuX2lkICsgbW9tZW50KGV2LnN0YXJ0KS5mb3JtYXQoKX1cclxuXHRcdFx0XHRcdHRpdGxlPXtldi50aXRsZX1cclxuXHRcdFx0XHRcdG9uTW91c2VFbnRlcj17dGhpcy5tb3VzZUVudGVyRXZlbnR9XHJcblx0XHRcdFx0XHRvbk1vdXNlTGVhdmU9e3RoaXMubW91c2VMZWF2ZUV2ZW50fVxyXG5cdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja0V2ZW50fVxyXG5cdFx0XHRcdFx0ZGF0YS1ldmVudGlkPXtldi5faWR9XHJcblx0XHRcdFx0XHRkYXRhLWRhdGU9e21vbWVudChkYXRhc2V0LnN0YXJ0KS5mb3JtYXQoJ1lZWVktTU0tREQnKX0+XHJcblx0XHRcdFx0IFxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPSdldmVudC10aXRsZSc+e2V2LnRpdGxlfTwvc3Bhbj5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHQpXHJcblx0XHR9KTtcclxuXHJcblx0XHRsZXQgaGlnaGVzdEFsbGRheSA9IF8ubWF4KGRhdGFzZXQuYWxsZGF5cywgZXYgPT4geyByZXR1cm4gZXYucG9zIH0pO1xyXG5cclxuXHRcdGxldCBhbGxkYXlzSGVpZ2h0ID0geyBoZWlnaHQ6ICgoKE51bWJlcihoaWdoZXN0QWxsZGF5LnBvcykgfHwgMCkgKyAxICkgKiAyNSkgKyA1IH1cclxuXHJcblx0XHRsZXQgc2luZ2xlcyA9IGRhdGFzZXQuc2luZ2xlcy5tYXAoKGV2LCBpbmRleCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0bGV0IHRpbWUgPSA8dGltZSBjbGFzc05hbWU9J2V2ZW50LXRpbWUnIGRhdGVUaW1lPXtldi5zdGFydH0+e21vbWVudChldi5zdGFydCkuZm9ybWF0KCdISDptbScpfTwvdGltZT47XHJcblx0XHRcdGlmIChldi5lbmQpIHRpbWUgPSA8dGltZSBjbGFzc05hbWU9J2V2ZW50LXRpbWUnIGRhdGVUaW1lPXtldi5zdGFydH0+e21vbWVudChldi5zdGFydCkuZm9ybWF0KCdISDptbScpfSAmbmRhc2g7IHttb21lbnQoZXYuZW5kKS5mb3JtYXQoJ0hIOm1tJyl9PC90aW1lPlxyXG5cclxuXHRcdFx0bGV0IHdlZWtlbmREYXkgPSAnJztcclxuXHRcdFx0aWYgKGRhdGFzZXQud2Vla2RheSA9PSAnd2tkJykge1xyXG5cdFx0XHRcdHdlZWtlbmREYXkgPSA8c3BhbiBjbGFzc05hbWU9J2V2ZW50LXdlZWtlbmQnPnttb21lbnQoZXYuc3RhcnQpLmZvcm1hdCgnZGRkJyl9PC9zcGFuPjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPSdldmVudCcgXHJcblx0XHRcdFx0XHRrZXk9e2V2Ll9pZCArIG1vbWVudChldi5zdGFydCkuZm9ybWF0KCl9XHJcblx0XHRcdFx0XHR0aXRsZT17ZXYudGl0bGV9XHJcblx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLmNsaWNrRXZlbnR9XHJcblx0XHRcdFx0XHRkYXRhLWV2ZW50aWQ9e2V2Ll9pZH1cclxuXHRcdFx0XHRcdGRhdGEtZGF0ZT17bW9tZW50KGRhdGFzZXQuc3RhcnQpLmZvcm1hdCgnWVlZWS1NTS1ERCcpfT5cclxuXHRcdFx0XHRcdDxpIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogZXYuY2F0ZWdvcnkuY29sb3IgfX0+PC9pPlxyXG5cdFx0XHRcdFx0e3RpbWV9e3dlZWtlbmREYXl9XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2V2ZW50LXRpdGxlJz57ZXYudGl0bGV9PC9zcGFuPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdClcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxsaSBjbGFzc05hbWU9e21vbWVudChub3cpLmlzQmV0d2VlbihkYXRhc2V0LnN0YXJ0LCBkYXRhc2V0LmVuZCkgPyAndG9kYXkgYWN0aXZlIGRheSAnICsgZGF0YXNldC53ZWVrZGF5IDogJ2RheSAnICsgZGF0YXNldC53ZWVrZGF5IH1cclxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmNsaWNrRGF5fVxyXG5cdFx0XHRcdGRhdGEtZGF0ZT17bW9tZW50KGRhdGFzZXQuc3RhcnQpLmZvcm1hdCgnWVlZWS1NTS1ERCcpfT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZGF5LW51bWJlcic+XHJcblx0XHRcdFx0XHR7ZGF5TnVtYmVyfVxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdkYXktbmFtZSc+e2RhdGFzZXQud2Vla2RheX08L2Rpdj5cclxuXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9eydldmVudC1jb250YWluZXIgJyArIGRhdGFzZXQud2Vla2RheX0+XHJcblx0XHRcdFx0XHQ8dWwgY2xhc3NOYW1lPSdhbGxkYXlzJyBzdHlsZT17YWxsZGF5c0hlaWdodH0+e2FsbGRheXN9PC91bD5cclxuXHRcdFx0XHRcdDx1bCBjbGFzc05hbWU9J3NpbmdsZXMnPntzaW5nbGVzfTwvdWw+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvbGk+XHJcblx0XHQpXHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9zcmMvY2FsZW5kYXItZGF5LmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuaW1wb3J0IENhbGVuZGFyRmlsdGVyIGZyb20gJy4vY2FsZW5kYXItZmlsdGVyJztcclxuaW1wb3J0IENhbGVuZGFyTWluaWNhbCBmcm9tICcuL2NhbGVuZGFyLW1pbmljYWwnO1xyXG5pbXBvcnQgQ2FsZW5kYXJZZWFyY2FsIGZyb20gJy4vY2FsZW5kYXIteWVhcmNhbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxlbmRhclNpZGViYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRsZXQgbWluaVZpZXcsIHZpZXdTd2l0Y2g7XHJcblxyXG5cdFx0aWYgKHRoaXMucHJvcHMudmlldyA9PSAnd2Vla2x5Jykge1xyXG5cdFx0XHRtaW5pVmlldyA9IDxDYWxlbmRhck1pbmljYWxcdFxyXG5cdFx0XHRcdGRhdGU9e3RoaXMucHJvcHMuZGF0ZX1cclxuXHRcdFx0XHRzZXREYXRlPXt0aGlzLnByb3BzLnNldERhdGV9IC8+XHJcblxyXG5cdFx0XHR2aWV3U3dpdGNoID0gPGEgaHJlZj0nJyBvbkNsaWNrPXt0aGlzLnByb3BzLnZpZXdUb2dnbGV9PlN3aXRjaCB0byA8dT5Nb250aGx5IHZpZXc8L3U+PC9hPjtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5wcm9wcy52aWV3ID09ICdtb250aGx5Jykge1xyXG5cdFx0XHRtaW5pVmlldyA9IDxDYWxlbmRhclllYXJjYWxcclxuXHRcdFx0XHRkYXRlPXt0aGlzLnByb3BzLmRhdGV9XHJcblx0XHRcdFx0c2V0RGF0ZT17dGhpcy5wcm9wcy5zZXREYXRlfSAvPlxyXG5cclxuXHRcdFx0dmlld1N3aXRjaCA9IDxhIGhyZWY9Jycgb25DbGljaz17dGhpcy5wcm9wcy52aWV3VG9nZ2xlfT5Td2l0Y2ggdG8gPHU+V2Vla2x5IHZpZXc8L3U+PC9hPjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8YXNpZGUgaWQ9J2NhbGVuZGFyLXNpZGViYXInPlxyXG5cdFx0XHRcdHttaW5pVmlld31cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQ8Q2FsZW5kYXJGaWx0ZXIgXHJcblx0XHRcdFx0XHRjYXRlZ29yaWVzPXt0aGlzLnByb3BzLmNhdGVnb3JpZXN9XHJcblx0XHRcdFx0XHRjYXRGaWx0ZXI9e3RoaXMucHJvcHMuY2F0RmlsdGVyfVxyXG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyPXt0aGlzLnByb3BzLnRvZ2dsZUZpbHRlcn0gLz5cclxuXHJcblx0XHRcdFx0PGRpdiBpZD0nY2FsZW5kYXItdmlld3RvZ2dsZSc+XHJcblx0XHRcdFx0XHR7dmlld1N3aXRjaH1cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdDwvYXNpZGU+XHJcblx0XHQpXHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9zcmMvY2FsZW5kYXItc2lkZWJhci5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGVuZGFyRmlsdGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcdFxyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cdFx0XHJcblx0XHR0aGlzLnRvZ2dsZUZpbHRlciA9IHRoaXMudG9nZ2xlRmlsdGVyLmJpbmQodGhpcyk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGVGaWx0ZXIoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dGhpcy5wcm9wcy50b2dnbGVGaWx0ZXIoZS50YXJnZXQuaWQpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0bGV0IGNhdGVnb3J5TGlzdCA9IHRoaXMucHJvcHMuY2F0ZWdvcmllcy5tYXAoY2F0ID0+IHtcclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHQ8bGkgY2xhc3NOYW1lPSdjYXRlZ29yeScga2V5PXtjYXQuaWR9PlxyXG5cdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jYXRGaWx0ZXIuaW5kZXhPZihjYXQuaWQpID4gLTEgPyAnY2hlY2tib3ggYWN0aXZlJyA6ICdjaGVja2JveCd9IG9uQ2xpY2s9e3RoaXMudG9nZ2xlRmlsdGVyfSBpZD17Y2F0LmlkfSB0aXRsZT17Y2F0Lm5hbWV9IGtleT17J2ZpbHRlci0nICsgY2F0LmlkfT5cclxuXHRcdFx0XHRcdFx0PGkgc3R5bGU9e3tiYWNrZ3JvdW5kQ29sb3I6IGNhdC5jb2xvcn19PjwvaT5cdHtjYXQubmFtZX1cclxuXHRcdFx0XHRcdDwvbGFiZWw+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0KVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PHVsIGlkPSdjYWxlbmRhci1maWx0ZXInPlxyXG5cdFx0XHRcdHtjYXRlZ29yeUxpc3R9XHJcblx0XHRcdFx0PGxpIGNsYXNzTmFtZT0nY2xlYXItZmlsdGVyJyBzdHlsZT17dGhpcy5wcm9wcy5jYXRGaWx0ZXIubGVuZ3RoID4gMCA/IHt9IDogeyBkaXNwbGF5OiAnbm9uZScgfX0+XHJcblx0XHRcdFx0XHQ8YSBocmVmPScnIG9uQ2xpY2s9e3RoaXMudG9nZ2xlRmlsdGVyfSBpZD0nY2xlYXInPkNsZWFyIGZpbHRlcnM8L2E+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0PC91bD5cclxuXHRcdClcclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL3NyYy9jYWxlbmRhci1maWx0ZXIuanMiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCBmdWxsQ2FsZW5kYXIgZnJvbSAnZnVsbGNhbGVuZGFyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGVuZGFyTWluaWNhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XHJcblx0XHRsZXQgdGhhdCA9IHRoaXMsIG5vdyA9IG1vbWVudCgpO1xyXG5cclxuXHRcdCQoJyNjYWxlbmRhci1taW5pY2FsJykuZnVsbENhbGVuZGFyKHtcclxuXHRcdFx0Zmlyc3REYXk6IDEsXHJcblx0XHRcdGhlYWRlcjoge1xyXG5cdFx0XHRcdGxlZnQ6ICcnLFxyXG5cdFx0XHRcdGNlbnRlcjogJ3ByZXYgdGl0bGUgbmV4dCcsXHJcblx0XHRcdFx0cmlnaHQ6ICcnXHJcblx0XHRcdH0sXHJcblx0XHRcdGJ1dHRvbkljb25zOiBmYWxzZSxcclxuXHRcdFx0YnV0dG9uVGV4dDoge1xyXG5cdFx0XHRcdHByZXY6ICdcXHUyMDM5JyxcclxuXHRcdFx0XHRuZXh0OiAnXFx1MjAzQSdcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGF5TmFtZXNTaG9ydDogWydTJywgJ00nLCAnVCcsICdXJywgJ1QnLCAnRicsICdTJ10sXHJcblx0XHRcdGRheUNsaWNrKGRhdGUsIGpzRXZlbnQsIHZpZXcpIHtcclxuXHRcdFx0XHQkKCd0aGVhZCB0cicpLnJlbW92ZUNsYXNzKCdkaXNwbGF5LXdlZWsnKTtcclxuXHRcdFx0XHQkKCd0aGVhZCB0ZFtkYXRhLWRhdGU9JyArIG1vbWVudChkYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQnKSArICddJykucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc3BsYXktd2VlaycpO1xyXG5cdFx0XHRcdHZhciBjbGlja0RhdGUgPSBtb21lbnQoZGF0ZSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XHJcblx0XHRcdFx0dGhhdC5wcm9wcy5zZXREYXRlKG1vbWVudChjbGlja0RhdGUsICdZWVlZLU1NLUREJykpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXlSZW5kZXIoZGF0ZSwgY2VsbCkge1xyXG5cdFx0XHRcdGlmIChtb21lbnQoZGF0ZSkuaXNTYW1lKHRoYXQucHJvcHMuZGF0ZSwgJ2RheScpKSAkKCd0aGVhZCB0ZFtkYXRhLWRhdGU9JyArIG1vbWVudChkYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQnKSArICddJykucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc3BsYXktd2VlaycpO1xyXG5cdFx0XHRcdGlmIChtb21lbnQoZGF0ZSkuaXNTYW1lKG5vdywgJ2RheScpKSAkKCd0aGVhZCB0ZFtkYXRhLWRhdGU9JyArIG1vbWVudChkYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQnKSArICddJykuaHRtbCgnPHNwYW4+JyArIG1vbWVudChkYXRlKS5mb3JtYXQoJ0QnKSArICc8L3NwYW4+Jyk7XHJcblx0XHRcdH0sXHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG5cclxuXHRcdCQoJyNjYWxlbmRhci1taW5pY2FsJykuZnVsbENhbGVuZGFyKCdnb3RvRGF0ZScsIG5leHRQcm9wcy5kYXRlKTtcclxuXHRcdGlmICghbW9tZW50KG5leHRQcm9wcy5kYXRlKS5pc1NhbWUodGhpcy5wcm9wcy5kYXRlLCAnd2VlaycpKSB7XHJcblx0XHRcdCQoJ3RoZWFkIHRyJykucmVtb3ZlQ2xhc3MoJ2Rpc3BsYXktd2VlaycpO1xyXG5cdFx0XHQkKCd0aGVhZCB0ZFtkYXRhLWRhdGU9JyArIG1vbWVudChuZXh0UHJvcHMuZGF0ZSkuZm9ybWF0KCdZWVlZLU1NLUREJykgKyAnXScpLnBhcmVudCgpLmFkZENsYXNzKCdkaXNwbGF5LXdlZWsnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgaWQ9J2NhbGVuZGFyLW1pbmljYWwnPjwvZGl2PlxyXG5cdFx0KVxyXG5cdH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvc3JjL2NhbGVuZGFyLW1pbmljYWwuanMiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxlbmRhclllYXJjYWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHRcclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdHllYXI6ICcnLFxyXG5cdFx0XHRtb250aDogJydcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5uYXZZZWFyID0gdGhpcy5uYXZZZWFyLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmNsaWNrTW9udGggPSB0aGlzLmNsaWNrTW9udGguYmluZCh0aGlzKTtcclxuXHR9XHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cdFx0XHJcblx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0eWVhcjogbW9tZW50KHRoaXMucHJvcHMuZGF0ZSkuZm9ybWF0KCdZWVlZJyksXHJcblx0XHRcdG1vbnRoOiBtb21lbnQodGhpcy5wcm9wcy5kYXRlKS5mb3JtYXQoJ01NJylcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoe1xyXG5cdFx0XHR5ZWFyOiBtb21lbnQobmV4dFByb3BzLmRhdGUpLmZvcm1hdCgnWVlZWScpLFxyXG5cdFx0XHRtb250aDogbW9tZW50KG5leHRQcm9wcy5kYXRlKS5mb3JtYXQoJ01NJylcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0bmF2WWVhcihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0bGV0IG5ld1llYXIgPSBtb21lbnQodGhpcy5zdGF0ZS55ZWFyLCAnWVlZWScpLmFkZCgxLCAneWVhcnMnKS5mb3JtYXQoJ1lZWVknKTsgXHJcblx0XHRpZiAoZS50YXJnZXQuZGF0YXNldC5hcmcgPT0gJ3ByZXYnKSBuZXdZZWFyID0gbW9tZW50KHRoaXMuc3RhdGUueWVhciwgJ1lZWVknKS5zdWJ0cmFjdCgxLCAneWVhcnMnKS5mb3JtYXQoJ1lZWVknKTtcclxuXHJcblx0XHR0aGlzLnNldFN0YXRlKHsgeWVhcjogbmV3WWVhciB9KTtcclxuXHR9XHJcblxyXG5cdGNsaWNrTW9udGgoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dGhpcy5wcm9wcy5zZXREYXRlKG1vbWVudChlLnRhcmdldC5kYXRhc2V0Lm1vbnRoLCAnWVlZWS1NTScpKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGxldCB2aWV3WWVhciA9IG1vbWVudCh0aGlzLnByb3BzLmRhdGUpLmZvcm1hdCgnWVlZWScpLFxyXG5cdFx0XHRub3cgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0nKTtcclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGlkPSdjYWxlbmRhci15ZWFyY2FsJz5cclxuXHRcdFx0XHQ8aGVhZGVyPlxyXG5cdFx0XHRcdFx0PGEgaHJlZj0nJyBvbkNsaWNrPXt0aGlzLm5hdlllYXJ9IGRhdGEtYXJnPSdwcmV2Jz57J1xcdTIwMzknfTwvYT5cclxuXHRcdFx0XHRcdHt0aGlzLnN0YXRlLnllYXJ9XHJcblx0XHRcdFx0XHQ8YSBocmVmPScnIG9uQ2xpY2s9e3RoaXMubmF2WWVhcn0gZGF0YS1hcmc9J25leHQnPnsnXFx1MjAzQSd9PC9hPlxyXG5cdFx0XHRcdDwvaGVhZGVyPlxyXG5cdFx0XHRcdDx1bCBpZD0neWVhcmNhbC1tb250aHMnIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS55ZWFyID09ICB2aWV3WWVhciA/ICd0aGlzLXllYXInIDogJyd9PlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDEnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTAxJyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTAxJ31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5KQU48L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDInID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTAyJyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTAyJ31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5GRUI8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDMnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTAzJyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTAzJ31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5NQVI8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDQnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTA0JyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTA0J31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5BUFI8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDUnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTA1JyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTA1J31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5NQVk8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDYnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTA2JyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTA2J31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5KVU48L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDcnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTA3JyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTA3J31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5KVUw8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDgnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTA4JyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTA4J31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5BVUc8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMDknID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTA5JyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTA5J31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5TRVA8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMTAnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTEwJyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTEwJ31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5PQ1Q8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMTEnID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTExJyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTExJ31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5OT1Y8L2xpPlxyXG5cdFx0XHRcdFx0PGxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5tb250aCA9PSAnMTInID8gJ2FjdGl2ZScgOiAnJ30gXHJcblx0XHRcdFx0XHRcdGRhdGEtdG9kYXk9e25vdyA9PSB0aGlzLnN0YXRlLnllYXIgKyAnLTEyJyA/ICd5YXknIDogJ25vcGUnfVxyXG5cdFx0XHRcdFx0XHRkYXRhLW1vbnRoPXt0aGlzLnN0YXRlLnllYXIgKyAnLTEyJ31cclxuXHRcdFx0XHRcdFx0b25DbGljaz17dGhpcy5jbGlja01vbnRofT5ERUM8L2xpPlxyXG5cdFx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdClcclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL3NyYy9jYWxlbmRhci15ZWFyY2FsLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG5cclxuaW1wb3J0IENhbGVuZGFyVXBkYXRlIGZyb20gJy4vY2FsZW5kYXItdXBkYXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGVuZGFyRGV0YWlsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0dmlldzogJ2RldGFpbCcsXHJcblx0XHRcdGxvYWRpbmc6IGZhbHNlLFxyXG5cdFx0XHRkZXRhaWw6IHtcclxuXHRcdFx0XHR0aXRsZTogJycsXHJcblx0XHRcdFx0c3RhcnQ6ICcnLFxyXG5cdFx0XHRcdGVuZDogJycsXHJcblx0XHRcdFx0YWxsZGF5OiB0cnVlLFxyXG5cdFx0XHRcdG11bHRpZGF5OiBmYWxzZSxcclxuXHRcdFx0XHRjYXRlZ29yeTogeyBuYW1lOiAnJywgY29sb3I6ICcnLCBfaWQ6ICcnIH0sXHJcblx0XHRcdFx0dXNlcjogeyBuYW1lOiB7IGZpcnN0OiAnJywgbGFzdDogJycgfSwgdXNlcm5hbWU6ICcnLCBfaWQ6ICcnIH0sXHJcblx0XHRcdFx0cmVjdXJzaW9uOiAnb25jZScsXHJcblx0XHRcdFx0bm90ZTogJycsXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnN3aXRjaFZpZXcgPSB0aGlzLnN3aXRjaFZpZXcuYmluZCh0aGlzKTtcclxuXHR9XHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IHRydWUgfSwgKCkgPT4ge1xyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHRcdHVybDogZG9jdW1lbnQuYmFzZVVSSSArICcvZXZlbnRzLz9kZXRhaWw9JyArIHRoaXMucHJvcHMuZGV0YWlsLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbidcclxuXHRcdFx0fSkuZG9uZShldiA9PiB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGV2LmFsbGRheSkge1xyXG5cdFx0XHRcdFx0ZXYuc3RhcnQgPSBtb21lbnQoZXYuc3RhcnQsICdYJyk7XHJcblx0XHRcdFx0XHRpZiAoZXYuZW5kKSB7XHJcblx0XHRcdFx0XHRcdGV2LmVuZCA9IG1vbWVudChldi5lbmQsICdYJyk7XHJcblx0XHRcdFx0XHRcdGlmICghbW9tZW50KGV2LnN0YXJ0KS5pc1NhbWUoZXYuZW5kLCAnZGF5JykpIGV2WydtdWx0aWRheSddID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZXYuc3RhcnQgPSBtb21lbnQoZXYuc3RhcnQsICdYJykuc3VidHJhY3QoMiwgJ2hvdXJzJyk7XHJcblx0XHRcdFx0XHRpZiAoZXYuZW5kKSBldi5lbmQgPSBtb21lbnQoZXYuZW5kLCAnWCcpLnN1YnRyYWN0KDIsICdob3VycycpO1x0XHRcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgZGV0YWlsOiBldiwgbG9hZGluZzogZmFsc2UgfSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRzd2l0Y2hWaWV3KGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyB2aWV3OiBlLnRhcmdldC5kYXRhc2V0LmFyZyB9KTtcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGxldCBkZXRhaWwgPSB0aGlzLnN0YXRlLmRldGFpbCxcclxuXHRcdFx0Y3VycmVudFZpZXcsIHVwZGF0ZUJ1dHRvbixcclxuXHRcdFx0ZGF0ZVN0cmluZywgZHVyYXRpb25TdHJpbmc7XHJcblxyXG5cdFx0aWYgKGRldGFpbC5zdGFydCAmJiBkZXRhaWwuZW5kICYmIGRldGFpbC5hbGxkYXkpIHtcclxuXHRcdFx0ZGF0ZVN0cmluZyA9IChcclxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9J2RldGFpbC10aW1lJz5cclxuXHRcdFx0XHRcdDx0aW1lPnttb21lbnQoZGV0YWlsLnN0YXJ0KS5mb3JtYXQoJ2RkZC4gRCBNTU1NIFlZWVknKX08L3RpbWU+ICZuZGFzaDsgPHRpbWU+e21vbWVudChkZXRhaWwuZW5kKS5mb3JtYXQoJ2RkZC4gRCBNTU1NIFlZWVknKX08L3RpbWU+XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHQpO1xyXG5cdFx0XHRkdXJhdGlvblN0cmluZyA9IChcclxuXHRcdFx0XHQ8c21hbGwgY2xhc3NOYW1lPSdkZXRhaWwtZHVyYXRpb24nPlxyXG5cdFx0XHRcdFx0e21vbWVudChkZXRhaWwuZW5kKS5kaWZmKGRldGFpbC5zdGFydCwgJ2RheXMnKSArIDF9IGRheXNcclxuXHRcdFx0XHQ8L3NtYWxsPlxyXG5cdFx0XHQpO1xyXG5cdFx0fSBlbHNlIGlmIChkZXRhaWwuc3RhcnQgJiYgIWRldGFpbC5lbmQgJiYgZGV0YWlsLmFsbGRheSkge1xyXG5cdFx0XHRkYXRlU3RyaW5nID0gKFxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nZGV0YWlsLXRpbWUnPlxyXG5cdFx0XHRcdFx0PHRpbWU+e21vbWVudChkZXRhaWwuc3RhcnQpLmZvcm1hdCgnZGRkLiBEIE1NTU0gWVlZWScpfTwvdGltZT5cclxuXHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdCk7XHJcblx0XHRcdGR1cmF0aW9uU3RyaW5nID0gKFxyXG5cdFx0XHRcdDxzbWFsbCBjbGFzc05hbWU9J2RldGFpbC1kdXJhdGlvbic+MSBkYXk8L3NtYWxsPlxyXG5cdFx0XHQpO1xyXG5cdFx0fSBlbHNlIGlmIChkZXRhaWwuc3RhcnQgJiYgZGV0YWlsLmVuZCAmJiAhZGV0YWlsLmFsbGRheSkge1xyXG5cdFx0XHRkYXRlU3RyaW5nID0gKFxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nZGV0YWlsLXRpbWUnPlxyXG5cdFx0XHRcdFx0PHRpbWU+e21vbWVudChkZXRhaWwuc3RhcnQpLmZvcm1hdCgnZGRkLiBEIE1NTU0gWVlZWScpfSwge21vbWVudChkZXRhaWwuc3RhcnQpLmZvcm1hdCgnSDptbScpfSAmbmRhc2g7IHttb21lbnQoZGV0YWlsLmVuZCkuZm9ybWF0KCdIOm1tJyl9PC90aW1lPlxyXG5cdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdGlmIChtb21lbnQoZGV0YWlsLmVuZCkuZGlmZihkZXRhaWwuc3RhcnQsICdtaW51dGVzJykgPiAxODApIHtcclxuXHRcdFx0XHRkdXJhdGlvblN0cmluZyA9IChcclxuXHRcdFx0XHRcdDxzbWFsbCBjbGFzc05hbWU9J2RldGFpbC1kdXJhdGlvbic+e21vbWVudChkZXRhaWwuZW5kKS5kaWZmKGRldGFpbC5zdGFydCwgJ2hvdXJzJyl9IGhvdXJzPC9zbWFsbD5cclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGR1cmF0aW9uU3RyaW5nID0gKFxyXG5cdFx0XHRcdFx0PHNtYWxsIGNsYXNzTmFtZT0nZGV0YWlsLWR1cmF0aW9uJz57bW9tZW50KGRldGFpbC5lbmQpLmRpZmYoZGV0YWlsLnN0YXJ0LCAnbWludXRlcycpfSBtaW51dGVzPC9zbWFsbD5cclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKGRldGFpbC5zdGFydCAmJiAhZGV0YWlsLmVuZCAmJiAhZGV0YWlsLmFsbGRheSkge1xyXG5cdFx0XHRkYXRlU3RyaW5nID0gKFxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT0nZGV0YWlsLXRpbWUnPlxyXG5cdFx0XHRcdFx0PHRpbWU+e21vbWVudChkZXRhaWwuc3RhcnQpLmZvcm1hdCgnZGRkLiBEIE1NTU0gWVlZWScpfSwge21vbWVudChkZXRhaWwuc3RhcnQpLmZvcm1hdCgnSDptbScpfTwvdGltZT5cclxuXHRcdFx0XHQ8L3NwYW4+XHJcblx0XHRcdCk7XHJcblx0XHR9IFxyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLnZpZXcgPT0gJ2RldGFpbCcpIHtcclxuXHRcdFx0Y3VycmVudFZpZXcgPSAoXHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3BvcHVwLWJvZHknIHN0eWxlPXt7cGFkZGluZ1RvcDogJzJlbSd9fT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjYXQtc3RyaXBlJyBzdHlsZT17e2JhY2tncm91bmRDb2xvcjogZGV0YWlsLmNhdGVnb3J5LmNvbG9yfX0+PC9kaXY+XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdDxkbCBjbGFzc05hbWU9J2RldGFpbC1saXN0Jz5cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdkbC1yb3cnPlxyXG5cdFx0XHRcdFx0XHRcdDxkZD5UaXRsZTwvZGQ+XHJcblx0XHRcdFx0XHRcdFx0PGR0PjxzdHJvbmc+e2RldGFpbC50aXRsZX08L3N0cm9uZz48L2R0PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdkbC1yb3cnPlxyXG5cdFx0XHRcdFx0XHRcdDxkZD5EYXRlPC9kZD5cclxuXHRcdFx0XHRcdFx0XHQ8ZHQ+e2RhdGVTdHJpbmd9IHtkdXJhdGlvblN0cmluZ308L2R0PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdkbC1yb3cnPlxyXG5cdFx0XHRcdFx0XHRcdDxkZD5DYXRlZ29yeTwvZGQ+XHJcblx0XHRcdFx0XHRcdFx0PGR0PjxpIHN0eWxlPXt7YmFja2dyb3VuZENvbG9yOiBkZXRhaWwuY2F0ZWdvcnkuY29sb3J9fT48L2k+IHtkZXRhaWwuY2F0ZWdvcnkubmFtZX08L2R0PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtkZXRhaWwucmVjdXJzaW9uICE9ICdvbmNlJyA/ICdkbC1yb3cnIDogJ2RsLXJvdyBoaWRlJ30+XHJcblx0XHRcdFx0XHRcdFx0PGRkPlJlY3Vyc2lvbjwvZGQ+IFxyXG5cdFx0XHRcdFx0XHRcdDxkdCBzdHlsZT17eyB0ZXh0VHJhbnNmb3JtOiAnY2FwaXRhbGl6ZScgfX0+e2RldGFpbC5yZWN1cnNpb259PC9kdD5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17ZGV0YWlsLm5vdGUgPyAnZGwtcm93JyA6ICdkbC1yb3cgaGlkZSd9PlxyXG5cdFx0XHRcdFx0XHRcdDxkZD5Ob3RlPC9kZD5cclxuXHRcdFx0XHRcdFx0XHQ8ZHQ+e2RldGFpbC5ub3RlfTwvZHQ+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2RsLXJvdyc+XHJcblx0XHRcdFx0XHRcdFx0PGRkPkF1dGhvcjwvZGQ+XHJcblx0XHRcdFx0XHRcdFx0PGR0PlxyXG5cdFx0XHRcdFx0XHRcdFx0e2RldGFpbC51c2VyLm5hbWUuZmlyc3R9IHtkZXRhaWwudXNlci5uYW1lLmxhc3R9IDxzbWFsbD57bW9tZW50KGRldGFpbC5hZGRlZCkuZnJvbU5vdygpfTwvc21hbGw+XHJcblx0XHRcdFx0XHRcdFx0PC9kdD5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2RsPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUudmlldyA9PSAndXBkYXRlJykge1xyXG5cdFx0XHRjdXJyZW50VmlldyA9IDxDYWxlbmRhclVwZGF0ZSBcclxuXHRcdFx0XHRjYXRlZ29yaWVzPXt0aGlzLnByb3BzLmNhdGVnb3JpZXN9XHJcblx0XHRcdFx0ZGV0YWlsPXt0aGlzLnN0YXRlLmRldGFpbH1cclxuXHRcdFx0XHRjYW5jZWxQb3B1cD17dGhpcy5wcm9wcy5jYW5jZWxQb3B1cH1cclxuXHRcdFx0XHR1cGRhdGVFdmVudD17dGhpcy5wcm9wcy51cGRhdGVFdmVudH0gLz5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoJCgnI2hlYWRlci11c2VyJykuaGFzQ2xhc3MoJ3B1Ymxpc2hlcicpIHx8IHRoaXMucHJvcHMudXNlci5faWQgPT0gZGV0YWlsLnVzZXIuX2lkKSB7XHJcblx0XHRcdHVwZGF0ZUJ1dHRvbiA9IDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLnZpZXcgPT0gJ3VwZGF0ZScgPyAnYWN0aXZlJyA6ICcnfSBvbkNsaWNrPXt0aGlzLnN3aXRjaFZpZXd9IGRhdGEtYXJnPSd1cGRhdGUnPlVwZGF0ZTwvZGl2PlxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgaWQ9J2NhbGVuZGFyLXNldHRpbmdzJz5cclxuXHRcdFx0XHQ8aGVhZGVyIGNsYXNzTmFtZT0ncG9wdXAtaGVhZGVyJz5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLnZpZXcgPT0gJ2RldGFpbCcgPyAnYWN0aXZlJyA6ICcnfSBvbkNsaWNrPXt0aGlzLnN3aXRjaFZpZXd9IGRhdGEtYXJnPSdkZXRhaWwnPkRldGFpbDwvZGl2PlxyXG5cdFx0XHRcdFx0e3VwZGF0ZUJ1dHRvbn1cclxuXHRcdFx0XHRcdDxkaXYgaWQ9J2Nsb3NlLXBvcHVwJyBvbkNsaWNrPXt0aGlzLnByb3BzLmNhbmNlbFBvcHVwfT4mdGltZXM7PC9kaXY+XHJcblx0XHRcdFx0PC9oZWFkZXI+XHJcblx0XHRcdFx0e2N1cnJlbnRWaWV3fVxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmxvYWRpbmcgPyAnbG9hZGluZyBhY3RpdmUnIDogJ2xvYWRpbmcnfT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdzcGlubmVyJz48L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpXHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9zcmMvY2FsZW5kYXItZGV0YWlsLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG5pbXBvcnQgZnVsbENhbGVuZGFyIGZyb20gJ2Z1bGxjYWxlbmRhcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxlbmRhclVwZGF0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHRcclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdGxvYWRpbmc6IGZhbHNlLFxyXG5cdFx0XHRkZXRhaWw6IHtcclxuXHRcdFx0XHR0aXRsZTogJycsXHJcblx0XHRcdFx0c3RhcnQ6ICcnLFxyXG5cdFx0XHRcdGVuZDogJycsXHJcblx0XHRcdFx0YWxsZGF5OiB0cnVlLFxyXG5cdFx0XHRcdG11bHRpZGF5OiBmYWxzZSxcclxuXHRcdFx0XHRjYXRlZ29yeTogJycsXHJcblx0XHRcdFx0cmVjdXJzaW9uOiAnb25jZScsXHJcblx0XHRcdFx0dXNlcjogJycsXHJcblx0XHRcdFx0bm90ZTogJycsXHJcblx0XHRcdH0sXHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zZXREYXRlID0gdGhpcy5zZXREYXRlLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmhhbmRsZUNoZWNrYm94ID0gdGhpcy5oYW5kbGVDaGVja2JveC5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5oYW5kbGVUaW1lID0gdGhpcy5oYW5kbGVUaW1lLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmhhbmRsZUVuZFRpbWUgPSB0aGlzLmhhbmRsZUVuZFRpbWUuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcclxuXHRcdHRoaXMuaGFuZGxlUmVtb3ZlID0gdGhpcy5oYW5kbGVSZW1vdmUuYmluZCh0aGlzKTtcclxuXHR9XHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cclxuXHRcdGxldCB0aGF0ID0gdGhpcywgZGV0YWlsID0gdGhpcy5wcm9wcy5kZXRhaWw7XHJcblx0XHRkZXRhaWwuY2F0ZWdvcnkgPSBkZXRhaWwuY2F0ZWdvcnkuX2lkO1xyXG5cdFx0ZGV0YWlsLnN0YXJ0ID0gbW9tZW50KGRldGFpbC5zdGFydCk7XHJcblx0XHRpZiAoZGV0YWlsLmVuZCkgZGV0YWlsLmVuZCA9IG1vbWVudChkZXRhaWwuZW5kKTtcclxuXHJcblx0XHR0aGlzLnNldFN0YXRlKHsgZGV0YWlsIH0sICgpID0+IHtcclxuXHJcblx0XHRcdCQoJy5jYWxlbmRhci1wb3B1cGNhbCcpLmZ1bGxDYWxlbmRhcih7XHJcblx0XHRcdFx0Zmlyc3REYXk6IDEsXHJcblx0XHRcdFx0aGVhZGVyOiB7XHJcblx0XHRcdFx0XHRsZWZ0OiAnJyxcclxuXHRcdFx0XHRcdGNlbnRlcjogJ3ByZXYgdGl0bGUgbmV4dCcsXHJcblx0XHRcdFx0XHRyaWdodDogJydcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGJ1dHRvbkljb25zOiBmYWxzZSxcclxuXHRcdFx0XHRidXR0b25UZXh0OiB7XHJcblx0XHRcdFx0XHRwcmV2OiAnXFx1MjAzOScsXHJcblx0XHRcdFx0XHRuZXh0OiAnXFx1MjAzQSdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGRheU5hbWVzU2hvcnQ6IFsnUycsICdNJywgJ1QnLCAnVycsICdUJywgJ0YnLCAnUyddLFxyXG5cdFx0XHRcdGRheVJlbmRlcihkYXRlLCBjZWxsKSB7XHJcblx0XHRcdFx0XHQkKGNlbGwpLmh0bWwoJzxzcGFuPicgKyBtb21lbnQoZGF0ZSkuZm9ybWF0KCdEJykgKyAnPC9zcGFuPicpO1xyXG5cdFx0XHRcdFx0aWYgKHRoYXQuc3RhdGUuZGV0YWlsLm11bHRpZGF5KSB7XHJcblx0XHRcdFx0XHRcdGlmIChtb21lbnQoZGF0ZSkuaXNTYW1lKHRoYXQuc3RhdGUuZGV0YWlsLnN0YXJ0LCAnZGF5JykpICQoY2VsbCkuYWRkQ2xhc3MoJ3NlbGVjdGVkIHN0YXJ0Jyk7XHJcblx0XHRcdFx0XHRcdGlmIChtb21lbnQoZGF0ZSkuaXNTYW1lKHRoYXQuc3RhdGUuZGV0YWlsLmVuZCwgJ2RheScpKSAkKGNlbGwpLmFkZENsYXNzKCdzZWxlY3RlZCBlbmQnKTtcclxuXHRcdFx0XHRcdFx0aWYgKG1vbWVudChkYXRlKS5pc0JldHdlZW4odGhhdC5zdGF0ZS5kZXRhaWwuc3RhcnQsIHRoYXQuc3RhdGUuZGV0YWlsLmVuZCkpICQoY2VsbCkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAobW9tZW50KHRoYXQuc3RhdGUuZGV0YWlsLnN0YXJ0KS5pc1NhbWUoZGF0ZSwgJ2RheScpKSAkKGNlbGwpLmFkZENsYXNzKCdzZWxlY3RlZCBzdGFydCBlbmQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGRheUNsaWNrKGRhdGUsIGpzRXZlbnQsIHZpZXcpIHtcclxuXHRcdFx0XHRcdHRoYXQuc2V0RGF0ZShkYXRlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZXREYXRlKGRhdGUpIHtcclxuXHRcdGxldCBkZXRhaWwgPSB0aGlzLnN0YXRlLmRldGFpbDtcclxuXHRcdCQoJy5mYy1kYXknKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQgc3RhcnQgZW5kJyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUuZGV0YWlsLm11bHRpZGF5KSB7XHJcblx0XHRcdGlmIChtb21lbnQoZGF0ZSkuaXNCZWZvcmUodGhpcy5zdGF0ZS5kZXRhaWwuc3RhcnQpKSB7XHJcblx0XHRcdFx0ZGV0YWlsLnN0YXJ0ID0gbW9tZW50KGRhdGUpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKG1vbWVudChkYXRlKS5pc0JldHdlZW4odGhpcy5zdGF0ZS5kZXRhaWwuc3RhcnQsIHRoaXMuc3RhdGUuZGV0YWlsLmVuZCkpIHtcclxuXHRcdFx0XHRkZXRhaWwuc3RhcnQgPSBtb21lbnQoZGF0ZSk7XHJcblx0XHRcdH0gZWxzZSBpZiAobW9tZW50KGRhdGUpLmlzQWZ0ZXIodGhpcy5zdGF0ZS5kZXRhaWwuc3RhcnQpKSB7XHJcblx0XHRcdFx0ZGV0YWlsLmVuZCA9IG1vbWVudChkYXRlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGRldGFpbDogZGV0YWlsIH0sICgpID0+IHtcclxuXHRcdFx0XHRkcmF3UmFuZ2UodGhpcy5zdGF0ZS5kZXRhaWwuc3RhcnQsIHRoaXMuc3RhdGUuZGV0YWlsLmVuZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcdFx0XHRcdFx0XHJcblx0XHRcdCQoJy5mYy1kYXlbZGF0YS1kYXRlPScgKyBtb21lbnQoZGF0ZSkuZm9ybWF0KCdZWVlZLU1NLUREJykgKyAnXScpLmFkZENsYXNzKCdzZWxlY3RlZCBzdGFydCBlbmQnKTtcclxuXHRcdFx0ZGV0YWlsLnN0YXJ0ID0gbW9tZW50KGRhdGUpO1xyXG5cdFx0XHRkZXRhaWwuZW5kID0gJyc7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBkZXRhaWw6IGRldGFpbCB9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBkcmF3UmFuZ2UgKHN0YXJ0LCBlbmQpIHtcclxuXHRcdFx0dmFyIG51bSA9IG1vbWVudChlbmQpLmRpZmYoc3RhcnQsICdkYXlzJyk7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IG51bTsgaSsrKSB7XHJcblx0XHRcdFx0JCgnLmZjLWRheVtkYXRhLWRhdGU9JyArIG1vbWVudChzdGFydCkuYWRkKGksICdkYXlzJykuZm9ybWF0KCdZWVlZLU1NLUREJykgKyAnXScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuXHRcdFx0XHRpZiAoaSA9PSAwKSAkKCcuZmMtZGF5W2RhdGEtZGF0ZT0nICsgbW9tZW50KHN0YXJ0KS5hZGQoaSwgJ2RheXMnKS5mb3JtYXQoJ1lZWVktTU0tREQnKSArICddJykuYWRkQ2xhc3MoJ3N0YXJ0Jyk7XHJcblx0XHRcdFx0aWYgKGkgPT0gbnVtKSAkKCcuZmMtZGF5W2RhdGEtZGF0ZT0nICsgbW9tZW50KHN0YXJ0KS5hZGQoaSwgJ2RheXMnKS5mb3JtYXQoJ1lZWVktTU0tREQnKSArICddJykuYWRkQ2xhc3MoJ2VuZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRoYW5kbGVDaGFuZ2UoZSkge1xyXG5cdFx0dmFyIGRldGFpbCA9IHRoaXMuc3RhdGUuZGV0YWlsO1xyXG5cdFx0ZGV0YWlsW2UudGFyZ2V0Lm5hbWVdID0gZS50YXJnZXQudmFsdWU7XHJcblx0XHR0aGlzLnNldFN0YXRlKHsgZGV0YWlsOiBkZXRhaWwgfSk7XHJcblx0fVxyXG5cclxuXHRoYW5kbGVDaGVja2JveChlKSB7XHJcblx0XHRsZXQgZGV0YWlsID0gdGhpcy5zdGF0ZS5kZXRhaWw7XHJcblx0XHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcblx0XHRcdGRldGFpbFtlLnRhcmdldC5kYXRhc2V0LmFyZ10gPSBmYWxzZTtcclxuXHRcdH0gZWxzZSB7IGRldGFpbFtlLnRhcmdldC5kYXRhc2V0LmFyZ10gPSB0cnVlOyBcdH1cclxuXHJcblx0XHRpZiAoZGV0YWlsLm11bHRpZGF5ID09IHRydWUgfHwgdGhpcy5zdGF0ZS5kZXRhaWwubXVsdGlkYXkgPT0gdHJ1ZSkgZGV0YWlsWydhbGxkYXknXSA9IHRydWU7XHJcblx0XHRpZiAoZGV0YWlsLm11bHRpZGF5ID09IGZhbHNlIHx8IHRoaXMuc3RhdGUuZGV0YWlsLm11bHRpZGF5ID09IGZhbHNlKSBkZXRhaWxbJ2VuZCddID0gJyc7XHJcblx0XHRpZiAoZGV0YWlsLmFsbGRheSA9PSB0cnVlKSBkZXRhaWxbJ3N0YXJ0J10gPSBtb21lbnQodGhpcy5zdGF0ZS5kZXRhaWwuc3RhcnQpLnNldCh7J2hvdXInOiAwLCAnbWludXRlJzogMH0pO1xyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBkZXRhaWw6IGRldGFpbCB9LCAoKSA9PiB7XHJcblx0XHRcdGlmIChkZXRhaWwubXVsdGlkYXkgPT0gZmFsc2UpIHRoaXMuc2V0RGF0ZSh0aGlzLnN0YXRlLmRldGFpbC5zdGFydCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGhhbmRsZVRpbWUoZSkge1xyXG5cdFx0dmFyIGRldGFpbCA9IHRoaXMuc3RhdGUuZGV0YWlsLFxyXG5cdFx0XHR0aW1lID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcclxuXHJcblx0XHRpZiAoZS50YXJnZXQuZGF0YXNldC5hcmcgPT0gJ3N0YXJ0LWhvdXJzJykgZGV0YWlsLnN0YXJ0ID0gbW9tZW50KGRldGFpbC5zdGFydCkuc2V0KCdob3VyJywgdGltZSk7XHJcblx0XHRpZiAoZS50YXJnZXQuZGF0YXNldC5hcmcgPT0gJ3N0YXJ0LW1pbnV0ZXMnKSBkZXRhaWwuc3RhcnQgPSBtb21lbnQoZGV0YWlsLnN0YXJ0KS5zZXQoJ21pbnV0ZScsIHRpbWUpO1xyXG5cdFx0aWYgKGUudGFyZ2V0LmRhdGFzZXQuYXJnID09ICdlbmQtaG91cnMnKSBkZXRhaWwuZW5kID0gbW9tZW50KGRldGFpbC5lbmQpLnNldCgnaG91cicsIHRpbWUpO1xyXG5cdFx0aWYgKGUudGFyZ2V0LmRhdGFzZXQuYXJnID09ICdlbmQtbWludXRlcycpIGRldGFpbC5lbmQgPSBtb21lbnQoZGV0YWlsLmVuZCkuc2V0KCdtaW51dGUnLCB0aW1lKTtcclxuXHJcblx0XHRpZiAobW9tZW50KGRldGFpbC5lbmQpLmlzQmVmb3JlKGRldGFpbC5zdGFydCkpIHJldHVybiBhbGVydCgnSW52YWxpZCB0aW1lJyk7XHJcblxyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGRldGFpbDogZGV0YWlsIH0pO1xyXG5cdH1cclxuXHJcblx0aGFuZGxlRW5kVGltZShlKSB7XHJcblx0XHRsZXQgZGV0YWlsID0gdGhpcy5zdGF0ZS5kZXRhaWw7XHJcblxyXG5cdFx0aWYgKGRldGFpbC5lbmQgPT0gJycgJiYgZGV0YWlsLmFsbGRheSA9PSBmYWxzZSkge1xyXG5cdFx0XHRkZXRhaWwuZW5kID0gbW9tZW50KGRldGFpbC5zdGFydCkuYWRkKDEsICdob3VycycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGV0YWlsLmVuZCA9ICcnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBkZXRhaWw6IGRldGFpbCB9KTtcclxuXHR9XHJcblxyXG5cdGhhbmRsZVN1Ym1pdChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUuZGV0YWlsLnRpdGxlID09ICcnKSByZXR1cm4gYWxlcnQoJ1BsZWFzZSBlbnRlciBhIHRpdGxlJyk7XHJcblx0XHRpZiAodGhpcy5zdGF0ZS5kZXRhaWwuY2F0ZWdvcnkgPT0gJycpIHJldHVybiBhbGVydCgnUGxlYXNlIHN1cHBseSBhIGNhdGVnb3J5Jyk7XHJcblxyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IHRydWUgfSwgKCkgPT4ge1xyXG5cclxuXHRcdFx0bGV0IGV2ID0gdGhpcy5zdGF0ZS5kZXRhaWw7XHJcblxyXG5cdFx0XHRpZiAoIWV2LmFsbGRheSkge1xyXG5cdFx0XHRcdGV2LnN0YXJ0ID0gbW9tZW50KGV2LnN0YXJ0KS5hZGQoMiwgJ2hvdXJzJykuZm9ybWF0KCdYJyk7XHJcblx0XHRcdFx0aWYgKGV2LmVuZCkgZXYuZW5kID0gbW9tZW50KGV2LmVuZCkuYWRkKDIsICdob3VycycpLmZvcm1hdCgnWCcpO1x0XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZXYuc3RhcnQgPSBtb21lbnQoZXYuc3RhcnQpLmZvcm1hdCgnWCcpO1xyXG5cdFx0XHRcdGlmIChldi5lbmQpIGV2LmVuZCA9IG1vbWVudChldi5lbmQpLmZvcm1hdCgnWCcpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdFx0ZXZbJ3JlYXNvbiddID0gJ3VwZGF0ZSc7XHJcblxyXG5cdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRcdHVybDogJy9odW1waHJleS9ldmVudHMnLFxyXG5cdFx0XHRcdGRhdGE6IGV2LFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbidcclxuXHRcdFx0fSkuZG9uZShyZXNwb25zZSA9PiB7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IGZhbHNlIH0sICgpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMucHJvcHMuY2FuY2VsUG9wdXAoKTtcclxuXHRcdFx0XHRcdHRoaXMucHJvcHMudXBkYXRlRXZlbnQocmVzcG9uc2UpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aGFuZGxlUmVtb3ZlKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlPycpKSB7XHJcblxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0bGV0IGV2ID0gdGhpcy5zdGF0ZS5kZXRhaWwsXHJcblx0XHRcdGhvdXJzID0gWycwMCcsICcwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMicsICcxMycsICcxNCcsICcxNScsICcxNicsICcxNycsICcxOCcsICcxOScsICcyMCcsICcyMScsICcyMicsICcyMycsICcyNCddLFxyXG5cdFx0XHRtaW51dGVzID0gWycwMCcsICcwNScsICcxMCcsICcxNScsICcyMCcsICcyNScsICczMCcsICczNScsICc0MCcsICc0NScsICc1MCcsICc1NSddO1xyXG5cclxuXHRcdHZhciBzdGFydEhvdXJMaXN0ID0gaG91cnMubWFwKGhvdXIgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKCA8b3B0aW9uIHZhbHVlPXtob3VyfSBrZXk9eydzaC0nICsgaG91cn0+e2hvdXJ9PC9vcHRpb24+IClcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBzdGFydE1pbnV0ZUxpc3QgPSBtaW51dGVzLm1hcChtaW51dGUgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKCA8b3B0aW9uIHZhbHVlPXttaW51dGV9IGtleT17J3NtLScgKyBtaW51dGV9PnttaW51dGV9PC9vcHRpb24+IClcclxuXHRcdH0pO1x0XHJcblxyXG5cdFx0dmFyIGVuZEhvdXJMaXN0ID0gaG91cnMubWFwKGhvdXIgPT4ge1xyXG5cdFx0XHRpZiAoaG91ciA+PSBtb21lbnQoZXYuc3RhcnQpLmZvcm1hdCgnSEgnKSkge1xyXG5cdFx0XHRcdHJldHVybiAoIDxvcHRpb24gdmFsdWU9e2hvdXJ9IGtleT17J2VoLScgKyBob3VyfT57aG91cn08L29wdGlvbj4gKVxyXG5cdFx0XHR9XHRcdFx0XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgZW5kTWludXRlTGlzdCA9IG1pbnV0ZXMubWFwKG1pbnV0ZSA9PiB7XHJcblx0XHRcdHJldHVybiAoIDxvcHRpb24gdmFsdWU9e21pbnV0ZX0ga2V5PXsnZW0tJyArIG1pbnV0ZX0+e21pbnV0ZX08L29wdGlvbj4gKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIGNhdExpc3QgPSB0aGlzLnByb3BzLmNhdGVnb3JpZXMubWFwKGNhdCA9PiB7XHJcblx0XHRcdHJldHVybiAoIDxvcHRpb24gdmFsdWU9e2NhdC5pZH0ga2V5PXtjYXQuaWR9PntjYXQubmFtZX08L29wdGlvbj4gKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J3BvcHVwLWJvZHknPlxyXG5cdFx0XHRcdDxmb3JtPlxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmb3JtLXJvdyc+XHJcblx0XHRcdFx0XHRcdDxsYWJlbCBodG1sRm9yPSd1cGRhdGUtdGl0bGUnPlRpdGxlPC9sYWJlbD5cclxuXHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9J3RleHQnIGlkPSd1cGRhdGUtdGl0bGUnIG5hbWU9J3RpdGxlJyB2YWx1ZT17ZXYudGl0bGV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gLz5cclxuXHRcdFx0XHRcdDwvZGl2Plx0XHRcclxuXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZm9ybS1yb3cnPlx0XHJcblx0XHRcdFx0XHRcdDxsYWJlbCBodG1sRm9yPSd1cGRhdGUtZGF0ZSc+RGF0ZTwvbGFiZWw+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjYWxlbmRhcic+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NhbGVuZGFyLXBvcHVwY2FsJz48L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2FsZW5kYXItb3B0aW9ucyc+XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzc05hbWU9e2V2LmFsbGRheSA/ICdjaGVja2JveCBhY3RpdmUnIDogJ2NoZWNrYm94J30gZGF0YS1hcmc9J2FsbGRheScgb25DbGljaz17dGhpcy5oYW5kbGVDaGVja2JveH0+QWxsIGRheTwvbGFiZWw+XHJcblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPXtldi5tdWx0aWRheSA/ICdjaGVja2JveCBhY3RpdmUnIDogJ2NoZWNrYm94J30gZGF0YS1hcmc9J211bHRpZGF5JyBvbkNsaWNrPXt0aGlzLmhhbmRsZUNoZWNrYm94fT5EYXRlIHJhbmdlPC9sYWJlbD5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPXtldi5hbGxkYXkgPyAndXBkYXRlLXRpbWUgZGlzYWJsZWQnIDogJ3VwZGF0ZS10aW1lJ30gaHRtbEZvcj0ndXBkYXRlLXRpbWUtc3RhcnQtaG91cnMnPlN0YXJ0IHRpbWU8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3NldC10aW1lJz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNlbGVjdCBpZD0ndXBkYXRlLXRpbWUtc3RhcnQtaG91cnMnIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRpbWV9IHZhbHVlPXttb21lbnQoZXYuc3RhcnQpLmZvcm1hdCgnSEgnKX0gZGlzYWJsZWQ9e2V2LmFsbGRheX0gZGF0YS1hcmc9J3N0YXJ0LWhvdXJzJz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhcnRIb3VyTGlzdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9zZWxlY3Q+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxzZWxlY3QgaWQ9J3VwZGF0ZS10aW1lLXN0YXJ0LW1pbnV0ZXMnIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRpbWV9IHZhbHVlPXttb21lbnQoZXYuc3RhcnQpLmZvcm1hdCgnbW0nKX0gZGlzYWJsZWQ9e2V2LmFsbGRheX0gZGF0YS1hcmc9J3N0YXJ0LW1pbnV0ZXMnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGFydE1pbnV0ZUxpc3R9XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvc2VsZWN0PlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT17ZXYuYWxsZGF5ID8gJ2NoZWNrYm94IGRpc2FibGVkJyA6IGV2LmVuZCAhPSAnJyA/ICdjaGVja2JveCBhY3RpdmUnIDogJ2NoZWNrYm94J30gaHRtbEZvcj0ndXBkYXRlLXRpbWUtZW5kLWhvdXJzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZUVuZFRpbWV9PkVuZCB0aW1lPC9sYWJlbD5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdzZXQtdGltZSc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxzZWxlY3QgaWQ9J3VwZGF0ZS10aW1lLWVuZC1ob3Vycycgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVGltZX0gdmFsdWU9e21vbWVudChldi5lbmQpLmZvcm1hdCgnSEgnKX0gZGlzYWJsZWQ9e2V2LmFsbGRheSA9PSB0cnVlIHx8IGV2LmVuZCA9PSAnJ30gZGF0YS1hcmc9J2VuZC1ob3Vycyc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0e2VuZEhvdXJMaXN0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L3NlbGVjdD5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHNlbGVjdCBpZD0ndXBkYXRlLXRpbWUtZW5kLW1pbnV0ZXMnIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRpbWV9IHZhbHVlPXttb21lbnQoZXYuZW5kKS5mb3JtYXQoJ21tJyl9IGRpc2FibGVkPXtldi5hbGxkYXkgPT0gdHJ1ZSB8fCBldi5lbmQgPT0gJyd9IGRhdGEtYXJnPSdlbmQtbWludXRlcyc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0e2VuZE1pbnV0ZUxpc3R9XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvc2VsZWN0PlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0ndXBkYXRlLXRpbWUnIGh0bWxGb3I9J3VwZGF0ZS1yZWN1cnNpb24nPlJlY3Vyc2lvbjwvbGFiZWw+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nc2V0LXRpbWUnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8c2VsZWN0IGlkPSd1cGRhdGUtcmVjdXJzaW9uJyBuYW1lPSdyZWN1cnNpb24nIHZhbHVlPXtldi5yZWN1cnNpb259IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PG9wdGlvbiB2YWx1ZT0nb25jZSc+T25jZTwvb3B0aW9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxvcHRpb24gdmFsdWU9J21vbnRobHknPk1vbnRobHk8L29wdGlvbj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8b3B0aW9uIHZhbHVlPSd5ZWFybHknPlllYXJseTwvb3B0aW9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8L3NlbGVjdD5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmb3JtLXJvdyc+XHRcclxuXHRcdFx0XHRcdFx0PGxhYmVsIGh0bWxGb3I9J3VwZGF0ZS1jYXRlZ29yeSc+Q2F0ZWdvcnk8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHQ8c2VsZWN0IGlkPSd1cGRhdGUtY2F0ZWdvcnknIG5hbWU9J2NhdGVnb3J5JyB2YWx1ZT17ZXYuY2F0ZWdvcnl9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0+XHJcblx0XHRcdFx0XHRcdFx0e2NhdExpc3R9XHJcblx0XHRcdFx0XHRcdDwvc2VsZWN0PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2Zvcm0tcm93Jz5cdFxyXG5cdFx0XHRcdFx0XHQ8bGFiZWwgaHRtbEZvcj0ndXBkYXRlLW5vdGUnPk5vdGU8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHQ8dGV4dGFyZWEgaWQ9J3VwZGF0ZS1ub3RlJyBuYW1lPSdub3RlJyB2YWx1ZT17ZXYubm90ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfT48L3RleHRhcmVhPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2J1dHRvbicgdHlwZT0nc3VibWl0JyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0+VXBkYXRlPC9idXR0b24+XHJcblx0XHRcdFx0XHQ8YSBocmVmPScnIGNsYXNzTmFtZT0nbGluaycgb25DbGljaz17dGhpcy5oYW5kbGVSZW1vdmV9PlJlbW92ZTwvYT5cclxuXHRcdFx0XHQ8L2Zvcm0+XHJcblxyXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmxvYWRpbmcgPyAnbG9hZGluZyBhY3RpdmUnIDogJ2xvYWRpbmcnfT5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdzcGlubmVyJz48L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpXHJcblx0fVxyXG59IFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvc3JjL2NhbGVuZGFyLXVwZGF0ZS5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IGZ1bGxDYWxlbmRhciBmcm9tICdmdWxsY2FsZW5kYXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsZW5kYXJDcmVhdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHRcclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdHRpdGxlOiAnJyxcclxuXHRcdFx0c3RhcnQ6IG1vbWVudCgpLFxyXG5cdFx0XHRlbmQ6ICcnLFxyXG5cdFx0XHRhbGxkYXk6IHRydWUsXHJcblx0XHRcdG11bHRpZGF5OiBmYWxzZSxcclxuXHRcdFx0Y2F0ZWdvcnk6ICcnLFxyXG5cdFx0XHRyZWN1cnNpb246ICdvbmNlJyxcclxuXHRcdFx0bm90ZTogJycsXHJcblx0XHRcdGxvYWRpbmc6IGZhbHNlXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2V0RGF0ZSA9IHRoaXMuc2V0RGF0ZS5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5oYW5kbGVDaGVja2JveCA9IHRoaXMuaGFuZGxlQ2hlY2tib3guYmluZCh0aGlzKTtcclxuXHRcdHRoaXMuaGFuZGxlVGltZSA9IHRoaXMuaGFuZGxlVGltZS5iaW5kKHRoaXMpO1xyXG5cdFx0dGhpcy5oYW5kbGVFbmRUaW1lID0gdGhpcy5oYW5kbGVFbmRUaW1lLmJpbmQodGhpcyk7XHJcblx0XHR0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XHJcblx0fVxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cclxuXHRcdGxldCB0aGF0ID0gdGhpcztcclxuXHJcblx0XHQkKCcuY2FsZW5kYXItcG9wdXBjYWwnKS5mdWxsQ2FsZW5kYXIoe1xyXG5cdFx0XHRmaXJzdERheTogMSxcclxuXHRcdFx0aGVhZGVyOiB7XHJcblx0XHRcdFx0bGVmdDogJycsXHJcblx0XHRcdFx0Y2VudGVyOiAncHJldiB0aXRsZSBuZXh0JyxcclxuXHRcdFx0XHRyaWdodDogJydcclxuXHRcdFx0fSxcclxuXHRcdFx0YnV0dG9uSWNvbnM6IGZhbHNlLFxyXG5cdFx0XHRidXR0b25UZXh0OiB7XHJcblx0XHRcdFx0cHJldjogJ1xcdTIwMzknLFxyXG5cdFx0XHRcdG5leHQ6ICdcXHUyMDNBJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXlOYW1lc1Nob3J0OiBbJ1MnLCAnTScsICdUJywgJ1cnLCAnVCcsICdGJywgJ1MnXSxcclxuXHRcdFx0ZGF5UmVuZGVyKGRhdGUsIGNlbGwpIHtcclxuXHRcdFx0XHQkKGNlbGwpLmh0bWwoJzxzcGFuPicgKyBtb21lbnQoZGF0ZSkuZm9ybWF0KCdEJykgKyAnPC9zcGFuPicpO1xyXG5cdFx0XHRcdGlmICh0aGF0LnN0YXRlLm11bHRpZGF5KSB7XHJcblx0XHRcdFx0XHRpZiAobW9tZW50KGRhdGUpLmlzU2FtZSh0aGF0LnN0YXRlLnN0YXJ0LCAnZGF5JykpICQoY2VsbCkuYWRkQ2xhc3MoJ3NlbGVjdGVkIHN0YXJ0Jyk7XHJcblx0XHRcdFx0XHRpZiAobW9tZW50KGRhdGUpLmlzU2FtZSh0aGF0LnN0YXRlLmVuZCwgJ2RheScpKSAkKGNlbGwpLmFkZENsYXNzKCdzZWxlY3RlZCBlbmQnKTtcclxuXHRcdFx0XHRcdGlmIChtb21lbnQoZGF0ZSkuaXNCZXR3ZWVuKHRoYXQuc3RhdGUuc3RhcnQsIHRoYXQuc3RhdGUuZW5kKSkgJChjZWxsKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKG1vbWVudCh0aGF0LnN0YXRlLnN0YXJ0KS5pc1NhbWUoZGF0ZSwgJ2RheScpKSB0aGF0LnNldERhdGUoZGF0ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRkYXlDbGljayhkYXRlLCBqc0V2ZW50LCB2aWV3KSB7XHJcblx0XHRcdFx0dGhhdC5zZXREYXRlKGRhdGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNldERhdGUoZGF0ZSkge1xyXG5cclxuXHRcdCQoJy5mYy1kYXknKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQgc3RhcnQgZW5kJyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUubXVsdGlkYXkpIHtcclxuXHRcdFx0aWYgKG1vbWVudChkYXRlKS5pc0JlZm9yZSh0aGlzLnN0YXRlLnN0YXJ0KSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlLmVuZCAhPSAnJykge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHN0YXJ0OiBtb21lbnQoZGF0ZSkgfSwgKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRkcmF3UmFuZ2UodGhpcy5zdGF0ZS5zdGFydCwgdGhpcy5zdGF0ZS5lbmQpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBzdGFydDogbW9tZW50KGRhdGUpLCBlbmQ6IHRoaXMuc3RhdGUuc3RhcnQgfSwgKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRkcmF3UmFuZ2UodGhpcy5zdGF0ZS5zdGFydCwgdGhpcy5zdGF0ZS5lbmQpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKG1vbWVudChkYXRlKS5pc0JldHdlZW4odGhpcy5zdGF0ZS5zdGFydCwgdGhpcy5zdGF0ZS5lbmQpKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHN0YXJ0OiBtb21lbnQoZGF0ZSkgfSwgKCkgPT4ge1xyXG5cdFx0XHRcdFx0ZHJhd1JhbmdlKHRoaXMuc3RhdGUuc3RhcnQsIHRoaXMuc3RhdGUuZW5kKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIGlmIChtb21lbnQoZGF0ZSkuaXNBZnRlcih0aGlzLnN0YXRlLnN0YXJ0KSkge1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBlbmQ6IG1vbWVudChkYXRlKSB9LCAoKSA9PiB7XHJcblx0XHRcdFx0XHRkcmF3UmFuZ2UodGhpcy5zdGF0ZS5zdGFydCwgdGhpcy5zdGF0ZS5lbmQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1x0XHRcdFx0XHRcclxuXHRcdFx0JCgnLmZjLWRheVtkYXRhLWRhdGU9JyArIG1vbWVudChkYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQnKSArICddJykuYWRkQ2xhc3MoJ3NlbGVjdGVkIHN0YXJ0IGVuZCcpO1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgc3RhcnQ6IG1vbWVudChkYXRlKSwgZW5kOiAnJyB9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBkcmF3UmFuZ2UgKHN0YXJ0LCBlbmQpIHtcclxuXHRcdFx0bGV0IG51bSA9IGVuZC5kaWZmKHN0YXJ0LCAnZGF5cycpO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBudW07IGkrKykge1xyXG5cdFx0XHRcdCQoJy5mYy1kYXlbZGF0YS1kYXRlPScgKyBtb21lbnQoc3RhcnQpLmFkZChpLCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpICsgJ10nKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHJcblx0XHRcdFx0aWYgKGkgPT0gMCkgJCgnLmZjLWRheVtkYXRhLWRhdGU9JyArIG1vbWVudChzdGFydCkuYWRkKGksICdkYXlzJykuZm9ybWF0KCdZWVlZLU1NLUREJykgKyAnXScpLmFkZENsYXNzKCdzdGFydCcpO1xyXG5cdFx0XHRcdGlmIChpID09IG51bSkgJCgnLmZjLWRheVtkYXRhLWRhdGU9JyArIG1vbWVudChzdGFydCkuYWRkKGksICdkYXlzJykuZm9ybWF0KCdZWVlZLU1NLUREJykgKyAnXScpLmFkZENsYXNzKCdlbmQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aGFuZGxlQ2hhbmdlKGUpIHtcclxuXHRcdGxldCBvYmogPSB7fTtcclxuXHRcdG9ialtlLnRhcmdldC5uYW1lXSA9IGUudGFyZ2V0LnZhbHVlO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShvYmopO1xyXG5cdH1cclxuXHJcblx0aGFuZGxlQ2hlY2tib3goZSkge1xyXG5cdFx0bGV0IG9iaiA9IHt9O1xyXG5cdFx0aWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG5cdFx0XHRvYmpbZS50YXJnZXQuZGF0YXNldC5hcmddID0gZmFsc2U7XHJcblx0XHR9IGVsc2UgeyBvYmpbZS50YXJnZXQuZGF0YXNldC5hcmddID0gdHJ1ZTsgXHR9XHJcblxyXG5cdFx0aWYgKG9iai5tdWx0aWRheSA9PSB0cnVlIHx8IHRoaXMuc3RhdGUubXVsdGlkYXkgPT0gdHJ1ZSkgb2JqWydhbGxkYXknXSA9IHRydWU7XHJcblx0XHRpZiAob2JqLm11bHRpZGF5ID09IGZhbHNlIHx8IHRoaXMuc3RhdGUubXVsdGlkYXkgPT0gZmFsc2UpIG9ialsnZW5kJ10gPSAnJztcclxuXHRcdGlmIChvYmouYWxsZGF5ID09IHRydWUpIG9ialsnc3RhcnQnXSA9IG1vbWVudCh0aGlzLnN0YXRlLnN0YXJ0KS5zZXQoeydob3VyJzogMCwgJ21pbnV0ZSc6IDB9KTtcclxuXHJcblx0XHR0aGlzLnNldFN0YXRlKG9iaiwgKCkgPT4ge1xyXG5cdFx0XHRpZiAob2JqLm11bHRpZGF5ID09IGZhbHNlKSB0aGlzLnNldERhdGUodGhpcy5zdGF0ZS5zdGFydCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGhhbmRsZVRpbWUoZSkge1xyXG5cdFx0bGV0IHN0YXJ0ID0gbW9tZW50KHRoaXMuc3RhdGUuc3RhcnQpLFxyXG5cdFx0XHRlbmQgPSAnJyxcclxuXHRcdFx0dGltZSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhdGUuZW5kICE9ICcnKSBlbmQgPSBtb21lbnQodGhpcy5zdGF0ZS5lbmQpO1xyXG5cclxuXHRcdGlmIChlLnRhcmdldC5kYXRhc2V0LmFyZyA9PSAnc3RhcnQtaG91cnMnKSBzdGFydCA9IG1vbWVudChzdGFydCkuc2V0KCdob3VyJywgdGltZSk7XHJcblx0XHRpZiAoZS50YXJnZXQuZGF0YXNldC5hcmcgPT0gJ3N0YXJ0LW1pbnV0ZXMnKSBzdGFydCA9IG1vbWVudChzdGFydCkuc2V0KCdtaW51dGUnLCB0aW1lKTtcclxuXHRcdGlmIChlLnRhcmdldC5kYXRhc2V0LmFyZyA9PSAnZW5kLWhvdXJzJykgZW5kID0gbW9tZW50KGVuZCkuc2V0KCdob3VyJywgdGltZSk7XHJcblx0XHRpZiAoZS50YXJnZXQuZGF0YXNldC5hcmcgPT0gJ2VuZC1taW51dGVzJykgZW5kID0gbW9tZW50KGVuZCkuc2V0KCdtaW51dGUnLCB0aW1lKTtcclxuXHJcblx0XHRpZiAobW9tZW50KGVuZCkuaXNCZWZvcmUoc3RhcnQpKSByZXR1cm4gYWxlcnQoJ0ludmFsaWQgdGltZScpO1xyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBzdGFydDogc3RhcnQsIGVuZDogZW5kIH0pO1xyXG5cdH1cclxuXHJcblx0aGFuZGxlRW5kVGltZShlKSB7XHJcblx0XHRsZXQgc3RhcnQgPSB0aGlzLnN0YXRlLnN0YXJ0O1xyXG5cclxuXHRcdGlmICh0aGlzLnN0YXRlLmVuZCA9PSAnJyAmJiB0aGlzLnN0YXRlLmFsbGRheSA9PSBmYWxzZSkge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgZW5kOiBtb21lbnQoc3RhcnQpLmFkZCgxLCAnaG91cnMnKSB9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBlbmQ6ICcnIH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aGFuZGxlU3VibWl0KGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRpZiAodGhpcy5zdGF0ZS50aXRsZSA9PSAnJykgcmV0dXJuIGFsZXJ0KCdQbGVhc2UgZW50ZXIgYSB0aXRsZScpO1xyXG5cdFx0aWYgKHRoaXMuc3RhdGUuY2F0ZWdvcnkgPT0gJycpIHJldHVybiBhbGVydCgnUGxlYXNlIHN1cHBseSBhIGNhdGVnb3J5Jyk7XHJcblxyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IHRydWUgfSwgKCkgPT4ge1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLnN0YXRlO1xyXG5cdFx0XHRldi5zdGFydCA9IG1vbWVudChldi5zdGFydCkuZm9ybWF0KCdYJyk7XHJcblx0XHRcdGlmIChldi5lbmQpIGV2LmVuZCA9IG1vbWVudChldi5lbmQpLmZvcm1hdCgnWCcpO1x0XHRcclxuXHJcblx0XHRcdGV2WydyZWFzb24nXSA9ICdjcmVhdGUnO1xyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcclxuXHRcdFx0XHR1cmw6IGRvY3VtZW50LmJhc2VVUkkgKyAnL2V2ZW50cycsXHJcblx0XHRcdFx0ZGF0YTogZXYsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJ1xyXG5cdFx0XHR9KS5kb25lKHJlc3BvbnNlID0+IHtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogZmFsc2UgfSwgKCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5jYW5jZWxQb3B1cCgpO1xyXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5uZXdFdmVudChyZXNwb25zZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdGxldCBldiA9IHRoaXMuc3RhdGUsXHJcblx0XHRcdGhvdXJzID0gWycwMCcsICcwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMicsICcxMycsICcxNCcsICcxNScsICcxNicsICcxNycsICcxOCcsICcxOScsICcyMCcsICcyMScsICcyMicsICcyMycsICcyNCddLFxyXG5cdFx0XHRtaW51dGVzID0gWycwMCcsICcwNScsICcxMCcsICcxNScsICcyMCcsICcyNScsICczMCcsICczNScsICc0MCcsICc0NScsICc1MCcsICc1NSddO1xyXG5cclxuXHRcdGxldCBzdGFydEhvdXJMaXN0ID0gaG91cnMubWFwKGhvdXIgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKCA8b3B0aW9uIHZhbHVlPXtob3VyfSBrZXk9eydzaC0nICsgaG91cn0+e2hvdXJ9PC9vcHRpb24+IClcclxuXHRcdH0pO1xyXG5cclxuXHRcdGxldCBzdGFydE1pbnV0ZUxpc3QgPSBtaW51dGVzLm1hcChtaW51dGUgPT4ge1xyXG5cdFx0XHRyZXR1cm4gKCA8b3B0aW9uIHZhbHVlPXttaW51dGV9IGtleT17J3NtLScgKyBtaW51dGV9PnttaW51dGV9PC9vcHRpb24+IClcclxuXHRcdH0pO1x0XHJcblxyXG5cdFx0bGV0IGVuZEhvdXJMaXN0ID0gaG91cnMubWFwKGhvdXIgPT4ge1xyXG5cdFx0XHRpZiAoaG91ciA+PSBtb21lbnQoZXYuc3RhcnQpLmZvcm1hdCgnSEgnKSkge1xyXG5cdFx0XHRcdHJldHVybiAoIDxvcHRpb24gdmFsdWU9e2hvdXJ9IGtleT17J2VoLScgKyBob3VyfT57aG91cn08L29wdGlvbj4gKVxyXG5cdFx0XHR9XHRcdFx0XHJcblx0XHR9KTtcclxuXHJcblx0XHRsZXQgZW5kTWludXRlTGlzdCA9IG1pbnV0ZXMubWFwKG1pbnV0ZSA9PiB7XHJcblx0XHRcdHJldHVybiAoIDxvcHRpb24gdmFsdWU9e21pbnV0ZX0ga2V5PXsnZW0tJyArIG1pbnV0ZX0+e21pbnV0ZX08L29wdGlvbj4gKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IGNhdExpc3QgPSB0aGlzLnByb3BzLmNhdGVnb3JpZXMubWFwKGNhdCA9PiB7XHJcblx0XHRcdHJldHVybiAoIDxvcHRpb24gdmFsdWU9e2NhdC5pZH0ga2V5PXtjYXQuaWR9PntjYXQubmFtZX08L29wdGlvbj4gKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBpZD0nY2FsZW5kYXItY3JlYXRlJz5cclxuXHRcdFx0XHQ8aGVhZGVyIGNsYXNzTmFtZT0ncG9wdXAtaGVhZGVyJz5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdhY3RpdmUnPkFkZDwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBpZD0nY2xvc2UtcG9wdXAnIG9uQ2xpY2s9e3RoaXMucHJvcHMuY2FuY2VsUG9wdXB9PiZ0aW1lczs8L2Rpdj5cclxuXHRcdFx0XHQ8L2hlYWRlcj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0ncG9wdXAtYm9keSc+XHJcblx0XHRcdFx0XHQ8Zm9ybT5cclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmb3JtLXJvdyc+XHJcblx0XHRcdFx0XHRcdFx0PGxhYmVsIGh0bWxGb3I9J2NyZWF0ZS10aXRsZSc+VGl0bGU8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD0nY3JlYXRlLXRpdGxlJyBuYW1lPSd0aXRsZScgdmFsdWU9e2V2LnRpdGxlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XHJcblx0XHRcdFx0XHRcdDwvZGl2Plx0XHRcclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmb3JtLXJvdyc+XHRcclxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgaHRtbEZvcj0nY3JlYXRlLWRhdGUnPkRhdGU8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdjYWxlbmRhcic+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nY2FsZW5kYXItcG9wdXBjYWwnPjwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J2NhbGVuZGFyLW9wdGlvbnMnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT17ZXYuYWxsZGF5ID8gJ2NoZWNrYm94IGFjdGl2ZScgOiAnY2hlY2tib3gnfSBkYXRhLWFyZz0nYWxsZGF5JyBvbkNsaWNrPXt0aGlzLmhhbmRsZUNoZWNrYm94fT5BbGwgZGF5PC9sYWJlbD5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT17ZXYubXVsdGlkYXkgPyAnY2hlY2tib3ggYWN0aXZlJyA6ICdjaGVja2JveCd9IGRhdGEtYXJnPSdtdWx0aWRheScgb25DbGljaz17dGhpcy5oYW5kbGVDaGVja2JveH0+RGF0ZSByYW5nZTwvbGFiZWw+XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3NOYW1lPXtldi5hbGxkYXkgPyAnY3JlYXRlLXRpbWUgZGlzYWJsZWQnIDogJ2NyZWF0ZS10aW1lJ30gaHRtbEZvcj0nY3JlYXRlLXRpbWUtc3RhcnQtaG91cnMnPlN0YXJ0IHRpbWU8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nc2V0LXRpbWUnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzZWxlY3QgaWQ9J2NyZWF0ZS10aW1lLXN0YXJ0LWhvdXJzJyBvbkNoYW5nZT17dGhpcy5oYW5kbGVUaW1lfSB2YWx1ZT17bW9tZW50KGV2LnN0YXJ0KS5mb3JtYXQoJ0hIJyl9IGRpc2FibGVkPXtldi5hbGxkYXl9IGRhdGEtYXJnPSdzdGFydC1ob3Vycyc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7c3RhcnRIb3VyTGlzdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L3NlbGVjdD5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c2VsZWN0IGlkPSdjcmVhdGUtdGltZS1zdGFydC1taW51dGVzJyBvbkNoYW5nZT17dGhpcy5oYW5kbGVUaW1lfSB2YWx1ZT17bW9tZW50KGV2LnN0YXJ0KS5mb3JtYXQoJ21tJyl9IGRpc2FibGVkPXtldi5hbGxkYXl9IGRhdGEtYXJnPSdzdGFydC1taW51dGVzJz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHtzdGFydE1pbnV0ZUxpc3R9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9zZWxlY3Q+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT17ZXYuYWxsZGF5ID8gJ2NoZWNrYm94IGRpc2FibGVkJyA6IGV2LmVuZCAhPSAnJyA/ICdjaGVja2JveCBhY3RpdmUnIDogJ2NoZWNrYm94J30gaHRtbEZvcj0nY3JlYXRlLXRpbWUtZW5kLWhvdXJzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZUVuZFRpbWV9PkVuZCB0aW1lPC9sYWJlbD5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3NldC10aW1lJz5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c2VsZWN0IGlkPSdjcmVhdGUtdGltZS1lbmQtaG91cnMnIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVRpbWV9IHZhbHVlPXttb21lbnQoZXYuZW5kKS5mb3JtYXQoJ0hIJyl9IGRpc2FibGVkPXtldi5hbGxkYXkgPT0gdHJ1ZSB8fCBldi5lbmQgPT0gJyd9IGRhdGEtYXJnPSdlbmQtaG91cnMnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0e2VuZEhvdXJMaXN0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvc2VsZWN0PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzZWxlY3QgaWQ9J2NyZWF0ZS10aW1lLWVuZC1taW51dGVzJyBvbkNoYW5nZT17dGhpcy5oYW5kbGVUaW1lfSB2YWx1ZT17bW9tZW50KGV2LmVuZCkuZm9ybWF0KCdtbScpfSBkaXNhYmxlZD17ZXYuYWxsZGF5ID09IHRydWUgfHwgZXYuZW5kID09ICcnfSBkYXRhLWFyZz0nZW5kLW1pbnV0ZXMnPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0e2VuZE1pbnV0ZUxpc3R9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9zZWxlY3Q+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzTmFtZT0nY3JlYXRlLXRpbWUnIGh0bWxGb3I9J2NyZWF0ZS1yZWN1cnNpb24nPlJlY3Vyc2lvbjwvbGFiZWw+XHJcblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdzZXQtdGltZSc+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNlbGVjdCBpZD0nY3JlYXRlLXJlY3Vyc2lvbicgbmFtZT0ncmVjdXJzaW9uJyB2YWx1ZT17ZXYucmVjdXJzaW9ufSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9PlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PG9wdGlvbiB2YWx1ZT0nb25jZSc+T25jZTwvb3B0aW9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PG9wdGlvbiB2YWx1ZT0nbW9udGhseSc+TW9udGhseTwvb3B0aW9uPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PG9wdGlvbiB2YWx1ZT0neWVhcmx5Jz5ZZWFybHk8L29wdGlvbj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L3NlbGVjdD5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nZm9ybS1yb3cnPlx0XHJcblx0XHRcdFx0XHRcdFx0PGxhYmVsIGh0bWxGb3I9J2NyZWF0ZS1jYXRlZ29yeSc+Q2F0ZWdvcnk8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHRcdDxzZWxlY3QgaWQ9J2NyZWF0ZS1jYXRlZ29yeScgbmFtZT0nY2F0ZWdvcnknIHZhbHVlPXtldi5jYXRlZ29yeX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfT5cclxuXHRcdFx0XHRcdFx0XHRcdDxvcHRpb24gdmFsdWU9Jycga2V5PSdlbXB0eS1jYXQnPiA8L29wdGlvbj5cclxuXHRcdFx0XHRcdFx0XHRcdHtjYXRMaXN0fVxyXG5cdFx0XHRcdFx0XHRcdDwvc2VsZWN0PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdmb3JtLXJvdyc+XHRcclxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgaHRtbEZvcj0nY3JlYXRlLW5vdGUnPk5vdGU8L2xhYmVsPlxyXG5cdFx0XHRcdFx0XHRcdDx0ZXh0YXJlYSBpZD0nY3JlYXRlLW5vdGUnIG5hbWU9J25vdGUnIHZhbHVlPXtldi5ub3RlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9PjwvdGV4dGFyZWE+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cclxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzc05hbWU9J2J1dHRvbicgdHlwZT0nc3VibWl0JyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0+Q3JlYXRlPC9idXR0b24+XHJcblx0XHRcdFx0XHQ8L2Zvcm0+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e3RoaXMuc3RhdGUubG9hZGluZyA/ICdsb2FkaW5nIGFjdGl2ZScgOiAnbG9hZGluZyd9PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9J3NwaW5uZXInPjwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdClcclxuXHR9XHJcbn0gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9zcmMvY2FsZW5kYXItY3JlYXRlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==