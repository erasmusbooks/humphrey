import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

import CalendarWeek from './calendar-week';

export default class CalendarStretch extends React.Component {
	
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

		if (moment(newDate).isSame(oldDate, 'isoWeek')) {
			newDate.position = ' same-week';
		} else if (moment(newDate).isBefore(oldDate)) {
			newDate.position = ' new-left';
		} else if (moment(newDate).isAfter(oldDate)) {
			newDate.position = ' new-right';
		}

		dates.push(newDate);
		this.setState({ dates }, () => {

			if (moment(oldDate).isSame(newDate, 'isoWeek')) {
				var newDates = _.reject(this.state.dates, date => {
					return date.position == 0;
				});
				this.setState({ dates: newDates });
				return;
			}

			setTimeout(() => {
				if (moment(newDate).isBefore(oldDate)) {
					$('.week[data-week='+ moment(oldDate).startOf('isoweek').format("YYYY-ww") +']').addClass('old-right');
					$('.week[data-week='+ moment(newDate).startOf('isoweek').format("YYYY-ww") +']').removeClass('new-left old-left new-right old-right');
				}
				if (moment(newDate).isAfter(oldDate)) {
					$('.week[data-week='+ moment(oldDate).startOf('isoweek').format("YYYY-ww") +']').addClass('old-left');
					$('.week[data-week='+ moment(newDate).startOf('isoweek').format("YYYY-ww") +']').removeClass('new-left old-left new-right old-right');

				}
			}, 1);

			setTimeout(() => {
				var newDates = _.reject(this.state.dates, date => {
					return moment(oldDate).isSame(date, 'isoWeek')
				});
				this.setState({ dates: newDates });
			}, 400);
		});
	}

	render() {	
		let weekList = this.state.dates.map(date => {
			let weekNum = moment(date).format('YYYY-ww');
			return (
				<CalendarWeek 
					date={date} 
					events={this.props.events}
					key={weekNum}
					setPopup={this.props.setPopup}
					setDetail={this.props.setDetail} />
			)
		});

		return (
			<div id='calendar-weekly'>
				{weekList}
				<div className={this.props.loading ? 'loader active' : 'loading'}>
					<div className='spinner'></div>
				</div> 
			</div>
		)
	}
}