<?php function thb_instagram( $atts, $content = null ) {
	$atts = vc_map_get_attributes( 'thb_instagram', $atts );
	extract( $atts );
	
	$out ='';
	ob_start();
	
	$el_class[] = 'row instagram-row';
	$el_class[] = $column_padding;
	
	$instagram = thb_getInstagramPhotos($number);
	?>
	<div class="<?php echo esc_attr(implode(' ', $el_class)); ?>">
		<?php if ($instagram) { foreach ($instagram as $item) { ?>
			<div class="small-12 <?php echo esc_attr($columns); ?> columns">
				<figure style="background-image:url(<?php echo esc_url($item['image_url']); ?>)">
				<?php if ($link == 'true') { ?>
					<a href="<?php echo esc_attr($item['link']); ?>" target="_blank" class="instagram-link"></a>
				<?php } ?>
				<span><?php get_template_part('assets/img/svg/like.svg'); ?><em><?php echo esc_attr($item['likes']); ?></em> <?php get_template_part('assets/img/svg/comment.svg'); ?><em><?php echo esc_attr($item['comments']); ?></em></span>
				</figure>
			</div>
		<?php } } ?>
	</div>
	<?php
	
	$out = ob_get_clean();
	   
	return $out;
}
thb_add_short( 'thb_instagram', 'thb_instagram');