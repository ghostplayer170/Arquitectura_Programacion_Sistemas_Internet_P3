// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";

const transaccionParaCliente = async (req: Request, res: Response) => {
  try {
    
    const dniEmisor = req.params.id;
    const { dniReceptor, importe } = req.body;

    if (!dniEmisor || !dniReceptor || !importe) {
      res.status(400).send("Cliente Emisor DNI, Cliente Receptor DNI, importe Dinero are required");
      return;
    }

    if(importe <= 0){
        res.status(400).send("importe Dinero must be greater than 0");
        return;
    }

    //Emisor
    const clienteEmisor = await ClienteModel.findOne({ dni: dniEmisor }).exec();
    
    if (!clienteEmisor) {
        res.status(404).send("Cliente Emisor not found");
        return;
    }

    const movimiento = `Emisor: ${dniEmisor} send ${importe} to Receptor: ${dniReceptor}`;

    if(clienteEmisor.saldo >= importe){
        clienteEmisor.saldo -= importe;
        clienteEmisor.movimientos.push(movimiento);
    }else{
        res.status(400).send("Cliente Emisor insufficient balance");
        return;
    }

    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniEmisor'
        { dni: dniEmisor },
        // Actualizamos campos
        { saldo: clienteEmisor.saldo },
    ).exec();

    //Receptor
    const clienteReceptor = await ClienteModel.findOne({ dni: dniReceptor }).exec();

    if (!clienteReceptor) {
        res.status(404).send("Cliente Receptor not found");
        return;
    }

    clienteReceptor.saldo += importe;
    clienteReceptor.movimientos.push(movimiento);

    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniReceptor'
        { dni: dniReceptor },
        // Actualizamos campos
        { saldo: clienteReceptor.saldo },
    ).exec();

    res.status(200).send(`Cliente ${dniEmisor} and Cliente ${dniReceptor} Updated \n ${movimiento}`);
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default transaccionParaCliente;
