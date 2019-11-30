<?php
	$thb_id = get_queried_object_id();
	$header_color = thb_get_header_color($thb_id);

	$header_class[] = 'header style7';
	$header_class[] = $header_color;
?>
<!-- Start Header -->
<header class="<?php echo esc_attr(implode(' ', $header_class)); ?>">
	<div class="row align-middle">
		<div class="small-12 columns">
			<?php do_action( 'thb_logo', true ); ?>
			<div>
				<?php do_action( 'thb_mobile_toggle', false); ?>
			</div>
		</div>
	</div>
</header>
<!-- End Header -->