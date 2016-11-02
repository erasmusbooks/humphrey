import React from 'react';
import moment from 'moment';
import $ from 'jquery';

import CalendarUpdate from './calendar-update';

export default class CalendarDetail extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			view: 'detail',
			loading: false,
			detail: {
				title: '',
				start: '',
				end: '',
				allday: true,
				multiday: false,
				category: { name: '', color: '', _id: '' },
				user: { name: { first: '', last: '' }, username: '', _id: '' },
				recursion: 'once',
				note: '',
			}
		}

		this.switchView = this.switchView.bind(this);
	}

	componentDidMount() {
		this.setState({ loading: true }, () => {

			$.ajax({
				method: 'GET',
				url: document.baseURI + '/events/?detail=' + this.props.detail,
				dataType: 'json'
			}).done(ev => {
				
				if (ev.allday) {
					ev.start = moment(ev.start, 'X');
					if (ev.end) {
						ev.end = moment(ev.end, 'X');
						if (!moment(ev.start).isSame(ev.end, 'day')) ev['multiday'] = true;
					}
				} else {
					ev.start = moment(ev.start, 'X').subtract(2, 'hours');
					if (ev.end) ev.end = moment(ev.end, 'X').subtract(2, 'hours');			
				}
				this.setState({ detail: ev, loading: false });
			});

		})
	}

	switchView(e) {
		e.preventDefault();
		this.setState({ view: e.target.dataset.arg });
	}

	render() {
		let detail = this.state.detail,
			currentView, updateButton,
			dateString, durationString;

		if (detail.start && detail.end && detail.allday) {
			dateString = (
				<span className='detail-time'>
					<time>{moment(detail.start).format('ddd. D MMMM YYYY')}</time> &ndash; <time>{moment(detail.end).format('ddd. D MMMM YYYY')}</time>
				</span>
			);
			durationString = (
				<small className='detail-duration'>
					{moment(detail.end).diff(detail.start, 'days') + 1} days
				</small>
			);
		} else if (detail.start && !detail.end && detail.allday) {
			dateString = (
				<span className='detail-time'>
					<time>{moment(detail.start).format('ddd. D MMMM YYYY')}</time>
				</span>
			);
			durationString = (
				<small className='detail-duration'>1 day</small>
			);
		} else if (detail.start && detail.end && !detail.allday) {
			dateString = (
				<span className='detail-time'>
					<time>{moment(detail.start).format('ddd. D MMMM YYYY')}, {moment(detail.start).format('H:mm')} &ndash; {moment(detail.end).format('H:mm')}</time>
				</span>
			);

			if (moment(detail.end).diff(detail.start, 'minutes') > 180) {
				durationString = (
					<small className='detail-duration'>{moment(detail.end).diff(detail.start, 'hours')} hours</small>
				);
			} else {
				durationString = (
					<small className='detail-duration'>{moment(detail.end).diff(detail.start, 'minutes')} minutes</small>
				);
			}
		} else if (detail.start && !detail.end && !detail.allday) {
			dateString = (
				<span className='detail-time'>
					<time>{moment(detail.start).format('ddd. D MMMM YYYY')}, {moment(detail.start).format('H:mm')}</time>
				</span>
			);
		} 

		if (this.state.view == 'detail') {
			currentView = (
				<div className='popup-body' style={{paddingTop: '2em'}}>
					<div className='cat-stripe' style={{backgroundColor: detail.category.color}}></div>
					
					<dl className='detail-list'>
						
						<div className='dl-row'>
							<dd>Title</dd>
							<dt><strong>{detail.title}</strong></dt>
						</div>

						<div className='dl-row'>
							<dd>Date</dd>
							<dt>{dateString} {durationString}</dt>
						</div>

						<div className='dl-row'>
							<dd>Category</dd>
							<dt><i style={{backgroundColor: detail.category.color}}></i> {detail.category.name}</dt>
						</div>

						<div className={detail.recursion != 'once' ? 'dl-row' : 'dl-row hide'}>
							<dd>Recursion</dd> 
							<dt style={{ textTransform: 'capitalize' }}>{detail.recursion}</dt>
						</div>

						<div className={detail.note ? 'dl-row' : 'dl-row hide'}>
							<dd>Note</dd>
							<dt>{detail.note}</dt>
						</div>

						<div className='dl-row'>
							<dd>Author</dd>
							<dt>
								{detail.user.name.first} {detail.user.name.last} <small>{moment(detail.added).fromNow()}</small>
							</dt>
						</div>
					</dl>
				</div>
			)
		}

		if (this.state.view == 'update') {
			currentView = <CalendarUpdate 
				categories={this.props.categories}
				detail={this.state.detail}
				cancelPopup={this.props.cancelPopup}
				updateEvent={this.props.updateEvent} />
		}

		if ($('#header-user').hasClass('publisher') || this.props.user._id == detail.user._id) {
			updateButton = <div className={this.state.view == 'update' ? 'active' : ''} onClick={this.switchView} data-arg='update'>Update</div>
		}

		return (
			<div id='calendar-settings'>
				<header className='popup-header'>
					<div className={this.state.view == 'detail' ? 'active' : ''} onClick={this.switchView} data-arg='detail'>Detail</div>
					{updateButton}
					<div id='close-popup' onClick={this.props.cancelPopup}>&times;</div>
				</header>
				{currentView}
				<div className={this.state.loading ? 'loading active' : 'loading'}>
					<div className='spinner'></div>
				</div>
			</div>
		)
	}
}