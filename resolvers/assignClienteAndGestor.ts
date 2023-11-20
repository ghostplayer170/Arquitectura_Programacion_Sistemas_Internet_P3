import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";
export class assignClienteAndGestorError extends Error {}

export const assignClienteAndGestor = async (dniCliente: string, dniGestor: string) => {

    const gestor = await GestorModel.findOne({ dni: dniGestor }).exec();
    // Si no encuentra el gestor.
    if (!gestor) {
        throw new assignClienteAndGestorError("Gestor DNI not found");
    }

    const cliente = await ClienteModel.findOne({ dni: dniCliente }).exec();
    // Si no encuentra el gestor.
    if (!cliente) {
      throw new assignClienteAndGestorError("Cliente DNI not found");
    }

    if (gestor.clientes.length > 10) {
      throw new assignClienteAndGestorError("Gestor have not space for more Clientes");
    }

    const updatedCliente = await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniCliente'
        { dni: dniCliente },
        // Actualizamos campos
        { gestor: dniGestor },

        { new: true }
    ).exec();

    if (!updatedCliente) {
        throw new assignClienteAndGestorError("Cliente not found");
    }

    const clienteExists = gestor.clientes.find((elem) => elem === dniCliente);

    if (!clienteExists) {
        
        gestor.clientes.push(dniCliente);
        
        const updateGestor = await GestorModel.findOneAndUpdate(
            // Buscamos un registro con 'dni' igual a 'dniGestor'
            { dni: dniGestor },
            // Actualizamos campos
            { clientes: gestor.clientes },

            { new: true }
        ).exec();   

        if (!updateGestor) {
            throw new assignClienteAndGestorError("Gestor not found");
        }

    } else {
        throw new assignClienteAndGestorError("Gestor has already assigned the Cliente");
    }
};

export default assignClienteAndGestor;
