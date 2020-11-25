exports.up = function (knex) {
    return knex.schema.createTable('pedidos', table => {
        table.increments("id").primary()
        table.string('pedido')
        table.integer("clienteId")
            .references("userId")
            .inTable("clientes");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('pedidos')
};
