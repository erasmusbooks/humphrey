import React from 'react';
import moment from 'moment';
import _ from 'underscore';

import CalendarDay from './calendar-day';

export default class CalendarWeek extends React.Component {

	render() {
		let startWeek = moment(this.props.date).startOf('isoWeek'),
			weekdays = [
				{ name: 'mon', column: [] },
				{ name: 'tue', column: [] },
				{ name: 'wed', column: [] },	
				{ name: 'thu', column: [] },
				{ name: 'fri', column: [] },
				{ name: 'wkd', column: [] }
			];
			
		function happensToday (ev, day) {
			if (moment(ev.start).isBetween(day.start, day.end)) return true;
			if (ev.end && moment(ev.end).isBetween(day.start, day.end)) return true;
			if (ev.end && moment(ev.start).isBefore(day.start) && moment(ev.end).isAfter(day.end)) return true;
			if (ev.end && moment(ev.end).isBefore(day.start)) return false;
			if (moment(ev.start).isAfter(day.end)) return false;
		}

		let events = _.filter(this.props.events, ev => { return ev.visible });
		events = _.sortBy(events, 'start');
		let x;

		for (x in events) {
			if (events[x].allday == true) {
				
				events[x].pos = -1;
				let day, i;

				for (i in weekdays) {
					day = {
						start: moment(startWeek).add(i, 'days').startOf('day').format(),
						end: moment(startWeek).add(i, 'days').endOf('day').format(),
					};
					if (weekdays[i].name == 'wkd') day.end = moment(startWeek).add(6, 'days').endOf('day').format();

					if (events[x].pos > -1) {

						weekdays[i].column[events[x].pos] = (happensToday(events[x], day)) ? events[x]._id : 'empty';

					} else {

						if (happensToday(events[x], day)) {
							let fill = false, j;
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
		events = _.sortBy(events, 'pos');

		let dataset = weekdays.map((weekday, index) => {
			let day = {
				start: moment(startWeek).add(index, 'days').startOf('day').format(),
				end: moment(startWeek).add(index, 'days').endOf('day').format(),
				weekday: weekday.name,
				alldays: [],
				singles: []
			};

			if (weekday.name == 'wkd') day.end = moment(startWeek).add(6, 'days').endOf('day').format();

			events.forEach(ev => {
				if (moment(ev.start).isBetween(day.start, day.end)) {
					if (ev.allday) day.alldays.push(ev); 
					if (!ev.allday) day.singles.push(ev); 
				}

				if (ev.allday && ev.end) {
					if (moment(ev.end).isBetween(day.start, day.end)) {
						day.alldays.push(ev);
					} else	if (moment(ev.start).isBefore(day.start) && moment(ev.end).isAfter(day.end)) {
						day.alldays.push(ev);
					}
				}
			});

			return day;
		});

		let weekList = dataset.map((day, index) => {
			return (
				<CalendarDay 
					dataset={day}
					key={moment(day.start).format()}
					setPopup={this.props.setPopup} 
					setDetail={this.props.setDetail} />
			)
		});

		return (
			<ul 
				className={'week ' + this.props.date.position} 
				data-week={moment(startWeek).format('YYYY-ww')}>
					{weekList}
			</ul>
		)
	}
}