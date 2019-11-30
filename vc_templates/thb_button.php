<?php function thb_button( $atts, $content = null ) {
  $atts = vc_map_get_attributes( 'thb_button', $atts );
  extract( $atts );

	$element_id = uniqid("thb-button-");
	$full_width = $full_width === "true" ? 'full' : '';

	$link = ( $link == '||' ) ? '' : $link;
	$link = vc_build_link( $link  );

	$link_to = $link['url'];
	$a_title = $link['title'];
	$a_target = $link['target'] ? $link['target'] : '_self';

	// Lightbox
	if ($lightbox == 'true') {
  	if (strpos($link_to, 'youtu.be') !== false || strpos($link_to, 'youtube.com') !== false || strpos($link_to, 'player.vimeo.com') !== false){
  	  $class[] = 'mfp-video';
  	} else {
  	  $class[] = 'mfp-image';
  	}
	}
	// Classes
	$class[] = 'btn';
	$class[] = $style;
	$class[] = $size;
	$class[] = $full_width;
	$class[] = $color;
	$class[] = $border_radius;
	$class[] = $animation;
	$class[] = $extra_class;
	$class[] = $thb_shadow;
	$class[] = ( $add_arrow && ($style !== 'style4') ) ? 'arrow-enabled' : '';
	$out = '';

	ob_start();
	?>
	<a id="<?php echo esc_attr($element_id); ?>" class="<?php echo esc_attr( implode( ' ', $class ) ); ?>" href="<?php echo esc_attr($link_to); ?>" target="<?php echo sanitize_text_field( $a_target ); ?>" role="button">
		<?php if ($icon) { ?><span class="thb-button-icon"><i class="<?php echo esc_attr($icon);?>"></i></span><?php } ?>
	  <span><?php echo esc_attr($a_title); ?></span><?php if ($add_arrow && $style !== 'style4') { get_template_part('assets/img/svg/next_arrow.svg'); } ?></a>
  <?php if ($color === 'gradient') { ?>
    <?php if ($bg_gradient1 && $bg_gradient2) { ?>
      <style>

    			<?php if ($style === 'style1') { ?>
    			/* Style1 */
    			#<?php echo esc_attr($element_id); ?>.style1 {
    				<?php echo thb_css_gradient($bg_gradient1, $bg_gradient2, "-135", true); ?>
    			}
    			#<?php echo esc_attr($element_id); ?>.style1:after {
    				background: <?php echo esc_attr($bg_gradient2); ?>;
    			}
    			<?php } ?>
    			<?php if ($style === 'style2') { ?>
    			/* Style2 */
    			#<?php echo esc_attr($element_id); ?>.style2:after {
    				<?php echo thb_css_gradient($bg_gradient1, $bg_gradient2, "-135", true); ?>
    			}
    			#<?php echo esc_attr($element_id); ?>.style2:not(:hover) {
    				color: <?php echo esc_attr($bg_gradient2); ?>;
    			}
    			#<?php echo esc_attr($element_id); ?>.style2:before {
    				background: <?php echo esc_attr($st_color); ?>;
    			}
    			<?php } ?>
    			<?php if ($style === 'style3') { ?>
    			/* Style3 */
    			#<?php echo esc_attr($element_id); ?>.style3:after {
    				<?php echo thb_css_gradient($bg_gradient1, $bg_gradient2, "-135", true); ?>
    			}
    			#<?php echo esc_attr($element_id); ?>.style3:not(:hover) {
    				color: <?php echo esc_attr($bg_gradient2); ?>;
    			}
    			#<?php echo esc_attr($element_id); ?>.style3:before {
    				background: <?php echo esc_attr($st_color); ?>;
    			}
    			<?php } ?>
    			<?php if ($style === 'style4') { ?>
    			/* Style4 */
    			#<?php echo esc_attr($element_id); ?>.style4 {
    				border-image: <?php echo thb_css_gradient($bg_gradient1, $bg_gradient2, "-135", false); ?> 1;
    			}
    			#<?php echo esc_attr($element_id); ?>.style4 {
    				color: <?php echo esc_attr($bg_gradient2); ?>;
    			}
    			#<?php echo esc_attr($element_id); ?>.style4:after {
    				background: <?php echo esc_attr($bg_gradient2); ?>;
    			}
    			<?php } ?>
      </style>
    <?php } ?>
  <?php } ?>
  <?php
  $out = ob_get_clean();

  return $out;
}
thb_add_short( 'thb_button', 'thb_button');
