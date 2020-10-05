create database mundo;
use mundo;

create table categorias(
    id_categoria int auto_increment primary key,
    nombre_categoria varchar(220)
)engine = InnoDB charset =utf8mb4 collate utf8mb4_general_ci;


create table companias (
    id_compania int auto_increment primary key,
    nombre_compania varchar(220),
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
    precio_unitario decimal(15,8)
);



drop table cliente_compra_producto, proveedor_compra_producto;


create table cliente_compra_producto(
    id_orden int auto_increment primary key ,
    id_cliente_fk int,
    id_producto_fk int,
    cantidad_compra int,

    foreign key (id_cliente_fk) references clientes(id_cliente),
    foreign key (id_producto_fk) references productos(id_producto)
);


create table proveedor_compra_producto(
    id_orden int auto_increment primary key ,
    id_proveedor_fk int,
    id_producto_fk int,
    cantidad_compra int,

    foreign key (id_proveedor_fk) references proveedores(id_proveedor),
    foreign key (id_producto_fk) references productos(id_producto)
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

-- yep --
create table cliente_ciudad(
    id_ciudad_fk int,
    id_cliente_fk int,
    foreign key (id_ciudad_fk) references ciudades(id_ciudad),
    foreign key (id_cliente_fk) references clientes(id_cliente)
);

-- yep --
create table proveedor_ciudad(
    id_ciudad_fk int,
    id_proveedor_fk int,
    foreign key (id_ciudad_fk) references ciudades(id_ciudad),
    foreign key (id_proveedor_fk) references proveedores(id_proveedor)
);

-- yep --
create table producto_categoria(
    id_producto_fk int,
    id_categoria_fk int,
    foreign key (id_categoria_fk) references categorias(id_categoria),
    foreign key (id_producto_fk) references productos(id_producto)
);

-- yep --
create table cliente_compania(
    id_cliente_fk int,
    id_compania_fk int,
    foreign key (id_cliente_fk) references clientes(id_cliente),
    foreign key (id_compania_fk) references companias(id_compania)
);

-- yep --
create table proveedor_compania(
    id_proveedor_fk int,
    id_compania_fk int,
    foreign key (id_proveedor_fk) references proveedores(id_proveedor),
    foreign key (id_compania_fk) references companias(id_compania)
);