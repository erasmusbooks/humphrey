<?php 
	
	header('Content-type: application/json; charset=UTF-8');
	
	$post = get_post();
	$user = get_userdata($post->post_author);

	$single = new stdClass();

	$single->_id = $post->ID;
	$single->title = $post->post_title;
	$single->slug = $post->post_name;
	$single->note = $post->post_content;
	$single->start = get_field('start');
	$single->end = get_field('end');
	$single->allday = get_field('all_day');
	$single->recursion = get_field('recursion');
	$single->category = get_term(get_field('category'), 'category');
	$single->category->color = get_field('color', $single->category);
	$single->user = new stdClass;
	$single->user->_id = $post->post_author;
	$single->user->username = $user->user_nicename;
	$single->user->name = new stdClass;
	$single->user->name->first = get_user_meta($post->post_author, 'first_name', true);
	$single->user->name->last = get_user_meta($post->post_author, 'last_name', true);
	$single->added = $post->post_date;

	echo json_encode($single);


?>