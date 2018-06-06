import $ from 'jquery'
import isbn from 'isbn-utils'
import moment from 'moment'

require('../../styles/main.less')

$(document).ready(() => {
	let where = $('body').data().where,
		sidebar = $('body .wrapper').hasClass('with-sidebar') ? where : '',
		menuItem

	// SEARCH

	$('#header-search label').click(() => {
		$('#masthead').addClass('searching')
	})

	$('#header-search i').click(() => {
		$('#masthead').removeClass('searching')
		$('#header-search input').val('')
		$('#header-search #search-results').html('')
	})

	$('#header-search input').focusout(() => {
		let s = $('#header-search input').val()
		if (!s) {
			$('#masthead').removeClass('searching')
			$('#header-search #search-results').html('')
		}
	})

	$('#header-search').submit(e => {
		e.preventDefault()
	})

	let searchTimer
	$('#header-search input#s').keypress(e => {
		if (e.which !== 0) {
			if ($('#header-search input#s').val().length > 1) {
				$('#search-results').html(
					'<li class="loading"><span class="spinner"></span></li>'
				)

				if (searchTimer) clearTimeout(searchTimer)

				searchTimer = setTimeout(() => {
					$.ajax({
						method: 'GET',
						url:
							$('#header-search').attr('action') +
							'?s=' +
							$('#header-search input#s').val(),
						dataType: 'json'
					}).done(response => {
						$('#header-search #search-results').html('')
						if (response.context == 'fail') {
							$('#search-results').html(
								'<li class="fail">No results found for <strong>' +
									$('#header-search input#s').val() +
									'</strong></li>'
							)
						} else if (response.context == 'success') {
							response.results.forEach((result, index) => {
								if (!result.excerpt) result.excerpt = '<em>No content</em>'

								let icon = '<span class="material-icons">weekend</span>'
								if (result.post_type == 'page') {
									icon = '<span class="material-icons">description</span>'
								} else if (result.post_type == 'post') {
									icon = '<span class="material-icons">feedback</span>'
								}

								let title = '<h3>' + result.title + '</h3>',
									time = '<time>' + result.time + '</time>',
									excerpt = '<div class="excerpt">' + result.excerpt + '</div>'

								let author =
									'<div class="author">' +
									result.avatar +
									'<div class="author-name">' +
									result.author.full_name +
									'</div><div class="author-description">' +
									result.author.description +
									'</div></div>'

								let contents =
									'<li class="result"><a href="' +
									result.permalink +
									'" title="' +
									result.title +
									'">' +
									icon +
									title +
									time +
									excerpt +
									author +
									'</a></li>'

								$('#search-results').append(contents)
							})
						}
					})
				}, 1000)
			}
		}
	})

	// PRIMARY NAVIGATION

	if ($('#primary-nav li').hasClass('current-page-ancestor'))
		menuItem = $('#primary-nav .current-page-ancestor')
	if ($('#primary-nav li').hasClass('current-menu-item'))
		menuItem = $('#primary-nav .current-menu-item')
	if ($('#primary-nav li').hasClass('current_page_parent'))
		menuItem = $('#primary-nav .current_page_parent')

	$('#primary-nav a, #header-user').click(function(e) {
		var target

		if ($(this).attr('id') == 'header-user') {
			target = 'user'
		} else {
			target = $(this).text().toLowerCase()
		}

		if (target == 'docs' || target == 'tools' || target == 'user') {
			e.preventDefault()

			$('.menu-item').removeClass('current-menu-item')
			$('.menu-item').removeClass('current-page-ancestor')
			$('.menu-item').removeClass('current_page_parent')
			$(this).parent('.menu-item').addClass('current-menu-item')

			if (target != sidebar) {
				$('#main').addClass('vague')

				if (sidebar) {
					$('.wrapper').removeClass('with-sidebar')
					$('#sidebar .' + sidebar).fadeOut(250)
					$('#sidebar .' + sidebar).hide()

					setTimeout(() => {
						$('.wrapper').addClass('with-sidebar')
						$('#sidebar .' + target).fadeIn(250)
						sidebar = target
					}, 250)
				} else {
					$('.wrapper').addClass('with-sidebar')
					$('#sidebar .' + target).fadeIn(250)
					sidebar = target
				}

				if (target == where) $('#main').removeClass('vague')
			} else if (target == sidebar && target != where) {
				$('.wrapper').removeClass('with-sidebar')
				$('#sidebar .' + sidebar).fadeOut(250)
				$('#sidebar .' + sidebar).hide()
				$('#main').removeClass('vague')
				sidebar = ''

				if (menuItem) {
					$('.menu-item').removeClass('current-menu-item')
					$('.menu-item').removeClass('current-page-ancestor')
					$('.menu-item').removeClass('current_page_parent')
					menuItem.addClass('current-menu-item')

					if (
						menuItem.text().toLowerCase() == 'docs' ||
						menuItem.text().toLowerCase() == 'tools'
					) {
						setTimeout(() => {
							$('.wrapper').addClass('with-sidebar')
							$('#sidebar .' + menuItem.text().toLowerCase()).fadeIn(250)
							sidebar = menuItem.text().toLowerCase()
						}, 250)
					}
				} else {
					$('.menu-item').removeClass('current-menu-item')
					$('.menu-item').removeClass('current-page-ancestor')
					$('.menu-item').removeClass('current_page_parent')
				}
			}
		}
	})

	// SECONDARY NAVIGATION

	$('.secondary-nav .page_item a').click(function(e) {
		let oldURL = window.location.href

		if ($(this).parent().hasClass('page_item_has_children')) {
			e.preventDefault()
			if ($(this).next('.children').hasClass('open')) {
				$(this).next('.children').slideUp('fast', () => {
					$(this).removeClass('open')
				})
			} else {
				$(this).next('.children').slideDown('fast', () => {
					$(this).addClass('open')
				})
			}
		} else {
			e.preventDefault()
			$('.loader').addClass('active')
			$('#main').removeClass('vague')

			$('#main .content').load(e.target.href + ' #stuff', () => {
				if ($('.secondary-nav:visible').hasClass('docs')) {
					document.title =
						e.target.firstChild.data + ' \u2039 Docs \u2013 Humphrey'
					where = 'docs'
					$('body').attr('data-where', 'docs')
					$('#main .content').attr('id', 'docs')
				} else if ($('.secondary-nav:visible').hasClass('tools')) {
					document.title =
						e.target.firstChild.data + ' \u2039 Tools \u2013 Humphrey'
					where = 'tools'
					$('body').attr('data-where', 'tools')
					$('#main .content').attr('id', 'tools')
				}

				if (e.target.firstChild.data == 'Pricing help') {
					fetchRates($('#base-currency').val())
					if ($('#base-amount').val()) calcVAT($('#base-amount').val())
				}

				history.pushState(
					{ ajaxLoaded: true, oldURL: oldURL },
					null,
					e.target.href
				)
				setTimeout(() => {
					$('.loader').removeClass('active')
				}, 600)
			})

			$('.secondary-nav li').removeClass(
				'current_page_item current_page_ancestor current_page_parent'
			)
			$(this).parent().addClass('current_page_item')

			if ($(this).parent().parent().hasClass('children'))
				$(this)
					.parent()
					.parent()
					.parent('.page_item_has_children')
					.addClass('current_page_ancestor current_page_parent')
		}
	})

	if (where == 'tools') {
		fetchRates($('#base-currency').val() || 'EUR')
		if ($('#base-amount').val()) calcVAT($('#base-amount').val())
	}
})

