<?php 
	
	header('Content-type: application/json; charset=UTF-8');
	
	global $wpdb;
	global $post;

	if ($_GET['s'] && $_GET['e']):

		$start = $_GET['s'];
		$end = $_GET['e'];

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
				
				FROM wp_posts AS P

				LEFT JOIN wp_postmeta AS S ON P.ID = S.post_id AND S.meta_key = 'start'
				LEFT JOIN wp_postmeta AS E ON P.ID = E.post_id AND E.meta_key = 'end'
				LEFT JOIN wp_postmeta AS R ON P.ID = R.post_id AND R.meta_key = 'recursion'

				WHERE P.post_status = 'publish' AND P.post_type = 'events' 

				AND ( 
					R.meta_value = 'once'
					AND (
						(S.meta_value >= %d AND S.meta_value <= %d)
						OR (E.meta_value >= %d AND E.meta_value <= %d)
						OR (S.meta_value <= %d AND E.meta_value >= %d)
					)
				)

				OR ( 
					R.meta_value = 'monthly'
					AND S.meta_value <= %d
					AND (
						(DATE_FORMAT(FROM_UNIXTIME(S.meta_value), '%%d') IN( {$dayImploded} ))
						OR (DATE_FORMAT(FROM_UNIXTIME(E.meta_value), '%%d') IN( {$dayImploded} ))
					)
				)

				OR (
					R.meta_value = 'yearly'
					AND S.meta_value <= %d
					AND (
						(DATE_FORMAT(FROM_UNIXTIME(S.meta_value), '%%m') IN( {$monthImploded} ))
						OR (DATE_FORMAT(FROM_UNIXTIME(E.meta_value), '%%m') IN( {$monthImploded} ))
					)
					AND (
						(DATE_FORMAT(FROM_UNIXTIME(S.meta_value), '%%d') IN( {$dayImploded} ))
						OR (DATE_FORMAT(FROM_UNIXTIME(E.meta_value), '%%d') IN( {$dayImploded} ))
					)
				)

				GROUP BY P.ID", 
				$start, $end, $start, $end, $start, $end,
				$end,
				$end
			)
		);

		if ($events):

			$stack = array();
			foreach ($events as $post):

				setup_postdata($post);
			
				$ev = new stdClass();

				$ev->_id = $post->ID;
				$ev->title = $post->post_title;
				$ev->slug = $post->post_name;
				$ev->note = $post->post_content;
				$ev->start = get_field('start');
				$ev->end = get_field('end');
				$ev->allday = get_field('all_day');
				$ev->recursion = get_field('recursion');
				$ev->category = get_term(get_field('category'), 'category');
				$ev->category->color = get_field('color', $ev->category);
				$ev->user = $post->post_author;
				$ev->pos = -1;

				array_push($stack, $ev);

			endforeach;

			echo json_encode($stack);
			
		else:

			$response = array('response' => 'Empty', 'message' => 'No events found');
			echo json_encode($response);

		endif;

	elseif ($_GET['c'] == '1'):

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

	elseif ($_POST['title']):

		$table_name = $wpdb->prefix . 'events';

		$end = NULL;
		if ($_POST['end']) $end = $_POST['end'];
		
		$allday = 0;
		if ($_POST['allday'] == 'true') $allday = 1;

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
			), 
			array('%s', '%s', '%s', '%s', '%d', '%s', '%d') 
		);
		
		echo json_encode($_POST);

	else:

		$response = array('response' => 'Error', 'message' => 'No parameters found. Please provide start and end time');
		echo json_encode($response);
	
	endif;

?>