import type { HttpContext } from '@adonisjs/core/http'
import { avatarValidator, registerValidator } from '#validators/post'
import User from '#models/user';
import app from '@adonisjs/core/services/app';

export default class AuthController {
    public async registerShow({ view }: HttpContext) {
        return view.render('layouts/main', { page: 'pages/auth/register' });
    }

    public async register({ request, response, auth }: HttpContext) {
        const validData = await request.validateUsing(registerValidator);
        const file = request.allFiles();
        const validFiles = await avatarValidator.validate(file);
        
        const user = await User.create({
            ...validData,
            profile_picture: validFiles.profile_picture.clientName
        });
        
        await auth.use('web').login(user);
        
        await validFiles.profile_picture.move(app.makePath(`public/assets/profile_pictures/${user.id}`));

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