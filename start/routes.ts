/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';
// import db from '@adonisjs/lucid/services/db'
// import hash from '@adonisjs/core/services/hash'

router.get('/', async ({ view }) => {
    const products = [
        { hash: 'werdsghh', title: 'Schreibtisch', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' },
        { hash: 'werefsda', title: 'asdfsad', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' },
        { hash: 'xycvpwoe', title: 'sadlfasöldföl', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' }
    ];

    return view.render('layouts/main', { page: 'pages/dashboard', products: products });
});

router.get('/item/:hash', async ({ view, params }) => {
    return view.render('layouts/main', { page: 'pages/item-viewer', params: params });
});

// for unauthenticated users only

router
    .get('/login', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/auth/login' });
    })
    .use(middleware.guest({
        guards: ['web']
    }));

router
    .get('/register', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/auth/register' });
    })
    .use(middleware.guest({
        guards: ['web']
    }));;

// for authenticated users only

router
    .get('/profile/add', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/profile/add-item' });
    })
    .use(middleware.auth({
        guards: ['web']
    }));

router
    .get('/profile/items', async ({ view }) => {
        const products = [
            { hash: 'werdsghh', title: 'Schreibtisch', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' },
        ];

        return view.render('layouts/main', { page: 'pages/dashboard', products: products });
    })
    .use(middleware.auth({
        guards: ['web']
    }));

router
    .get('/profile/chats', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/profile/chats-overview' });
    })
    .use(middleware.auth({
        guards: ['web']
    }));

router
    .get('/profile/settings', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/profile/settings' });
    })
    .use(middleware.auth({
        guards: ['web']
    }));

