var React = require('react'),
	$ = require('jquery'),
	_ = require('underscore'),
	moment = require('moment'),
	cookie = require('react-cookie');

var CalendarBody = require('./cal-body.react.jsx'),
	CalendarSidebar = require('./cal-sidebar.react.jsx'),
	CalendarDetail = require('./cal-detail.react.jsx'),
	CalendarCreate = require('./cal-create.react.jsx');

// var Router = require('react-router').Router,
// 	Route = require('react-router').Route;

var Calendar = React.createClass({
	getInitialState: function () {
		var now = moment();
		now['position'] = 0;
		var cookieView = cookie.load('view') || 'weekly';
		var cookieFilter = cookie.load('catFilter') || [];

		return {
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
		}
	},
	componentDidMount: function () {
		var self = this, now = moment();
		// if (this.props.params.period) {
		// 	if (this.state.view == 'weekly') {
		// 		now = moment().year(this.props.params.year).isoWeek(this.props.params.period);
		// 	} else if (this.state.view == 'monthly') {
		// 		now = moment().year(this.props.params.year).month(this.props.params.period);
		// 	}
		// }

		self.fetchCategories();
		self.handleDate(now);
		
		if (this.state.view == 'weekly') {
			document.title = moment(this.state.date).startOf('isoWeek').format('D') + '\u2013' + moment(this.state.date).endOf('isoWeek').format('D MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
		} else if (this.state.view == 'monthly') {
			document.title = moment(this.state.date).format('MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
		}

		// $(window).on('popstate', function (e) {
		// 	var pop;
		// 	if (this.state.view == 'weekly') {
		// 		pop = moment(e.originalEvent.target.location.pathname, '/YYYY/W').add(1, 'days');
		// 	} else if (this.state.view == 'monthly') {
		// 		pop = moment(e.originalEvent.target.location.pathname, '/YYYY/M');
		// 	}
		// 	self.handleDate(pop)
		// });
	
		// socket.emit('auth:handshake');
		// socket.on('fistbump', function (data) { self.setState({ user: data }) });
		
		// socket.on('message', function (data) { 
		// 	var msg;
		// 	if (data.m == 'create') msg = (<span>Event <em>{data.ev.title}</em> has succesfully been created.</span>); 
		// 	if (data.m == 'update') msg = (<span>Event <em>{data.ev.title}</em> has succesfully been updated.</span>);
		// 	if (data.m == 'remove') msg = (<span>Event <em>{data.ev.title}</em> has succesfully been removed.</span>);

		// 	self.setState({ message: { a: true, m: msg, o: data.o }}, function () {
		// 		if (data.o == 'success') {
		// 			setTimeout(function () { self.cancelMessage()	}, 5000)
		// 		}
		// 	});
		// });

		// socket.on('highfive', function (data) {
		// 	if (moment(data.ev.start).isSame(self.state.date, 'isoWeek')) {
		// 		var queue = self.state.queue, found = false, creations = [], updates = [], removals = [], createString, updateString, removeString;

		// 		found = _.find(queue, function (q) { return q.id == data.id && q.what == 'create' });

		// 		if (found && data.what == 'remove') {
		// 			queue = _.reject(queue, function (q) { return q.id == found.id });
		// 		} else {
		// 			queue.push(data);
		// 		}

		// 		if (queue.length > 0) {

		// 			queue.forEach(function (q) {
		// 				if (q.what == 'create') creations.push(q);
		// 				if (q.what == 'update') updates.push(q);
		// 				if (q.what == 'remove') removals.push(q);
		// 			});

		// 			if (creations.length > 0) createString = ( <span><strong>{creations.length}</strong> {creations.length > 1 ? 'events have' : 'event has'} been created. </span> );

		// 			if (updates.length > 0) updateString = ( <span><strong>{updates.length}</strong> {updates.length > 1 ? 'events have' : 'event has'} been updated. </span> );

		// 			if (removals.length > 0) removeString = ( <span><strong>{removals.length}</strong> {removals.length > 1 ? 'events have' : 'event has'} been removed. </span> );

		// 			var msg = (
		// 				<span>
		// 					{createString}
		// 					{updateString}
		// 					{removeString}
		// 					<a href='' onClick={self.refreshEvents}>Refresh</a>
		// 				</span>
		// 			);

		// 			self.setState({ queue: queue, message: { a: true, m: msg, o: 'warning' }})
		// 		} else {
		// 			self.cancelMessage();
		// 		}
		// 	}
		// });
	},
	fetchCategories: function () {
		var self = this, x = self.state.categories.length;
		$.ajax({
			method: 'GET',
			url: document.baseURI + '/events/?categories=1',
			dataType: 'json'
		}).done(function (categoryList) {
			var catList = _.sortBy(categoryList, 'name');
			self.setState({ categories: catList }, function () {
				if (x > 0) {

					self.fetchEvents(self.state.date, function (newEvents) {
						self.setState({ loading: false, events: newEvents });
					});
				}
			});
		});

	},
	fetchEvents: function (week, callback) {
		var self = this, 
			start = moment(week).startOf('isoWeek').format('X'), 
			end = moment(week).endOf('isoWeek').format('X'),
			catFilter = this.state.catFilter;

		if (self.state.view == 'monthly') {
			start = moment(week).startOf('month').subtract(15, 'days').format('X');
			end = moment(week).endOf('month').add(15, 'days').format('X');
		} 

		this.setState({ loading: true }, function () {

			$.ajax({
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
								ev.start = moment(ev.start, 'X');
								if (ev.end) ev.end = moment(ev.end, 'X');
							} else {
								ev.start = moment(ev.start, 'X').subtract(2, 'hours');
								if (ev.end) ev.end = moment(ev.end, 'X').subtract(2, 'hours');							
							}

							// if (ev.recursion == 'monthly') {
							// 	ev.start = moment(ev.start).month(month).year(year).format();
							// 	if (ev.end) ev.end = moment(ev.end).month(month).year(year).format();
							// } else if (ev.recursion == 'yearly') {
							// 	ev.start = moment(ev.start).year(year).format();
							// 	if (ev.end) ev.end = moment(ev.end).year(year).format();						
							// }
						});
					}, 100);

					setTimeout(function () { callback(data); }, 300);
				} else {
					setTimeout(function () { callback([]); }, 300);
				}

			});

			// socket.emit('events:fetch', obj, function (data) {
				

			// });
		});
		
	},
	refreshEvents: function (e) {
		e.preventDefault();
		var self = this;
		self.fetchEvents(self.state.date, function (newEvents) {
			self.cancelMessage();
			self.setState({ loading: false, events: newEvents}); 
		})
	},
	handleEventChange: function (ev) {
		var self = this, events = this.state.events;	
		this.fetchEvents(self.state.date, function (newEvents) {
			self.setState({ loading: false, events: newEvents });
		})
	},
	handleDate: function (newDate) {
		var self = this;
		// if (this.state.view == 'weekly') {
		// 	url = '/humphrey/calendar' + moment(newDate).format('/YYYY/W');
		// } else if (this.state.view == 'monthly') {
		// 	url = '/humphrey/calendar' + moment(newDate).format('/YYYY/M')
		// }

		// window.history.pushState(self.props.params, null, url);

		if (this.state.view == 'weekly' && moment(newDate).isoWeekday() == 1) newDate = moment(newDate).add(1, 'days');

		self.fetchEvents(newDate, function (newEvents) {
			self.setState({ loading: false, date: newDate, events: newEvents }, function () {
				
				if (self.state.view == 'weekly') {
					document.title = moment(newDate).startOf('isoWeek').format('D') + '\u2013' + moment(newDate).endOf('isoWeek').format('D MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
				} else if (self.state.view == 'monthly') {
					document.title = moment(newDate).format('MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
				}
			});
		});
	},
	handlePopup: function (arg) {
		this.setState({ popup: { a: true, p: arg }});
	},
	handleDetail: function (arg) {
		this.setState({ detail: arg });
	},
	cancelPopup: function () {
		var self = this, popup = this.state.popup;
		popup.a = false;
		self.setState({ popup: popup }, function () {
			setTimeout(function () {
				popup.p = false;
				self.setState({ popup: popup }, function () {
					if (self.state.message.o != 'success') {
						self.cancelMessage();	
					}
				});
			}, 1);
		});
	},
	cancelPopupClick: function (e) {
		var self = this, popup = this.state.popup;
		e.preventDefault();
		if (e.target.id == 'calendar-jacket' || e.target.id == 'close-popup') {
			popup.a = false;
			self.setState({ popup: popup }, function () {
				setTimeout(function () {
					popup.p = false;
					self.setState({ popup: popup, detail: false }, function () {
						if (self.state.message.o != 'success') {
							self.cancelMessage();	
						}
					});
				}, 251);
			});
		} 
	},
	cancelMessage: function (e) {
		var self = this, message = this.state.message;
		if (e) e.preventDefault();

		message.a = false;
		this.setState({ message: message }, function () {
			setTimeout(function () {
				message.m = false;
				message.o = false;
				self.setState({ message: message, queue: [] });
			}, 251)
		});
	},
	preventCancelPopup: function (e) {
		e.preventDefault();
	},
	toggleFilter: function (arg) {
		var self = this,
			cat = Number(arg),
			catFilter = this.state.catFilter,
			events = this.state.events,
			catIndex = catFilter.indexOf(cat);

		if (catIndex > -1) catFilter.splice(catIndex, 1);
		if (catIndex == -1) catFilter.push(cat);
		if (arg == 'clear') catFilter = [];

		events.forEach(function (ev) {
			ev.visible = true;
			if (catFilter.length > 0  && catFilter.indexOf(ev.category._id) == -1) ev.visible = false;
		});

		this.setState({ catFilter: catFilter, events: events }, function () {
			cookie.save('catFilter', catFilter);
		});
	},
	viewToggle: function (e) {
		e.preventDefault();
		var self = this, date = this.state.date, newView = 'weekly';

		if (this.state.view == 'weekly') newView = 'monthly';
				
		this.setState({ view: newView }, function () {
			self.handleDate(date);
			cookie.save('view', newView);
		});		
	},
	render: function () {
		var CalendarPopup;

		if (this.state.popup.p == 'detail') CalendarPopup = <CalendarDetail 
			user={this.state.user}
			detail={this.state.detail}
			categories={this.state.categories}
			cancelPopup={this.cancelPopup} 
			updateEvent={this.handleEventChange} />;

		if (this.state.popup.p == 'create') CalendarPopup = <CalendarCreate 
			user={this.state.user}
			cancelPopup={this.cancelPopup}
			categories={this.state.categories} 
			newEvent={this.handleEventChange} />;

		var CalendarMessage, messageClasses = 'calendar-message ';
		if (this.state.message.m) {
			CalendarMessage = (
				<span>
					<span className='content'>{this.state.message.m}</span>
					<a href='' className='close' onClick={this.cancelMessage}>&times;</a>
				</span>
			);
			messageClasses = messageClasses + this.state.message.o;
		}

		return (
			<div id='calendar-wrapper' className={this.state.message.a ? 'message' : ''}>

				<CalendarSidebar
					date={this.state.date}
					view={this.state.view}
					catFilter={this.state.catFilter}
					categories={this.state.categories}
					toggleFilter={this.toggleFilter}
					setDate={this.handleDate}
					viewToggle={this.viewToggle} />

				<CalendarBody
					date={this.state.date}
					view={this.state.view}
					events={this.state.events}
					loading={this.state.loading}
					user={this.state.user} 
					setDate={this.handleDate}
					setPopup={this.handlePopup}
					setDetail={this.handleDetail} />

				<div id='calendar-jacket' onClick={this.cancelPopupClick} className={this.state.popup.a ? 'active' : ''}>
					<div className={'calendar-popup ' + this.state.popup.p} onClick={this.preventCancelPopup}>
						{CalendarPopup}
					</div>
				</div>

				<div className={this.state.message.a ? messageClasses + ' active' : messageClasses}>
					{CalendarMessage}
				</div>
			</div>
		)
	}
});

React.render(<Calendar />, document.getElementById('calendar'));

// React.render(
// 	<Calendar />,
// 	document.getElementById('calendar')
// );