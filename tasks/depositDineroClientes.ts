import ClienteModel from "../db/clientes.ts";

export const depositDineroClientes = async () => {

    try {

        const now = new Date();
        const horaActual = now.toLocaleTimeString(); // Obtiene la hora actual como una cadena en el formato local

        // Valor del importe a depositar periódicamente.
        const importePeriodico = 10000;

        // Descripción del movimiento de depósito.
        const movimiento = `${horaActual}: Deposited ${importePeriodico}$ in your bank account`; 

        // Actualización de todos los clientes en la base de datos.
        // Incrementa el saldo de cada cliente y añade el movimiento a su historial.
        await ClienteModel.updateMany({}, { $inc: { saldo: importePeriodico}, $push: { movimientos: movimiento } });

    } catch (error) {
        console.error(error);
    }

};

export default depositDineroClientes;