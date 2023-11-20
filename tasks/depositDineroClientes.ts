import ClienteModel from "../db/clientes.ts";

export const depositDineroClientes = async () => {

    try {
        const importePeriodico = 10000;
        const movimiento = `Deposited ${importePeriodico}$ in your bank account`; 
        await ClienteModel.updateMany({}, { $inc: { saldo: importePeriodico}, $push: { movimientos: movimiento } });
    } catch (error) {
        console.error(error);
    }

};

export default depositDineroClientes;