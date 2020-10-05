const pool = require('../database');

async function llenar(){
    await pool.query("load data infile '/var/lib/mysql-files/DataCenterData.csv' into table datos_entrada "+
    "columns terminated by ';' "+
    "optionally enclosed by '\"' "+
    "lines terminated by '\n' "+
    "ignore 1 lines "+
    "(nombre_compania, contacto_compania, correo_compania,telefono_compania,tipo,nombre,correo, "+
    "telefono, @date_time_variable,direccion, ciudad, codigo_postal, region, producto,categoria_producto, cantidad, precio_unitario) "+
    "SET fecha_registro = STR_TO_DATE(@date_time_variable, '%d/%m/%Y');" );
    return {info: "datos procasados"};
}

async function vaciar(){
    await pool.query("truncate table datos_entrada");
    return {info: "datos eliminados"};
}

module.exports.llenar=llenar;
module.exports.vaciar=vaciar;