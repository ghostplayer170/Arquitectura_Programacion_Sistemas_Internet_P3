import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";

const ingresarDineroCliente = async (req: Request, res: Response) => {
  try {
    
    const { id } = req.params;
    const { cantidad } = req.body;

    const dni = id;

    if (!dni || !cantidad) {
      res.status(400).send("Cliente DNI and Cantidad Dinero are required");
      return;
    }

    if(cantidad <= 0){
        res.status(400).send("Cantidad Dinero must be greater than 0");
        return;
    }

    const cliente = await ClienteModel.findOne({ dni: dni }).exec();
    
    if (!cliente) {
        res.status(404).send("Cliente  not found");
        return;
    }

    if (cliente?.saldo !== undefined) {
        cliente.saldo += cantidad;
        cliente.movimientos.push({emisor: dni, receptor: dni, importe: cantidad})
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

    res.status(200).send(`Cliente ${dni} Updated`);
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default ingresarDineroCliente;
