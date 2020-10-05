const pool = require('../database');

async function consulta() {
    const f = await pool.query("select proveedores.nombre,proveedores.telefono,proveedor_compra_producto.id_orden , " +
        "(proveedor_compra_producto.cantidad_compra * productos.precio_unitario) as cant " +
        "from proveedor_compra_producto " +
        "inner join proveedores on  proveedor_compra_producto.id_proveedor_fk=proveedores.id_proveedor " +
        "inner  join productos on proveedor_compra_producto.id_producto_fk=productos.id_producto " +
        "order by cant desc " +
        "limit 1 ");
    return f;
}
module.exports.consulta = consulta;