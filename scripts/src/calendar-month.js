import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import fullCalendar from 'fullcalendar';

export default class CalendarMonth extends React.Component {

	componentDidMount() {
		let that = this, monthId = moment(this.props.date).format('YYYY-MM'), now = moment();

		let correctedEvents = this.props.events;
		correctedEvents.forEach(ev => {
			if (ev.allday && ev.end) ev.end = moment(ev.end).add(1, 'days').format();
			if (!ev.allday) {
				ev.start = ev.start = moment(ev.start).format();
				if (ev.end) ev.end = ev.end = moment(ev.end).format();
			}
		}); 

		$('#' + monthId).fullCalendar({
			firstDay: 1,
			header: false,
			dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
			events(start, end, timezone, callback) {
				let events = _.filter(correctedEvents, function (ev) { return ev.visible; });
				callback(events);
			},
			dayRender(date, cell) {
				$(cell).prepend('<span class="bling"></span>')
			},
			eventRender(event, element) {
				if (event.allday) {
					$(element).addClass('allday');
					$(element).css('background-color', event.category.color);
					$(element).attr('title', event.title);
				} else {
					let time = moment(event.start).format('HH:mm');
					if (event.end) time = moment(event.start).format('HH:mm') + ' \u2013 '  + moment(event.end).format('HH:mm');

					$(element).addClass('single');
					$(element).prepend('<span class="category" style="background-color:' + event.category.color +'"></span><time>' + time + '</time>');
					$(element).attr('title', time + ', ' + event.title);
				}
			},
			eventClick(event, jsEvent, view) {
				that.props.setDetail(event._id);
				that.props.setPopup('detail');
			}
		});
		
		$('#' + monthId).fullCalendar('gotoDate', that.props.date);

		setTimeout(() => {
			$('#calendar-monthly').css('min-height', $('#' + monthId).height());
		}, 1);
	}

	componentWillReceiveProps(nextProps) {
		let monthId = moment(this.props.date).format('YYYY-MM');
		$('#' + monthId).fullCalendar('refetchEvents');

		setTimeout(() => {
			$('#calendar-monthly').css('min-height', $('#' + monthId).height());
		}, 1);
	}

	render() {
		return (
			<div className={'calendar-month ' + this.props.date.position}
				id={moment(this.props.date).format('YYYY-MM')} />
		)
	}
}