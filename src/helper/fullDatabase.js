const pool = require('../database');

async function filModel() {

    //ciudades();
    //regiones();
    //categorias();

    //the group join

    //companias();
    //clientes();
    //proveedores();
    //productos();

    //cliente_compania();
    //proveedor_compania();
    //producto_categoria();
    //proveedor_ciudad();
    //cliente_ciudad();
    //proveedor_region();
    cliente_region();


}


async function ciudades() {
    const cd = await pool.query('select distinct ciudad from datos_entrada');
    for (let i = 0; i < cd.length; i++) {
        let nombre = cd[i].ciudad;
        await pool.query("insert into ciudades(nombre_ciudad) values(\'" + nombre + "\')");
    }
}

async function regiones() {
    const r = await pool.query('select distinct region from datos_entrada');
    for (let i = 0; i < r.length; i++) {
        let nombre = r[i].region;
        await pool.query("insert into regiones(nombre_region) values(\'" + nombre + "\')");
    }
}


async function categorias() {
    const c = await pool.query('select distinct categoria_producto from datos_entrada');
    for (let i = 0; i < c.length; i++) {
        let nombre = c[i].categoria_producto;
        //insert categoria
        await pool.query("insert into categorias(nombre_categoria) values(\'" + nombre + "\')");
    }
}


async function companias() {
    const comp = await pool.query('select distinct nombre_compania from datos_entrada');
    for (let i = 0; i < comp.length; i++) {

        let k = await pool.query("select nombre_compania, contacto_compania, correo_compania, telefono_compania from datos_entrada " +
            "where nombre_compania = '" + comp[i].nombre_compania + "' limit 1");
        //insert into companias
        await pool.query("insert into companias(nombre_compania, contacto, correo, telefono) values(" +
            "\'" + k[0].nombre_compania + "\'," +
            "\'" + k[0].contacto_compania + "\'," +
            "\'" + k[0].correo_compania + "\'," +
            "\'" + k[0].telefono_compania + "\'" +
            ")");
    }
}

async function clientes() {
    const nomb = await pool.query("select distinct nombre from datos_entrada where tipo='C'");
    for (let i = 0; i < nomb.length; i++) {
        let t = "select nombre, correo, telefono, fecha_registro, direccion, codigo_postal " +
            "from datos_entrada where nombre = '" + nomb[i].nombre + "' limit 1";
        let k = await pool.query(t);
        //insert into companias
        await pool.query("insert into clientes(nombre, correo, telefono, fecha_reg, direccion, codigo_postal) values(" +
            "'" + k[0].nombre + "'," +
            "'" + k[0].correo + "'," +
            "'" + k[0].telefono + "'," +
            "'" + fix_date(k[0].fecha_registro) + "'," +
            "'" + k[0].direccion + "'," +
            "'" + k[0].codigo_postal + "'" +
            ")");
    }
}

async function proveedores() {
    const nomb = await pool.query("select distinct nombre from datos_entrada where tipo='P'");
    for (let i = 0; i < nomb.length; i++) {
        let t = "select nombre, correo, telefono, fecha_registro, direccion, codigo_postal " +
            "from datos_entrada where nombre = '" + nomb[i].nombre + "' limit 1";
        let k = await pool.query(t);
        //insert into companias
        await pool.query("insert into proveedores(nombre, correo, telefono, fecha_reg, direccion, codigo_postal) values(" +
            "'" + k[0].nombre + "'," +
            "'" + k[0].correo + "'," +
            "'" + k[0].telefono + "'," +
            "'" + fix_date(k[0].fecha_registro) + "'," +
            "'" + k[0].direccion + "'," +
            "'" + k[0].codigo_postal + "'" +
            ")");
    }
}

async function productos() {
    const nomb = await pool.query("select distinct producto from datos_entrada");
    for (let i = 0; i < nomb.length; i++) {
        let t = "select producto, precio_unitario " +
            "from datos_entrada where producto = '" + nomb[i].producto + "' limit 1";
        let k = await pool.query(t);
        //console.log(k);
        //insert into companias
        await pool.query("insert into productos(nombre_producto, precio_unitario) values(" +
            "'" + k[0].producto + "'," +
            "'" + k[0].precio_unitario + "'" +
            ")");

    }
}


async function cliente_compania() {
    const comp = await pool.query('select distinct nombre_compania from datos_entrada');
    for (let i = 0; i < comp.length; i++) {

        let k = await pool.query("select nombre_compania,  nombre from datos_entrada " +
            "where nombre_compania='" + comp[i].nombre_compania + "' and tipo='C'");
        for (let j = 0; j < k.length; j++) {
            let idv = await pool.query("select id_compania from companias where nombre_compania = '" + k[j].nombre_compania + "' ;");
            let idx = await pool.query("select id_cliente from clientes where nombre = '" + k[j].nombre + "' ;");
            let h = await pool.query("select count(*) as x from cliente_compania where " +
                "id_cliente_fk = " + idx[0].id_cliente + " and " +
                "id_compania_fk = " + idv[0].id_compania);
            if (h[0].x == 0) {
                await pool.query("insert into cliente_compania values(" + idx[0].id_cliente + ", " + idv[0].id_compania + ")");
            }
        }

    }
}


