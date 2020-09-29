const pool = require('../database');

async function filModel() {
    const c = await pool.query('select distinct categoria_producto from datos_entrada');
    for (let i = 0; i < c.length; i++) {
        let nombre = c[i].categoria_producto;
        //insert categoria
        await pool.query("insert into categorias(nombre_categoria) values(\'"+nombre+"\')");
    }

    const r = await pool.query('select distinct region from datos_entrada');
    for (let i = 0; i < r.length; i++) {
        let nombre = r[i].region;
        await pool.query("insert into regiones(nombre_region) values(\'"+nombre+"\')");
    }

    const cd = await pool.query('select distinct ciudad from datos_entrada');
    for (let i = 0; i < cd.length; i++) {
        let nombre = cd[i].region;
        await pool.query("insert into ciudades(nombre_ciudad) values(\'"+nombre+"\')");
    }


    
}

module.exports.filModel = filModel;