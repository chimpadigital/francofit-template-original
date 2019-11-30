<?php
/* Custom Language Switcher */
function thb_language_switcher() {
	$thb_ls = ot_get_option( 'thb_ls', 'on');
	if ($thb_ls !== 'off') {
		if ( function_exists('icl_get_languages') || defined('THB_DEMO_SITE') || function_exists('pll_the_languages')) {
			$permalink = get_permalink();
			$full_menu_hover_style = ot_get_option( 'full_menu_hover_style', 'thb-standard');
		?>
		<ul class="thb-full-menu thb-language-switcher <?php echo esc_attr($full_menu_hover_style); ?>">
			<li class="menu-item-has-children">
				<a href="#"><?php
					if (defined('THB_DEMO_SITE')) {
						$languages = array(
							"en" => array(
								"language_code" => "en",
								"active" => 1,
								"url" => $permalink,
								"native_name" => "English"
							),
							"fr" => array(
								"language_code" => "fr",
								"active" => 0,
								"url" => $permalink,
								"native_name" => "Français"
							),
							"de" => array(
								"language_code" => "de",
								"active" => 0,
								"url" => $permalink,
								"native_name" => "Deutsch"
							)
						);
					} elseif (function_exists('pll_the_languages')) {
						$languages = pll_the_languages(array('raw'=>1));
					} elseif (function_exists('icl_get_languages')) {
						$languages = icl_get_languages('skip_missing=0');
					}

						if(1 < count($languages)){
							if (function_exists('pll_the_languages')) { // Polylang
								foreach($languages as $l){
									echo esc_attr($l['current_lang'] ? $l['slug'] : '');
								}
							} else { // WPML
								foreach($languages as $l){
									echo esc_attr($l['active'] ? $l['language_code'] : '');
								}
							}
						}
					?></a>
				<ul class="sub-menu">
				<?php
					if(0 < count($languages)){
						foreach($languages as $l){
							if (function_exists('pll_the_languages')) {
								if (!$l['current_lang']) {
									echo '<li><a href="'.$l['url'].'" title="'.$l['name'].'">'.$l['name'].'</a></li>';
								}
							} else {
								if (!$l['active']) {
									echo '<li><a href="'.$l['url'].'" title="'.$l['native_name'].'">'.$l['native_name'].'</a></li>';
								}
							}
						}
					} else {
						echo '<li>'.esc_html__('Add Languages', 'revolution' ).'</li>';
					}
				?>
				</ul>
			</li>
		</ul>
		<?php
		}
	}
}
add_action( 'thb_language_switcher', 'thb_language_switcher' );

/* Custom Language Switcher */
function thb_language_switcher_mobile() {
	$thb_ls = ot_get_option( 'thb_ls', 'on');
	if ($thb_ls !== 'off') {
		if ( function_exists('icl_get_languages') || defined('THB_DEMO_SITE') || function_exists('pll_the_languages')) {
			$permalink = get_permalink();
		?>
		<div class="thb-mobile-language-switcher">
			<?php
				if (defined('THB_DEMO_SITE')) {
					$languages = array(
						"en" => array(
							"language_code" => "en",
							"active" => 1,
							"url" => $permalink,
							"native_name" => "English"
						),
						"fr" => array(
							"language_code" => "fr",
							"active" => 0,
							"url" => $permalink,
							"native_name" => "Français"
						),
						"de" => array(
							"language_code" => "de",
							"active" => 0,
							"url" => $permalink,
							"native_name" => "Deutsch"
						)
					);
				} elseif (function_exists('pll_the_languages')) {
					$languages = pll_the_languages(array('raw'=>1));
				} elseif (function_exists('icl_get_languages')) {
					$languages = icl_get_languages('skip_missing=0');
				}

				if(0 < count($languages)){
					foreach($languages as $l){
						if (function_exists('pll_the_languages')) {
							$class = $l['current_lang'] ? ' class="active"' : '';
							echo '<a href="'.esc_url($l['url']).'"'.$class.' title="'.esc_attr($l['name']).'">'.$l['slug'].'</a>';
						} else {
							$class = $l['active'] ? ' class="active"' : '';
							echo '<a href="'.esc_url($l['url']).'"'.$class.' title="'.esc_attr($l['native_name']).'">'.$l['language_code'].'</a>';
						}
					}
				} else {
					echo esc_html__('Add Languages', 'revolution' );
				}
			?>
		</div>
		<?php
		}
	}
}
add_action( 'thb_language_switcher_mobile', 'thb_language_switcher_mobile' );