import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

export default class CalendarDay extends React.Component {

	constructor(props) {
		super(props);
		
		this.clickDay = this.clickDay.bind(this);
		this.clickEvent = this.clickEvent.bind(this);
		this.mouseEnterEvent = this.mouseEnterEvent.bind(this);
		this.mouseLeaveEvent = this.mouseLeaveEvent.bind(this);
	}

	clickDay(e) {
		$('.day, .event').removeClass('active');
		$('.day[data-date=' + e.target.dataset.date + '], .event[data-date=' + e.target.dataset.date + ']').addClass('active');
	}

	clickEvent(e) {
		$('.day, .event').removeClass('active');
		$('.day[data-date=' + e.target.dataset.date + '], .event[data-date=' + e.target.dataset.date + ']').addClass('active');
		this.props.setPopup('detail');
		this.props.setDetail(e.target.dataset.eventid);
	}

	mouseEnterEvent(e) {
		$('.event.event-' + e.target.dataset.eventid).addClass('hover');
	}

	mouseLeaveEvent(e) {
		$('.event').removeClass('hover');
	}

	render() {
		let now = moment(),
			dataset = this.props.dataset,
			dayNumber;

		if (dataset.weekday == 'wkd') {
			let num = Number(moment(dataset.start).format('D'))
			dayNumber = (
				<span className='sat-sun'>
					<span className='saturday'>{num}</span>
					<span className='seperator'>/</span>
					<span className='sunday'>{num + 1}</span>
				</span>
			)
		} else {
			dayNumber = <span className='workday'>{moment(dataset.start).format('D')}</span>
		}

		dataset.alldays = _.sortBy(dataset.alldays, 'pos');
		let alldays = dataset.alldays.map((ev, index) => {
			let style = { backgroundColor: ev.category.color }
			style.top = (ev.pos * 25);

			let classes = 'event event-' + ev._id;
			if (moment(ev.start).isBefore(dataset.start)) classes = classes + ' yesterday';
			if (ev.end && moment(ev.end).isAfter(dataset.end)) classes = classes + ' tomorrow';

			return (
				<li className={classes} 
					style={style}
					key={ev._id + moment(ev.start).format()}
					title={ev.title}
					onMouseEnter={this.mouseEnterEvent}
					onMouseLeave={this.mouseLeaveEvent}
					onClick={this.clickEvent}
					data-eventid={ev._id}
					data-date={moment(dataset.start).format('YYYY-MM-DD')}>
				 
					<span className='event-title'>{ev.title}</span>
				</li>
			)
		});

		let highestAllday = _.max(dataset.alldays, ev => { return ev.pos });

		let alldaysHeight = { height: (((Number(highestAllday.pos) || 0) + 1 ) * 25) + 5 }

		let singles = dataset.singles.map((ev, index) => {
						
			let time = <time className='event-time' dateTime={ev.start}>{moment(ev.start).format('HH:mm')}</time>;
			if (ev.end) time = <time className='event-time' dateTime={ev.start}>{moment(ev.start).format('HH:mm')} &ndash; {moment(ev.end).format('HH:mm')}</time>

			let weekendDay = '';
			if (dataset.weekday == 'wkd') {
				weekendDay = <span className='event-weekend'>{moment(ev.start).format('ddd')}</span>;
			}

			return (
				<li className='event' 
					key={ev._id + moment(ev.start).format()}
					title={ev.title}
					onClick={this.clickEvent}
					data-eventid={ev._id}
					data-date={moment(dataset.start).format('YYYY-MM-DD')}>
					<i style={{ backgroundColor: ev.category.color }}></i>
					{time}{weekendDay}
					<span className='event-title'>{ev.title}</span>
				</li>
			)
		});

		return (
			<li className={moment(now).isBetween(dataset.start, dataset.end) ? 'today active day ' + dataset.weekday : 'day ' + dataset.weekday }
				onClick={this.clickDay}
				data-date={moment(dataset.start).format('YYYY-MM-DD')}>
				<div className='day-number'>
					{dayNumber}
				</div>
				<div className='day-name'>{dataset.weekday}</div>

				<div className={'event-container ' + dataset.weekday}>
					<ul className='alldays' style={alldaysHeight}>{alldays}</ul>
					<ul className='singles'>{singles}</ul>
				</div>
			</li>
		)
	}
}