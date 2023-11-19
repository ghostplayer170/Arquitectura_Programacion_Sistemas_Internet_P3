// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";

const ingresarDineroCliente = async (req: Request, res: Response) => {
  try {
    
    const dni = req.params.id;
    const importe: number = req.body.importe;

    if (!dni || !importe) {
      res.status(400).send("Cliente DNI and Cantidad Dinero are required");
      return;
    }

    if(importe <= 0){
        res.status(400).send("Cantidad Dinero must be greater than 0");
        return;
    }

    const cliente = await ClienteModel.findOne({ dni: dni }).exec();
    
    if (!cliente) {
        res.status(404).send("Cliente  not found");
        return;
    }

    const movimiento = `Emisor: ${dni} send ${importe} to Receptor: ${dni}`;

    if (cliente?.saldo !== undefined) {
        cliente.saldo += importe;
        cliente.movimientos.push(movimiento);
    } else {
        res.status(400).send("Money could not be deposited");
        return;
    }

    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dni'
        { dni: dni },
        // Actualizamos campos
        { saldo: cliente.saldo, movimientos: cliente.movimientos },
    ).exec();

    res.status(200).send(movimiento);
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default ingresarDineroCliente;
