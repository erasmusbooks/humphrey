import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import fullCalendar from 'fullcalendar';

export default class CalendarUpdate extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			loading: false,
			detail: {
				title: '',
				start: '',
				end: '',
				allday: true,
				multiday: false,
				category: '',
				recursion: 'once',
				user: '',
				note: '',
			},
		}

		this.setDate = this.setDate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleTime = this.handleTime.bind(this);
		this.handleEndTime = this.handleEndTime.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {

		let that = this, detail = this.props.detail;
		detail.category = detail.category._id;
		detail.start = moment(detail.start);
		if (detail.end) detail.end = moment(detail.end);

		this.setState({ detail }, () => {

			$('.calendar-popupcal').fullCalendar({
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
				dayRender(date, cell) {
					$(cell).html('<span>' + moment(date).format('D') + '</span>');
					if (that.state.detail.multiday) {
						if (moment(date).isSame(that.state.detail.start, 'day')) $(cell).addClass('selected start');
						if (moment(date).isSame(that.state.detail.end, 'day')) $(cell).addClass('selected end');
						if (moment(date).isBetween(that.state.detail.start, that.state.detail.end)) $(cell).addClass('selected');
					} else {
						if (moment(that.state.detail.start).isSame(date, 'day')) $(cell).addClass('selected start end');
					}
				},
				dayClick(date, jsEvent, view) {
					that.setDate(date);
				}
			});
		});
	}

	setDate(date) {
		let detail = this.state.detail;
		$('.fc-day').removeClass('selected start end');

		if (this.state.detail.multiday) {
			if (moment(date).isBefore(this.state.detail.start)) {
				detail.start = moment(date);
			} else if (moment(date).isBetween(this.state.detail.start, this.state.detail.end)) {
				detail.start = moment(date);
			} else if (moment(date).isAfter(this.state.detail.start)) {
				detail.end = moment(date);
			}

			this.setState({ detail: detail }, () => {
				drawRange(this.state.detail.start, this.state.detail.end);
			});
		} else {					
			$('.fc-day[data-date=' + moment(date).format('YYYY-MM-DD') + ']').addClass('selected start end');
			detail.start = moment(date);
			detail.end = '';
			this.setState({ detail: detail });
		}

		function drawRange (start, end) {
			var num = moment(end).diff(start, 'days');
			for (var i = 0; i <= num; i++) {
				$('.fc-day[data-date=' + moment(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('selected');

				if (i == 0) $('.fc-day[data-date=' + moment(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('start');
				if (i == num) $('.fc-day[data-date=' + moment(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('end');
			}
		}
	}

	handleChange(e) {
		var detail = this.state.detail;
		detail[e.target.name] = e.target.value;
		this.setState({ detail: detail });
	}

	handleCheckbox(e) {
		let detail = this.state.detail;
		if ($(e.target).hasClass('active')) {
			detail[e.target.dataset.arg] = false;
		} else { detail[e.target.dataset.arg] = true; 	}

		if (detail.multiday == true || this.state.detail.multiday == true) detail['allday'] = true;
		if (detail.multiday == false || this.state.detail.multiday == false) detail['end'] = '';
		if (detail.allday == true) detail['start'] = moment(this.state.detail.start).set({'hour': 0, 'minute': 0});

		this.setState({ detail: detail }, () => {
			if (detail.multiday == false) this.setDate(this.state.detail.start);
		});
	}

	handleTime(e) {
		var detail = this.state.detail,
			time = Number(e.target.value);

		if (e.target.dataset.arg == 'start-hours') detail.start = moment(detail.start).set('hour', time);
		if (e.target.dataset.arg == 'start-minutes') detail.start = moment(detail.start).set('minute', time);
		if (e.target.dataset.arg == 'end-hours') detail.end = moment(detail.end).set('hour', time);
		if (e.target.dataset.arg == 'end-minutes') detail.end = moment(detail.end).set('minute', time);

		if (moment(detail.end).isBefore(detail.start)) return alert('Invalid time');

		this.setState({ detail: detail });
	}

	handleEndTime(e) {
		let detail = this.state.detail;

		if (detail.end == '' && detail.allday == false) {
			detail.end = moment(detail.start).add(1, 'hours');
		} else {
			detail.end = '';
		}

		this.setState({ detail: detail });
	}

	handleSubmit(e) {
		e.preventDefault();

		if (this.state.detail.title == '') return alert('Please enter a title');
		if (this.state.detail.category == '') return alert('Please supply a category');

		this.setState({ loading: true }, () => {

			let ev = this.state.detail;

			if (!ev.allday) {
				ev.start = moment(ev.start).add(2, 'hours').format('X');
				if (ev.end) ev.end = moment(ev.end).add(2, 'hours').format('X');	
			} else {
				ev.start = moment(ev.start).format('X');
				if (ev.end) ev.end = moment(ev.end).format('X');			
			}
		
			ev['reason'] = 'update';

			$.ajax({
				method: 'POST',
				url: '/humphrey/events',
				data: ev,
				dataType: 'json'
			}).done(response => {
				this.setState({ loading: false }, () => {
					this.props.cancelPopup();
					this.props.updateEvent(response);
				});
			});
		});
	}

	handleRemove(e) {
		e.preventDefault();

		if (confirm('Are you sure?')) {

		}
	}

	render() {
		let ev = this.state.detail,
			hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
			minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

		var startHourList = hours.map(hour => {
			return ( <option value={hour} key={'sh-' + hour}>{hour}</option> )
		});

		var startMinuteList = minutes.map(minute => {
			return ( <option value={minute} key={'sm-' + minute}>{minute}</option> )
		});	

		var endHourList = hours.map(hour => {
			if (hour >= moment(ev.start).format('HH')) {
				return ( <option value={hour} key={'eh-' + hour}>{hour}</option> )
			}			
		});

		var endMinuteList = minutes.map(minute => {
			return ( <option value={minute} key={'em-' + minute}>{minute}</option> )
		});

		var catList = this.props.categories.map(cat => {
			return ( <option value={cat.id} key={cat.id}>{cat.name}</option> )
		});

		return (
			<div className='popup-body'>
				<form>

					<div className='form-row'>
						<label htmlFor='update-title'>Title</label>
						<input type='text' id='update-title' name='title' value={ev.title} onChange={this.handleChange} />
					</div>		

					<div className='form-row'>	
						<label htmlFor='update-date'>Date</label>
						<div className='calendar'>
							<div className='calendar-popupcal'></div>
							<div className='calendar-options'>
								
								<label className={ev.allday ? 'checkbox active' : 'checkbox'} data-arg='allday' onClick={this.handleCheckbox}>All day</label>
								<label className={ev.multiday ? 'checkbox active' : 'checkbox'} data-arg='multiday' onClick={this.handleCheckbox}>Date range</label>

								<label className={ev.allday ? 'update-time disabled' : 'update-time'} htmlFor='update-time-start-hours'>Start time</label>
								<div className='set-time'>
									<select id='update-time-start-hours' onChange={this.handleTime} value={moment(ev.start).format('HH')} disabled={ev.allday} data-arg='start-hours'>
										{startHourList}
									</select>
									<select id='update-time-start-minutes' onChange={this.handleTime} value={moment(ev.start).format('mm')} disabled={ev.allday} data-arg='start-minutes'>
										{startMinuteList}
									</select>
								</div>

								<label className={ev.allday ? 'checkbox disabled' : ev.end != '' ? 'checkbox active' : 'checkbox'} htmlFor='update-time-end-hours' onClick={this.handleEndTime}>End time</label>
								<div className='set-time'>
									<select id='update-time-end-hours' onChange={this.handleTime} value={moment(ev.end).format('HH')} disabled={ev.allday == true || ev.end == ''} data-arg='end-hours'>
										{endHourList}
									</select>
									<select id='update-time-end-minutes' onChange={this.handleTime} value={moment(ev.end).format('mm')} disabled={ev.allday == true || ev.end == ''} data-arg='end-minutes'>
										{endMinuteList}
									</select>
								</div>

								<label className='update-time' htmlFor='update-recursion'>Recursion</label>
								<div className='set-time'>
									<select id='update-recursion' name='recursion' value={ev.recursion} onChange={this.handleChange}>
										<option value='once'>Once</option>
										<option value='monthly'>Monthly</option>
										<option value='yearly'>Yearly</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<div className='form-row'>	
						<label htmlFor='update-category'>Category</label>
						<select id='update-category' name='category' value={ev.category} onChange={this.handleChange}>
							{catList}
						</select>
					</div>

					<div className='form-row'>	
						<label htmlFor='update-note'>Note</label>
						<textarea id='update-note' name='note' value={ev.note} onChange={this.handleChange}></textarea>
					</div>

					<button className='button' type='submit' onClick={this.handleSubmit}>Update</button>
					<a href='' className='link' onClick={this.handleRemove}>Remove</a>
				</form>

				<div className={this.state.loading ? 'loading active' : 'loading'}>
					<div className='spinner'></div>
				</div>
			</div>
		)
	}
} 