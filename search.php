<?php 

	$stack = new stdClass();
	$stack->context = '';
	$stack->results = array();

	if (have_posts()) :

		$stack->context = 'success';
 
		while (have_posts()) : the_post();
				
			$result = new stdClass();
			$result->ID = get_the_ID();
			$result->permalink = get_the_permalink();
			$result->title = get_the_title();
			$result->time = get_the_time('D j F Y - H:i');
			$result->excerpt = get_the_excerpt();
			$result->avatar = get_avatar(get_the_author_id());
			$result->post_type = get_post_type();
			$result->author = new stdClass();
			$result->author->full_name = get_the_author_meta('first_name') . ' ' . get_the_author_meta('last_name');
			$result->author->nickname = get_the_author_meta('user_nicename');
			$result->author->description = get_the_author_meta('description');

			array_push($stack->results, $result);

		endwhile;
		
		wp_send_json($stack);

	else: 

		$stack->context = 'fail';
		wp_send_json($stack);
	
	endif;

?>