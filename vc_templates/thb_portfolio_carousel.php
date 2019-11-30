<?php function thb_portfolio_carousel( $atts, $content = null ) {
  $atts = vc_map_get_attributes( 'thb_portfolio_carousel', $atts );
  extract( $atts );

  $source_data = VcLoopSettings::parseData( $source );
  $query_builder = new ThbLoopQueryBuilder( $source_data );
  $carousel_posts = $query_builder->build();
  $carousel_posts = $carousel_posts[1];

 	$rand = wp_rand(0,1000);
 	$i = 0;

 	$classes[] = 'thb-portfolio thb-carousel';
 	$classes[] = $thb_overflow;
 	ob_start();

	?>
		<div class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>" id="portfolio-carousel-<?php echo esc_attr($rand); ?>" data-columns="<?php echo esc_attr($thb_columns); ?>" data-pagination="<?php echo esc_attr($thb_pagination); ?>" data-autoplay="<?php echo esc_attr($autoplay); ?>" data-autoplay-speed="<?php echo esc_attr($autoplay_speed); ?>" data-pagination="true">
				<?php if ($carousel_posts->have_posts()) :  while ($carousel_posts->have_posts()) : $carousel_posts->the_post(); ?>
					<?php
						set_query_var( 'thb_size', $thb_columns );
						get_template_part( 'inc/templates/portfolio/'.$portfolio_style);
					?>
				<?php endwhile; else : endif; ?>
		</div>

	<?php

	$out = ob_get_clean();
  set_query_var('thb_size', false);
	wp_reset_query();
	wp_reset_postdata();

  return $out;
}
thb_add_short( 'thb_portfolio_carousel', 'thb_portfolio_carousel');