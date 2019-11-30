<?php
/*
Template Name: Standard Page Layout
*/
$thb_id        = get_the_ID();
$display_title = get_post_meta( $thb_id, 'display_title', true );
$sidebar       = get_post_meta( $thb_id, 'sidebar', true );
?>
<?php get_header(); ?>
<?php if ( have_posts() ) :  while ( have_posts() ) : the_post(); ?>
	<div <?php post_class('page-padding'); ?>>
		<div class="row">
			<?php if ( 'on' === $sidebar ) { ?>
				<div class="small-12 medium-4 small-order-2 columns">
					<?php get_sidebar('page'); ?>
				</div>
			<?php } ?>
			<div class="small-12<?php if ( $sidebar === 'on' ) { ?> medium-8<?php }?> small-order-1 columns">
				<?php if ( 'off' !== $display_title ) { ?>
				<header class="post-title page-title">
					<?php the_title( '<h1 class="entry-title" itemprop="name headline">', '</h1>' ); ?>
				</header>
				<?php } ?>
				<div class="post-content no-vc">
					<?php the_content();?>
				</div>
			</div>
		</div>
	</div>
	<?php if ( comments_open() || get_comments_number() ) : ?>
	<!-- Start #comments -->
	<?php comments_template( '', true ); ?>
	<!-- End #comments -->
	<?php endif; ?>
<?php endwhile; endif; ?>
<?php get_footer();
