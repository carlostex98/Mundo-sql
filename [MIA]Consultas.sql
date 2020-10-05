use mundo;

select proveedores.nombre,proveedores.telefono,proveedor_compra_producto.id_orden ,
(proveedor_compra_producto.cantidad_compra * productos.precio_unitario) as cant
from proveedor_compra_producto
inner join proveedores on  proveedor_compra_producto.id_proveedor_fk=proveedores.id_proveedor
inner  join productos on proveedor_compra_producto.id_producto_fk=productos.id_producto
order by cant desc
limit 1
;

select clientes.id_cliente, clientes.nombre, count(cliente_compra_producto.cantidad_compra)
as cant from cliente_compra_producto
inner join clientes on cliente_compra_producto.id_cliente_fk = clientes.id_cliente
group by clientes.id_cliente, clientes.nombre
order by cant desc , nombre asc limit 1
;



(select nombre_region, nombre, direccion, codigo_postal, count(cantidad_compra) as ordenes, nombre_ciudad from regiones
inner join proveedor_region pr on regiones.id_region = pr.id_region_fk
inner join proveedores p on pr.id_proveedor_fk = p.id_proveedor
inner join proveedor_compra_producto pcp on p.id_proveedor = pcp.id_proveedor_fk
inner join proveedor_ciudad pc on p.id_proveedor = pc.id_proveedor_fk
inner join ciudades c on pc.id_ciudad_fk = c.id_ciudad
group by nombre_region, nombre, direccion, codigo_postal, nombre_ciudad
order by ordenes
limit 1)
union all
(select nombre_region, nombre, direccion, codigo_postal, count(cantidad_compra) as ordenes, nombre_ciudad from regiones
inner join proveedor_region pr on regiones.id_region = pr.id_region_fk
inner join proveedores p on pr.id_proveedor_fk = p.id_proveedor
inner join proveedor_compra_producto pcp on p.id_proveedor = pcp.id_proveedor_fk
inner join proveedor_ciudad pc on p.id_proveedor = pc.id_proveedor_fk
inner join ciudades c on pc.id_ciudad_fk = c.id_ciudad
group by nombre_region, nombre, direccion, codigo_postal, nombre_ciudad
order by ordenes desc
limit 1)

;


select id_cliente,
substring_index(nombre,' ',1)as nombre_,
substring_index(nombre,' ',-1)as apellido_,
count(cantidad_compra) as compras, sum(precio_unitario) as cantidad from clientes
inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk
inner join productos p on ccp.id_producto_fk = p.id_producto
inner join producto_categoria pc on p.id_producto = pc.id_producto_fk
inner join categorias c on pc.id_categoria_fk = c.id_categoria
where  nombre_categoria = 'Cheese'
group by nombre, id_cliente
order by compras desc, cantidad desc
limit 5
;


(select
substring_index(nombre,' ',1)as nombre_,
substring_index(nombre,' ',-1)as apellido_,
extract( month from fecha_reg) as fecha,
sum(cantidad_compra*precio_unitario) as dinero from clientes
inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk
inner join productos p on ccp.id_producto_fk = p.id_producto
group by nombre, fecha_reg
order by dinero limit 1)
union all
(select
substring_index(nombre,' ',1)as nombre_,
substring_index(nombre,' ',-1)as apellido_,
extract( month from fecha_reg) as fecha,
sum(cantidad_compra*precio_unitario) as dinero from clientes
inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk
inner join productos p on ccp.id_producto_fk = p.id_producto
group by nombre, fecha_reg
order by dinero desc limit 1 )
;


(select nombre_categoria, sum(precio_unitario * cantidad_compra) as monto
from categorias
inner join producto_categoria pc on categorias.id_categoria = pc.id_categoria_fk
inner join productos p on pc.id_producto_fk = p.id_producto
inner join cliente_compra_producto ccp on p.id_producto = ccp.id_producto_fk
group by nombre_categoria
order by monto desc limit 1)
union all
(select nombre_categoria, sum(precio_unitario * cantidad_compra) as monto
from categorias
inner join producto_categoria pc on categorias.id_categoria = pc.id_categoria_fk
inner join productos p on pc.id_producto_fk = p.id_producto
inner join cliente_compra_producto ccp on p.id_producto = ccp.id_producto_fk
group by nombre_categoria
order by monto asc limit 1);


select nombre,nombre_categoria ,sum(precio_unitario*cantidad_compra)as monto from proveedores
inner join proveedor_compra_producto pcp on proveedores.id_proveedor = pcp.id_proveedor_fk
inner join productos p on pcp.id_producto_fk = p.id_producto
inner join producto_categoria pc on p.id_producto = pc.id_producto_fk
inner join categorias c on pc.id_categoria_fk = c.id_categoria
group by nombre, nombre_categoria
having nombre_categoria='Fresh Vegetables'
order by monto desc limit 5;

(select nombre, nombre_region, nombre_ciudad, direccion, codigo_postal,
sum(cantidad_compra * precio_unitario) as monto
from clientes
inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk
inner join productos p on ccp.id_producto_fk = p.id_producto
inner join cliente_region cr on clientes.id_cliente = cr.id_cliente_fk
inner join regiones r on cr.id_region_fk = r.id_region
inner join cliente_ciudad cc on clientes.id_cliente = cc.id_cliente_fk
inner join ciudades c on cc.id_ciudad_fk = c.id_ciudad
group by nombre, nombre_region, nombre_ciudad, direccion, codigo_postal
order by monto desc limit 1 )
union all
(select nombre, nombre_region, nombre_ciudad, direccion, codigo_postal,
sum(cantidad_compra * precio_unitario) as monto
from clientes
inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk
inner join productos p on ccp.id_producto_fk = p.id_producto
inner join cliente_region cr on clientes.id_cliente = cr.id_cliente_fk
inner join regiones r on cr.id_region_fk = r.id_region
inner join cliente_ciudad cc on clientes.id_cliente = cc.id_cliente_fk
inner join ciudades c on cc.id_ciudad_fk = c.id_ciudad
group by nombre, nombre_region, nombre_ciudad, direccion, codigo_postal
order by monto asc limit 1 );

select nombre, telefono, id_orden, cantidad_compra,
(cantidad_compra*precio_unitario) as monto from proveedores
inner join proveedor_compra_producto pcp on proveedores.id_proveedor = pcp.id_proveedor_fk
inner join productos p on pcp.id_producto_fk = p.id_producto
order by cantidad_compra asc, monto asc
limit 1
;

select nombre, sum(cantidad_compra) as cantidad from clientes
inner join cliente_compra_producto ccp on clientes.id_cliente = ccp.id_cliente_fk
inner join productos p on ccp.id_producto_fk = p.id_producto
inner join producto_categoria pc on p.id_producto = pc.id_producto_fk
inner join categorias c on pc.id_categoria_fk = c.id_categoria
where nombre_categoria = 'Seafood'
group by nombre
order by cantidad desc limit 10

;