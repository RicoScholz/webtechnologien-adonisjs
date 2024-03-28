import type { HttpContext } from '@adonisjs/core/http'
import { avatarValidator, registerValidator, updateNameValidator, updatePasswordValidator, updateProfilePictureValidator } from '#validators/post'
import User from '#models/user';
import app from '@adonisjs/core/services/app';
import { request } from 'http';

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

        const user = await User.verifyCredentials(email, password);

        await auth.use('web').login(user);

        return response.redirect('/')
    }

    public async updateName({ request, response, auth }: HttpContext) {
        await auth.check();
        const user = await User.find(auth.user!.id);

        const validData = await request.validateUsing(updateNameValidator);

        if (user) {
            user.full_name = validData.full_name;
            user.save();
        }

        return response.redirect('/profile/settings');
    }

    public async updatePassword({ request, response, auth }: HttpContext) {
        await auth.check();
        const user = await User.find(auth.user!.id);

        const validData = await request.validateUsing(updatePasswordValidator);

        if (user) {
            user.password = validData.password;
            user.save();
        }

        return response.redirect('/profile/settings');
    }

    public async updateProfilePicture({ request, response, auth }: HttpContext) {
        await auth.check();
        const user = await User.find(auth.user!.id);
        if (!user) return response.abort({ err: 'user does not exist' });

        const file = request.allFiles();
        const validFiles = await avatarValidator.validate(file);

        user.profile_picture = validFiles.profile_picture.clientName;
        user.save();
        await validFiles.profile_picture.move(app.makePath(`public/assets/profile_pictures/${user.id}`));

        return response.redirect('/profile/settings');
    }
}