// PRICING HELP

$(document).on('change', '#base-currency', () => {
	fetchRates($('#base-currency').val())
})

$(document).on('keyup', '#base-amount', e => {
	$('.input-error').html('')
	let i = $('#base-amount').val()

	if (isNaN(i)) {
		$('#base-amount').css({
			color: 'red',
			'box-shadow':
				'inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(255,0,0,0.6)',
			'border-color': 'red'
		})
		$('.input-error')
			.html(
				'Not a valid number. Please use periods for decimal marks. For example: 999.99, not 999,99.'
			)
			.css('color', 'red')
		$(
			'.calc, .twenty, .twenty-margin, .thirty, .thirty-margin, .fourty, .fourty-margin, .incl, .excl, .incl-margin, .excl-margin'
		).html('')
	} else {
		$('#base-amount').attr('style', '')
		calcRates(i)
		calcVAT(i)
	}
})

$(document).on('submit', '#pricing-help', e => {
	e.preventDefault()
})

let curr = {}
function fetchRates(base) {
	const b = document.getElementsByTagName('base')[0].href
	$.getJSON(b + '/wp-json/curr/newest', data => {
		const z = 1 / data.rates[base]

		$.each(data.rates, (key, value) => {
			$('#' + key + ' .rate').html(parseFloat((value * z).toFixed(5)))
			curr[key] = value * z
		})

		if ($('#base-amount').val()) calcRates($('#base-amount').val())

		let updated = new Date(data.date)
		$('.last-updated').html(
			'(last updated <strong>' + updated.toUTCString() + '</strong>)'
		)
	})
}

