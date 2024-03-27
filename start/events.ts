import emitter from '@adonisjs/core/services/emitter'

emitter.on('session_auth:login_attempted', (event) => {
  console.log('login sueccess: ' + event.user.full_name)
})
