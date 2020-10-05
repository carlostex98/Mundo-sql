const pool = require('../database');

async function consulta() {
    const f = await pool.query("select nombre, sum(cantidad_compra) as cantidad from clientes " +
        "inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk " +
        "inner join productos p on ccp.id_producto_fk = p.id_producto " +
        "inner join producto_categoria pc on p.id_producto = pc.id_producto_fk " +
        "inner join categorias c on pc.id_categoria_fk = c.id_categoria " +
        "where nombre_categoria = 'Seafood' " +
        "group by nombre "+
        "order by cantidad desc limit 10 ");
    return f;
}

module.exports.consulta = consulta;