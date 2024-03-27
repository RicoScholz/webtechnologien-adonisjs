import Item from '#models/item';
import { addItemValidator } from '#validators/post';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';

export default class ItemsController {
    public async allItemsShow({ view, auth }: HttpContext) {
        await auth.check();

        const items: Item[] = await db.from('items').select('*');
    
        return view.render('layouts/main', { page: 'pages/dashboard', items });
    }

    public async singleItemShow({ view, auth, params }: HttpContext) {
        await auth.check();

        const item: Item = await db.from('items').select('*').where('id', params.id).first();
    
        return view.render('layouts/main', { page: 'pages/item-viewer', item });
    }

    public async ownItemsShow({ view, auth }: HttpContext) {
        const items: Item[] = await db.from('items').select('*').where('user_id', auth.user!.id);

        return view.render('layouts/main', { page: 'pages/dashboard', items });
    }

    public async addItemShow({ view }: HttpContext) {
        return view.render('layouts/main', { page: 'pages/profile/add-item' });
    }

    public async addItem({ request, response, auth }: HttpContext) {
        const data = await request.validateUsing(addItemValidator);
        const user_id = await auth.user!.id;
        const active = true

        Item.create({...data, user_id, active });

        return response.redirect('/profile/items');
    }
}