import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import CalendarFilter from './calendar-filter';
import CalendarMinical from './calendar-minical';
import CalendarYearcal from './calendar-yearcal';

export default class CalendarSidebar extends React.Component {

	render() {
		let miniView, viewSwitch;

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
}