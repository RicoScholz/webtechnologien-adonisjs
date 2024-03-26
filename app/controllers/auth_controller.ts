import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from '#validators/post'
import User from '#models/user';

export default class AuthController {
    public async registerShow({ view }: HttpContext) {
        return view.render('layouts/main', { page: 'pages/auth/register' });
    }

    public async register({ request, response, auth }: HttpContext) {
        const data = await request.validateUsing(registerValidator);

        const user = await User.create(data);

        await auth.use('web').login(user);

        return response.redirect('/');
    }

    public async loginShow({ view }: HttpContext) {
        return view.render('layouts/main', { page: 'pages/auth/login' });
    }

    public async login({ request, response, auth }: HttpContext) {
        const { email, password } = request.only(['email', 'password']);

        const user =  await User.verifyCredentials(email, password);

        await auth.use('web').login(user);

        return response.redirect('/')
    }
}