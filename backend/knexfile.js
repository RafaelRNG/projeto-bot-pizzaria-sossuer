// Update with your config settings.

module.exports = {
  client: 'pg',
  connection: {
    database: 'pizzariasossuer',
    user: 'postgres',
    password: '44919548877'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}
