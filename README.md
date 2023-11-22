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


## Endpoints

### post("/api/BancoNebrija/addCliente")

- **Descripción**: Permite añadir un nuevo cliente al banco.
- **Campos Requeridos**:
  - nombre: String, requerido.
  - dni: String, único y requerido.
  - saldo: Number, opcional, por defecto 0.
  - hipotecas: Array de String, opcional, por defecto vacío.
  - movimientos: Array de String, opcional, por defecto vacío.
  - gestor: String, opcional.

### post("/api/BancoNebrija/addGestor")

- **Descripción**: Permite añadir un nuevo gestor al banco.
- **Campos Requeridos**:
  - nombre: String, requerido.
  - dni: String, único y requerido.
  - clientes: Array de String, opcional, por defecto vacío.

### post("/api/BancoNebrija/addHipoteca")

- **Descripción**: Permite añadir una nueva hipoteca.
- **Campos Requeridos**:
  - importe: Number, requerido.
  - cuotas: Number, opcional, por defecto 20.
  - cliente: String, requerido.
  - gestor: String, requerido.
  - deudaImporte: Number, requerido.
  - deudaCuotas: Number, opcional, por defecto 20.

### delete("/api/BancoNebrija/deleteCliente/:id")

- **Descripción**: Elimina un cliente basado en su ID.
- **Requiere**:
  - id: DNI asociado al cliente.

### put("/api/BancoNebrija/asignarGestorCliente/:id")

- **Descripción**: Permite asignar un gestor a un cliente.
- **Requiere**:
  - id: DNI asociado al cliente.
  - JSON con el DNI del gestor: `{"dniGestor": "47457683P"}`

### put("/api/BancoNebrija/amortizarHipotecaCliente/:id")

- **Descripción**: Permite amortizar una hipoteca para un cliente.
- **Requiere**:
  - id: DNI asociado al cliente.
  - JSON con el ID de la hipoteca: `{"hipoteca": "655e79671d2ac1187228d70e"}`

### put("/api/BancoNebrija/transaccionParaCliente/:id")

- **Descripción**: Permite realizar una transacción desde la cuenta de un cliente a otro.
- **Requiere**:
  - id: DNI del cliente emisor.
  - JSON con el importe y el DNI del receptor: `{"importe": 500, "dniReceptor": "52387457P"}`

### put("/api/BancoNebrija/ingresarDineroCliente/:id")

- **Descripción**: Permite ingresar dinero a la cuenta de un cliente.
- **Requiere**:
  - id: DNI asociado al cliente.
  - JSON con el importe a ingresar: `{"importe": 1000}`

## Consideraciones

- **Los límites y reglas establecidos para la API son:**
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
