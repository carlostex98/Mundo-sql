const pool = require('../database');

async function consulta(){
    const f = await pool.query("(select nombre, nombre_region, nombre_ciudad, direccion, codigo_postal, "+
        "sum(cantidad_compra * precio_unitario) as monto "+
        "from clientes "+
        "inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk "+
        "inner join productos p on ccp.id_producto_fk = p.id_producto "+
        "inner join cliente_region cr on clientes.id_cliente = cr.id_cliente_fk "+
        "inner join regiones r on cr.id_region_fk = r.id_region "+
        "inner join cliente_ciudad cc on clientes.id_cliente = cc.id_cliente_fk "+
        "inner join ciudades c on cc.id_ciudad_fk = c.id_ciudad "+
        "group by nombre, nombre_region, nombre_ciudad, direccion, codigo_postal "+
        "order by monto desc limit 1 ) "+
        "union all "+
        "(select nombre, nombre_region, nombre_ciudad, direccion, codigo_postal, "+
        "sum(cantidad_compra * precio_unitario) as monto "+
        "from clientes "+
        "inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk "+
        "inner join productos p on ccp.id_producto_fk = p.id_producto "+
        "inner join cliente_region cr on clientes.id_cliente = cr.id_cliente_fk "+
        "inner join regiones r on cr.id_region_fk = r.id_region "+
        "inner join cliente_ciudad cc on clientes.id_cliente = cc.id_cliente_fk "+
        "inner join ciudades c on cc.id_ciudad_fk = c.id_ciudad "+
        "group by nombre, nombre_region, nombre_ciudad, direccion, codigo_postal "+
        "order by monto asc limit 1 ) ");
    return f;
}

module.exports.consulta=consulta;