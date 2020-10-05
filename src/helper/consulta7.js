const pool = require('../database');

async function consulta() {
    const f = await pool.query("select nombre,nombre_categoria ,sum(precio_unitario*cantidad_compra) " +
        "as monto from proveedores " +
        "inner join proveedor_compra_producto pcp on proveedores.id_proveedor = pcp.id_proveedor_fk " +
        "inner join productos p on pcp.id_producto_fk = p.id_producto " +
        "inner join producto_categoria pc on p.id_producto = pc.id_producto_fk " +
        "inner join categorias c on pc.id_categoria_fk = c.id_categoria " +
        "group by nombre, nombre_categoria " +
        "having nombre_categoria='Fresh Vegetables' " +
        "order by monto desc limit 5 ");
    return f;
}

module.exports.consulta = consulta;