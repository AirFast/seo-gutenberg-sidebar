<?php

function seo_register_meta() {
	register_meta( 'post', '_seo_meta_data', array(
			'single'            => true,
			'type'              => 'object',
			'show_in_rest'      => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'description'    => array(
							'type' => 'string',
						),
						'is_index'       => array(
							'type' => 'number',
						),
						'is_follow'      => array(
							'type' => 'number',
						),
						'is_image_index' => array(
							'type' => 'number',
						),
						'is_archive'     => array(
							'type' => 'number',
						),
						'is_snippet'     => array(
							'type' => 'number',
						),
					),
				),
			),
			'sanitize_callback' => 'sanitize_meta_data',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			}
		)
	);
}

add_action( 'init', 'seo_register_meta' );

function sanitize_meta_data( $data ) {
	if ( is_string( $data ) ) {
		$data = wp_strip_all_tags( $data );
	}

	if ( is_array( $data ) ) {
		foreach ( $data as $key => &$value ) {
			if ( is_array( $value ) ) {
				$value = sanitize_meta_data( $value );
			} else {
				$value = wp_strip_all_tags( $value );
			}
		}
	}

	return $data;
}