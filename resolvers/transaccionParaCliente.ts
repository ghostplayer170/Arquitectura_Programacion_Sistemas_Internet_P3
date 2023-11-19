import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";

const transaccionParaCliente = async (req: Request, res: Response) => {
  try {
    
    const dniEmisor = req.params.id;
    const { dniReceptor, cantidad } = req.body;

    if (!dniEmisor || !dniReceptor || !cantidad) {
      res.status(400).send("Cliente Emisor DNI, Cliente Receptor DNI, Cantidad Dinero are required");
      return;
    }

    if(cantidad <= 0){
        res.status(400).send("Cantidad Dinero must be greater than 0");
        return;
    }

    //Emisor
    const clienteEmisor = await ClienteModel.findOne({ dni: dniEmisor }).exec();
    
    if (!clienteEmisor) {
        res.status(404).send("Cliente Emisor not found");
        return;
    }

    if(clienteEmisor?.saldo !== undefined && clienteEmisor?.saldo >= cantidad){
        clienteEmisor.saldo -= cantidad;
        clienteEmisor.movimientos.push({emisor: dniEmisor, receptor: dniReceptor, importe: cantidad})
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

    if(clienteReceptor?.saldo !== undefined && clienteReceptor?.saldo >= cantidad){
        clienteReceptor.saldo += cantidad;
        clienteReceptor.movimientos.push({emisor: dniEmisor, receptor: dniReceptor, importe: cantidad})
    }else{
        res.status(400).send("Cliente Receptor insufficient balance");
        return;
    }

    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniReceptor'
        { dni: dniReceptor },
        // Actualizamos campos
        { saldo: clienteReceptor.saldo },
    ).exec();

    res.status(200).send(`Cliente ${dniEmisor} and Cliente ${dniReceptor} Updated`);
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default transaccionParaCliente;
