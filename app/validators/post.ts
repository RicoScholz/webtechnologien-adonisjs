import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim().minLength(3),
    email: vine.string().trim().email().unique(async (db, value) => {
      const user = await db
        .from('users')
        .where('email', value)
        .first()
      return !user
    }),
    password: vine.string().trim().minLength(8),
  })
);

export const avatarValidator = vine.compile(
  vine.object({
    profile_picture: vine.file({ 
      size: '1mb',
      extnames: ['jpg', 'png', 'jpeg']
    })
  })
);

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
    )
  })
);
