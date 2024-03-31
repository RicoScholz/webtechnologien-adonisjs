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
        const product: Product = { info, owner };

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

    public async chatOverviewShow({ view, auth }: HttpContext) {
        await auth.check();

        const prospects = await db
            .from('messages')
            .distinct('items.id as item_id')
            .select('items.title', 'users.id as user_id', 'users.full_name')
            .leftJoin('items', 'messages.item_id', 'items.id')
            .leftJoin('users', query => {
            query.on('messages.sender_id', '=', 'users.id')
                .orOn('messages.receiver_id', '=', 'users.id')
            })
            .where('items.user_id', auth.user!.id)
            .andWhereNot('users.id', auth.user!.id)
            .andWhere(query => {
                query.where('messages.sender_id', auth.user!.id)
                .orWhere('messages.receiver_id', auth.user!.id)
            })
            .then(async (rows) => {
                return rows.reduce((acc, row) => {
                  const existingItem = acc.find((item: any) => item.item_id === row.item_id);
                  if (existingItem) {
                    existingItem.users.push({ user_id: row.user_id, full_name: row.full_name });
                  } else {
                    acc.push({ item_id: row.item_id, title: row.title, users: [{ user_id: row.user_id, full_name: row.full_name }] });
                  }
                  return acc;
                }, []);
            });

        const requests = await db
            .from('messages')
            .distinct('items.id as item_id')
            .select('items.title', 'users.id as user_id', 'users.full_name')
            .leftJoin('items', 'messages.item_id', 'items.id')
            .leftJoin('users', query => {
            query.on('messages.sender_id', '=', 'users.id')
                .orOn('messages.receiver_id', '=', 'users.id')
            })
            .whereNot('items.user_id', auth.user!.id)
            .andWhereNot('users.id', auth.user!.id)
            .andWhere(query => {
                query.where('messages.sender_id', auth.user!.id)
                .orWhere('messages.receiver_id', auth.user!.id)
            })

        return view.render('layouts/main', { page: 'pages/profile/chats-overview', prospects, requests });
    }
}