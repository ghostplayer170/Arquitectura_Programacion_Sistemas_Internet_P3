import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";

export const assignClienteAndGestor = async (dniCliente: string, dniGestor: string) => {

    const gestor = await GestorModel.findOne({ dniGestor }).exec();

    // Si no encuentra el gestor.
    if (!gestor) {
      throw new Error("Gestor not found");
    }

    if(gestor.clientes.length > 10){
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

    if(!clienteExists){
        
        const clientesGestor = gestor.clientes.push(dniCliente);
        
        const updateGestor = await GestorModel.findOneAndUpdate(
            // Buscamos un registro con 'dni' igual a 'dni'
            { dni: dniCliente },
            // Actualizamos campos
            { clientes: clientesGestor },
            
            { new: true }
        ).exec();

        if (!updateGestor) {
            throw new Error("Gestor not found");
        }
    }
};

export default assignClienteAndGestor;
