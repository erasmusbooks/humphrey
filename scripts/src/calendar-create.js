import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import fullCalendar from 'fullcalendar';

export default class CalendarCreate extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			title: '',
			start: moment(),
			end: '',
			allday: true,
			multiday: false,
			category: '',
			recursion: 'once',
			note: '',
			loading: false
		};

		this.setDate = this.setDate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleTime = this.handleTime.bind(this);
		this.handleEndTime = this.handleEndTime.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {

		let that = this;

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
				if (that.state.multiday) {
					if (moment(date).isSame(that.state.start, 'day')) $(cell).addClass('selected start');
					if (moment(date).isSame(that.state.end, 'day')) $(cell).addClass('selected end');
					if (moment(date).isBetween(that.state.start, that.state.end)) $(cell).addClass('selected');
				} else {
					if (moment(that.state.start).isSame(date, 'day')) that.setDate(date);
				}
			},
			dayClick(date, jsEvent, view) {
				that.setDate(date);
			}
		});
	}

	setDate(date) {

		$('.fc-day').removeClass('selected start end');

		if (this.state.multiday) {
			if (moment(date).isBefore(this.state.start)) {
				if (this.state.end != '') {
					this.setState({ start: moment(date) }, () => {
						drawRange(this.state.start, this.state.end);
					});
				} else {
					this.setState({ start: moment(date), end: this.state.start }, () => {
						drawRange(this.state.start, this.state.end);
					});
				}
			} else if (moment(date).isBetween(this.state.start, this.state.end)) {
				this.setState({ start: moment(date) }, () => {
					drawRange(this.state.start, this.state.end);
				});
			} else if (moment(date).isAfter(this.state.start)) {
				this.setState({ end: moment(date) }, () => {
					drawRange(this.state.start, this.state.end);
				});
			}
		} else {					
			$('.fc-day[data-date=' + moment(date).format('YYYY-MM-DD') + ']').addClass('selected start end');
			this.setState({ start: moment(date), end: '' });
		}

		function drawRange (start, end) {
			let num = end.diff(start, 'days');
			for (var i = 0; i <= num; i++) {
				$('.fc-day[data-date=' + moment(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('selected');

				if (i == 0) $('.fc-day[data-date=' + moment(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('start');
				if (i == num) $('.fc-day[data-date=' + moment(start).add(i, 'days').format('YYYY-MM-DD') + ']').addClass('end');
			}
		}
	}

	handleChange(e) {
		let obj = {};
		obj[e.target.name] = e.target.value;
		this.setState(obj);
	}

	handleCheckbox(e) {
		let obj = {};
		if ($(e.target).hasClass('active')) {
			obj[e.target.dataset.arg] = false;
		} else { obj[e.target.dataset.arg] = true; 	}

		if (obj.multiday == true || this.state.multiday == true) obj['allday'] = true;
		if (obj.multiday == false || this.state.multiday == false) obj['end'] = '';
		if (obj.allday == true) obj['start'] = moment(this.state.start).set({'hour': 0, 'minute': 0});

		this.setState(obj, () => {
			if (obj.multiday == false) this.setDate(this.state.start);
		});
	}

	handleTime(e) {
		let start = moment(this.state.start),
			end = '',
			time = Number(e.target.value);

		if (this.state.end != '') end = moment(this.state.end);

		if (e.target.dataset.arg == 'start-hours') start = moment(start).set('hour', time);
		if (e.target.dataset.arg == 'start-minutes') start = moment(start).set('minute', time);
		if (e.target.dataset.arg == 'end-hours') end = moment(end).set('hour', time);
		if (e.target.dataset.arg == 'end-minutes') end = moment(end).set('minute', time);

		if (moment(end).isBefore(start)) return alert('Invalid time');

		this.setState({ start: start, end: end });
	}

	handleEndTime(e) {
		let start = this.state.start;

		if (this.state.end == '' && this.state.allday == false) {
			this.setState({ end: moment(start).add(1, 'hours') });
		} else {
			this.setState({ end: '' });
		}
	}

	handleSubmit(e) {
		e.preventDefault();

		if (this.state.title == '') return alert('Please enter a title');
		if (this.state.category == '') return alert('Please supply a category');

		this.setState({ loading: true }, () => {
			var ev = this.state;
			ev.start = moment(ev.start).format('X');
			if (ev.end) ev.end = moment(ev.end).format('X');		

			ev['reason'] = 'create';

			$.ajax({
				method: 'POST',
				url: document.baseURI + '/events',
				data: ev,
				dataType: 'json'
			}).done(response => {
				this.setState({ loading: false }, () => {
					this.props.cancelPopup();
					this.props.newEvent(response);
				});
			});
		})
	}

	render() {
		let ev = this.state,
			hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
			minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

		let startHourList = hours.map(hour => {
			return ( <option value={hour} key={'sh-' + hour}>{hour}</option> )
		});

		let startMinuteList = minutes.map(minute => {
			return ( <option value={minute} key={'sm-' + minute}>{minute}</option> )
		});	

		let endHourList = hours.map(hour => {
			if (hour >= moment(ev.start).format('HH')) {
				return ( <option value={hour} key={'eh-' + hour}>{hour}</option> )
			}			
		});

		let endMinuteList = minutes.map(minute => {
			return ( <option value={minute} key={'em-' + minute}>{minute}</option> )
		});

		let catList = this.props.categories.map(cat => {
			return ( <option value={cat.id} key={cat.id}>{cat.name}</option> )
		});

		return (
			<div id='calendar-create'>
				<header className='popup-header'>
					<div className='active'>Add</div>
					<div id='close-popup' onClick={this.props.cancelPopup}>&times;</div>
				</header>
				<div className='popup-body'>
					<form>

						<div className='form-row'>
							<label htmlFor='create-title'>Title</label>
							<input type='text' id='create-title' name='title' value={ev.title} onChange={this.handleChange} />
						</div>		

						<div className='form-row'>	
							<label htmlFor='create-date'>Date</label>
							<div className='calendar'>
								<div className='calendar-popupcal'></div>
								<div className='calendar-options'>
									
									<label className={ev.allday ? 'checkbox active' : 'checkbox'} data-arg='allday' onClick={this.handleCheckbox}>All day</label>
									<label className={ev.multiday ? 'checkbox active' : 'checkbox'} data-arg='multiday' onClick={this.handleCheckbox}>Date range</label>

									<label className={ev.allday ? 'create-time disabled' : 'create-time'} htmlFor='create-time-start-hours'>Start time</label>
									<div className='set-time'>
										<select id='create-time-start-hours' onChange={this.handleTime} value={moment(ev.start).format('HH')} disabled={ev.allday} data-arg='start-hours'>
											{startHourList}
										</select>
										<select id='create-time-start-minutes' onChange={this.handleTime} value={moment(ev.start).format('mm')} disabled={ev.allday} data-arg='start-minutes'>
											{startMinuteList}
										</select>
									</div>

									<label className={ev.allday ? 'checkbox disabled' : ev.end != '' ? 'checkbox active' : 'checkbox'} htmlFor='create-time-end-hours' onClick={this.handleEndTime}>End time</label>
									<div className='set-time'>
										<select id='create-time-end-hours' onChange={this.handleTime} value={moment(ev.end).format('HH')} disabled={ev.allday == true || ev.end == ''} data-arg='end-hours'>
											{endHourList}
										</select>
										<select id='create-time-end-minutes' onChange={this.handleTime} value={moment(ev.end).format('mm')} disabled={ev.allday == true || ev.end == ''} data-arg='end-minutes'>
											{endMinuteList}
										</select>
									</div>

									<label className='create-time' htmlFor='create-recursion'>Recursion</label>
									<div className='set-time'>
										<select id='create-recursion' name='recursion' value={ev.recursion} onChange={this.handleChange}>
											<option value='once'>Once</option>
											<option value='monthly'>Monthly</option>
											<option value='yearly'>Yearly</option>
										</select>
									</div>
								</div>
							</div>
						</div>

						<div className='form-row'>	
							<label htmlFor='create-category'>Category</label>
							<select id='create-category' name='category' value={ev.category} onChange={this.handleChange}>
								<option value='' key='empty-cat'> </option>
								{catList}
							</select>
						</div>

						<div className='form-row'>	
							<label htmlFor='create-note'>Note</label>
							<textarea id='create-note' name='note' value={ev.note} onChange={this.handleChange}></textarea>
						</div>

						<button className='button' type='submit' onClick={this.handleSubmit}>Create</button>
					</form>
				</div>
				<div className={this.state.loading ? 'loading active' : 'loading'}>
					<div className='spinner'></div>
				</div>
			</div>
		)
	}
} 