function calcRates(amount) {
	$('tr').removeClass('active')
	$('#' + $('#base-currency').val()).addClass('active')
	$('#' + $('#base-currency').val() + ' .calc').html(Number(amount).toFixed(2))
	$('#' + $('#base-currency').val() + ' .twenty').html(
		Number(amount / 0.8).toFixed(2)
	)
	$('#' + $('#base-currency').val() + ' .twenty-margin').html(
		'<small>+' + (amount / 0.8 - amount).toFixed(2) + '</small>'
	)
	$('#' + $('#base-currency').val() + ' .thirty').html(
		Number(amount / 0.7).toFixed(2)
	)
	$('#' + $('#base-currency').val() + ' .thirty-margin').html(
		'<small>+' + (amount / 0.7 - amount).toFixed(2) + '</small>'
	)
	$('#' + $('#base-currency').val() + ' .fourty').html(
		Number(amount / 0.6).toFixed(2)
	)
	$('#' + $('#base-currency').val() + ' .fourty-margin').html(
		'<small>+' + (amount / 0.6 - amount).toFixed(2) + '</small>'
	)

	$.each(curr, (key, value) => {
		let num = amount * value
		$('#' + key + ' .calc').html(num.toFixed(2))
		$('#' + key + ' .twenty').html((num / 0.8).toFixed(2))
		$('#' + key + ' .twenty-margin').html(
			'<small>+' + (num / 0.8 - num).toFixed(2) + '</small>'
		)
		$('#' + key + ' .thirty').html((num / 0.7).toFixed(2))
		$('#' + key + ' .thirty-margin').html(
			'<small>+' + (num / 0.7 - num).toFixed(2) + '</small>'
		)
		$('#' + key + ' .fourty').html((num / 0.6).toFixed(2))
		$('#' + key + ' .fourty-margin').html(
			'<small>+' + (num / 0.6 - num).toFixed(2) + '</small>'
		)
	})
}

