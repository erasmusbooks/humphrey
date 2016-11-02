<?php
	require_once('class-tgm-plugin-activation.php');
	
	// INSTALL REQUIRED PLUGIN(S)

	function include_plugins() {
		$plugins = array(

			array(
				'name' => 'Advanced Custom Fields Pro',
				'slug' => 'advanced-custom-fields-pro',
				'source' => get_stylesheet_directory() . '/advanced-custom-fields-pro.zip',
				'required' => true,
				'force_activation' => true, 
				'force_deactivation' => true,
			)
		);

		$config = array(
			'id' => 'tgmpa',
			'default_path' => '',
			'menu' => 'tgmpa-install-plugins',
			'parent_slug'  => 'themes.php',
			'capability'   => 'edit_theme_options',
			'has_notices'  => true,
			'dismissable'  => true, 
			'is_automatic' => true, 
		);

		tgmpa($plugins, $config);
	}
	add_action('tgmpa_register', 'include_plugins');


	function create_events_table() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'events';

		if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {

			$sql = "CREATE TABLE $table_name (
				id int(11) NOT NULL AUTO_INCREMENT,
				title text DEFAULT NULL,
				note longtext DEFAULT NULL,
				start int(10) DEFAULT NULL,
				end int(10) DEFAULT NULL,
				allday boolean DEFAULT NULL,
				publish boolean DEFAULT 1,
				recursion varchar(255) DEFAULT NULL,
				category int(11) DEFAULT NULL,
				user int(11) DEFAULT NULL,
				UNIQUE KEY id (id)
			);";

			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
			dbDelta($sql);
		}
	}
	add_action('after_switch_theme', 'create_events_table');

	function events_post_type() {
		register_post_type('events', array(
			'labels' => array(
				'name' => __( 'Events' ),
				'singular_name' => __( 'Event' )
			),
			'public' => true,
			'has_archive' => true,
			'rewrite' => array('slug' => 'events'),
		));
	}
	add_action('init', 'events_post_type');

	function hide_events_menu() {
		remove_menu_page('edit.php?post_type=events');
	}
	add_action('admin_menu', 'hide_events_menu');

	// SETUP DEFAULT PAGES

	function setup_default_pages() {

		// DEFAULT PAGES WILL BE CREATED ON CONTENT IMPORT
		// ENABLE THIS ONLY ON FRESH START, OTHERWISE DUPLICATE PAGES WILL APPEAR

		// $check_landing = get_page_by_path('dashboard');
		// if (!$check_dashboard) {

		// 	$dashboard_page = array(
		// 		'post_title' => 'Danding',
		// 		'post_type' => 'page',
		// 		'post_content' => '',
		// 		'post_status' => 'publish',
		// 		'post_author' => 1,
		// 	);
		// 	wp_insert_post($dashboard_page);
		// }

	}
	add_action('after_switch_theme', 'setup_default_pages');

	function register_header_nav() {
		register_nav_menu('header-menu',__('Header Menu'));
	}
	add_action('init', 'register_header_nav');

	function admin_styles() {
		echo '<style>
			#ui-datepicker-div { z-index: 999 !important; }
			#wp-content-editor-tools { z-index: 998 !important; }
		</style>';
	}
	add_action('admin_head', 'admin_styles');

?>