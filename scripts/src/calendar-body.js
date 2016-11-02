import React from 'react';

import CalendarControls from './calendar-controls';
import CalendarMonthly from './calendar-monthly';
import CalendarStretch from './calendar-stretch';
	
export default class CalendarBody extends React.Component {

	render() {
		let CalendarPeriod;
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
}