function calcVAT(i) {
	$('#four .incl').html((i / 1.04).toFixed(2))
	$('#four .excl').html((i * 1.04).toFixed(2))
	$('#four .incl-margin').html(
		'<small>+' + (i - i / 1.04).toFixed(2) + '</small>'
	)
	$('#four .excl-margin').html(
		'<small>-' + (i * 1.04 - i).toFixed(2) + '</small>'
	)
	$('#five .incl').html((i / 1.05).toFixed(2))
	$('#five	.excl').html((i * 1.05).toFixed(2))
	$('#five .incl-margin').html(
		'<small>+' + (i - i / 1.05).toFixed(2) + '</small>'
	)
	$('#five	.excl-margin').html(
		'<small>-' + (i * 1.05 - i).toFixed(2) + '</small>'
	)
	$('#fivehalf .incl').html((i / 1.055).toFixed(2))
	$('#fivehalf	.excl').html((i * 1.055).toFixed(2))
	$('#fivehalf .incl-margin').html(
		'<small>+' + (i - i / 1.055).toFixed(2) + '</small>'
	)
	$('#fivehalf	.excl-margin').html(
		'<small>-' + (i * 1.055 - i).toFixed(2) + '</small>'
	)
	$('#six .incl').html((i / 1.06).toFixed(2))
	$('#six	.excl').html((i * 1.06).toFixed(2))
	$('#six .incl-margin').html(
		'<small>+' + (i - i / 1.06).toFixed(2) + '</small>'
	)
	$('#six	.excl-margin').html(
		'<small>-' + (i * 1.06 - i).toFixed(2) + '</small>'
	)
	$('#seven .incl').html((i / 1.07).toFixed(2))
	$('#seven	.excl').html((i * 1.07).toFixed(2))
	$('#seven .incl-margin').html(
		'<small>+' + (i - i / 1.07).toFixed(2) + '</small>'
	)
	$('#seven	.excl-margin').html(
		'<small>-' + (i * 1.07 - i).toFixed(2) + '</small>'
	)
	$('#ten .incl').html((i / 1.1).toFixed(2))
	$('#ten	.excl').html((i * 1.1).toFixed(2))
	$('#ten .incl-margin').html(
		'<small>+' + (i - i / 1.1).toFixed(2) + '</small>'
	)
	$('#ten	.excl-margin').html(
		'<small>-' + (i * 1.1 - i).toFixed(2) + '</small>'
	)
	$('#nineteen .incl').html((i / 1.19).toFixed(2))
	$('#nineteen .excl').html((i * 1.19).toFixed(2))
	$('#nineteen .incl-margin').html(
		'<small>+' + (i - i / 1.19).toFixed(2) + '</small>'
	)
	$('#nineteen .excl-margin').html(
		'<small>-' + (i * 1.19 - i).toFixed(2) + '</small>'
	)
	$('#twenty .incl').html((i / 1.2).toFixed(2))
	$('#twenty .excl').html((i * 1.2).toFixed(2))
	$('#twenty .incl-margin').html(
		'<small>+' + (i - i / 1.2).toFixed(2) + '</small>'
	)
	$('#twenty .excl-margin').html(
		'<small>-' + (i * 1.2 - i).toFixed(2) + '</small>'
	)
	$('#twentyone .incl').html((i / 1.21).toFixed(2))
	$('#twentyone .excl').html((i * 1.21).toFixed(2))
	$('#twentyone .incl-margin').html(
		'<small>+' + (i - i / 1.21).toFixed(2) + '</small>'
	)
	$('#twentyone .excl-margin').html(
		'<small>-' + (i * 1.21 - i).toFixed(2) + '</small>'
	)
}

$(document).on('keyup', '#isbn-input', e => {
	let payload = isbn.parse($('#isbn-input').val())

	if (payload) {
		$('#isbn10').html(payload.codes.isbn10)
		$('#isbn10h').html(payload.codes.isbn10h)
		$('#isbn13').html(payload.codes.isbn13)
		$('#isbn13h').html(payload.codes.isbn13h)
		$('#group').html(payload.codes.group + ' (' + payload.codes.groupname + ')')
		$('#publisher').html(payload.codes.publisher)
	}
})

// SPLIT VAT

$(document).on('keyup', '#split-total-input, #split-vat-input', e => {
	var ttl = $('#split-total-input').val()
	var vat = $('#split-vat-input').val()

	$('#split-error').html('')
	$('#split-high').html('')
	$('#split-low').html('')

	if (ttl && vat) {
		if (isNaN(ttl) || isNaN(vat))
			return $('#split-error').html('Not a valid VAT amount.')
		$('#split-high').html(((ttl * 0.06 - vat) / -0.15).toFixed(2))
		$('#split-low').html((ttl - (ttl * 0.06 - vat) / -0.15).toFixed(2))
	}
})

