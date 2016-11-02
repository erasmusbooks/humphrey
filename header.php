<?php 

	if ($post->post_type == 'page') {
		$ancestor = array_pop(get_post_ancestors($post->ID));
		$where = empty($ancestor) ? $post->post_name : basename(get_permalink($ancestor));
	} else {
		$where = 'news';
	}
	$user = wp_get_current_user();

?>

<!DOCTYPE html>
<html lang="en">
	
	<head>

		<base href="<?php echo site_url(); ?>">
	
		<title><?php is_front_page() ? bloginfo('description') : wp_title('') ?>  &ndash; <?php bloginfo("name"); ?></title>

		<meta charset="UTF-8">
		<meta name="description" content="<?php bloginfo("description"); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
		<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,700italic,700,800,800italic' rel='stylesheet' type='text/css'>

		<!-- <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/styles/style.min.css"> -->

		<link rel="shortcut icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/images/ic_accessibility_black_24dp_1x.png">

		<script src="<?php echo get_template_directory_uri(); ?>/scripts/vendors.js"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/scripts/client.js"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/scripts/universal.js"></script>
					
	</head>

	<body data-where="<?php echo $where; ?>">

		<header id="masthead" class="<?php if (get_search_query()) echo 'searching'; ?>">
			
			<a href="<?php bloginfo('wpurl'); ?>" id="brand" title="<?php bloginfo('name'); ?>">
				<!-- <img src="<?php echo get_template_directory_uri(); ?>/images/coffee1.png" alt="<?php bloginfo("name"); ?>"> -->
				<span class='material-icons'>accessibility</span>
			</a>

			<nav id="primary-nav">
				<?php wp_nav_menu(array('header-menu' => __( 'Header Menu' ))); ?>	
			</nav>

			<div id="header-user" class="<?php if ($user->allcaps['edit_posts'] == 1) echo 'publisher'; ?>">

			<?php  if ( 0 == $user->ID ) { ?>
				
				<i class='material-icons entry' title='Login'>exit_to_app</i>

			<?php } else {	

				 echo get_avatar($user->ID, '50'); 

			} ?>				
				
			</div>

			<?php get_search_form(); ?>
		</header>

		<div class="wrapper <?php if ($where == 'docs' || $where == 'tools') echo 'with-sidebar'; ?>">

			<div id="main">