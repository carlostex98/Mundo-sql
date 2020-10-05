const pool = require('../database');

async function filModel() {

    //ciudades();
    //compras_cliente();
    cliente_compania();
}


async function ciudades() {
    const cd = await pool.query('select distinct ciudad from datos_entrada');
    for (let i = 0; i < cd.length; i++) {
        let nombre = cd[i].ciudad;
        await pool.query("insert into ciudades(nombre_ciudad) values(\'" + nombre + "\')");
    }
    regiones();
}

async function regiones() {
    const r = await pool.query('select distinct region from datos_entrada');
    for (let i = 0; i < r.length; i++) {
        let nombre = r[i].region;
        await pool.query("insert into regiones(nombre_region) values(\'" + nombre + "\')");
    }
    categorias();
}


async function categorias() {
    const c = await pool.query('select distinct categoria_producto from datos_entrada');
    for (let i = 0; i < c.length; i++) {
        let nombre = c[i].categoria_producto;
        //insert categoria
        await pool.query("insert into categorias(nombre_categoria) values(\'" + nombre + "\')");
    }
    companias();
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
    clientes();
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
    proveedores();
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
    productos();
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
    cliente_compania();
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
    //proveedor_compania();
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
    producto_categoria();
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
    proveedor_ciudad();
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
    cliente_ciudad();
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
    proveedor_region();
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
    cliente_region();
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
    compras_cliente();
}

async function compras_cliente(){
    const comp = await pool.query("select producto, nombre, cantidad from datos_entrada where tipo='C'");
    for (let i = 0; i < comp.length; i++) {
        //console.log(i);
        let a = await pool.query("select id_cliente from clientes where nombre ='"+comp[i].nombre+"' ");
        let b = await pool.query("select id_producto from productos where nombre_producto ='"+comp[i].producto+"' ");
        
        await pool.query("insert into cliente_compra_producto values("+a[0].id_cliente+", "+b[0].id_producto+","+comp[i].cantidad+")");
        
    }
    compras_proveedor();
}

async function compras_proveedor(){
    const comp = await pool.query("select producto, nombre, cantidad from datos_entrada where tipo='P'");
    for (let i = 0; i < comp.length; i++) {
        let a = await pool.query("select id_proveedor from proveedores where nombre ='"+comp[i].nombre+"' ");
        let b = await pool.query("select id_producto from productos where nombre_producto ='"+comp[i].producto+"' ");
        
        await pool.query("insert into proveedor_compra_producto values("+a[0].id_proveedor+", "+b[0].id_producto+","+comp[i].cantidad+")");
        
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