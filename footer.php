				<div class='loader'>
					<div class="spinner"></div>
				</div>
			
			</div>

			<aside id="sidebar">
			
				<ul class="secondary-nav docs">
					<h3><i class='material-icons'>description</i> Docs</h3>

					<?php 
						$docs = get_page_by_path('docs');
						wp_list_pages(array(
							'child_of' => $docs->ID,
							'title_li' => '',
							'link_after' => '<i class="material-icons">more_horiz</i>'
						)); 
					?>
				</ul>

				<ul class="secondary-nav tools">
					<h3><i class='material-icons'>build</i> Tools</h3>
					<?php 
						$tools = get_page_by_path('tools');
						wp_list_pages(array(
							'child_of' => $tools->ID,
							'title_li' => ''
						)); 
					?>
				</ul>

				<div class="secondary-nav user">
					<h3><i class='material-icons'>account_circle</i> User</h3>
					
					<?php  if (is_user_logged_in()) {

						?>
							<a href='<?php echo admin_url(); ?>' title='Site admin'>Site admin</a>
						<?php
						wp_loginout($_SERVER['REQUEST_URI']); 


					} else {	

						wp_login_form();


					} ?>
				</div>
				
			</aside>

		<footer id="footer">
			
			<div class="credits">
				Built by <a href="http://mibdw.club" target="_blank">MIBDW</a>. Powered by <a href="http://wordpress.org" target="_blank">Wordpress</a>.
			</div>
		
			<div class="repository">
				<a href="http://github.com/erasmusbooks/humphrey">Github</a>
				&nbsp;&nbsp;
				<a href="<?php echo get_template_directory_uri(); ?>/images/xbe1p1R.gif">Moves</a>
				&nbsp;&nbsp;
				<a href="<?php echo site_url(); ?>">Dashboard</a>
			</div>

		</footer>

		<?php if (is_page('Dashboard')) { ?>
			<script src="<?php echo get_template_directory_uri(); ?>/scripts/dashboard.js"></script>
		<?php } else if (is_page('Calendar')) { ?>
			<script src="<?php echo get_template_directory_uri(); ?>/scripts/calendar.js"></script>
		<?php } else if (is_home()) { ?>
			<script src="<?php echo get_template_directory_uri(); ?>/scripts/news.js"></script>
		<?php } ?>
	
	</body>		
</html>