async function proveedor_compania() {
    const comp = await pool.query('select distinct nombre_compania from datos_entrada');
    for (let i = 0; i < comp.length; i++) {

        let k = await pool.query("select nombre_compania,  nombre from datos_entrada " +
            "where nombre_compania='" + comp[i].nombre_compania + "' and tipo='P'");
        for (let j = 0; j < k.length; j++) {
            let idv = await pool.query("select id_compania from companias where nombre_compania = '" + k[j].nombre_compania + "' ;");
            let idx = await pool.query("select id_proveedor from proveedores where nombre = '" + k[j].nombre + "' ;");
            let h = await pool.query("select count(*) as x from proveedor_compania where " +
                "id_proveedor_fk = " + idx[0].id_proveedor + " and " +
                "id_compania_fk = " + idv[0].id_compania);
            if (h[0].x == 0) {
                await pool.query("insert into proveedor_compania values(" + idx[0].id_proveedor + ", " + idv[0].id_compania + ")");
            }
        }

    }
}


async function producto_categoria() {
    const comp = await pool.query('select distinct producto from datos_entrada');
    for (let i = 0; i < comp.length; i++) {

        let k = await pool.query("select producto, categoria_producto from datos_entrada " +
            "where producto='" + comp[i].producto + "'");
        for (let j = 0; j < k.length; j++) {
            let idv = await pool.query("select id_producto from productos where nombre_producto = '" + k[j].producto + "' ;");
            let idx = await pool.query("select id_categoria from categorias where nombre_categoria = '" + k[j].categoria_producto + "' ;");
            let h = await pool.query("select count(*) as x from producto_categoria where " +
                "id_categoria_fk = " + idx[0].id_categoria + " and " +
                "id_producto_fk = " + idv[0].id_producto);
            if (h[0].x == 0) {
                await pool.query("insert into producto_categoria values(" + idv[0].id_producto + ", " + idx[0].id_categoria + ")");
            }
        }

    }
}

async function proveedor_ciudad() {
    const comp = await pool.query("select distinct nombre from datos_entrada where tipo='P'");
    for (let i = 0; i < comp.length; i++) {

        let k = await pool.query("select nombre, ciudad from datos_entrada " +
            "where nombre='" + comp[i].nombre + "' and tipo='P'");
        for (let j = 0; j < k.length; j++) {
            let idx = await pool.query("select id_proveedor from proveedores where nombre = '" + k[j].nombre + "' ;");
            let idv = await pool.query("select id_ciudad from ciudades where nombre_ciudad = '" + k[j].ciudad + "' ;");
            let h = await pool.query("select count(*) as x from proveedor_ciudad where " +
                "id_proveedor_fk = " + idx[0].id_proveedor + " and " +
                "id_ciudad_fk = " + idv[0].id_ciudad );
            if (h[0].x == 0) {
                await pool.query("insert into proveedor_ciudad values(" + idv[0].id_ciudad + ", " + idx[0].id_proveedor + ")");
            }
        }

    }
}

async function cliente_ciudad() {
    const comp = await pool.query("select distinct nombre from datos_entrada where tipo='C'");
    for (let i = 0; i < comp.length; i++) {

        let k = await pool.query("select nombre, ciudad from datos_entrada " +
            "where nombre='" + comp[i].nombre + "' and tipo='C'");
        for (let j = 0; j < k.length; j++) {
            let idx = await pool.query("select id_cliente from clientes where nombre = '" + k[j].nombre + "' ;");
            let idv = await pool.query("select id_ciudad from ciudades where nombre_ciudad = '" + k[j].ciudad + "' ;");
            let h = await pool.query("select count(*) as x from cliente_ciudad where " +
                "id_cliente_fk = " + idx[0].id_cliente+ " and " +
                "id_ciudad_fk = " + idv[0].id_ciudad );
            if (h[0].x == 0) {
                await pool.query("insert into cliente_ciudad values(" + idv[0].id_ciudad + ", " + idx[0].id_cliente + ")");
            }
        }

    }
}

async function proveedor_region() {
    const comp = await pool.query("select distinct nombre from datos_entrada where tipo='P'");
    for (let i = 0; i < comp.length; i++) {

        let k = await pool.query("select nombre, region from datos_entrada " +
            "where nombre='" + comp[i].nombre + "' and tipo='P'");
        for (let j = 0; j < k.length; j++) {
            let idx = await pool.query("select id_proveedor from proveedores where nombre = '" + k[j].nombre + "' ;");
            let idv = await pool.query("select id_region from regiones where nombre_region = '" + k[j].region + "' ;");
            let h = await pool.query("select count(*) as x from proveedor_region where " +
                "id_proveedor_fk = " + idx[0].id_proveedor + " and " +
                "id_region_fk = " + idv[0].id_region );
            if (h[0].x == 0) {
                await pool.query("insert into proveedor_region values(" + idv[0].id_region + ", " + idx[0].id_proveedor + ")");
            }
        }

    }
}

async function cliente_region() {
    const comp = await pool.query("select distinct nombre from datos_entrada where tipo='C'");
    for (let i = 0; i < comp.length; i++) {

        let k = await pool.query("select nombre, region from datos_entrada " +
            "where nombre='" + comp[i].nombre + "' and tipo='C'");
        for (let j = 0; j < k.length; j++) {
            let idx = await pool.query("select id_cliente from clientes where nombre = '" + k[j].nombre + "' ;");
            let idv = await pool.query("select id_region from regiones where nombre_region = '" + k[j].region + "' ;");
            let h = await pool.query("select count(*) as x from cliente_region where " +
                "id_cliente_fk = " + idx[0].id_cliente+ " and " +
                "id_region_fk = " + idv[0].id_region );
            if (h[0].x == 0) {
                await pool.query("insert into cliente_region values(" + idv[0].id_region + ", " + idx[0].id_cliente + ")");
            }
        }

    }
}





function fix_date(p) {
    var today = new Date(p);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}


module.exports.filModel = filModel;