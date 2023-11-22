// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import HipotecaModel from "../db/hipotecas.ts";
import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";
import assignClienteAndGestor, { assignClienteAndGestorError } from "./assignClienteAndGestor.ts";

// Esta función maneja una solicitud para agregar una nueva Hipoteca.
const addHipoteca = async (req: Request, res: Response) => {
  try {
    // Obtiene el importe, cliente, gestor del cuerpo de la solicitud.
    const { importe, cliente, gestor, cuotas } = req.body;

    // Verifica si el importe, cliente, gestor están ausentes en la solicitud.
    if ( !importe || !cliente || !gestor ) {
      res.status(400).send("Importe, cliente, gestor are required");
      return;
    }

    // El importe no puede ser mayor a 1 Millón.
    if (importe > 1000000) {
      res.status(400).send("Hipoteca Importe can't be more than a million");
      return;
    }

    // Verifica que el cliente y el gestor existan en las bases de datos.
    const gestorExists = await GestorModel.findOne({ dni: gestor }).exec();
    const clienteExists = await ClienteModel.findOne({ dni: cliente }).exec();
    if (!gestorExists || !clienteExists) {
      res.status(400).send("Cliente or Gestor not found");
      return;
    }

    // Crea nueva Hipoteca y lo guarda en la base de datos.
    const newHipoteca = new HipotecaModel({ importe, deuda: importe, cliente, cuotas, gestor, deudaImporte: importe, deudaCuotas: cuotas });
    await newHipoteca.save();

    // Asignamos la hipoteca al cliente 
    await ClienteModel.findOneAndUpdate(
      // Buscamos un registro con 'dni' igual a 'cliente'
      { dni: cliente },
      // Actualizamos campos
      { $push: { hipotecas: newHipoteca._id.toString() } },
    ).exec();

    try {
        // Asignar el cliente al gestor.
        await assignClienteAndGestor(cliente, gestor);
    } catch (error) {
        if (error instanceof assignClienteAndGestorError) {
          res.status(400).send(error.message);
          return;
        } else {
          res.status(500).send("Internal Server Error");
          return;
        }
    }

    // Responde con los datos del nuevo Hipoteca.
    res.status(200).send({
        id: newHipoteca._id.toString(),
        importe: newHipoteca.importe,
        deuda: newHipoteca.deuda,
        cuotas: newHipoteca.cuotas,
        cliente: newHipoteca.cliente,
        gestor: newHipoteca.gestor,
        deudaImporte: newHipoteca.deudaImporte,
        deudaCuotas: newHipoteca.deudaCuotas
    });
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addHipoteca;