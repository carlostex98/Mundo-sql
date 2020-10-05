use mundo;
create table datos_entrada(
    nombre_compania varchar(220),
    contacto_compania varchar(220),
    correo_compania varchar(220),
    telefono_compania varchar(220),
    tipo varchar(2),
    nombre varchar(220),
    correo varchar(220),
    telefono varchar(220),
    fecha_registro date,
    direccion varchar(220),
    ciudad varchar(220),
    codigo_postal int,
    region varchar(220),
    producto varchar(220),
    categoria_producto varchar(220),
    cantidad int,
    precio_unitario decimal(15,8)
);



load data infile '/var/lib/mysql-files/DataCenterData.csv' into table datos_entrada
    columns terminated by ';'
    optionally enclosed by '"'
    lines terminated by '\n'
    ignore 1 lines
    (nombre_compania, contacto_compania, correo_compania,telefono_compania,tipo,nombre,correo,
    telefono, @date_time_variable,direccion, ciudad, codigo_postal, region, producto,categoria_producto, cantidad, precio_unitario)
    SET fecha_registro = STR_TO_DATE(@date_time_variable, '%d/%m/%Y');



insert into categorias(nombre_categoria)
select distinct categoria_producto from datos_entrada;

insert into regiones(nombre_region)
select distinct region from datos_entrada;

insert into ciudades(nombre_ciudad)
select distinct ciudad from datos_entrada;

insert into companias (nombre_compania, contacto, correo, telefono)
select nombre_compania, contacto_compania, correo_compania, telefono_compania
from datos_entrada
group by nombre_compania, contacto_compania, correo_compania, telefono_compania;

insert into clientes(nombre, correo, telefono, fecha_reg, direccion, codigo_postal)
select nombre, correo, telefono, fecha_registro, direccion, codigo_postal
from datos_entrada where tipo = 'C'
group by nombre, correo, telefono, fecha_registro, direccion, codigo_postal;

insert into proveedores(nombre, correo, telefono, fecha_reg, direccion, codigo_postal)
select nombre, correo, telefono, fecha_registro, direccion, codigo_postal
from datos_entrada where tipo = 'P'
group by nombre, correo, telefono, fecha_registro, direccion, codigo_postal;

insert into productos(nombre_producto, precio_unitario)
select producto, precio_unitario
from datos_entrada
group by producto, precio_unitario;


insert into cliente_compania(id_cliente_fk, id_compania_fk)
select id_cliente, id_compania from clientes, companias
where (companias.nombre_compania, clientes.nombre) in
(select nombre_compania, nombre from datos_entrada where tipo='C'
group by nombre_compania, nombre);


insert into proveedor_compania(id_proveedor_fk, id_compania_fk)
select id_proveedor, id_compania from companias, proveedores
where (companias.nombre_compania, proveedores.nombre) in
(select nombre_compania, nombre from datos_entrada where tipo='P'
group by nombre_compania, nombre);


insert into producto_categoria (id_producto_fk, id_categoria_fk)
select id_producto, id_categoria from productos, categorias
where (productos.nombre_producto, categorias.nombre_categoria) in
(select producto, categoria_producto from datos_entrada
group by producto, categoria_producto);



insert into proveedor_ciudad(id_ciudad_fk, id_proveedor_fk)
select  id_ciudad, id_proveedor from ciudades, proveedores
where (ciudades.nombre_ciudad, proveedores.nombre) in
(select ciudad, nombre from datos_entrada where tipo='P'
group by ciudad, nombre);


insert into cliente_ciudad(id_ciudad_fk, id_cliente_fk)
select  id_ciudad, id_cliente from ciudades, clientes
where (ciudades.nombre_ciudad, clientes.nombre) in
(select ciudad, nombre from datos_entrada where tipo='C'
group by ciudad, nombre);


insert into proveedor_region(id_region_fk, id_proveedor_fk)
select  id_region, id_proveedor from regiones, proveedores
where (regiones.nombre_region, proveedores.nombre) in
(select region, nombre from datos_entrada where tipo='P'
group by region, nombre);


insert into cliente_region(id_region_fk, id_cliente_fk)
select  id_region, id_cliente from regiones, clientes
where (regiones.nombre_region, clientes.nombre) in
(select region, nombre from datos_entrada where tipo='C'
group by region, nombre);




insert into cliente_compra_producto (id_producto_fk, id_cliente_fk, cantidad_compra)
select (select id_producto from productos where nombre_producto=datos_entrada.producto and datos_entrada.tipo='C') as x,
(select id_cliente from clientes where clientes.nombre = datos_entrada.nombre and datos_entrada.tipo='C') as y,
cantidad from datos_entrada where tipo='C';


insert into proveedor_compra_producto (id_producto_fk, id_proveedor_fk, cantidad_compra)
select (select id_producto from productos where nombre_producto=datos_entrada.producto and datos_entrada.tipo='P') as x,
(select id_proveedor from proveedores where proveedores.nombre = datos_entrada.nombre and datos_entrada.tipo='P') as y,
cantidad from datos_entrada where tipo='P';