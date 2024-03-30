import Item from '#models/item';
import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db';
import { Product } from '../types/product.js';
import Message from '#models/message';
import { messageValidator } from '#validators/post';

export default class ChatsController {
    public async chatShow({ response, view, auth, params }: HttpContext) {
        await auth.check();

        const info: Item = await db.from('items').where('id', params.id).first();
        const owner: User = await db.from('users').where('id', info.user_id).first();
        const product: Product = { info, owner, editable: false };

        if (auth.user?.id == params.prospect && auth.user?.id == owner.id) return response.forbidden();
        if (auth.user?.id != params.prospect && auth.user?.id != owner.id) return response.unauthorized();

        const messages: Message[] = await db
            .from('messages')
            .where('item_id', params.id)
            .andWhere(query => {
                query
                    .where((query) => {
                        query
                            .where('sender_id', params.prospect)
                            .andWhere('receiver_id', owner.id)
                    })
                    .orWhere((query) => {
                        query
                            .where('sender_id', owner.id)
                            .andWhere('receiver_id', params.prospect)
                    })
            });

        return view.render('layouts/main', { page: 'pages/chat', product, messages });
    }

    public async sendMessage({ request, response, auth, params }: HttpContext) {
        await auth.check();

        const validData = await request.validateUsing(messageValidator);

        const item: Item = await db.from('items').where('id', params.id).first();
        const owner: User = await db.from('users').where('id', item.user_id).first();

        if (auth.user?.id == owner.id) return response.forbidden();
        if (auth.user?.id != params.prospect && auth.user?.id != owner.id) return response.unauthorized();

        Message.create({
            sender_id: auth.user?.id,
            receiver_id: auth.user?.id === owner.id ? params.prospect : owner.id,
            item_id: item.id,
            content: validData.message
        });

        return response.redirect().back();
    }
}