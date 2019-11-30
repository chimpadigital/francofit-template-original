<?php
	$thb_id = get_queried_object_id();

	$fixed_header_color = ot_get_option( 'fixed_header_color', 'dark-header');
	$fixed_header_shadow = ot_get_option( 'fixed_header_shadow');
	$header_color = thb_get_header_color($thb_id);

	$header_class[] = 'header style6';
	$header_class[] = $fixed_header_shadow;
	$header_class[] = thb_get_header_color($thb_id);
?>
<!-- Start Header -->
<header class="<?php echo esc_attr(implode(' ', $header_class)); ?>" data-header-color="<?php echo esc_attr($header_color); ?>" data-fixed-header-color="<?php echo esc_attr($fixed_header_color); ?>">
	<div class="row align-middle">
		<div class="small-12 columns">
			<?php do_action( 'thb_mobile_toggle', false); ?>
			<?php do_action( 'thb_logo', true ); ?>
			<div>
				<?php do_action( 'thb_secondary_area', true ); ?>
			</div>
		</div>
	</div>
</header>
<!-- End Header -->