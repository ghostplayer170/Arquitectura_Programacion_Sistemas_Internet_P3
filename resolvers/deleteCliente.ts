// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";

// Esta función maneja una solicitud para eliminar un cliente.
const deleteCliente = async (req: Request, res: Response) => {
  try {
    // Obtiene el dni del cliente de los parámetros de la solicitud.
    const  dni  = req.params.id;

    // Busca y elimina el cliente con el dni otorgado.
    const Cliente = await ClienteModel.findOne({ dni: dni }).exec();

    // Si no encuentra cliente.
    if (!Cliente) {
      res.status(404).send("Cliente not found");
      return;
    }
  
    // Si el cliente tiene una hipoteca pendiente no puede ser eliminado de la base de datos.
    if (Cliente.hipotecas.length > 0) {
      res.status(404).send("Cliente has outstanding Hipotecas");
      return;
    }
    
    // Obtener el gestor asociado al cliente.
    const Gestor = await GestorModel.findOne({ dni: Cliente.gestor }).exec();
    if (!Gestor) {
      res.status(404).send("Gestor not found");
      return;
    }
    
    // Elimina al cliente del array de clientes del gestor.
    const updatedClientes = Gestor.clientes.filter((cliente: string) => cliente !== dni);

    await GestorModel.findOneAndUpdate(
      // Buscamos un registro con 'dni' igual a gestor.
      { dni: Cliente.gestor },
      // Actualizamos solo el campo 'clientes'.
      { $set: { clientes: updatedClientes } } 
      ).exec();

    // Busca y elimina el cliente con el dni otorgado.
    await ClienteModel.findOneAndDelete({ dni: dni }).exec();

    // Envía un mensaje de cliente eliminado.
    res.status(200).send(`Cliente ${dni} deleted`);

  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteCliente;
