<?php
$blog_nav_style = ot_get_option( 'blog_nav_style', 'style1');
$cond = ('style2' == $blog_nav_style); ?>

<footer class="article-tags entry-footer nav-style-<?php echo esc_attr($blog_nav_style); ?>">
<div class="row">
	<?php if ($cond) { ?>
	<div class="small-12 medium-3 columns medium-text-left">
		<?php do_action( 'thb_social_article_detail'); ?>
	</div>
	<?php } ?>
	<div class="small-12 <?php if ($cond) { ?>medium-9 medium-text-right <?php } else { ?>medium-12 <?php } ?>columns">
		<?php if (ot_get_option( 'article_tags', 'on') == 'on') { ?>
				<?php
				if ($posttags = get_the_tags()) {
					$return = '';
					foreach($posttags as $thb_tag) {
						$return .= '<a href="'. get_tag_link($thb_tag->term_id).'" title="'. get_tag_link($thb_tag->name).'" class="tag-cloud-link">' . $thb_tag->name . '</a> ';
					}
					echo substr($return, 0, -1);
				} ?>
		<?php } ?>
	</div>
</div>
</footer>
<?php if (ot_get_option( 'article_author', 'on') == 'on') { ?>
	<?php do_action( 'thb_author'); ?>
<?php } ?>