<?php get_header(); ?>
			
	<div id="single" class="content">
		
		<?php if (have_posts()) :
					while (have_posts()) : the_post(); ?>
				
					<div class="article">

						<div class="article-wrapper">
								
							<h2 class="title" id="post-<?php the_ID(); ?>">
								<a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
									<?php the_title(); ?>
								</a>
							</h2>

							<div class="meta meta-top">
								<span class="time">
									<?php the_time('D j F Y - H:i'); ?>
								</span>
							</div>
					
							<div class="entry">
								<?php the_content(); ?>

								<?php edit_post_link('Edit'); ?> 
							</div>
						</div>

						<div class="article-side">

							<div class="author">
								<?php echo get_avatar(get_the_author_id()); ?>
								<a class='author-link' href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>">
									<?php the_author_meta('first_name') ?> 
									<?php the_author_meta('last_name') ?>		
								</a>
								<div class="author-description">
									<?php the_author_meta('description') ?>	
								</div>

							</div>
							
							<div class="comments-link">
								<span class="material-icons">chat_bubble</span>
								<?php comments_popup_link('0', '1', '%'); ?>
							</div>

							<ul class="categories">
								<?php
								$categories = get_the_category();
								$i = 0; $len = count($categories);
								foreach ($categories as $category) { ?>
								
									<li class="category" style="background-color: <?php the_field('category_color', $category); ?>;"><?php echo $category->name; ?></li>
								<?php $i++; }	?> 
							</ul> 

							<!--<?php trackback_rdf(); ?> -->
						</div>

					</div>

					<div id="post-navigation">
						<?php next_post_link('<div class="next"><i>arrow_back</i> %link</div>'); ?>
						<?php previous_post_link('<div class="prev">%link <i>arrow_forward</i></div>'); ?>
					</div>
						
					<?php comments_template(); ?>

				<?php endwhile; else : ?>

					<div class="article">

						<div class="artile-wrapper">
							
							<h2 class="title">Not Found</h2>
							<p><?php _e("Sorry, but you are looking for something that isn't here."); ?></p>
						</div>

					</div>

				<?php endif; ?>
		
	</div>		

<?php get_footer(); ?>