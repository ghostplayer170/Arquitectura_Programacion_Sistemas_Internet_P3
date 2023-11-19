export type Transaccion = {
    emisor: string;
    receptor: string;
    importe: number;
}

export type Cliente = {
    nombre: string;
    dni: string;
    saldo: number;
    hipotecas: string[];
    movimientos: Transaccion[];
    gestor: string;
};

export type Hipoteca = {
    importe: number;
    deuda: number;
    cuotas: number;
    cliente: string;
    gestor: string;
    deudaImporte: number;
    deudaCuotas: number;
}

export type Gestor = {
    dni: string;
    nombre: string;
    clientes: string[];
}