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
import Item from '#models/item';

router.get('/', '#controllers/items_controller.allItemsShow');

router.get('/item/:id', '#controllers/items_controller.singleItemShow');

// for unauthenticated users only

router
    .get('/register', '#controllers/auth_controller.registerShow')
    .use(middleware.guest());

router
    .post('/register', '#controllers/auth_controller.register')
    .as('auth.register')
    .use(middleware.guest());

router
    .get('/login', '#controllers/auth_controller.loginShow')
    .use(middleware.guest());

router
    .post('/login', '#controllers/auth_controller.login')
    .as('auth.login')
    .use(middleware.guest());

// for authenticated users only

router
    .get('/profile/add', '#controllers/items_controller.addItemShow')
    .use(middleware.auth());

router
    .post('/profile/add', '#controllers/items_controller.addItem')
    .as('items.add')
    .use(middleware.auth());

router
    .get('/profile/items', '#controllers/items_controller.ownItemsShow')
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
        await auth.use('web').logout();
        return response.redirect('/')
    })
    .use(middleware.auth());

