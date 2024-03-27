import Item from '#models/item';
import { addItemValidator } from '#validators/post';
import type { HttpContext } from '@adonisjs/core/http'

export default class ItemsController {
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