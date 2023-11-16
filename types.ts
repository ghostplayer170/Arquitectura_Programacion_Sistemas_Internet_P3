export type Cliente = {
    nombre: string;
    dni: string;
    saldo: number;
    hipotecas: string[];
    movimientos: string[];
    gestor: string;
};

export type Hipoteca = {
    importe: number;
    deuda: number;
    cuotas: number;
    cliente: string;
    gestor: string;
}

export type Gestor = {
    dni: string;
    nombre: string;
    clientes: string[];
}