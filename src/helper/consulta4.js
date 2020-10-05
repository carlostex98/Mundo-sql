const pool = require('../database');

async function consulta() {
    const f = await pool.query("select id_cliente, " +
        "substring_index(nombre,' ',1)as nombre_, " +
        "substring_index(nombre,' ',-1)as apellido_, " +
        "count(cantidad_compra) as compras, sum(precio_unitario) as cantidad from clientes " +
        "inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk " +
        "inner join productos p on ccp.id_producto_fk = p.id_producto " +
        "inner join producto_categoria pc on p.id_producto = pc.id_producto_fk " +
        "inner join categorias c on pc.id_categoria_fk = c.id_categoria " +
        "where  nombre_categoria = 'Cheese' " +
        "group by nombre, id_cliente " +
        "order by compras desc, cantidad desc " +
        "limit 5 ");
    return f;
}

module.exports.consulta = consulta;