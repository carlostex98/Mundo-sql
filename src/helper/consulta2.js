const pool = require('../database');

async function consulta() {
    const f = await pool.query("select clientes.id_cliente, clientes.nombre, count(cliente_compra_producto.cantidad_compra) " +
        "as cant from cliente_compra_producto " +
        "inner join clientes on cliente_compra_producto.id_cliente_fk = clientes.id_cliente " +
        "group by clientes.id_cliente, clientes.nombre " +
        "order by cant desc , nombre asc limit 1 ");
    return f;
}

module.exports.consulta = consulta;