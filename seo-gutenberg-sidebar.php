<?php
/**
 * Plugin Name: SEO Gutenberg Sidebar
 * Version: 1.0.0
 * Plugin URI: https://themeforest.net/user/airfast
 * Description: SEO Sidebar for the block editor Gutenberg. This plugin also sets simple SEO settings for your entire site.
 * Author: Andrew Petryk
 * Author URI: https://themeforest.net/user/airfast
 * Text Domain: seo-gutenberg-sidebar
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . 'inc/metabox.php';

function seo_enqueue_assets() {
	wp_enqueue_script(
		'seo-gutenberg-sidebar',
		plugins_url( 'build/index.js', __FILE__ ),
		array(
			'wp-plugins',
			'wp-edit-post',
			'wp-i18n',
			'wp-element',
			'wp-components',
			'wp-data',
			'wp-compose'
		)
	);
}

add_action( 'enqueue_block_editor_assets', 'seo_enqueue_assets' );

function seo_set_script_translations() {

	wp_set_script_translations(
		'seo-gutenberg-sidebar',
		'seo-gutenberg-sidebar',
		plugin_dir_path( __FILE__ ) . '/languages/'
	);
}

add_action( 'init', 'seo_set_script_translations' );

function seo_meta_robots_directives( $robots ) {
	if ( is_home() || is_front_page() || is_category() ) {
		if ( get_option( 'blog_public' ) ) {
			$robots['max-snippet']       = '-1';
			$robots['max-video-preview'] = '-1';
		}
	}

	if ( is_singular() && ! is_front_page() ) {
		global $post;
		$seo_meta_data = get_post_meta( $post->ID, '_seo_meta_data', true );

		if ( isset( $seo_meta_data['is_index'] ) && ! $seo_meta_data['is_index'] ) {
			unset( $robots['max-image-preview'] );
		}

		if ( isset( $seo_meta_data['is_index'] ) ) {
			if ( $seo_meta_data['is_index'] ) {
				unset( $robots['noindex'] );
				$robots['max-image-preview'] = 'large';
				$robots['max-snippet']       = '-1';
				$robots['max-video-preview'] = '-1';
				$robots['index']             = true;
			} else {
				$robots['noindex'] = true;
			}
		}

		if ( isset( $seo_meta_data['is_follow'] ) ) {
			if ( $seo_meta_data['is_follow'] ) {
				unset( $robots['nofollow'] );
				$robots['follow'] = true;
			} else {
				$robots['nofollow'] = true;
			}
		}

		if ( isset( $seo_meta_data['is_image_index'] ) && ! $seo_meta_data['is_image_index'] ) {
			$robots['noimageindex'] = true;
		}

		if ( isset( $seo_meta_data['is_archive'] ) && ! $seo_meta_data['is_archive'] ) {
			$robots['noarchive'] = true;
		}

		if ( isset( $seo_meta_data['is_snippet'] ) && ! $seo_meta_data['is_snippet'] ) {
			unset( $robots['max-snippet'] );
			$robots['nosnippet'] = true;
		}

	}

	return $robots;
}

add_filter( 'wp_robots', 'seo_meta_robots_directives' );


function seo_meta_description() {
	if ( is_singular() && ! is_front_page() ) {
		global $post;
		$seo_meta_data = get_post_meta( $post->ID, '_seo_meta_data', true );

		if ( ! empty( $seo_meta_data['description'] ) && isset( $seo_meta_data['description'] ) ) {
			echo '<meta name="description" content="' . esc_attr( $seo_meta_data['description'] ) . '" />' . "\n";
		}
	}

	if ( is_home() || is_front_page() ) {
		echo '<meta name="description" content="' . esc_attr( get_bloginfo( 'description' ) ) . '" />' . "\n";
	}

	if ( is_category() ) {
		echo '<meta name="description" content="' . esc_attr( wp_strip_all_tags( category_description() ) ) . '" />' . "\n";
	}
}

add_action( 'wp_head', 'seo_meta_description', 1 );