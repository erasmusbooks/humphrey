import $ from 'jquery';

$(document).ready(() => {

	$(document).on('click', '.navigation a, .category-list li a, .archive-list li a', e => {
		e.preventDefault();
		let oldURL = window.location.href;

		$('.loader').addClass('active');

		$('#main .content').load(e.target.href + ' #news-wrapper', () => {

			$('.loader').removeClass('active');
			history.pushState({ ajaxLoaded: true, oldURL: oldURL }, null, e.target.href);	
		});
	});
});