// CHATBOT

var msgHistory = [],
	msgHistoryPos = -1

$(document).on('keypress', '#humphreybot input', e => {
	if (msgHistory.length > 0) {
		if (e.keyCode == 38 && msgHistoryPos + 1 < msgHistory.length) {
			$('#humphreybot input').val(msgHistory[msgHistoryPos + 1])
			msgHistoryPos = msgHistoryPos + 1
		} else if (e.keyCode == 40 && msgHistoryPos > -1) {
			$('#humphreybot input').val(msgHistory[msgHistoryPos - 1])
			msgHistoryPos = msgHistoryPos - 1
		}
	}
})

$(document).on('submit', '#humphreybot', e => {
	e.preventDefault()

	const msg = $('#humphreybot input').val()
	msgHistory.unshift(msg)

	if (msg.length) {
		$('#humphreybot ul').append(
			'<li class="command-line"><span class="material-icons">chevron_right</span><div class="user-input">' +
				msg +
				'</div></li>'
		)
		$('#humphreybot input').val('')

		$(window).scrollTop(
			$('#humphreybot').offset().top +
				$('#humphreybot').outerHeight() -
				window.innerHeight
		)

		$('#humphreybot .command-line.bottom').css('visibility', 'hidden')

		const msgArray = msg.split(' ')
		const msgFirst = msgArray[0].toLowerCase()

		if (
			msgFirst == 'ph' ||
			msgFirst == 'price' ||
			msgFirst == 'c' ||
			msgFirst == 'curr' ||
			msgFirst == 'currency'
		) {
			if (!msgArray[1]) {
				hbReply(
					'Unable to process <strong>' +
						msg +
						'</strong> input. To use Pricing Help, please provide base amount and currency: <kbd>c 16.50 usd</kbd> or <kbd>c sgd 99 myr</kbd>.'
				)
			} else {
				let baseCurr = isNaN(msgArray[1])
					? msgArray[1].toUpperCase()
					: msgArray[2] == undefined
						? 'EUR'
						: isNaN(msgArray[2]) ? msgArray[2].toUpperCase() : null
				let baseAmount = isNaN(msgArray[2]) ? msgArray[1] : msgArray[2]
				let convCurr = false

				if (msgArray[3]) convCurr = msgArray[3].toUpperCase()

				const b = document.getElementsByTagName('base')[0].href
				$.getJSON(b + '/wp-json/curr/newest', data => {
					const z = 1 / data.rates[baseCurr]
					var baseRates = {}
					$.each(data.rates, (key, value) => {
						baseRates[key] = value * z
					})
					var calcRates

					if (convCurr) {
						calcRates = [baseCurr, convCurr]
					} else if (msgArray[2] == undefined) {
						calcRates = ['EUR', 'USD', 'GBP']
					} else {
						calcRates = [
							'EUR',
							'USD',
							'GBP',
							'AUD',
							'BRL',
							'CAD',
							'CHF',
							'CNY',
							'JPY',
							'ZAR'
						]
					}

					if (calcRates.indexOf(baseCurr) < 0) calcRates.push(baseCurr)

					var tableContents = ''

					calcRates.forEach(i => {
						var tableActive = i == baseCurr ? 'active' : ''

						var calc00 = (baseAmount * baseRates[i]).toFixed(2)
						var calc20 = (calc00 / 0.8).toFixed(2)
						var plus20 = (calc20 - calc00).toFixed(2)
						var calc30 = (calc00 / 0.7).toFixed(2)
						var plus30 = (calc30 - calc00).toFixed(2)
						var calc40 = (calc00 / 0.6).toFixed(2)
						var plus40 = (calc40 - calc00).toFixed(2)

						var tableRow =
							'<tr id="' +
							i +
							'" class="' +
							tableActive +
							'"><td class="id">' +
							i +
							'</td><td class="rate">' +
							parseFloat(baseRates[i].toFixed(5)) +
							'</td><td class="calc">' +
							calc00 +
							'</td><td class="twenty">' +
							calc20 +
							'</td><td class="twenty-margin"><small>+' +
							plus20 +
							'</small></td><td class="thirty">' +
							calc30 +
							'</td><td class="thirty-margin"><small>+' +
							plus30 +
							'</small></td><td class="fourty">' +
							calc40 +
							'</td><td class="fourty-margin"><small>+' +
							plus40 +
							'</small></td></tr>'
						tableContents = tableContents + tableRow
					})

					hbReply(
						'<table class="currency" style="margin-bottom: .3em;"><thead><tr><th style="width: 1%;"></th><th>Rate</th><th>Calculated</th><th colspan="2">+20%</th><th colspan="2">+30%</th><th colspan="2">+40%</th></tr></thead><tbody>' +
							tableContents +
							'</tbody></table><small id="pricing-byline" style="text-align: left;">Calculation based on <a href="http://www.ecb.europa.eu/stats/exchange/eurofxref/html/index.en.html">ECB rates</a> <span class="last-updated">(last updated <strong>' +
							data.date +
							'</strong>)</span>. <a href="#" id="show-currencies">Available currencies</a>.</small>'
					)
				}).fail((jqXHR, textStatus, errorThrown) => {
					hbReply(
						'Unable to process <strong>' +
							msg +
							'</strong> input. To use Pricing Help, please provide base amount and currency: <em>c 16.50 usd</em> or <em>c sgd 99 myr</em>.'
					)
				})
			}
		} else if (
			msgFirst == 'vat' ||
			msgFirst == 'btw' ||
			msgFirst == 'tva' ||
			msgFirst == 'mwst'
		) {
			if (isNaN(msgArray[1])) {
				hbReply(
					'Unable to process <strong>' +
						msg +
						'</strong> input. To use VAT conversion, please provide a valid base amount: <kbd>vat 85.25</kbd>.'
				)
			} else {
				let a = msgArray[1]
				let vatRates = [4, 5, 5.5, 6, 7, 8, 9, 10, 19, 20, 21]

				let tableContents = ''
				vatRates.forEach(vat => {
					let v = vat / 100 + 1,
						incl = (a / v).toFixed(2),
						inclm = '<small>+' + (a - a / v).toFixed(2) + '</small>',
						excl = (a * v).toFixed(2),
						exclm = '<small>-' + (a * v - a).toFixed(2) + '</small>'

					let tableRow =
						'<tr id="five"><td>' +
						vat +
						'</td><td class="incl">' +
						incl +
						'</td><td class="incl-margin">' +
						inclm +
						'</td><td class="excl">' +
						excl +
						'</td><td class="excl-margin">' +
						exclm +
						'</td></tr>'

					tableContents = tableContents + tableRow
				})

				hbReply(
					'<table class="vat" style="float: none;"><thead><tr><th style="width: 1%;">%</th><th colspan="2">Incl.</th><th colspan="2">Excl.</th></tr></thead><tbody>' +
						tableContents +
						'</tbody></table>'
				)
			}
		} else if (msgFirst == 'isbn' || msgFirst == 'i') {
			if (isbn.parse(msgArray[1])) {
				let payload = isbn.parse(msgArray[1])

				let isbn10 = payload.codes.isbn10
				let isbn10h = payload.codes.isbn10h
				let isbn13 = payload.codes.isbn13
				let isbn13h = payload.codes.isbn13h
				let isbngroup =
					payload.codes.group + ' (' + payload.codes.groupname + ')'
				let publisher = payload.codes.publisher

				hbReply(
					'<table class="isbn-chart" style="width: auto"><tbody><tr><td>ISBN10</td><td>' +
						isbn10 +
						'</td></tr><tr><td>ISBN10(-)</td><td>' +
						isbn10h +
						'</td></tr><tr><td>ISBN13</td><td>' +
						isbn13 +
						'</td></tr><tr><td>ISBN13(-)</td><td>' +
						isbn13h +
						'</td></tr><tr><td>Group</td><td>' +
						isbngroup +
						'</td></tr><tr><td>Publisher</td><td>' +
						publisher +
						'</td></tr></tbody></table>'
				)
			} else {
				hbReply(
					'Unable to process <strong>' +
						msg +
						'</strong> input. To use ISBN conversion, please provide a valid ISBN: <em>isbn 978-3-16-148410-0</em>.'
				)
			}
		} else if (
			msgFirst == 'search' ||
			msgFirst == 's' ||
			msgFirst == 'query' ||
			msgFirst == 'q'
		) {
			if (msgArray.length > 1) {
				var s = ''
				msgArray.forEach((w, i) => {
					if (i == 1) s = s + w
					if (i > 1) s = s + '+' + w
				})

				$.getJSON(
					'https://www.googleapis.com/books/v1/volumes?q=' +
						s +
						'&maxResults=3&key=AIzaSyDoOCTxCWWoFIlGvVQ0ZCiveGE9sDXFyeA',
					data => {
						if (data.items) {
							let tableContents = ''

							data.items.forEach((book, i) => {
								let b = book.volumeInfo

								let authors = ''
								if (b.authors) {
									b.authors.forEach((a, i) => {
										if (i == 0) {
											authors = authors + a
										} else {
											authors = authors + '; ' + a
										}
									})
								} else {
									authors = 'Author unknown'
								}

								let cover
								if (b.imageLinks) {
									cover =
										'<img src="' +
										b.imageLinks.smallThumbnail +
										'" title="' +
										b.title +
										'" height="120">'
								} else {
									cover =
										'<i class="material-icons" style="color:#ddd;font-size:120px;">book</i>'
								}

								let isbNumber
								if (b.industryIdentifiers) {
									b.industryIdentifiers.forEach(i => {
										if (i.identifier.length == 13) {
											isbNumber = i.identifier
										}
									})
								} else {
									isbNumber = 'ISBN unknown'
								}

								let descr = ''
								if (b.description) {
									descr = b.description.substring(0, 300) + '...'
								} else {
									descr = 'No description'
								}

								let tableRow =
									'<tr><td width="1%" style="text-align: left;">' +
									cover +
									'</td><td style="text-align: left"><em>' +
									authors +
									'</em><br><h3 style="display: inline; margin: 0;">' +
									b.title +
									'</h3><small> ' +
									(b.subtitle || '') +
									'</small><br>' +
									(isbNumber || 'ISBN unknown') +
									' - ' +
									(b.publisher || 'Publisher unknown') +
									', ' +
									(b.publishedDate || 'Date unknown') +
									'<p style="margin: .5em 0 0">' +
									descr +
									'</p></td></tr>'

								tableContents = tableContents + tableRow
							})

							hbReply(
								'<table style="margin-bottom: .2em"><tbody>' +
									tableContents +
									'</tbody></table><small id="pricing-byline" style="text-align: left;">See more results on <a href="https://www.google.com/search?tbm=bks&q=' +
									s +
									'" target="_blank">Google Books</a></small>'
							)
						} else {
							hbReply('No results found for <strong>' + msg + '</strong>.')
						}
					}
				)
			} else {
				hbReply(
					'Unable to process <strong>' +
						msg +
						'</strong> input. To use Book search, please provide a valid search term: <kbd>search ulysses joyce</kbd> or <kbd>q 9780679732266</kbd>.'
				)
			}
		} else if (msgFirst == 'help' || msgFirst == 'h') {
			var helpCurrency =
				'<tr><td>Currency converter</td><td>The <strong>Currency converter</strong> prints a list of our most used currencies and it\'s conversions or converts two specific currencies. The results also includes 20%, 30% and 40% margins, which can be useful with pricing. The convertor accepts most major <a href="https://en.wikipedia.org/wiki/ISO_4217" target="_blank">ISO 4217 currency codes</a> and conversions are based on most recent available <a href="http://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" target="_blank">ECB rates</a>.</td><td><em>currency, curr, c, ph, price</em></td><td width="20%"><kbd>currency 12 eur</kbd><br><kbd>curr 39.95 usd</kbd><br><kbd>c gbp 24.50 eur</kbd></td></tr>'

			var helpVAT =
				'<tr><td>VAT calculation</td><td>If you are wondering what an amount would look like including or excluding a certain percentage, use the <strong>VAT calculator</strong>.</td><td><em>vat, btw, mwst, tva</em></td><td><kbd>vat 130</kbd><br><kbd>btw 19.75</kbd></td></tr>'

			var helpISBN =
				'<tr><td>ISBN converter</td><td>If you ever had the need to convert, hyphenate or breakdown an ISBN, the <strong>ISBN converter</strong> is your friend. It accepts any type of ISBN and prints out a list of all its variations and parts</td><td><em>isbn, i</em></td><td><kbd>isbn 978-3-16-148410-0</kbd><br><kbd>i 316148410X</kbd></td></tr>'

			var helpSearch =
				'<tr><td>Book search</td><td>Looking for a book? HumphreyBot can help you search with a simple <strong>Book search</strong>. Just enter any search criteria and it will print a list of the top three search results, using the <a href="https://books.google.com" target="_blank">Google Books API</a>.</td><td><em>search, s, query, q</em></td><td><kbd>search ulysses joyce</kbd><br><kbd>s grapes wrath steinbeck</kbd><br><kbd>q 9780679732266</kbd></td></tr>'

			var helpCalc =
				'<tr><td>Calculation</td><td>HumphreyBot will do simple <strong>Calculation</strong>, no big deal.</td><td></td><td><kbd>2 * 8 - 3</kbd><br><kbd>(49 / 7) + 24</kbd></td></tr>'

			let tableContents =
				helpCurrency + helpVAT + helpISBN + helpSearch + helpCalc

			hbReply(
				'<table style="margin-bottom: .2em;"><thead><tr><th>Function</th><th>Description</th><th>Command(s)</th><th>Examples</th></tr></thead><tbody>' +
					tableContents +
					'</tbody></table>If you have questions, comments or suggestions, please let me know at <a href="mailto:ben@erasmusbooks.nl">ben@erasmusbooks.nl</a>'
			)
		} else {
			let error

			try {
				eval(msg)
			} catch (err) {
				error = err
			}

			if (error) {
				hbReply(
					'Input <strong color="red">' +
						msg +
						'</strong> not recognized. Please type <kbd>help</kbd> for a list of commands.<br>'
				)
			} else {
				hbReply(msg + ' = <strong>' + eval(msg) + '</strong>', 1)
			}
		}
	}
})

function hbReply(reply, time) {
	setTimeout(function() {
		$('#humphreybot ul').append(
			'<li><div class="person">' +
				moment().format('HH:mm:ss') +
				'</div><div class="message">' +
				reply +
				'</div></li>'
		)

		$('#humphreybot .command-line.bottom').css('visibility', 'visible')

		$('#humphreybot input').focus()

		$(window).scrollTop(
			$('#humphreybot').offset().top +
				$('#humphreybot').outerHeight() -
				window.innerHeight
		)
	}, time ? time : Math.floor(Math.random() * 750) + 250)
}

$(document).on('click', '#show-currencies', e => {
	e.preventDefault()
	$.getJSON(
		document.getElementsByTagName('base')[0].href + '/wp-json/curr/newest',
		data => {
			var reply =
				'<strong>Available currencies (<em>' +
				Object.keys(data.rates).length +
				'</em>)</strong>: '

			for (var key in data.rates) {
				reply = reply + key + ', '
			}

			hbReply(reply)
		}
	)
})
