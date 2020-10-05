const pool = require('../database');

async function consulta() {
    const f = await pool.query("(select nombre_categoria, sum(precio_unitario * cantidad_compra) as monto " +
        "from categorias " +
        "inner join producto_categoria pc on categorias.id_categoria = pc.id_categoria_fk " +
        "inner join productos p on pc.id_producto_fk = p.id_producto " +
        "inner join cliente_compra_producto ccp on p.id_producto = ccp.id_producto_fk " +
        "group by nombre_categoria " +
        "order by monto desc limit 1) " +
        "union all " +
        "(select nombre_categoria, sum(precio_unitario * cantidad_compra) as monto " +
        "from categorias " +
        "inner join producto_categoria pc on categorias.id_categoria = pc.id_categoria_fk " +
        "inner join productos p on pc.id_producto_fk = p.id_producto " +
        "inner join cliente_compra_producto ccp on p.id_producto = ccp.id_producto_fk " +
        "group by nombre_categoria " +
        "order by monto asc limit 1) ");
    return f;
}

module.exports.consulta = consulta;