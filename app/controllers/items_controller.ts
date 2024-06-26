import Item from '#models/item';
import { addItemValidator, itemImageValidator } from '#validators/post';
import type { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import { Product } from '../types/product.js';
import User from '#models/user';
import app from '@adonisjs/core/services/app';
import { MultipartFile } from '@adonisjs/core/bodyparser';

export default class ItemsController {
    public async allItemsShow({ view, auth }: HttpContext) {
        await auth.check();

        const items: Item[] = await db.from('items').where('active', true);

        const products: Product[] = [];
        for (const info of items) {
            const owner: User = await db.from('users').where('id', info.user_id).first();
            products.push({ info, owner })
        }

        return view.render('layouts/main', { page: 'pages/dashboard', heading: 'Neuste Anzeigen', products });
    }

    public async search({ request, view, auth }: HttpContext) {
        await auth.check()

        let { query, select } = request.only(['query', 'select']);
        if (!query) query = '';
 
        let items: Item[] = [];
        switch (select) {
            case 'title': {
                items = await db
                    .from('items')
                    .whereLike('title', `%${query}%`);
                break;
            }
            case 'description': {
                items = await db
                    .from('items')
                    .whereLike('description', `%${query}%`);
                break;
            }
            case 'user': {
                items = await db
                    .from('items')
                    .select('items.*')
                    .leftJoin('users', 'items.user_id', 'users.id')
                    .whereLike('users.full_name', `%${query}%`);
                break;
            }
            default:
                console.log('no match')
                break;
        }

        const products: Product[] = [];
        for (const info of items) {
            const owner: User = await db.from('users').where('id', info.user_id).first();
            products.push({ info, owner })
        }

        return view.render('layouts/main', { page: 'pages/dashboard', heading: `Ergebnisse für: ${query}`, products, query, select });
    }

    public async singleItemShow({ view, auth, params }: HttpContext) {
        await auth.check();

        const info: Item = await db.from('items').where('id', params.id).first();
        const owner: User = await db.from('users').where('id', info.user_id).first();

        const product: Product = { info, owner };

        return view.render('layouts/main', { page: 'pages/item-viewer', product });
    }

    public async ownItemsShow({ view, auth }: HttpContext) {
        await auth.check()

        const aktiveProducts: Product[] = [];
        const activeItems: Item[] = await db.from('items').where('user_id', auth.user!.id).andWhere('active', true);
        for (const info of activeItems) {
            aktiveProducts.push({ info, owner: auth.user! })
        }

        const inaktiveProducts: Product[] = [];
        const inaktiveItems: Item[] = await db.from('items').where('user_id', auth.user!.id).andWhere('active', false);
        for (const info of inaktiveItems) {
            inaktiveProducts.push({ info, owner: auth.user! })
        }
        return view.render('layouts/main', { page: 'pages/profile/my-items', aktiveProducts, inaktiveProducts });
    }

    public async addItemShow({ view }: HttpContext) {
        return view.render('layouts/main', { page: 'pages/profile/add-item' });
    }

    public async addItem({ request, response, auth }: HttpContext) {
        const validData = await request.validateUsing(addItemValidator);

        let files = request.allFiles();
        if (!(files['item_images'] instanceof Array)) files['item_images'] = [files['item_images'] as MultipartFile];

        const validFiles = await itemImageValidator.validate(files);

        const imageLinks = validFiles.item_images.map(file => file.clientName);

        const item = await Item.create({
            ...validData,
            item_images: JSON.stringify(imageLinks),
            user_id: auth.user!.id,
            active: true
        });

        for (const image of validFiles.item_images) {
            image.move(app.makePath(`public/assets/items/${item.id}`));
        }

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
            return response.redirect().back();
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
            return response.redirect().back();
        }

        return response.forbidden();
    }
}