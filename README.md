# API de Banco Nebrija con Express, Deno y MongoDB

Esta API ha sido creada para satisfacer las siguientes necesidades relacionadas con la gestión bancaria:

## Funcionalidades

La API proporciona los siguientes endpoints:

- **Crear Clientes**: Permite registrar nuevos clientes en el banco.
- **Borrar Clientes**: Permite eliminar clientes existentes.
- **Transferir Dinero**: Permite enviar dinero de un cliente a otro.
- **Ingresar Dinero**: Permite realizar depósitos en cuentas de clientes.
- **Crear Hipotecas**: Permite registrar nuevas hipotecas.
- **Amortizar Hipotecas**: Permite realizar pagos para amortizar una hipoteca.
- **Crear Gestores**: Permite la creación de gestores de cuentas.
- **Asignar Gestor a Cliente**: Permite asignar un gestor a un cliente.

## Consideraciones

- Los límites y reglas establecidos para la API son:
  - Los clientes no pueden tener hipotecas que superen el millón de euros.
  - Todo movimiento de dinero debe ser reflejado correctamente.
  - Las hipotecas están asociadas con clientes y gestores.
  - Un cliente solo puede tener asignado un gestor.
  - Un gestor puede manejar un máximo de 10 clientes.
  - Las cuotas de una hipoteca serán 20.
  
## Tareas Automáticas

- **Cada 5 minutos para todos los clientes del banco:**
  - Se ingresa 10,000 Euros.
  - Se pagan las cuotas de las hipotecas.
