var React = require('react');

var CalendarControls = require('./cal-controls.react.jsx'),
	CalendarMonthly = require('./cal-monthly.react.jsx'),
	CalendarStretch = require('./cal-stretch.react.jsx');
	
module.exports = React.createClass({
	render: function () {
		var CalendarPeriod;
		if (this.props.view == 'weekly') {

			CalendarPeriod = (
				<CalendarStretch 
					loading={this.props.loading}
					date={this.props.date}
					events={this.props.events}
					setPopup={this.props.setPopup}
					setDetail={this.props.setDetail} />
			)

		} else if (this.props.view == 'monthly') {

			CalendarPeriod = (
				<CalendarMonthly 
					loading={this.props.loading}
					date={this.props.date}
					events={this.props.events}
					setPopup={this.props.setPopup}
					setDetail={this.props.setDetail} />
			)

		}

		return (
			<section id='calendar-body'>
				<CalendarControls 
					date={this.props.date}
					view={this.props.view}
					user={this.props.user}
					setDate={this.props.setDate}
					setPopup={this.props.setPopup}
					handleAuth={this.props.handleAuth} />

				{CalendarPeriod}
			</section>
		)
	}
});