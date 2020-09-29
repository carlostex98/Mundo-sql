use mundo;


drop table datos_entrada;
truncate table datos_entrada;
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
    precio_unitario decimal
);



load data infile '/var/lib/mysql-files/DataCenterData.csv' into table datos_entrada
    columns terminated by ';'
    optionally enclosed by '"'
    lines terminated by '\n'
    ignore 1 lines
    (nombre_compania, contacto_compania, correo_compania,telefono_compania,tipo,nombre,correo,
    telefono, @date_time_variable,direccion, ciudad, codigo_postal, region, producto,categoria_producto, cantidad, precio_unitario)
    SET fecha_registro = STR_TO_DATE(@date_time_variable, '%d/%m/%Y');




create table categorias(
    id_categoria int auto_increment primary key,
    nombre_categoria varchar(220)
)engine = InnoDB charset =utf8mb4 collate utf8mb4_general_ci;


create table companias (
    id_compania int auto_increment primary key,
    contacto varchar(220),
    correo varchar(220),
    telefono varchar(220)
);

create table clientes(
    id_cliente int auto_increment primary key,
    nombre varchar(220),
    correo varchar(220),
    telefono varchar(220),
    fecha_reg date,
    direccion varchar(220),
    codigo_postal varchar(220)
);

create table proveedores(
    id_proveedor int auto_increment primary key,
    nombre varchar(220),
    correo varchar(220),
    telefono varchar(220),
    fecha_reg date,
    direccion varchar(220),
    codigo_postal varchar(220)
);

create table ciudades(
    id_ciudad int auto_increment primary key,
    nombre_ciudad varchar(220)
);

create table regiones(
    id_region int auto_increment primary key,
    nombre_region varchar(220)
);

create table productos(
    id_producto int auto_increment primary key,
    nombre_producto varchar(220),
    precio_unitario decimal
);


create table compras(
    id_compra int auto_increment primary key,
    cantidad_compra int
);

create table cliente_compra_producto(
    id_compra_fk int,
    id_cliente_fk int,
    id_producto int,
    foreign key (id_compra_fk) references compras(id_compra),
    foreign key (id_cliente_fk) references clientes(id_cliente),
    foreign key (id_producto) references productos(id_producto)
);


create table proveedor_compra_producto(
    id_compra_fk int,
    id_proveedor_fk int,
    id_producto int,
    foreign key (id_compra_fk) references compras(id_compra),
    foreign key (id_proveedor_fk) references proveedores(id_proveedor),
    foreign key (id_producto) references productos(id_producto)
);


create table cliente_region(
    id_region_fk int,
    id_cliente_fk int,
    foreign key (id_region_fk) references regiones(id_region),
    foreign key (id_cliente_fk) references clientes(id_cliente)
);

create table proveedor_region(
    id_region_fk int,
    id_proveedor_fk int,
    foreign key (id_region_fk) references regiones(id_region),
    foreign key (id_proveedor_fk) references proveedores(id_proveedor)
);


create table cliente_ciudad(
    id_ciudad_fk int,
    id_cliente_fk int,
    foreign key (id_ciudad_fk) references ciudades(id_ciudad),
    foreign key (id_cliente_fk) references clientes(id_cliente)
);

create table proveedor_ciudad(
    id_ciudad_fk int,
    id_proveedor_fk int,
    foreign key (id_ciudad_fk) references ciudades(id_ciudad),
    foreign key (id_proveedor_fk) references proveedores(id_proveedor)
);


create table producto_categoria(
    id_producto_fk int,
    id_categoria_fk int,
    foreign key (id_categoria_fk) references categorias(id_categoria),
    foreign key (id_producto_fk) references productos(id_producto)
);

create table cliente_compania(
    id_ciudad_fk int,
    id_compania_fk int,
    foreign key (id_ciudad_fk) references ciudades(id_ciudad),
    foreign key (id_compania_fk) references companias(id_compania)
);

create table proveedor_compania(
    id_ciudad_fk int,
    id_compania_fk int,
    foreign key (id_ciudad_fk) references ciudades(id_ciudad),
    foreign key (id_compania_fk) references companias(id_compania)
);