import vine from '@vinejs/vine';

const profilePicture = {
  profile_picture: vine.file({
    size: '1mb',
    extnames: ['jpg', 'png', 'jpeg']
  })
};

const fullName = { full_name: vine.string().trim().minLength(3) };
const password = { password: vine.string().trim().minLength(8) };

export const registerValidator = vine.compile(
  vine.object({
    ...fullName,
    email: vine.string().trim().email().unique(async (db, value) => {
      const user = await db
        .from('users')
        .where('email', value)
        .first()
      return !user
    }),
    ...password
  })
);

export const avatarValidator = vine.compile(vine.object({ ...profilePicture }));
export const updateNameValidator = vine.compile(vine.object({ ...fullName }));
export const updatePasswordValidator = vine.compile(vine.object({ ...password }));
export const updateProfilePictureValidator = vine.compile(vine.object({ ...profilePicture }));


export const addItemValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    description: vine.string().trim(),
    price: vine.number().positive()
  })
);

export const itemImageValidator = vine.compile(
  vine.object({
    item_images: vine.array(
      vine.file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg']
      })
    ).minLength(1)
  })
);

export const messageValidator = vine.compile(
  vine.object({
    message: vine.string().trim().minLength(1).maxLength(500)
  })
);
