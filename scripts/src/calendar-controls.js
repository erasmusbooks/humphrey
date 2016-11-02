import React from 'react';
import $ from 'jquery';
import moment from 'moment';

export default class CalendarControls extends React.Component {
	constructor(props) {
		super(props);
		
		this.setDate = this.setDate.bind(this);
		this.setPopup = this.setPopup.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	setDate(e) {
		e.preventDefault();
		this.props.setDate(moment(e.target.dataset.date, 'YYYY-MM-DD'));
	}

	setPopup(e) {
		e.preventDefault();
		this.props.setPopup(e.target.dataset.arg);
	}

	handleLogout(e) {
		e.preventDefault();
		this.props.handleAuth('logout');
	}

	render() {
		let prev,	next,	now = moment().format('YYYY-MM-DD'),
			loginButton, createButton, settingsButton,
			periodTitle, periodNum, periodNav,
			styles;

		if (this.props.view == 'weekly') {
			let startWeek = moment(this.props.date).startOf('isoWeek'),
				next = moment(this.props.date).add(7, 'days').format('YYYY-MM-DD'),
				prev = moment(this.props.date).subtract(7, 'days').format('YYYY-MM-DD');

			periodTitle = (
				<h1>{moment(this.props.date).startOf('isoWeek').format('D') + ' \u2013 ' + moment(this.props.date).endOf('isoWeek').format('D MMM YYYY')}</h1>
			);
			
			periodNum = (
				<span className='weekly-num' title={'Week ' + moment(this.props.date).format('W')}>
					<strong>{moment(this.props.date).format('W')}</strong>
				</span>
			);

			periodNav = (
				<div>
					<a href='' onClick={this.setDate} className='material-icons prev' data-date={prev} title={'Go to week ' + moment(this.props.date).subtract(1, 'weeks').format('W')}>arrow_back</a>
					{periodTitle} {periodNum}
					<a href='' onClick={this.setDate} className='material-icons next' data-date={next} title={'Go to week ' + moment(this.props.date).add(1, 'weeks').format('W')}>arrow_forward</a>
				</div>
			)

			if (moment().startOf('isoWeek').isSame(startWeek, 'week')) styles = { display: 'none'}

		} else if (this.props.view == 'monthly') {
			
			let next = moment(this.props.date).add(1, 'months').format('YYYY-MM-DD'),
				prev = moment(this.props.date).subtract(1, 'months').format('YYYY-MM-DD');

			periodTitle = <h1>{moment(this.props.date).format('MMMM YYYY')}</h1>

			periodNav = (
				<nav className='weekly-nav'>
					<a href='' onClick={this.setDate} className='material-icons prev' data-date={prev} title={'Go to ' + moment(this.props.date).subtract(1, 'months').format('MMMM YYYY')}>arrow_back</a>
					{periodTitle} {periodNum}
					<a href='' onClick={this.setDate} className='material-icons next' data-date={next} title={'Go to ' + moment(this.props.date).add(1, 'months').format('MMMM YYYY')}>arrow_forward</a>
				</nav>
			)
		
			if (moment().isSame(this.props.date, 'month')) styles = { display: 'none'}
		}


		if (!this.props.user) loginButton = <a href='' className='button' onClick={this.setPopup} data-arg='login'>Login</a>;
		if (this.props.user) loginButton = <a href='' className='button' onClick={this.handleLogout}>Logout</a>;
		if ($('#header-user').hasClass('publisher')) createButton = <a href='' className='button' onClick={this.setPopup} data-arg='create'>Add event</a>;
		
		return (
			<header id='calendar-controls'>
				
				<nav className='weekly-nav'>
					{periodNav}
				</nav>

				<div className='weekly-options'>
					<a href='' className='button today' onClick={this.setDate} data-date={now} style={styles}>Today</a>
					{createButton}
					{settingsButton}
				</div>
			</header>
		)
	}
}