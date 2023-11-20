// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";

// Esta función maneja una solicitud para eliminar un cliente.
const deleteCliente = async (req: Request, res: Response) => {
  try {
    // Obtiene el dni del cliente de los parámetros de la solicitud.
    const { id } = req.params;

    // Busca y elimina el cliente con el dni otorgado.
    const Cliente = await ClienteModel.findOne({ dni: id }).exec();

    // Si no encuentra cliente.
    if (!Cliente) {
      res.status(404).send("Cliente not found");
      return;
    }

    if (Cliente.hipotecas.length > 0) {
      res.status(404).send("Cliente has outstanding Hipotecas");
      return;
    }

    const Gestor = await GestorModel.findOneAndDelete({ dni: Cliente.gestor }).exec();

    if (!Gestor) {
      res.status(404).send("Gestor not found");
      return;
    }
    
    const updatedClientes = Gestor.clientes.filter((cliente: string) => cliente !== id);

    await GestorModel.findOneAndUpdate(
      // Buscamos un registro con 'dni' igual a gestor
      { dni: Cliente.gestor },
      // Actualizamos campos
      { clientes: updatedClientes }
    ).exec();

    // Busca y elimina el cliente con el dni otorgado.
    await ClienteModel.findOneAndDelete({ dni: id }).exec();

    // Caso contrario, se elimina correctamente, envía un mensaje de cliente eliminado.
    res.status(200).send(`Cliente ${id} deleted`);

  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteCliente;
