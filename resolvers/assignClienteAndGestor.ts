import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";

export const assignClienteAndGestor = async (dniCliente: string, dniGestor: string) => {

    const gestor = await GestorModel.findOne({ dni: dniGestor }).exec();

    // Si no encuentra el gestor.
    if (!gestor) {
      throw new Error("Gestor not found");
    }

    if (gestor.clientes.length > 10) {
      throw new Error("Gestor have not space for more Clientes");
    }

    const updatedCliente = await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniCliente'
        { dni: dniCliente },
        // Actualizamos campos
        { gestor: dniGestor },

        { new: true }
    ).exec();

    if (!updatedCliente) {
        throw new Error("Cliente not found");
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

        console.log(updateGestor!.dni)
        console.log(updateGestor!.clientes)    

        if (!updateGestor) {
            throw new Error("Gestor not found");
        }
    } else {
        throw new Error("Gestor has already assigned the Cliente");
    }
};

export default assignClienteAndGestor;
