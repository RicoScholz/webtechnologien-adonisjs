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
import db from '@adonisjs/lucid/services/db'
import Item from '#models/item';

router.get('/', async ({ view, auth }) => {
    await auth.check();

    const items: Item[] = await db.from('items').select('*');

    return view.render('layouts/main', { page: 'pages/dashboard', items });
});

router.get('/item/:id', async ({ view, auth, params }) => {
    await auth.check();

    const item: Item = await db.from('items').select('*').where('id', params.id).first();

    return view.render('layouts/main', { page: 'pages/item-viewer', item });
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
    .get('/profile/add', '#controllers/items_controller.addItemShow')
    .as('items.add.show')
    .use(middleware.auth());

router
    .post('/profile/add', '#controllers/items_controller.addItem')
    .as('items.add')
    .use(middleware.auth());

router
    .get('/profile/items', async ({ view, auth }) => {
        const items: Item[] = await db.from('items').select('*').where('user_id', auth.user!.id);

        return view.render('layouts/main', { page: 'pages/dashboard', items });
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

