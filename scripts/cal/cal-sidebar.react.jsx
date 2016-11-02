var React = require('react'),
	$ = require('jquery'),
	moment = require('moment'),
	fullCal = require('fullcalendar');

var CalendarFilter = require('./cal-filter.react.jsx'),
	CalendarMinical = require('./cal-minical.react.jsx'),
	CalendarYearcal = require('./cal-yearcal.react.jsx');

module.exports = React.createClass({
	render: function () {
		var miniView, viewSwitch;

		if (this.props.view == 'weekly') {
			miniView = <CalendarMinical	
				date={this.props.date}
				setDate={this.props.setDate} />

			viewSwitch = <a href='' onClick={this.props.viewToggle}>Switch to <u>Monthly view</u></a>;
		} else if (this.props.view == 'monthly') {
			miniView = <CalendarYearcal
				date={this.props.date}
				setDate={this.props.setDate} />

			viewSwitch = <a href='' onClick={this.props.viewToggle}>Switch to <u>Weekly view</u></a>;
		}

		return (
			<aside id='calendar-sidebar'>
				{miniView}
				
				<CalendarFilter 
					categories={this.props.categories}
					catFilter={this.props.catFilter}
					toggleFilter={this.props.toggleFilter} />

				<div id='calendar-viewtoggle'>
					{viewSwitch}
				</div>

			</aside>
		)
	}
});