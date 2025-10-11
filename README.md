# REALPRINT

## MOTIVACION
Este proyecto surge de una necesidad detectada en mi experiencia profesional en el sector de la rotulación y serigrafía. A lo largo de mi trabajo diario, me he encontrado con diversos desafíos operativos que podrían ser resueltos o mejorados con el uso de una aplicación personalizada, diseñada específicamente para las demandas de esta industria. La creación de esta herramienta no solo optimizaría la eficiencia y rapidez en los procesos, sino que también contribuiría a hacer el trabajo más sostenible y organizado, permitiendo un mejor aprovechamiento de los recursos y una gestión más eficaz. RealPrint es una aplicación diseñada para optimizar la colaboración entre el cliente y la empresa de estampación textil y rotulación. Gracias a la documentación aportada por el cliente y a la investigación de las tareas realizadas.
RealPrint permite reducir los plazos de entrega, mejorar la calidad del producto final y fomentar una mayor sostenibilidad en los procesos. La aplicación conecta de manera directa al encargado del pedido con su jefe de sección. Una vez que el jefe aprueba la solicitud, el pedido se registra con los detalles necesarios, como los materiales requeridos y la fecha estimada de entrega. La empresa textil responde el mismo día, gracias a los sistemas de alerta integrados en la aplicación.
Los pedidos pueden abarcar desde el abastecimiento de stock, como la solicitud de camisetas de mujer en talla M, hasta tareas más complejas, como la medición de salas en instalaciones externas para la decoración de paredes con imágenes y texto. Todos estos detalles se cargan en la app para su revisión y verificación de calidad antes de proceder a la producción.

## OBJETIVOS
El objetivo principal de este proyecto es desarrollar una aplicación multiplataforma que optimice los procesos en el sector de la rotulación y serigrafía, facilitando la conexión entre empresa y cliente, y permitiendo la realización de pedidos con la menor interacción posible y máxima eficiencia.
A partir de este objetivo general, se plantean los siguientes objetivos específicos:
1.	Automatización de procesos: Simplificar tareas como la gestión de proyectos, control de inventario y generación de presupuestos, mediante herramientas automatizadas.
2.	Mejora en la comunicación: Optimizar la interacción entre la empresa y el cliente, facilitando un proceso de pedidos más fluido y autónomo.
3.	Optimización de recursos: Reducir el desperdicio de materiales y mejorar la sostenibilidad mediante una gestión eficiente.
4.	Accesibilidad multiplataforma: Garantizar el uso de la aplicación desde distintos dispositivos, en cualquier lugar y momento.
5.	Mejora en la toma de decisiones: Proporcionar datos en tiempo real para decisiones estratégicas más informadas.

## CATALOGO DE REQUISITOS
### REQUISITOS FUNCIONALES
RF1 Gestión de usuarios: Crear, editar y eliminar perfiles de empleados y usuarios de REAL PRINT.
R.F.1.1 Crear perfil indicando Nombre y apellido, correo electrónico, teléfono, puesto en la empresa.
R.F.1.2 Edita el perfil para modificar cualquier campo.
R.F.1.3 Eliminar perfil debido a su no participación en la empresa.
RF2 Configuración de precios y descuentos: Definir precios de impresión según el tamaño del pedido, tipo de producto, colores y niveles de complejidad. Configurar descuentos para pedidos grandes o clientes frecuentes.
R.F.2.1 Creación de una tarifa donde aparecen los precios de los productos.
RF3 Control de inventario: Gestión de los materiales (tintas, films, textiles) con notificaciones para abastecer stock.
R.F.3.1 Creación de una lista de materiales, información, stock, proveedor.
RF4 Reportes y estadísticas: Generar reportes de ventas, pedidos completados, ingresos, y eficiencia de producción para análisis del negocio.
RF5 Gestión de permisos: Controlar el acceso de los usuarios y definir qué funciones y datos son accesibles según su rol (producción, administración, ventas).
RF6 Integración con sistemas contables: Sincronización de datos de ventas con el sistema contable para llevar control de gastos e ingresos.
RF7 Creación y seguimiento de pedidos: Realizar pedidos indicando el tipo de color, tamaño, cantidad. Recibir confirmación y seguimiento de estado del pedido.
R.F.7.1 Se abre una hoja de trabajo en la que se indica la información de lo que se necesita, se adjuntan los archivos si los hubiese, se pueden incluir trabajos personalizados creados en la RF8 y la fecha en la que se necesita el trabajo.
R.F.7.2 El trabajo pasa por un proceso de trabajo en espera, trabajo confirmado, trabajo en proceso de producción, trabajo en entrega, trabajo listo para recoger, trabajo entregado.
RF8 Personalización de productos:  Subir archivos de diseño y seleccionar opciones de personalización como tipo de prenda, tamaño de la impresión y color.
RF9 Calculadora de costos en tiempo real: Ver un desglose estimado del precio en función de los parámetros (cantidad, diseño, prenda, etc.…)
RF10 Historial de pedidos: Consultar pedidos previos, visualizar orden y estado de entrega.
R.F.10.1 Listado en los que se puede ver toda la información de los pedidos, en el se puede descargar, imprimir o repetir pedido.
RF11 Notificaciones y alertas: Recibir ya sea en la app o en email el cambio de estado del pedido (aprobación, en producción, envío o recogida y entrega.
RF12 Gestión de órdenes de trabajo: Visualizar la lista de pedidos en orden de prioridad, con detalles de diseño y especificaciones.
RF13 Confirmación y actualización de estado:  Cambiar el estado de cada pedido conforme avanza en el proceso de producción (pendiente de aprobación, en producción, listo para envío, entregado).
RF14 Registro de materiales utilizados: Poder marcar los materiales que se utilizan para cada pedido llevando así un control de inventario.
RF15 Registros de errores o ajustes: Registrar fallos en la producción o ajustes hechos a los diseños para que el equipo de administración pueda evaluar costos adicionales.
RF16 Acceso seguro: Autenticación segura para todos los usuarios de la app.
RF17 Interfaz intuitiva y diseño adaptativo:  Diseño fácil de usar y compatible con dispositivos móviles y ordenadores.
RF18 Soporte multilingüe: Opción de elegir entre varios idiomas según las necesidades del cliente y el equipo.
RF19 Exportación e impresión de datos: Poder exportar información relevante (facturas, ordenes de trabajo) en formatos comunes como PDF o Excel.

### REQUISITOS NO FUNCIONALES

- RNFN1 Usabilidad
- RNFN2 Fiabilidad
- RNFN3 Look & Feel
- RNFN4 Accesibilidad
- RNFN5 Leyes y estándares
- RNFN6 Soporte
- RNFN7 Seguiridad y autenticación
- RNFN8 Hardware
- RNFN9 Lógicos de la base de datos
- RNFN10 Portabilidad
- RNFN11 Escalabilidad



## 01. [ANALISIS]
### 01.1 [Diagrama Entidad Relación](./DIAGRAMAS/DiagramaEntidadRelacion.md)
### 01.2 [Diagrama de Clases]
### 01.3 [Diagrama de Casos de uso](./DIAGRAMAS/DiagramaCasosDeUso.md)