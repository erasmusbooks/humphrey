import $ from 'jquery';
import isbn from 'isbn-utils';

require('../../styles/main.less');

$(document).ready(() => {
	let where = $('body').data().where,
		sidebar = $('body .wrapper').hasClass('with-sidebar') ? where : '',
		menuItem;

	// SEARCH

	$('#header-search label').click(() => {
		$('#masthead').addClass('searching');
	});

	$('#header-search i').click(() => {
		$('#masthead').removeClass('searching');
		$('#header-search input').val('');
		$('#header-search #search-results').html('');
	});

	$('#header-search input').focusout(() => {
		let s = $('#header-search input').val();
		if (!s) {
			$('#masthead').removeClass('searching');
			$('#header-search #search-results').html('');
		}
	});

	$('#header-search').submit(e => {
		e.preventDefault();
	});

	let searchTimer;
	$('#header-search input#s').keypress(e => {

		if (e.which !== 0) {

			if ($('#header-search input#s').val().length > 1) {

				$('#search-results').html('<li class="loading"><span class="spinner"></span></li>');

				if (searchTimer) clearTimeout(searchTimer);

				searchTimer = setTimeout(() => {
					$.ajax({
						method: 'GET',
						url: $('#header-search').attr('action') + '?s=' + $('#header-search input#s').val(),
						dataType: 'json'
					}).done(response => {
						$('#header-search #search-results').html('');
						if (response.context == 'fail') {
							$('#search-results').html('<li class="fail">No results found for <strong>' + $('#header-search input#s').val() + '</strong></li>');
						} else if (response.context == 'success') {
							response.results.forEach((result, index) => {
								if (!result.excerpt) result.excerpt = '<em>No content</em>';

								let icon = '<span class="material-icons">weekend</span>'
								if (result.post_type == 'page') {
									icon = '<span class="material-icons">description</span>';
								} else if (result.post_type == 'post') {
									icon = '<span class="material-icons">feedback</span>'
								}

								let title = '<h3>' + result.title + '</h3>',
									time = '<time>' + result.time + '</time>',
									excerpt = '<div class="excerpt">' + result.excerpt + '</div>';

								let author = '<div class="author">' + result.avatar + '<div class="author-name">' + result.author.full_name + '</div><div class="author-description">' + result.author.description +'</div></div>';

								let contents = '<li class="result"><a href="' + result.permalink + '" title="' + result.title + '">' + icon + title + time + excerpt + author + '</a></li>'

								$('#search-results').append(contents);
							});
						}
					});
				}, 1000);
			}
		}
	});

	// PRIMARY NAVIGATION

	if ($('#primary-nav li').hasClass('current-page-ancestor')) menuItem = $('#primary-nav .current-page-ancestor');
	if ($('#primary-nav li').hasClass('current-menu-item')) menuItem = $('#primary-nav .current-menu-item');
	if ($('#primary-nav li').hasClass('current_page_parent')) menuItem = $('#primary-nav .current_page_parent');

	$('#primary-nav a, #header-user').click(function (e) {
		var target;
		
		if ($(this).attr('id') == 'header-user') {
			target = 'user';
		} else {
			target = $(this).text().toLowerCase();
		}


		if (target == 'docs' || target == 'tools' || target == 'user') {
			e.preventDefault();

			$('.menu-item').removeClass('current-menu-item');
			$('.menu-item').removeClass('current-page-ancestor');
			$('.menu-item').removeClass('current_page_parent');
			$(this).parent('.menu-item').addClass('current-menu-item');
			
			if (target != sidebar) {
				$('#main').addClass('vague');

				if (sidebar) {
					$('.wrapper').removeClass('with-sidebar');
					$('#sidebar .' + sidebar).fadeOut(250);
					$('#sidebar .' + sidebar).hide();

					setTimeout(() => {
						$('.wrapper').addClass('with-sidebar');
						$('#sidebar .' + target).fadeIn(250);
						sidebar = target;
					}, 250)

				} else {
					$('.wrapper').addClass('with-sidebar');
					$('#sidebar .' + target).fadeIn(250);
					sidebar = target;
				}

				if (target == where) $('#main').removeClass('vague');

			} else if (target == sidebar && target != where) {
				$('.wrapper').removeClass('with-sidebar');
				$('#sidebar .' + sidebar).fadeOut(250);
				$('#sidebar .' + sidebar).hide();
				$('#main').removeClass('vague');
				sidebar = '';

				if (menuItem) {
					$('.menu-item').removeClass('current-menu-item');
					$('.menu-item').removeClass('current-page-ancestor');
					$('.menu-item').removeClass('current_page_parent');
					menuItem.addClass('current-menu-item');

					if (menuItem.text().toLowerCase() == 'docs' || menuItem.text().toLowerCase() == 'tools') {

						setTimeout(() => {
							$('.wrapper').addClass('with-sidebar');
							$('#sidebar .' + menuItem.text().toLowerCase()).fadeIn(250);
							sidebar = menuItem.text().toLowerCase();
						}, 250)
					}
				} else {
					$('.menu-item').removeClass('current-menu-item');
					$('.menu-item').removeClass('current-page-ancestor');					
					$('.menu-item').removeClass('current_page_parent');					
				}
			}  
		}
	});

	// SECONDARY NAVIGATION

	$('.secondary-nav .page_item a').click(function (e) {
		let oldURL = window.location.href;

		if ($(this).parent().hasClass('page_item_has_children')) {
			e.preventDefault();
			if($(this).next('.children').hasClass('open')) {
				$(this).next('.children').slideUp('fast', () => {
					$(this).removeClass('open');
				});
			} else {
				$(this).next('.children').slideDown('fast', () => {
					$(this).addClass('open');
				});
			}

		}	else {
			e.preventDefault();
			$('.loader').addClass('active');
			$('#main').removeClass('vague');

			$('#main .content').load(e.target.href + ' #stuff', () => {

				if ($('.secondary-nav:visible').hasClass('docs')) {
					document.title = e.target.firstChild.data + ' \u2039 Docs \u2013 Humphrey';
					where = 'docs';
					$('body').attr('data-where', 'docs');
					$('#main .content').attr('id', 'docs');

				} else if ($('.secondary-nav:visible').hasClass('tools')) {
					document.title = e.target.firstChild.data + ' \u2039 Tools \u2013 Humphrey';
					where = 'tools';
					$('body').attr('data-where', 'tools');
					$('#main .content').attr('id', 'tools');
				}

				if (e.target.firstChild.data == 'Pricing help') {

					getRates($('#base-currency').val()); 
					if ($('#base-amount').val()) calcVAT($('#base-amount').val());
				}

				history.pushState({ ajaxLoaded: true, oldURL: oldURL }, null, e.target.href);	
				setTimeout(() => { $('.loader').removeClass('active');}, 600);
			});

			$('.secondary-nav li').removeClass('current_page_item current_page_ancestor current_page_parent');
			$(this).parent().addClass('current_page_item');

			if ($(this).parent().parent().hasClass('children')) $(this).parent().parent().parent('.page_item_has_children').addClass('current_page_ancestor current_page_parent');
		}
	});

	if (where == 'tools') {
		getRates($('#base-currency').val()); 
		if ($('#base-amount').val()) calcVAT($('#base-amount').val());
	}

});

