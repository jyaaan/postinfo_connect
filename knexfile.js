exports.development = {
  client: 'postgresql',
  connection: {
    user: 'postgres',
    password: 'peanut',
    host: 'localhost',
    database: 'postinfo-connect'
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
};