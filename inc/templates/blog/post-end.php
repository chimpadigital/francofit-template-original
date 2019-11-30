<?php do_action( 'thb_post_nav' ); ?>
<?php if (ot_get_option( 'article_related', 'on') == 'on') { ?>
<?php do_action( 'thb_related'); ?>
<?php }