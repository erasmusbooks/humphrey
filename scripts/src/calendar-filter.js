import React from 'react';
import moment from 'moment';

export default class CalendarFilter extends React.Component {	

	constructor(props) {
		super(props);
		
		this.toggleFilter = this.toggleFilter.bind(this);
	}

	toggleFilter(e) {
		e.preventDefault();
		this.props.toggleFilter(e.target.id);
	}

	render() {
		let categoryList = this.props.categories.map(cat => {
			return (
				<li className='category' key={cat.id}>
					<label className={this.props.catFilter.indexOf(cat.id) > -1 ? 'checkbox active' : 'checkbox'} onClick={this.toggleFilter} id={cat.id} title={cat.name} key={'filter-' + cat.id}>
						<i style={{backgroundColor: cat.color}}></i>	{cat.name}
					</label>
				</li>
			)
		});

		return (
			<ul id='calendar-filter'>
				{categoryList}
				<li className='clear-filter' style={this.props.catFilter.length > 0 ? {} : { display: 'none' }}>
					<a href='' onClick={this.toggleFilter} id='clear'>Clear filters</a>
				</li>
			</ul>
		)
	}
}