<?php

namespace Config;

use CodeIgniter\Router\RouteCollection;

$routes = Services::routes();

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();

// ============================================
// API ROUTES
// ============================================
$routes->group('api', ['namespace' => 'App\Controllers'], function($routes) {
    $routes->post('auth/login', 'Auth::login');
    
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->post('auth/logout', 'Auth::logout');
        $routes->get('auth/me', 'Auth::me');
        
        $routes->get('product', 'Product::index');
        $routes->get('product/(:num)', 'Product::show/$1');
        $routes->post('product', 'Product::create');
        $routes->put('product/(:num)', 'Product::update/$1');
        $routes->delete('product/(:num)', 'Product::delete/$1');
        
        $routes->get('category', 'Category::index');
        $routes->get('category/(:num)', 'Category::show/$1');
        $routes->post('category', 'Category::create');
        $routes->put('category/(:num)', 'Category::update/$1');
        $routes->delete('category/(:num)', 'Category::delete/$1');
        
        $routes->get('supplier', 'Supplier::index');
        $routes->get('supplier/(:num)', 'Supplier::show/$1');
        $routes->post('supplier', 'Supplier::create');
        $routes->put('supplier/(:num)', 'Supplier::update/$1');
        $routes->delete('supplier/(:num)', 'Supplier::delete/$1');
    });
});

// ============================================
// TEST LOGIN (tanpa auth)
// ============================================
$routes->post('test-login', 'TestLogin::index');
$routes->get('test-login', 'TestLogin::index');

// Default
$routes->get('/', 'Home::index');