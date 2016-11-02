<?php get_header(); 
	
	if (have_posts()) : ?>

		<div id="news" class="content">
			<div id="news-wrapper">
					<ul id="news-list">

						<?php if (is_category()) { ?>

							<h4>Category: <?php $this_category = get_category($cat); echo $this_category->cat_name; ?></h4>

						<?php } else if (is_archive()) { ?>

							<h4>Archive: <?php echo the_time('F Y'); ?></h4>						

						<?php } 
							while (have_posts()) : the_post(); ?>
				
							<li class="article" id="post-<?php the_ID(); ?>">

								<div class="article-wrapper">
								
									<h2 class="title">
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
										<?php the_content(); 
										edit_post_link('Edit'); ?> 
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

							</li>

							<?php endwhile; ?> 
					
						</ul>

						<aside id="news-side">

							<nav class="navigation">
								<?php echo paginate_links(array(
									'prev_text' => __('arrow_back'),
									'next_text' => __('arrow_forward'),
								)); ?>
							</nav>

							<ul class="category-list">
								
								<?php
									$categories = get_categories(); 
									foreach ($categories as $category) { ?>
										<li class="<?php if (is_category($category->cat_ID)) echo 'active'; ?>">

											<a href='<?php echo get_category_link($category->cat_ID) ; ?>'>
												<i class='category-bubble' style="background-color: <?php the_field('category_color', $category); ?>;"></i>
												<?php echo $category->cat_name; ?>
												<small>(<?php echo $category->category_count; ?>)</small>
											</a>
										</li>
									<?php	}	?>
								
							</ul>

							<ul class="archive-list">
								<?php wp_get_archives(); ?>
							</ul>
						</aside>

			</div>

		</div>	

			<?php else : ?>

				<div id="404" class='content'>
					
					<h1>Not Found</h1>
					<center>Sorry, but you are looking for something that isn't here.</center>

				</div>

			<?php endif; ?>

			


<?php get_footer(); ?>