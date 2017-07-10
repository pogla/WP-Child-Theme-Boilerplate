<?php
//show_admin_bar( false );

//Allow svg
function cc_mime_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');

//Styles and scripts
add_action( 'wp_enqueue_scripts', 'custom_enqueue_styles' );
function custom_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array( 'parent-style' ), wp_get_theme()->get('Version'));
    wp_enqueue_script( 'child-custom-js', get_stylesheet_directory_uri() . '/js/dist/build.js', array('jquery') , wp_get_theme()->get('Version') , true );
}

//async and defer to scripts
add_filter('script_loader_tag', 'add_defer_attribute', 10, 2);
function add_defer_attribute($tag, $handle) {
    if ( !in_array($handle, array( 'child-custom-js') ) )
        return $tag;
    return str_replace( ' src', ' defer="defer" async="async" src', $tag );
}

// load custom translation file for the parent theme
// add_action( 'after_setup_theme', function () {
//     load_theme_textdomain( 'parent-textdomain', get_stylesheet_directory() . '/languages' );
// });