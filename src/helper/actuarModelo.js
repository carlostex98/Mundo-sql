const pool = require('../database');

async function eliminarModelo() {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0 ");
    await pool.query("TRUNCATE TABLE mundo.categorias ");
    await pool.query("TRUNCATE TABLE mundo.ciudades");
    await pool.query("TRUNCATE TABLE mundo.cliente_ciudad ");
    await pool.query("TRUNCATE TABLE mundo.cliente_compania");
    await pool.query("TRUNCATE TABLE mundo.cliente_compra_producto");
    await pool.query("TRUNCATE TABLE mundo.cliente_region ");
    await pool.query("TRUNCATE TABLE mundo.clientes");
    await pool.query("TRUNCATE TABLE mundo.companias");
    await pool.query("TRUNCATE TABLE mundo.producto_categoria");
    await pool.query("TRUNCATE TABLE mundo.productos");
    await pool.query("TRUNCATE TABLE mundo.proveedor_ciudad");
    await pool.query("TRUNCATE TABLE mundo.proveedor_compania");
    await pool.query("TRUNCATE TABLE mundo.proveedor_compra_producto");
    await pool.query("TRUNCATE TABLE mundo.proveedor_region");
    await pool.query("TRUNCATE TABLE mundo.proveedores");
    await pool.query("TRUNCATE TABLE mundo.regiones");
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");
    return { info: "datos eliminados" };
}

async function llenarModelo() {

    let qs = [];

    qs.push("insert into categorias(nombre_categoria) " +
        "select distinct categoria_producto from datos_entrada ");

    qs.push("insert into regiones(nombre_region) " +
        "select distinct region from datos_entrada ");

    qs.push("insert into ciudades(nombre_ciudad) " +
        "select distinct ciudad from datos_entrada ");

    qs.push("insert into companias (nombre_compania, contacto, correo, telefono) " +
        "select nombre_compania, contacto_compania, correo_compania, telefono_compania " +
        "from datos_entrada " +
        "group by nombre_compania, contacto_compania, correo_compania, telefono_compania ");

    qs.push("insert into clientes(nombre, correo, telefono, fecha_reg, direccion, codigo_postal) " +
        "select nombre, correo, telefono, fecha_registro, direccion, codigo_postal " +
        "from datos_entrada where tipo = 'C' " +
        "group by nombre, correo, telefono, fecha_registro, direccion, codigo_postal;");

    qs.push("insert into proveedores(nombre, correo, telefono, fecha_reg, direccion, codigo_postal) " +
        "select nombre, correo, telefono, fecha_registro, direccion, codigo_postal " +
        "from datos_entrada where tipo = 'P' " +
        "group by nombre, correo, telefono, fecha_registro, direccion, codigo_postal ");


    qs.push("insert into productos(nombre_producto, precio_unitario) " +
        "select producto, precio_unitario " +
        "from datos_entrada " +
        "group by producto, precio_unitario ");

    qs.push("insert into cliente_compania(id_cliente_fk, id_compania_fk) " +
        "select id_cliente, id_compania from companias, clientes " +
        "where (companias.nombre_compania, clientes.nombre) in " +
        "(select nombre_compania, nombre from datos_entrada where tipo='C' " +
        "group by nombre_compania, nombre) ");

    qs.push("insert into proveedor_compania(id_proveedor_fk, id_compania_fk) " +
        "select id_proveedor, id_compania from companias, proveedores " +
        "where (companias.nombre_compania, proveedores.nombre) in " +
        "(select nombre_compania, nombre from datos_entrada where tipo='P' " +
        "group by nombre_compania, nombre) ");


    qs.push("insert into producto_categoria (id_producto_fk, id_categoria_fk) " +
        "select id_producto, id_categoria from productos, categorias " +
        "where (productos.nombre_producto, categorias.nombre_categoria) in " +
        "(select producto, categoria_producto from datos_entrada " +
        "group by producto, categoria_producto) ");

    qs.push("insert into proveedor_ciudad(id_ciudad_fk, id_proveedor_fk) " +
        "select  id_ciudad, id_proveedor from ciudades, proveedores " +
        "where (ciudades.nombre_ciudad, proveedores.nombre) in " +
        "(select ciudad, nombre from datos_entrada where tipo='P' " +
        "group by ciudad, nombre) ");

    qs.push("insert into cliente_ciudad(id_ciudad_fk, id_cliente_fk) "+
    "select  id_ciudad, id_cliente from ciudades, clientes "+
    "where (ciudades.nombre_ciudad, clientes.nombre) in "+
    "(select ciudad, nombre from datos_entrada where tipo='C' "+
    "group by ciudad, nombre)");


    qs.push("insert into proveedor_region(id_region_fk, id_proveedor_fk) " +
        "select  id_region, id_proveedor from regiones, proveedores " +
        "where (regiones.nombre_region, proveedores.nombre) in " +
        "(select region, nombre from datos_entrada where tipo='P' " +
        "group by region, nombre) ");


    qs.push("insert into cliente_region(id_region_fk, id_cliente_fk) " +
        "select  id_region, id_cliente from regiones, clientes " +
        "where (regiones.nombre_region, clientes.nombre) in " +
        "(select region, nombre from datos_entrada where tipo='C' " +
        "group by region, nombre) ");


    qs.push("insert into cliente_compra_producto (id_producto_fk, id_cliente_fk, cantidad_compra) " +
        "select (select id_producto from productos where nombre_producto=datos_entrada.producto and datos_entrada.tipo='C') as x, " +
        "(select id_cliente from clientes where clientes.nombre = datos_entrada.nombre and datos_entrada.tipo='C') as y," +
        "cantidad from datos_entrada where tipo='C' ");

    qs.push("insert into proveedor_compra_producto (id_producto_fk, id_proveedor_fk, cantidad_compra) " +
        "select (select id_producto from productos where nombre_producto=datos_entrada.producto and datos_entrada.tipo='P') as x," +
        "(select id_proveedor from proveedores where proveedores.nombre = datos_entrada.nombre and datos_entrada.tipo='P') as y, " +
        "cantidad from datos_entrada where tipo='P' ");

    for (let i = 0; i < qs.length; i++) {
        await pool.query(qs[i]);
    }

    return { info: "datos procesados" };

}

module.exports.eliminarModelo = eliminarModelo;
module.exports.llenarModelo = llenarModelo;