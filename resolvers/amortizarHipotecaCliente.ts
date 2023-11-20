// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";
import HipotecaModel from "../db/hipotecas.ts";

const amortizarHipotecaCliente = async (req: Request, res: Response) => {
  try {
    
    const dniCliente = req.params.id;
    const { hipoteca } = req.body;

    if (!dniCliente) {
      res.status(400).send("Cliente dniCliente are required");
      return;
    }

    const cliente = await ClienteModel.findOne({ dni: dniCliente }).exec();
    
    if (!cliente) {
        res.status(404).send("Cliente  not found");
        return;
    }

    const hipotecaCliente = await HipotecaModel.findOne({ _id: hipoteca }).exec();

    if ( !hipotecaCliente ) {
        res.status(404).send("Hipoteca  not found");
        return;
    }

    const idHipoteca = cliente.hipotecas.find((elem) => elem === hipoteca);

    if ( !idHipoteca ) {
        res.status(404).send("Cliente Hipoteca not found");
        return;
    }

    const importeCuota = hipotecaCliente.importe/hipotecaCliente.cuotas;
    const movimiento = `Emisor: ${dniCliente} send ${importeCuota} to Receptor: ${idHipoteca}`;

    if( cliente.saldo >= importeCuota && hipotecaCliente.deudaCuotas >= 0 ){ //ARREGLAR DEUDAS COUTAS //PROBAR
        hipotecaCliente.deudaImporte -= importeCuota;
        hipotecaCliente.deudaCuotas -= 1;
        cliente.saldo -= importeCuota;
        cliente.movimientos.push(movimiento);
    }else{
        res.status(400).send("Insufficient balance");
        return;
    }

    await HipotecaModel.findOneAndUpdate(
        // Buscamos un registro con '_id' igual a 'idHipoteca'
        { _id: idHipoteca },
        // Actualizamos campos
        { deudaImporte: hipotecaCliente.deudaImporte, deudaCuotas: hipotecaCliente.deudaCuotas },
    ).exec();

    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniCliente'
        { dni: dniCliente },
        // Actualizamos campos
        { saldo: cliente.saldo, movimientos: cliente.movimientos },
    ).exec();

    res.status(200).send(`Hipoteca ${idHipoteca} from Cliente ${dniCliente} was Updated \n ${movimiento}`);
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default amortizarHipotecaCliente;
