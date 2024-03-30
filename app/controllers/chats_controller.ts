import Item from '#models/item';
import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db';
import { Product } from '../types/product.js';

export default class ChatsController {
    public async chatShow({ view, params }: HttpContext) {
        const info: Item = await db.from('items').select('*').where('id', params.id).first();
        const owner: User = await db.from('users').select('*').where('id', info.user_id).first();

        const product: Product = { info, owner, editable: false };
        
        return view.render('layouts/main', { page: 'pages/chat', product });
    }
}