// PRICING HELP

$(document).on('change', '#base-currency', () => { getRates($('#base-currency').val()) });

$(document).on('keyup', '#base-amount', e => { 
	$('.input-error').html('');
	let i = $('#base-amount').val();

	if (isNaN(i))  {
		$('#base-amount').css({'color': 'red', 'box-shadow': 'inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(255,0,0,0.6)', 'border-color': 'red'});
		$('.input-error').html('Not a valid number. Please use periods for decimal marks. For example: 999.99, not 999,99.').css('color', 'red');
		$('.calc, .twenty, .twenty-margin, .thirty, .thirty-margin, .fourty, .fourty-margin, .incl, .excl, .incl-margin, .excl-margin').html('');
	} else {
		$('#base-amount').attr('style', '');
		calcRates(i);
		calcVAT(i);
	}

});

$(document).on('submit', '#pricing-help', e => {
	e.preventDefault();
});

let curr;
function getRates (base) {
	$.getJSON('http://api.fixer.io/latest?base=' + base, data => {
		$('#' + base + ' .rate').html(1);
		$.each(data.rates, (key, value) => {
			$('#' + key + ' .rate').html(value);
		});
		curr = data.rates;

		if ($('#base-amount').val()) calcRates($('#base-amount').val());

		let updated = new Date(data.date);
		$('.last-updated').html('(last updated <strong>' + updated.toUTCString() + '</strong>)');
	});
}

