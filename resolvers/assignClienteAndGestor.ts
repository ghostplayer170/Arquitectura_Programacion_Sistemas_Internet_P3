import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";

const assignClienteAndGestor = async (dniCliente: string, dniGestor: string) => {

    const gestor = await GestorModel.findOne({ dniGestor }).exec();

    // Si no encuentra el gestor.
    if (!gestor) {
      throw new Error("Gestor not found");
    }

    if(gestor.clientes.length > 10){
        throw new Error("Gestor have not space");
    }

    const updatedCliente = await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniCliente'
        { dni: dniCliente },
        // Actualizamos campos
        { gestor: dniGestor },
        // Opciones adicionales, en este caso 'new: true' indica que queremos obtener el documento actualizado
        { new: true }
    ).exec();

    if (!updatedCliente) {
        throw new Error("Cliente not found");
    }
    
    const clientesGestor = gestor.clientes.push(dniCliente);

    await GestorModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dni'
        { dni: dniCliente },
        // Actualizamos campos
        { clientes: clientesGestor },
        // Opciones adicionales, en este caso 'new: true' indica que queremos obtener el documento actualizado
        { new: true }
    ).exec();

};

export default assignClienteAndGestor;
