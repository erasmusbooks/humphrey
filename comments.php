<!-- You can start editing here. -->

<?php if ($comments) : ?>

	<ol class="comment-list" id="comments">

	<?php foreach ($comments as $comment) : ?>

		<li id="comment-<?php comment_ID() ?>">

			<div class='comment-author'>
				<?php echo get_avatar(get_comment_author_email()); ?>
				<span class='comment-author-name'><?php comment_author_link() ?></span>
			</div> 

			<div class="comment-content">

				<?php if ($comment->comment_approved == '0') : ?>
					<em>Your comment is awaiting moderation.</em>
				<?php endif; ?>

				<?php comment_text() ?>
				
				<div class="comment-meta">
					<?php comment_date('F jS, Y') ?> at <?php comment_time() ?> (<a href="#comment-<?php comment_ID() ?>" title="">#</a>) <?php edit_comment_link('edit','&nbsp;&nbsp;',''); ?>
				</div>

			</div>

		</li>


	<?php endforeach; ?>

	</ol>


 <?php else : // this is displayed if there are no comments so far ?>

	<?php if ('open' == $post->comment_status) : ?>

	 <?php else : // comments are closed ?>
		<!-- If comments are closed. -->
		<h1>Comments are closed.</h1>

	<?php endif; ?>
<?php endif; ?>


<?php if ('open' == $post->comment_status) : ?>

<h1 id="respond">Leave a Response</h1>

<?php if ( get_option('comment_registration') && !$user_ID ) : ?>
	
	<p>You must be <a href="<?php echo get_option('siteurl'); ?>/wp-login.php?redirect_to=<?php the_permalink(); ?>">logged in</a> to post a comment.</p>

<?php else : ?>

<form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform">

	<?php if ( $user_ID ) : ?>
	
		<div class='respond-author'>	
			Logged in as <a href="<?php echo get_option('siteurl'); ?>/wp-admin/profile.php"><?php echo $user_identity; ?></a>. <a href="<?php echo get_option('siteurl'); ?>/wp-login.php?action=logout" title="Log out of this account">Logout &raquo;</a>
		</div>

	<?php else : ?>

		
		<div class='respond-author'>

			<label for="author">Name <?php if ($req) echo "(required)"; ?></label>
			<input type="text" name="author" id="author" value="<?php echo $comment_author; ?>" size="22" tabindex="1" />

			<label for="email">Email (will not be published) <?php if ($req) echo "(required)"; ?></label>
			<input type="text" name="email" id="email" value="<?php echo $comment_author_email; ?>" size="22" tabindex="2" />

		</div>

	<?php endif; ?>

		<!--<p><small><strong>XHTML:</strong> You can use these tags: <code><?php echo allowed_tags(); ?></code></small></p>-->

		<div class='respond-content'>

			<textarea name="comment" id="comment" cols="10" rows="20" tabindex="4"></textarea>

			<br>

			<input name="submit" type="submit" id="submit" tabindex="5" value="Submit Comment" />
			<input type="hidden" name="comment_post_ID" value="<?php echo $id; ?>" />

		</div>

	<?php do_action('comment_form', $post->ID); ?>

</form>

<?php endif; // If registration required and not logged in ?>

<?php endif; // if you delete this the sky will fall on your head ?>
