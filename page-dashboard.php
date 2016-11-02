<?php get_header(); ?>

<div id="dashboard" class="content">


	<div id="dash-main">

		<div id="dash-header">

			<div id="dash-datetime">
				<div id="dash-weekday"></div>
				<div id="dash-dayno"></div>
				<div id="dash-monthyear"></div>
				<div>
					<span id="dash-week"></span>					
					<span id="dash-time"></span>
				</div>
			</div>

			<div class="dash-events" id="dash-today">
				<h3>Today</h3>

				<ul class="events">
					
				</ul>
			</div>

			<div class="dash-events" id="dash-tomorrow">
				<h3>Tommorow</h3>
				
				<ul class="events">
					
				</ul>
			</div>

			<div class="dash-loader loader">
				<div class="spinner"></div>
			</div>	
			
		</div>
		
		<div class="column">
		
			<h2><i class="material-icons">phone</i> Phone numbers</h2>

			<table id='internal-phone-list' class='compact'>
				<thead>
					<tr>
						<th class='name'>Name</th>
						<th class='no'>No.</th>
						<th class='name'>Name</th>
						<th class='no'>No.</th>
					</tr>
				</thead>
				<tbody>
					<?php 
						$ipl = get_field('internal_phone_list');
						$ipll = count($ipl);
						$ipl1 = array_slice($ipl, 0, round($ipll / 2));
						$ipl2 = array_slice($ipl, round($ipll / 2));
						foreach ($ipl1 as $i => $row) {
					?>
						<tr>
							<td class='name'><?php echo $row['person']; ?></td>
							<td class='no'><?php echo $row['extension']; ?></td>
							<td class='name'><?php echo $ipl2[$i]['person']; ?></td>
							<td class='no'><?php echo $ipl2[$i]['extension']; ?></td>
						</tr>
					<?php } ?>		
				</tbody>
			</table>

			<table id='external-phone-list'>
				<thead>
					<tr>
						<th class='name'>Name</th>
						<th class="no">No.</th>
						<th class='name'>Name</th>
						<th class="no">No.</th>
					</tr>
				</thead>
				<tbody>
					<?php 
						$xpl = get_field('external_phone_list');
						$xpll = count($xpl);
						$xpl1 = array_slice($xpl, 0, round($xpll / 2));
						$xpl2 = array_slice($xpl, round($xpll / 2));
						foreach ($xpl1 as $i => $row) {
					?>
						<tr>
							<td class='name'><?php echo $row['person']; ?></td>
							<td class='no'><?php echo $row['extension']; ?></td>
							<td class='name'><?php echo $xpl2[$i]['person']; ?></td>
							<td class='no'><?php echo $xpl2[$i]['extension']; ?></td>
						</tr>
					<?php } ?>		
				</tbody>
			</table>

			<table id='emergency-phone-list'>
				<thead>
					<tr>
						<th>Name</th>
						<th>No.</th>
					</tr>
				</thead>
				<tbody>
					<?php 
						$epl = get_field('emergency_phone_list');
						foreach ($epl as $row) {
					?>
						<tr>
							<td><?php echo $row['person']; ?></td>
							<td><?php echo $row['number']; ?></td>
						</tr>
					<?php } ?>		
				</tbody>
			</table>
			
			<h2><i class="material-icons">local_shipping</i> Useful numbers</h2>

			<table id='useful-numbers'>
				<thead>
					<tr>
						<th>Service</th>
						<th>No.</th>
					</tr>
				</thead>
				<tbody>
					<?php 
						$useful_numbers = get_field('useful_numbers');
						foreach ($useful_numbers as $row) {
					?>
						<tr>
							<td><?php echo $row['service']; ?></td>
							<td><?php echo $row['number']; ?></td>
						</tr>
					<?php } ?>		
				</tbody>
			</table>
		
		</div>

		<div class="column">

			<h2><i class="material-icons">language</i> Useful links</h2>
			
			<table id='useful-links'>
				<thead>
					<tr>
						<th>Country</th>
						<th>Address</th>
					</tr>
				</thead>
				<tbody>
					<?php 
						$links = get_field('useful_links');
						foreach ($links as $row) {
					?>
						<tr>
							<td><?php echo $row['category']; ?></td>
							<td><?php echo $row['links']; ?></td>
						</tr>
					<?php } ?>		
				</tbody>
			</table>

			<h2><i class="material-icons">store</i> Adresses</h2>
			
			<table id='useful-addresses'>
				<thead>
					<tr>
						<th>Country</th>
						<th>Address</th>
					</tr>
				</thead>
				<tbody>
					<?php 
						$addresses = get_field('addresses');
						foreach ($addresses as $row) {
					?>
						<tr>
							<td><?php echo $row['location']; ?></td>
							<td><?php echo $row['address']; ?></td>
						</tr>
					<?php } ?>		
				</tbody>
			</table>

		</div>

	</div>

	<aside id="dash-side">

		<h2><i class="material-icons">new_releases</i> Latest news</h2>
		
		<?php 
			$temp_query = $wp_query;
			query_posts('post_type=post&posts_per_page=8');
			while ( have_posts() ) : the_post(); 
		?>
			
			<div class="dash-article article">
				<h3 class="title"><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></h3>
				<div class="meta">
					<span class="user">
			
						<?php the_author_meta('first_name') ?> 
						<?php the_author_meta('last_name') ?>,
					</span>
					<span class="time">
						<?php the_time('D j F Y - H:i'); ?>
					</span>
				</div>
				
				<div class="entry">
					<?php the_excerpt(); ?>
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

			</div>
	
		<?php 
			endwhile;
			$wp_query = $temp_query; 
		?>

		<a class='news-archive' href='<?php echo home_url(); ?>/news' title='News archive'>News archive</a>

	</aside>


</div>

<?php get_footer(); ?>