function calcRates (amount) {
	$('tr').removeClass('active');
	$('#' + $('#base-currency').val()).addClass('active');
	$('#' + $('#base-currency').val() + ' .calc').html(Number(amount).toFixed(2));
	$('#' + $('#base-currency').val() + ' .twenty').html(Number(amount / .8).toFixed(2));
	$('#' + $('#base-currency').val() + ' .twenty-margin').html("<small>+" + ((amount / .8) - amount).toFixed(2) + "</small>");
	$('#' + $('#base-currency').val() + ' .thirty').html(Number(amount / .7).toFixed(2));
	$('#' + $('#base-currency').val() + ' .thirty-margin').html("<small>+" + ((amount / .7) - amount).toFixed(2) + "</small>");
	$('#' + $('#base-currency').val() + ' .fourty').html(Number(amount / .6).toFixed(2));
	$('#' + $('#base-currency').val() + ' .fourty-margin').html("<small>+" + ((amount / .6) - amount).toFixed(2) + "</small>");

	$.each(curr, (key, value) => {
		let num = amount * value;
		$('#' + key + ' .calc').html(num.toFixed(2));
		$('#' + key + ' .twenty').html((num / .8).toFixed(2));
		$('#' + key + ' .twenty-margin').html("<small>+" + ((num / .8) - num).toFixed(2) + "</small>");
		$('#' + key + ' .thirty').html((num / .7).toFixed(2));
		$('#' + key + ' .thirty-margin').html("<small>+" + ((num / .7) - num).toFixed(2) + "</small>");
		$('#' + key + ' .fourty').html((num / .6).toFixed(2));
		$('#' + key + ' .fourty-margin').html("<small>+" + ((num / .6) - num).toFixed(2) + "</small>");
	});
}

