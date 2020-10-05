const pool = require('../database');

async function consulta() {
    const f = await pool.query("(select nombre_region, nombre, direccion, codigo_postal, count(cantidad_compra) as ordenes, nombre_ciudad from regiones " +
        "inner join proveedor_region pr on regiones.id_region = pr.id_region_fk " +
        "inner join proveedores p on pr.id_proveedor_fk = p.id_proveedor " +
        "inner join proveedor_compra_producto pcp on p.id_proveedor = pcp.id_proveedor_fk " +
        "inner join proveedor_ciudad pc on p.id_proveedor = pc.id_proveedor_fk " +
        "inner join ciudades c on pc.id_ciudad_fk = c.id_ciudad " +
        "group by nombre_region, nombre, direccion, codigo_postal, nombre_ciudad " +
        "order by ordenes " +
        "limit 1) " +
        "union all " +
        "(select nombre_region, nombre, direccion, codigo_postal, count(cantidad_compra) as ordenes, nombre_ciudad from regiones " +
        "inner join proveedor_region pr on regiones.id_region = pr.id_region_fk " +
        "inner join proveedores p on pr.id_proveedor_fk = p.id_proveedor " +
        "inner join proveedor_compra_producto pcp on p.id_proveedor = pcp.id_proveedor_fk " +
        "inner join proveedor_ciudad pc on p.id_proveedor = pc.id_proveedor_fk " +
        "inner join ciudades c on pc.id_ciudad_fk = c.id_ciudad " +
        "group by nombre_region, nombre, direccion, codigo_postal, nombre_ciudad " +
        "order by ordenes desc " +
        "limit 1) ");
    return f;
}

module.exports.consulta = consulta;