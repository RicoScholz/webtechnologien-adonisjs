import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sender_id').references('id').inTable('users').notNullable()
      table.integer('receiver_id').references('id').inTable('users').notNullable()
      table.integer('item_id').references('id').inTable('items').notNullable()
      table.string('content').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}