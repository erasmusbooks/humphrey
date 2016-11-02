import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

import CalendarMonth from './calendar-month';

export default class CalendarMonthly extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = { 
			dates: [],
			events: [] 
		}
	}

	componentWillReceiveProps(nextProps) {
		let dates = this.state.dates,
			oldDate = this.props.date,
			newDate = nextProps.date;

		if (_.isEqual(oldDate, newDate) && this.props.events == nextProps.events) return;

		if (moment(newDate).isSame(oldDate, 'month')) {
			newDate.position = ' same-month';
		} else if (moment(newDate).isBefore(oldDate)) {
			newDate.position = ' new-left';
		} else if (moment(newDate).isAfter(oldDate)) {
			newDate.position = ' new-right';
		}

		dates.push(newDate);
		this.setState({ dates: dates }, () => {

			if (moment(oldDate).isSame(newDate, 'month')) {
				let newDates = _.reject(this.state.dates, date => {
					return date.position == 0;
				});
				this.setState({ dates: newDates });
				return;
			}

			setTimeout(() => {
				if (moment(newDate).isBefore(oldDate)) {
					$('.calendar-month#'+ moment(oldDate).format("YYYY-MM")).addClass('old-right');
					$('.calendar-month#'+ moment(newDate).format("YYYY-MM")).removeClass('new-left old-left new-right old-right');
				}
				if (moment(newDate).isAfter(oldDate)) {
					$('.calendar-month#'+ moment(oldDate).format("YYYY-MM")).addClass('old-left');
					$('.calendar-month#'+ moment(newDate).format("YYYY-MM")).removeClass('new-left old-left new-right old-right');
				}
			}, 1);

			setTimeout(() => {
				let newDates = _.reject(this.state.dates, date => {
					return moment(oldDate).isSame(date, 'month')
				});
				this.setState({ dates: newDates });
			}, 400);
		});
	}
	
	render() {	
		let	monthList = this.state.dates.map((date, index) => {
			let monthNum = moment(date).format('YYYY-MM');
			
			return (
				<CalendarMonth 
					date={date} 
					events={this.props.events}
					key={monthNum}
					setPopup={this.props.setPopup}
					setDetail={this.props.setDetail} />
			)
		});

		return (
			<div id='calendar-monthly'>
				{monthList}
				<div className={this.props.loading ? 'loader active' : 'loader'}>
					<div className='spinner'></div>
				</div> 
			</div>
		)
	}
}