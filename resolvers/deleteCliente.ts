import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";

// Esta función maneja una solicitud para eliminar un cliente.
const deleteCliente = async (req: Request, res: Response) => {
  try {
    // Obtiene el cif del cliente de los parámetros de la solicitud.
    const { id } = req.params;

    // Busca y elimina el cliente con el CIF otorgado.
    const Cliente = await ClienteModel.findOneAndDelete({ dni: id }).exec();

    // Si no encuentra cliente.
    if (!Cliente) {
      res.status(404).send("Cliente not found");
      return;
    }
    
    // Caso contrario, se elimina correctamente, envía un mensaje de cliente eliminado.
    res.status(200).send("Cliente deleted");

  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteCliente;
