import ClienteModel from "../db/clientes.ts";
import { obtenerHoraActual } from "./localHour.ts"


export const depositDineroClientes = async () => {

    try {

        // Valor del importe a depositar periódicamente.
        const importePeriodico = 10000;

        // Descripción del movimiento de depósito.
        const movimiento = `${obtenerHoraActual()}: Deposited ${importePeriodico}$ in your bank account`; 

        // Actualización de todos los clientes en la base de datos.
        // Incrementa el saldo de cada cliente y añade el movimiento a su historial.
        await ClienteModel.updateMany({}, { $inc: { saldo: importePeriodico}, $push: { movimientos: movimiento } });

    } catch (error) {
        console.error(error);
    }

};

export default depositDineroClientes;