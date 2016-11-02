import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import fullCalendar from 'fullcalendar';

export default class CalendarMinical extends React.Component {
	componentDidMount() {
		let that = this, now = moment();

		$('#calendar-minical').fullCalendar({
			firstDay: 1,
			header: {
				left: '',
				center: 'prev title next',
				right: ''
			},
			buttonIcons: false,
			buttonText: {
				prev: '\u2039',
				next: '\u203A'
			},
			dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
			dayClick(date, jsEvent, view) {
				$('thead tr').removeClass('display-week');
				$('thead td[data-date=' + moment(date).format('YYYY-MM-DD') + ']').parent().addClass('display-week');
				var clickDate = moment(date).format('YYYY-MM-DD');
				that.props.setDate(moment(clickDate, 'YYYY-MM-DD'));
			},
			dayRender(date, cell) {
				if (moment(date).isSame(that.props.date, 'day')) $('thead td[data-date=' + moment(date).format('YYYY-MM-DD') + ']').parent().addClass('display-week');
				if (moment(date).isSame(now, 'day')) $('thead td[data-date=' + moment(date).format('YYYY-MM-DD') + ']').html('<span>' + moment(date).format('D') + '</span>');
			},
		});

	}

	componentWillReceiveProps(nextProps) {

		$('#calendar-minical').fullCalendar('gotoDate', nextProps.date);
		if (!moment(nextProps.date).isSame(this.props.date, 'week')) {
			$('thead tr').removeClass('display-week');
			$('thead td[data-date=' + moment(nextProps.date).format('YYYY-MM-DD') + ']').parent().addClass('display-week');
		}
	}

	render() {
		return (
			<div id='calendar-minical'></div>
		)
	}
}