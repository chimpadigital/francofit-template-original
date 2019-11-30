<?php

// Get Instagram Photos.
function thb_getInstagramPhotos( $number = 6 ) {
	$username     = ot_get_option( 'instagram_username' );
	$access_token = ot_get_option( 'instagram_accesstoken' );
	$transient    = 'thb-instagram-media-' . $access_token . '-' . $number;
	$instagram    = get_transient( $transient );

	if ( false === $instagram && $username && $access_token ) {
		$response = wp_remote_get( 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' . $access_token . '&count=' . $number, array( 'sslverify' => false ) );
		if ( is_wp_error( $response ) ) {
			$error_string = $response->get_error_message();
			echo esc_html( $error_string );
			return;
		}
		$body = json_decode( wp_remote_retrieve_body( $response ) );
		if ( isset( $body->meta->error_message ) ) {
			echo esc_html( $body->meta->error_message );
			return;
		}
		$instagram = array();
		if ( property_exists( $body, 'error_type' ) ) {
			echo esc_html( $body->error_message );
		} elseif ( property_exists( $body, 'data' ) ) {
			foreach ( $body->data as $item ) {
				$instagram[] = array(
					'link'      => $item->link,
					'image_url' => $item->images->standard_resolution->url,
					'likes'     => $item->likes->count,
					'comments'  => $item->comments->count,
					'caption'   => $item->caption->text,
				);
			}
		}
		$instagram = serialize( $instagram );
		set_transient( $transient, $instagram, HOUR_IN_SECONDS );
	}
	$instagram = unserialize( $instagram );

	return $instagram;
}
