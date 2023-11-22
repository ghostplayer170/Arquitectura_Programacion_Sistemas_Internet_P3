// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";
import HipotecaModel from "../db/hipotecas.ts";
import { obtenerHoraActual } from "../localHour.ts"

const amortizarHipotecaCliente = async (req: Request, res: Response) => {
  try {
    
    // Obtiene el DNI del cliente y la hipoteca desde el cuerpo y parámetros de la solicitud.
    const dniCliente = req.params.id;
    const { hipoteca } = req.body;

    // Verifica si el DNI del cliente y el id de hipoteca está ausente en la solicitud.
    if (!dniCliente || !hipoteca) {
      res.status(400).send("Cliente dniCliente are required");
      return;
    }

    // Busca si existe el cliente en la base de datos usando su DNI.
    const cliente = await ClienteModel.findOne({ dni: dniCliente }).exec();
    if (!cliente) {
        res.status(404).send("Cliente  not found");
        return;
    }

    // Busca si existe la hipoteca en la base de datos usando su _id.
    const hipotecaCliente = await HipotecaModel.findOne({ _id: hipoteca }).exec();
    if (!hipotecaCliente) {
        res.status(404).send("Hipoteca  not found");
        return;
    }

    // Verifica que la hipoteca este asociada a las hipotecas del cliente.
    const idHipoteca = cliente.hipotecas.find((hipotecaExiste) => hipotecaExiste === hipoteca);
    if (!idHipoteca) {
        res.status(404).send("Hipoteca not found in Cliente Hipotecas");
        return;
    }
    
    // Calculo importe de la cuota.
    const importeCuota = hipotecaCliente.importe/hipotecaCliente.cuotas;
    // Verifica si hay pagos pendientes.
    const pagosPendientes = hipotecaCliente.deudaCuotas > 0;
    // Mensaje del movimiento/transaccion.
    const movimiento = `${obtenerHoraActual()}: Emisor: ${dniCliente} has amortised ${importeCuota} on his Hipoteca: ${idHipoteca}`;

    // Verifica si no hay pagos pendientes. La Hipoteca se encuentra pagada.
    if (!pagosPendientes) {
        res.status(400).send("Hipoteca is already completed");
        return;
    }
    
    // Si hay saldo suficiente y pagos pendientes, realizar la amortización de la hipoteca.
    if ( cliente.saldo >= importeCuota ) {
        // Actualización campos hipoteca.
        hipotecaCliente.deudaImporte -= importeCuota;
        hipotecaCliente.deudaCuotas -= 1;
        // Actualización campos cliente.
        cliente.saldo -= importeCuota;
        cliente.movimientos.push(movimiento);
    }else{
        res.status(400).send("Cliente has insufficient balance");
        return;
    }
    
    // Actualiza la información de la hipoteca en la base de datos.
    await HipotecaModel.findOneAndUpdate(
        // Buscamos un registro con '_id' igual a 'idHipoteca'.
        { _id: idHipoteca },
        // Actualizamos campos
        { deudaImporte: hipotecaCliente.deudaImporte, deudaCuotas: hipotecaCliente.deudaCuotas },
    ).exec();

    // Actualiza la información del cliente en la base de datos.
    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniCliente'
        { dni: dniCliente },
        // Actualizamos campos
        { saldo: cliente.saldo, movimientos: cliente.movimientos },
    ).exec();

    res.status(200).send(`Hipoteca: ${idHipoteca} from Cliente: ${dniCliente} was Updated \n ${movimiento}`);
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default amortizarHipotecaCliente;
