const pool = require('../database');

async function consulta() {
    const f = await pool.query("select nombre, telefono, id_orden, cantidad_compra, " +
        "(cantidad_compra*precio_unitario) as monto from proveedores " +
        "inner join proveedor_compra_producto pcp on proveedores.id_proveedor = pcp.id_proveedor_fk " +
        "inner join productos p on pcp.id_producto_fk = p.id_producto " +
        "order by cantidad_compra asc, monto asc " +
        "limit 1 ");
    return f;
}

module.exports.consulta = consulta;