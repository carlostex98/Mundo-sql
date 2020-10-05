const pool = require('../database');

async function consulta() {
    const f = await pool.query("(select " +
        "substring_index(nombre,' ',1)as nombre_, " +
        "substring_index(nombre,' ',-1)as apellido_, " +
        "extract( month from fecha_reg) as fecha, " +
        "sum(cantidad_compra*precio_unitario) as dinero from clientes " +
        "inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk " +
        "inner join productos p on ccp.id_producto_fk = p.id_producto " +
        "group by nombre, fecha_reg " +
        "order by dinero limit 1) " +
        "union all " +
        "(select " +
        "substring_index(nombre,' ',1)as nombre_, " +
        "substring_index(nombre,' ',-1)as apellido_, " +
        "extract( month from fecha_reg) as fecha, " +
        "sum(cantidad_compra*precio_unitario) as dinero from clientes " +
        "inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk " +
        "inner join productos p on ccp.id_producto_fk = p.id_producto " +
        "group by nombre, fecha_reg " +
        "order by dinero desc limit 1 ) ");
    return f;
}

module.exports.consulta = consulta;