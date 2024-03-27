import Item from '#models/item';
import { addItemValidator } from '#validators/post';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import { Product } from '../types/product.js';
import User from '#models/user';

export default class ItemsController {
    public async allItemsShow({ view, auth }: HttpContext) {
        await auth.check();

        const products: Product[] = [];

        const items: Item[] = await db.from('items').select('*').where('active', true);

        for (const info of items) {
            const owner: User = await db.from('users').select('*').where('id', info.user_id).first();
            products.push({ info, owner, editable: false })
        }
        
        return view.render('layouts/main', { page: 'pages/dashboard', products });
    }

    public async singleItemShow({ view, auth, params }: HttpContext) {
        await auth.check();

        const info: Item = await db.from('items').select('*').where('id', params.id).first();
        const owner: User = await db.from('users').select('*').where('id', info.user_id).first();

        const product: Product = { info, owner, editable: false};
    
        return view.render('layouts/main', { page: 'pages/item-viewer', product });
    }

    public async ownItemsShow({ view, auth }: HttpContext) {
        await auth.check()
        
        const products: Product[] = [];
        
        const items: Item[] = await db.from('items').select('*').where('user_id', auth.user!.id);

        for (const info of items) {
            products.push({ info, owner: auth.user!, editable: true })
        }

        return view.render('layouts/main', { page: 'pages/dashboard', products });
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

    public async deactivateItem({ response, auth, params }: HttpContext) {
        await auth.check();

        const item: Item | null = await Item.find(params.id);
        if (!item) return response.abort({ err: 'item does not exist' });

        const owner: User | null = await User.find(item.user_id);
        if (!owner) return response.abort({ err: 'user does not exist' });

        if (auth.user!.id === owner.id) {
            item.active = false;
            await item.save();
            return response.redirect('/profile/items');
        }

        return response.forbidden();
    }

    public async activateItem({ response, auth, params }: HttpContext) {
        await auth.check();

        const item: Item | null = await Item.find(params.id);
        if (!item) return response.abort({ err: 'item does not exist' });

        const owner: User | null = await User.find(item.user_id);
        if (!owner) return response.abort({ err: 'user does not exist' });

        if (auth.user!.id === owner.id) {
            item.active = true;
            await item.save();
            return response.redirect('/profile/items');
        }

        return response.forbidden();
    }
}