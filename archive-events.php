<?php 
	
	header('Content-type: application/json; charset=UTF-8');
	
	global $wpdb;
	global $post;

	if ($_GET['start'] && $_GET['end']):

		$start = $_GET['start'];
		$end = $_GET['end'];

		$dayRange = array();
		$monthRange = array();

		$numDays = abs($start - $end)/60/60/24;
		array_push($dayRange, date('d', $start));
		array_push($monthRange, date('m', $start));

		for ($i = 1; $i <= $numDays; $i++) {
			$day = strtotime('+'. $i .' day', $start);
			
			if (! in_array(date('d', $day), $dayRange)) array_push($dayRange, date('d', $day));
			if (! in_array(date('m', $day), $monthRange)) array_push($monthRange, date('m', $day));
		}

		$dayRange = esc_sql($dayRange);
		$monthRange = esc_sql($monthRange);
		$dayImploded = implode(', ', $dayRange);
		$monthImploded = "'" . implode("','", $monthRange) . "'";

		$events = $wpdb->get_results(
			$wpdb->prepare("SELECT *
				
				FROM wp_events AS ev

				WHERE ev.publish = '1' 

				AND ( 
					ev.recursion = 'once'
					AND (
						(ev.start >= %d AND ev.start <= %d)
						OR (ev.end >= %d AND ev.end <= %d)
						OR (ev.start <= %d AND ev.end >= %d)
					)
				)

				OR ( 
					ev.recursion = 'monthly'
					AND ev.start <= %d
					AND (
						(DATE_FORMAT(FROM_UNIXTIME(ev.start), '%%d') IN( {$dayImploded} ))
					)
				)

				OR (
					ev.recursion = 'yearly'
					AND ev.start <= %d
					AND (
						(DATE_FORMAT(FROM_UNIXTIME(ev.start), '%%m') IN( {$monthImploded} ))
						OR (DATE_FORMAT(FROM_UNIXTIME(ev.end), '%%m') IN( {$monthImploded} ))
					)
					AND (
						(DATE_FORMAT(FROM_UNIXTIME(ev.start), '%%d') IN( {$dayImploded} ))
						OR (DATE_FORMAT(FROM_UNIXTIME(ev.end), '%%d') IN( {$dayImploded} ))
					)
				)

				GROUP BY ev.id", 
				$start, $end, $start, $end, $start, $end,
				$end,
				$end
			)
		);

		if ($events):

			$stack = array();
			foreach ($events as $ev):
			
				$person = get_userdata($ev->user);

				$user = new stdClass();
				$user->_id = $ev->user;
				$user->name = new stdClass();
				$user->name->first = $person->first_name;
				$user->name->last = $person->last_name;
				$user->username = $person->user_login;

				$term = get_term_by('id', intval($ev->category), 'category');
				
				$category = new stdClass();
				$category->name = $term->name;
				$category->_id = $term->term_id;
				$category->color = get_field('category_color', $term);

				$ev->_id = intval($ev->id);
				$ev->start = intval($ev->start);
				$ev->end = ($ev->end) ? intval($ev->end) : null;
				$ev->allday = boolval($ev->allday);
				$ev->publish = boolval($ev->publish);
				$ev->category = $category;
				$ev->user = $user;
				$ev->pos = -1;

				array_push($stack, $ev);

			endforeach;

			echo json_encode($events);
			
		else:

			$response = array('response' => 'Empty', 'message' => 'No events found');
			echo json_encode($response);

		endif;

	elseif ($_GET['categories'] == '1'):

		$categories = get_categories(array('hide_empty' => 0));
		$category_stack = array();

		foreach ($categories as $category) {
			$cat = new stdClass();

			$cat->id = $category->term_id;
			$cat->name = $category->name;
			$cat->slug = $category->slug;
			$cat->color = get_field('category_color', $category);

			array_push($category_stack, $cat);
		}

		echo json_encode($category_stack);

	elseif ($_GET['detail']):

		$detail = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM wp_events WHERE id = %d", 
				$_GET['detail']
			)
		);

		$person = get_userdata($detail->user);

		$user = new stdClass();
		$user->_id = $detail->user;
		$user->name = new stdClass();
		$user->name->first = $person->first_name;
		$user->name->last = $person->last_name;
		$user->username = $person->user_login;

		$term = get_term_by('id', intval($detail->category), 'category');
		
		$category = new stdClass();
		$category->name = $term->name;
		$category->_id = $term->term_id;
		$category->color = get_field('category_color', $term);

		$detail->_id = intval($detail->id);
		$detail->start = intval($detail->start);
		$detail->end = ($detail->end) ? intval($detail->end) : null;
		$detail->allday = boolval($detail->allday);
		$detail->publish = boolval($detail->publish);
		$detail->category = $category;
		$detail->user = $user;

		echo json_encode($detail);

	elseif ($_POST['reason'] == 'create'):

		$table_name = $wpdb->prefix . 'events';

		$end = $_POST['end'] ? $_POST['end'] : null;
		$allday = ($_POST['allday'] == 'true') ? 1 : 0;

		$wpdb->insert( 
			$table_name, 
			array( 
				'title' => $_POST['title'], 
				'note' => $_POST['note'], 
				'start' => $_POST['start'], 
				'end' => $end, 
				'allday' => $allday, 
				'recursion' => $_POST['recursion'], 
				'category' => $_POST['category'], 
				'user' => get_current_user_id(), 
			), 
			array('%s', '%s', '%s', '%s', '%d', '%s', '%d', '%d') 
		);
		
		echo json_encode($_POST);
	
	elseif ($_POST['reason'] == 'update'):

		$table_name = $wpdb->prefix . 'events';
		$end = $_POST['end'] ? $_POST['end'] : null;
		$allday = ($_POST['allday'] == 'true') ? 1 : 0;
		
		$wpdb->update( 
			$table_name,
			array( 
				'title' => $_POST['title'], 
				'note' => $_POST['note'], 
				'start' => $_POST['start'], 
				'end' => $end, 
				'allday' => $allday, 
				'recursion' => $_POST['recursion'], 
				'category' => $_POST['category'], 			
			), 
		array( 'ID' => $_POST['id'] ), 
		array('%s', '%s', '%s', '%s', '%d', '%s', '%d', '%d'), 
		array( '%d' ) 
		);

		echo json_encode($_POST);

	else:

		$response = array('response' => 'Error', 'message' => 'No parameters found. Please provide start and end time');
		echo json_encode($response);
	
	endif;

?>