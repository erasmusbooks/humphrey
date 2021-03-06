
<?php /* Template Name: Docs */ ?>

<?php get_header(); ?>

<div id="docs" class="content">

	<?php if (is_page('Docs')) { ?>
		
		<div class='placeholder'><i class='material-icons'>description</i></div>

	<?php } else { ?>

		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

			<?php if (get_field('login_required')) { ?>

				<article id='stuff'>
					
					<?php if (is_user_logged_in()) {
						
						$permitted = get_field('member_role_selector');
						
						if (!empty($permitted[0])) {
						
							$user_role = array_values(wp_get_current_user()->roles)[0];

							if (in_array($user_role, $permitted)) { ?>

								<h1><?php the_title(); ?> <?php edit_post_link('Edit', '<small>', '</small>'); ?></h1>
								<div><?php the_content(); ?></div>

							<?php } else { ?>

								<h1>Restricted content</h1>
								<div style='text-align: center'>Please check your permissions and/or contact your system administrator</div>

							<?php }

						} else { ?>
					
							<h1><?php the_title(); ?> <?php edit_post_link('Edit', '<small>', '</small>'); ?></h1>
							<div><?php the_content(); ?></div>

						<?php }

					} else { ?>
						
						<h1>Restricted content</h1>
						<div style='text-align: center'>Please login or/and check your permissions</div>

					<?php } ?>

				</article>

			<?php } else { ?>

				<article id='stuff'>
					
					<h1><?php the_title(); ?> <?php edit_post_link('Edit', '<small>', '</small>'); ?></h1>
					<div><?php the_content(); ?></div>

				</article>

			<?php } ?>

		<?php endwhile; endif; ?>

	<?php } ?>

</div>

<?php get_footer(); ?>