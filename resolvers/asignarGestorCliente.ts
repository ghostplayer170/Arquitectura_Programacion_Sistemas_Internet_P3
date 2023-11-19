import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";

const updateClientesGestor = async (req: Request, res: Response) => {
  try {
    
    const { id } = req.params;
    const { dni } = req.body;

    if (!id || !dni) {
      res.status(400).send("Cliente DNI and Gestor DNI are required");
      return;
    }

    const gestor = await GestorModel.findOne({ dni }).exec();
    // Si no encuentra la factura.
    if (!gestor) {
      res.status(404).send("Gestor not found");
      return;
    }

    const updatedCliente = await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'id'
        { dni: id },
        // Actualizamos campos
        { gestor: dni },
        // Opciones adicionales, en este caso 'new: true' indica que queremos obtener el documento actualizado
        { new: true }
    ).exec();

    if (!updatedCliente) {
        res.status(404).send("Cliente not found");
        return;
    }

    if(gestor.clientes.length <= 10){
        res.status(404).send("Gestor have not space");
        return;
    }
    
    const clientesGestor = gestor.clientes.push(id);

    const updatedGestor = await GestorModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dni'
        { dni: dni },
        // Actualizamos campos
        { clientes: clientesGestor },
        // Opciones adicionales, en este caso 'new: true' indica que queremos obtener el documento actualizado
        { new: true }
    ).exec();

    if (!updatedGestor) {
        res.status(404).send("Gestor not found");
        return;
    }

    res.status(200).send("Cliente and Gestor Updated");
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updateClientesGestor;
