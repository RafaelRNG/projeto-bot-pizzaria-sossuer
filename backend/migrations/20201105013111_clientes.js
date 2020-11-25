exports.up = function (knex) {
    return knex.schema.createTable('clientes', table => {
        table.integer('userId').primary()
        table.string("nome")
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('clientes')
};

