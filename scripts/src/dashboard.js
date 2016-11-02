import $ from 'jquery';
import moment from 'moment';

function dashTime () {
	let now = moment();

	document.getElementById('dash-weekday').innerHTML = now.format('dddd');
	document.getElementById('dash-dayno').innerHTML = now.format('D');
	document.getElementById('dash-monthyear').innerHTML = now.format('MMMM YYYY');
	document.getElementById('dash-week').innerHTML = 'Week ' + now.format('W');
	document.getElementById('dash-time').innerHTML = now.format('HH:mm');
}

$(document).ready(() => {
		dashTime();
		setInterval(() => { dashTime() }, 60000);

		$('.dash-loader').addClass('active');

		let now = moment().format('E'), today = moment(), tomorrow = moment().add(1, 'days');

		if (now == 5) {
			tomorrow = moment().add(3, 'days');
		} else if (now == 6) {
			today = moment().add(2, 'days');
			tomorrow = moment().add(3, 'days');
		} else if (now == 7) {
			today = moment().add(1, 'days');
			tomorrow = moment().add(2, 'days');
		}

		$('#dash-today h3').text(now == today.format('E') ? 'Today' : today.format('dddd'));
		$('#dash-tomorrow h3').text((now + 1) == tomorrow.format('E') ? 'Tomorrow' : tomorrow.format('dddd'));

		$.ajax({
			method: 'GET',
			url: document.baseURI + '/events/?start=' + today.startOf('day').format('X') + '&end=' + tomorrow.endOf('day').format('X'),
			dataType: 'json'
		}).done(data => {

			if (Array.isArray(data)) {

				data.forEach(ev => {
					ev['visible'] = true;
					
					if (ev.allday) {
						ev.start = moment(ev.start, 'X');
						if (ev.end) ev.end = moment(ev.end, 'X');
					} else {
						ev.start = moment(ev.start, 'X').subtract(2, 'hours');
						if (ev.end) ev.end = moment(ev.end, 'X').subtract(2, 'hours');		
					}
				});

				setTimeout(() => { 
					$('.dash-loader').remove();
					$('.dash-events').addClass('active');
				}, 300);


			} else {

				setTimeout(() => { 
					$('.dash-loader').remove();
					$('.dash-events').addClass('active');
				}, 300);
			}

		});
});