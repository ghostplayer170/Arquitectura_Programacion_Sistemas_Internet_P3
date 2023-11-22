// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";
import { obtenerHoraActual } from "../localHour.ts"

const transaccionParaCliente = async (req: Request, res: Response) => {
  try {
    
    // Obtiene el DNI del emisor, DNI del recptor y el importe desde el cuerpo y parámetros de la solicitud.
    const dniEmisor = req.params.id;
    const { dniReceptor, importe } = req.body;

    // Verifica si el DNI del emisor, DNI del receptor y el importe están ausentes en la solicitud.
    if (!dniEmisor || !dniReceptor || !importe) {
      res.status(400).send("Cliente Emisor DNI, Cliente Receptor DNI, importe are required");
      return;
    }

    // Verifica que el dni emisor exista en la base de datos.
    const clienteEmisor = await ClienteModel.findOne({ dni: dniEmisor }).exec();
    if (!clienteEmisor) {
        res.status(404).send("Cliente Emisor not found");
        return;
    }

    // Verifica que el dni receptor exista en la base de datos.
    const clienteReceptor = await ClienteModel.findOne({ dni: dniReceptor }).exec();
    if (!clienteReceptor) {
        res.status(404).send("Cliente Receptor not found");
        return;
    }

    // Verifica que el importe sea mayor que 0.
    if(importe < 0){
        res.status(400).send("Importe must be greater than 0");
        return;
    }

    // Verifica que el saldo del cliente sea mayor al importe a transferir.
    if(clienteEmisor.saldo < importe){
      res.status(400).send("Cliente Emisor insufficient balance");
      return;
    }

    // Mensaje del movimiento/transaccion.
    const movimiento = `${obtenerHoraActual()}: Emisor: ${dniEmisor} has transferred ${importe}$ to Receptor: ${dniReceptor}`;

    // Actualiza la información del cliente emisor en la base de datos.
    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniEmisor'.
        { dni: dniEmisor },
        // Actualizamos campos.
        { $inc: { saldo: -importe }, $push: { movimientos: movimiento } },
    ).exec();

    // Actualiza la información del cliente receptor en la base de datos.
    await ClienteModel.findOneAndUpdate(
        // Buscamos un registro con 'dni' igual a 'dniReceptor'.
        { dni: dniReceptor },
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

export default transaccionParaCliente;
