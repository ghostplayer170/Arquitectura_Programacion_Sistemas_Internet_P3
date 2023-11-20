export type Cliente = {
    nombre: string;         // Nombre del cliente
    dni: string;            // DNI del cliente
    saldo: number;          // Saldo disponible en la cuenta del cliente
    hipotecas: string[];    // Identificadores de las hipotecas asociadas al cliente
    movimientos: string[];  // Movimientos realizados en la cuenta del cliente
    gestor: string;         // DNI del gestor asociado al cliente
};

export type Hipoteca = {
    importe: number;        // Monto total de la hipoteca
    deuda: number;          // Deuda total pendiente en la hipoteca
    cuotas: number;         // Número total de cuotas de la hipoteca
    cliente: string;        // DNI del cliente asociado a la hipoteca
    gestor: string;         // DNI del gestor asociado a la hipoteca
    deudaImporte: number;   // Deuda restante del importe de la hipoteca
    deudaCuotas: number;    // Número de cuotas pendientes por pagar de la hipoteca
};

export type Gestor = {
    dni: string;            // DNI del gestor
    nombre: string;         // Nombre del gestor
    clientes: string[];     // DNIs de los clientes asociados al gestor
};
