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
import ItemsController from '#controllers/items_controller';
import ChatsController from '#controllers/chats_controller';
import AuthController from '#controllers/auth_controller';

router.get('/', [ItemsController, 'allItemsShow']);

router
    .post('/', [ItemsController, 'search'])
    .as('search');

router.get('/item/:id', [ItemsController, 'singleItemShow']);

router
    .get('/item/:id/deactivate', [ItemsController, 'deactivateItem'])
    .use(middleware.auth());

router
    .get('/item/:id/activate', [ItemsController, 'activateItem'])
    .use(middleware.auth());

router
    .get('/item/:id/chat/:prospect', [ChatsController, 'chatShow'])
    .use(middleware.auth());

router
    .post('/item/:id/chat/:prospect', [ChatsController, 'sendMessage'])
    .as('chat.send')
    .use(middleware.auth());

// auth

router
    .get('/register', [AuthController, 'registerShow'])
    .use(middleware.guest());

router
    .post('/register', [AuthController, 'register'])
    .as('auth.register')
    .use(middleware.guest());

router
    .get('/login', [AuthController, 'loginShow'])
    .use(middleware.guest());

router
    .post('/login', [AuthController, 'login'])
    .as('auth.login')
    .use(middleware.guest());

// profile

router
    .get('/profile/add', [ItemsController, 'addItemShow'])
    .use(middleware.auth());

router
    .post('/profile/add', [ItemsController, 'addItem'])
    .as('items.add')
    .use(middleware.auth());

router
    .get('/profile/items', [ItemsController, 'ownItemsShow'])
    .use(middleware.auth());

router
    .get('/profile/chats', [ChatsController, 'chatOverviewShow'])
    .use(middleware.auth());

router
    .get('/profile/settings', async ({ view }) => {
        return view.render('layouts/main', { page: 'pages/profile/settings' });
    })
    .use(middleware.auth());

router
    .post('/profile/update/name', [AuthController, 'updateName'])
    .as('auth.update.name')
    .use(middleware.auth());

router
    .post('/profile/update/password', [AuthController, 'updatePassword'])
    .as('auth.update.password')
    .use(middleware.auth());

router
    .post('/profile/update/profile_picture', [AuthController, 'updateProfilePicture'])
    .as('auth.update.profilePicture')
    .use(middleware.auth());

router
    .get('/logout', [AuthController, 'logout'])
    .use(middleware.auth());

