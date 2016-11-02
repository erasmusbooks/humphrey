var $ = require('jquery');

$(document).ready(function () {

	$(document).on('click', '.navigation a, .category-list li a, .archive-list li a', function (e) {
		e.preventDefault();
		var oldURL = window.location.href;

		$('.loader').addClass('active');

		$('#main .content').load(e.target.href + ' #news-wrapper', function() {

			$('.loader').removeClass('active');
			history.pushState({ ajaxLoaded: true, oldURL: oldURL }, null, e.target.href);	
		});
	});
});