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

router.get('/', async ({ view, auth }) => {
    await auth.check()

    const products = [
        { hash: 'werdsghh', title: 'Schreibtisch', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' },
        { hash: 'werefsda', title: 'asdfsad', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' },
        { hash: 'xycvpwoe', title: 'sadlfasöldföl', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' }
    ];

    return view.render('layouts/main', { page: 'pages/dashboard', products });
});

router.get('/item/:hash', async ({ view, auth, params }) => {
    await auth.check();

    return view.render('layouts/main', { params, page: 'pages/item-viewer',  });
});

// for unauthenticated users only

router
    .get('/register', '#controllers/auth_controller.registerShow')
    .as('auth.register.show')
    .use(middleware.guest());

router
    .post('/register', '#controllers/auth_controller.register')
    .as('auth.register')
    .use(middleware.guest());

router
    .get('/login', '#controllers/auth_controller.loginShow')
    .as('auth.login.show')
    .use(middleware.guest());

router
    .post('/login', '#controllers/auth_controller.login')
    .as('auth.login')
    .use(middleware.guest());

// for authenticated users only

router
    .get('/profile/add', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/profile/add-item' });
    })
    .use(middleware.auth());

router
    .get('/profile/items', async ({ view }) => {
        const products = [
            { hash: 'werdsghh', title: 'Schreibtisch', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' },
        ];

        return view.render('layouts/main', { page: 'pages/dashboard', products: products });
    })
    .use(middleware.auth());

router
    .get('/profile/chats', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/profile/chats-overview' });
    })
    .use(middleware.auth());

router
    .get('/profile/settings', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/profile/settings' });
    })
    .use(middleware.auth());

router
    .get('/logout', async ({ response, auth }) => {
        await auth.use('web').logout()
        return response.redirect('/')
    })
    .use(middleware.auth());

