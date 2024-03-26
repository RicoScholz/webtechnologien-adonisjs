import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
      fullName: vine.string().trim().minLength(3),
      email: vine.string().trim().email().unique(async (db, value) => {
        const user = await db
          .from('users')
          .where('email', value)
          .first()
        return !user
      }),
      password: vine.string().trim().minLength(8)
    })
  )