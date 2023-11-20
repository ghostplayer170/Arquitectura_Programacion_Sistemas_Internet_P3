import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";
export class assignClienteAndGestorError extends Error {}

export const assignClienteAndGestor = async (dniCliente: string, dniGestor: string) => {

    // Verifica si existe un Cliente con el dniCliente en la base de datos.
    const gestor = await GestorModel.findOne({ dni: dniGestor }).exec();
    if (!gestor) {
        throw new assignClienteAndGestorError("Gestor DNI not found");
    }
    
    // Verifica si existe un Gestor con el dniGestor en la base de datos.
    const cliente = await ClienteModel.findOne({ dni: dniCliente }).exec();
    if (!cliente) {
      throw new assignClienteAndGestorError("Cliente DNI not found");
    }

    // Verifica que el gestor no tenga más de 10 clientes asignados.
    if (gestor.clientes.length > 10) {
      throw new assignClienteAndGestorError("Gestor have not space for more Clientes");
    }

    // Actualiza el gestor del cliente con el nuevo gestor.
    const updatedCliente = await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniCliente'.
        { dni: dniCliente },
        // Actualizamos campos
        { gestor: dniGestor },
        // Devuelve el documento actualizado del gestor.
        { new: true }
    ).exec();

    if (!updatedCliente) {
        throw new assignClienteAndGestorError("Cliente not Updated \n Not found");
    }
    
    // Verifica si el cliente ya está asignado al gestor.
    const clienteExists = gestor.clientes.find((elem) => elem === dniCliente);
    if (!clienteExists) {
        // Si el cliente no está asignado, agrega el cliente a la lista de los clientes del gestor.
        const updateGestor = await GestorModel.findOneAndUpdate(
            // Buscamos un registro con 'dni' igual a 'dniGestor'.
            { dni: dniGestor },
            // Actualizamos campos
            { $push: {clientes: dniCliente} },
            // Devuelve el documento actualizado del gestor.
            { new: true }
        ).exec();   

        if (!updateGestor) {
            throw new assignClienteAndGestorError("Gestor not Updated \n Not found");
        }

    } else {
        throw new assignClienteAndGestorError("Gestor has already assigned the Cliente");
    }
};

export default assignClienteAndGestor;