function calcVAT (i) {
	$("#four .incl").html((i / 1.04).toFixed(2));
	$("#four .excl").html((i * 1.04).toFixed(2));
	$("#four .incl-margin").html("<small>+" + (i - (i / 1.04)).toFixed(2) + "</small>");
	$("#four .excl-margin").html("<small>-" + ((i * 1.04) - i).toFixed(2) + "</small>");
	$("#five .incl").html((i / 1.05).toFixed(2));
	$("#five	.excl").html((i * 1.05).toFixed(2));
	$("#five .incl-margin").html("<small>+" + (i - (i / 1.05)).toFixed(2) + "</small>");
	$("#five	.excl-margin").html("<small>-" + ((i * 1.05) - i).toFixed(2) + "</small>");
	$("#fivehalf .incl").html((i / 1.055).toFixed(2));
	$("#fivehalf	.excl").html((i * 1.055).toFixed(2));
	$("#fivehalf .incl-margin").html("<small>+" + (i - (i / 1.055)).toFixed(2) + "</small>");
	$("#fivehalf	.excl-margin").html("<small>-" + ((i * 1.055) - i).toFixed(2) + "</small>");
	$("#six .incl").html((i / 1.06).toFixed(2));
	$("#six	.excl").html((i * 1.06).toFixed(2));
	$("#six .incl-margin").html("<small>+" + (i - (i / 1.06)).toFixed(2) + "</small>");
	$("#six	.excl-margin").html("<small>-" + ((i * 1.06) - i).toFixed(2) + "</small>");
	$("#seven .incl").html((i / 1.07).toFixed(2));
	$("#seven	.excl").html((i * 1.07).toFixed(2));
	$("#seven .incl-margin").html("<small>+" + (i - (i / 1.07)).toFixed(2) + "</small>");
	$("#seven	.excl-margin").html("<small>-" + ((i * 1.07) - i).toFixed(2) + "</small>");
	$("#ten .incl").html((i / 1.1).toFixed(2));
	$("#ten	.excl").html((i * 1.1).toFixed(2));
	$("#ten .incl-margin").html("<small>+" + (i - (i / 1.1)).toFixed(2) + "</small>");
	$("#ten	.excl-margin").html("<small>-" + ((i * 1.1) - i).toFixed(2) + "</small>");
	$("#nineteen .incl").html((i / 1.19).toFixed(2));
	$("#nineteen .excl").html((i * 1.19).toFixed(2));
	$("#nineteen .incl-margin").html("<small>+" + (i - (i / 1.19)).toFixed(2) + "</small>");
	$("#nineteen .excl-margin").html("<small>-" + ((i * 1.19) - i).toFixed(2) + "</small>");
	$("#twenty .incl").html((i / 1.2).toFixed(2));
	$("#twenty .excl").html((i * 1.2).toFixed(2));
	$("#twenty .incl-margin").html("<small>+" + (i - (i / 1.2)).toFixed(2) + "</small>");
	$("#twenty .excl-margin").html("<small>-" + ((i * 1.2) - i).toFixed(2) + "</small>");
	$("#twentyone .incl").html((i / 1.21).toFixed(2));
	$("#twentyone .excl").html((i * 1.21).toFixed(2));
	$("#twentyone .incl-margin").html("<small>+" + (i - (i / 1.21)).toFixed(2) + "</small>");
	$("#twentyone .excl-margin").html("<small>-" + ((i * 1.21) - i).toFixed(2) + "</small>");
}

$(document).on('keyup', '#isbn-input', e => {
	let payload = isbn.parse($('#isbn-input').val());

	if (payload) {
		$('#isbn10').html(payload.codes.isbn10);
		$('#isbn10h').html(payload.codes.isbn10h);
		$('#isbn13').html(payload.codes.isbn13);
		$('#isbn13h').html(payload.codes.isbn13h);
		$('#group').html(payload.codes.group + " (" + payload.codes.groupname + ")");
		$('#publisher').html(payload.codes.publisher);
	}
});

// SPLIT VAT

$(document).on("keyup", "#split-total-input, #split-vat-input", (e) => {
	var ttl = $("#split-total-input").val();
	var vat = $("#split-vat-input").val();

	$("#split-error").html("");
	$("#split-high").html("");
	$("#split-low").html("");

	if (ttl && vat) {
		if (isNaN(ttl) || isNaN(vat)) return $("#split-error").html("Not a valid VAT amount.");
		$("#split-high").html((((ttl * 0.06) - vat) / -0.15).toFixed(2));
		$("#split-low").html((ttl - ((ttl * 0.06 - vat) / -0.15)).toFixed(2));
	}
}); 

// CHATBOT

$(document).on('submit', '#chatbot', e => {
	e.preventDefault();

	let msg = $("#chatbot input").val();
	if (msg.length) {
		$('#chatbot ul').prepend('<li><div class="person">You</div><div class="message">' + msg +'</div></li>');
		$("#chatbot input").val('');

		if (eval(msg)) {
			$('#chatbot ul').prepend('<li><div class="person humphrey">Humphrey</div><div class="message">' + eval(msg) +'</div></li>');
		}
	}
});