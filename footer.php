<?php
	$footer           = ot_get_option( 'footer', 'on' );
	$subfooter        = ot_get_option( 'subfooter', 'on' );
	$footer_portfolio = is_singular( 'portfolio' ) ? ot_get_option( 'footer_portfolio', 'off' ) : 'on';
	$footer_article   = is_singular( 'post' ) ? ot_get_option( 'footer_article', 'on' ) : 'on';
	$disable_footer   = get_post_meta( get_the_ID(), 'disable_footer', true );
	$cond             = ( 'on' === $footer && 'on' === $footer_portfolio && 'on' === $footer_article && 'on' !== $disable_footer );

if ( $cond ) {
	do_action( 'thb_footer_bar' );
}
?>
	</div> <!-- End Main -->
	<div class="fixed-footer-container">
		<?php
		if ( $cond ) {
			get_template_part( 'inc/templates/footer/style1' );
		}
		?>
		<?php
		if ( 'on' === $subfooter && 'on' === $footer_portfolio && 'on' === $footer_article && 'on' !== $disable_footer ) {
			get_template_part( 'inc/templates/footer/subfooter-' . ot_get_option( 'subfooter_style', 'style1' ) );
		}
		?>
	</div>
	<?php

		/*
		 * Always have wp_footer() just before the closing </body>
		 * tag of your theme, or you will break many plugins, which
		 * generally use this hook to reference JavaScript files.
		 */
		 wp_footer();
	?>
</div> <!-- End Wrapper -->
<?php do_action( 'thb_after_wrapper' ); ?>
</body>
</html>
