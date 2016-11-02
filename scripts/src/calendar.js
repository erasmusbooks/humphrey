import React from 'react';
import ReactDOM from 'react-dom';
import ReactCookie from 'react-cookie';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

import CalendarBody from './calendar-body';
import CalendarSidebar from './calendar-sidebar';
import CalendarDetail from './calendar-detail';
import CalendarCreate from './calendar-create';

class Calendar extends React.Component {

	constructor(props) {

		super(props);

		let now = moment(),
			cookieView = ReactCookie.load('view') || 'weekly',
			cookieFilter = ReactCookie.load('catFilter') || [];

		now['position'] = 0;

		this.state = {
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

		this.fetchCategories = this.fetchCategories.bind(this);
		this.fetchEvents = this.fetchEvents.bind(this);
		this.refreshEvents = this.refreshEvents.bind(this);
		this.handleEventChange = this.handleEventChange.bind(this);
		this.handleDate = this.handleDate.bind(this);
		this.handlePopup = this.handlePopup.bind(this);
		this.handleDetail = this.handleDetail.bind(this);
		this.cancelPopup = this.cancelPopup.bind(this);
		this.cancelPopupClick = this.cancelPopupClick.bind(this);
		this.cancelMessage = this.cancelMessage.bind(this);
		this.preventCancelPopup = this.preventCancelPopup.bind(this);
		this.toggleFilter = this.toggleFilter.bind(this);
		this.viewToggle = this.viewToggle.bind(this);
	}

	componentDidMount() {
		let now = moment();

		this.fetchCategories();
		this.handleDate(now);
		
		if (this.state.view == 'weekly') {
			document.title = moment(this.state.date).startOf('isoWeek').format('D') + '\u2013' + moment(this.state.date).endOf('isoWeek').format('D MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
		} else if (this.state.view == 'monthly') {
			document.title = moment(this.state.date).format('MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
		}
	}

	fetchCategories() {
		let x = this.state.categories.length;

		$.ajax({
			method: 'GET',
			url: document.baseURI + '/events/?categories=1',
			dataType: 'json'
		}).done(categoryList => {
			
			let catList = _.sortBy(categoryList, 'name');

			this.setState({ categories: catList }, () => {
				if (x > 0) {

					this.fetchEvents(this.state.date, newEvents => {
						this.setState({ loading: false, events: newEvents });
					});
				}
			});
		});

	}

	fetchEvents(week, callback) {
		let start = moment(week).startOf('isoWeek').format('X'), 
			end = moment(week).endOf('isoWeek').format('X'),
			catFilter = this.state.catFilter;

		if (this.state.view == 'monthly') {
			start = moment(week).startOf('month').subtract(15, 'days').format('X');
			end = moment(week).endOf('month').add(15, 'days').format('X');
		} 

		this.setState({ loading: true }, () => {

			$.ajax({
				method: 'GET',
				url: document.baseURI + '/events/?start=' + start + '&end=' + end,
				dataType: 'json'
			}).done(data => {

				if (Array.isArray(data)) {

					setTimeout(() => {

						data.forEach(ev => {

							ev['visible'] = true;
							if (catFilter.length > 0 && catFilter.indexOf(ev.category._id) == -1) ev.visible = false;

							if (ev.allday) {
								ev.start = moment(ev.start, 'X');
								if (ev.end) ev.end = moment(ev.end, 'X');
							} else {
								ev.start = moment(ev.start, 'X').subtract(2, 'hours');
								if (ev.end) ev.end = moment(ev.end, 'X').subtract(2, 'hours');
							}
						});
					}, 100);

					setTimeout(function () { callback(data); }, 300);
				} else {
					setTimeout(function () { callback([]); }, 300);
				}
			});
		});
		
	}

	refreshEvents(e) {
		e.preventDefault();

		this.fetchEvents(this.state.date, newEvents => {
			this.cancelMessage();
			this.setState({ loading: false, events: newEvents}); 
		})
	}

	handleEventChange(ev) {
		let events = this.state.events;	
		this.fetchEvents(this.state.date, newEvents => {
			this.setState({ loading: false, events: newEvents });
		})
	}

	handleDate(newDate) {

		if (this.state.view == 'weekly' && moment(newDate).isoWeekday() == 1) newDate = moment(newDate).add(1, 'days');

		this.fetchEvents(newDate, newEvents => {
			this.setState({ loading: false, date: newDate, events: newEvents }, () => {
				
				if (this.state.view == 'weekly') {
					document.title = moment(newDate).startOf('isoWeek').format('D') + '\u2013' + moment(newDate).endOf('isoWeek').format('D MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
				} else if (this.state.view == 'monthly') {
					document.title = moment(newDate).format('MMMM YYYY') + ' \u2039 Calendar \u2013 Humphrey';
				}
			});
		});
	}

	handlePopup(arg) {
		this.setState({ popup: { a: true, p: arg }});
	}

	handleDetail(arg) {
		this.setState({ detail: arg });
	}

	cancelPopup() {
		let popup = this.state.popup;
		popup.a = false;

		this.setState({ popup: popup }, () => {

			setTimeout(() => {
				popup.p = false;

				this.setState({ popup: popup }, () => {
					if (this.state.message.o != 'success') this.cancelMessage();
				});
			}, 1);
		});
	}

	cancelPopupClick(e) {
		e.preventDefault();
		let popup = this.state.popup;

		if (e.target.id == 'calendar-jacket' || e.target.id == 'close-popup') {
			popup.a = false;
			
			this.setState({ popup: popup }, () => {

				setTimeout(() => {
					popup.p = false;
					
					this.setState({ popup: popup, detail: false }, () => {
						if (this.state.message.o != 'success') {
							this.cancelMessage();	
						}
					});
				}, 251);
			});
		} 
	}

	cancelMessage(e) {
		if (e) e.preventDefault();
		let message = this.state.message;

		message.a = false;
		this.setState({ message: message }, () => {
			setTimeout(() => {
				message.m = false;
				message.o = false;
				this.setState({ message: message, queue: [] });
			}, 251)
		});
	}

	preventCancelPopup(e) { e.preventDefault(); }

	toggleFilter(arg) {
		let cat = Number(arg),
			catFilter = this.state.catFilter,
			events = this.state.events,
			catIndex = catFilter.indexOf(cat);

		if (catIndex > -1) catFilter.splice(catIndex, 1);
		if (catIndex == -1) catFilter.push(cat);
		if (arg == 'clear') catFilter = [];

		events.forEach(ev => {
			ev.visible = true;
			if (catFilter.length > 0  && catFilter.indexOf(ev.category._id) == -1) ev.visible = false;
		});

		this.setState({ catFilter: catFilter, events: events }, () => {
			ReactCookie.save('catFilter', catFilter);
		});
	}

	viewToggle(e) {
		e.preventDefault();
		let date = this.state.date, newView = 'weekly';

		if (this.state.view == 'weekly') newView = 'monthly';
				
		this.setState({ view: newView }, () => {
			this.handleDate(date);
			ReactCookie.save('view', newView);
		});		
	}
	
	render() {
		let CalendarPopup;

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
}

ReactDOM.render(<Calendar />, document.getElementById('calendar'));