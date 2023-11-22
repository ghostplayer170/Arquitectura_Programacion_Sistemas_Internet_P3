// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";

const ingresarDineroCliente = async (req: Request, res: Response) => {
  try {
    
    // Obtiene el DNI del cliente y el importe desde el cuerpo y parámetros de la solicitud.
    const dni = req.params.id;
    const { importe } = req.body;

    // Verifica si el DNI del cliente y el importe están ausentes en la solicitud.
    if (!dni || !importe) {
      res.status(400).send("Cliente DNI and Cantidad Dinero are required");
      return;
    }

    // Verifica que el cliente exista en la base datos.
    const cliente = await ClienteModel.findOne({ dni: dni }).exec();
    if (!cliente) {
        res.status(404).send("Cliente  not found");
        return;
    }

    // Verifica que el importe sea mayor que 0.
    if(importe <= 0){
        res.status(400).send("Cantidad Dinero must be greater than 0");
        return;
    }
    
    // Mensaje del movimiento/transaccion.
    const movimiento = `Emisor: ${dni} deposited ${importe}$ in his bank account`; 

    // Actualiza la información del cliente en la base de datos.
    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dni'.
        { dni: dni },
        // Actualizamos campos.
        { $inc: { saldo: +importe }, $push: { movimientos: movimiento } },
    ).exec();

    // Envía un mensaje del movimiento/transaccion.
    res.status(200).send(movimiento);
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default ingresarDineroCliente;
