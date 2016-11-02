<form role="search" method="get" id="header-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="material-icons" for="s">search</label>
	<input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" placeholder="Search" />

	<i class="material-icons">close</i>
	<ul id="search-results">
		
	</ul>
</form>