import { Request, Response } from "npm:express@4.18.2";
import HipotecaModel from "../db/hipotecas.ts";
import ClienteModel from "../db/clientes.ts";
import GestorModel from "../db/gestores.ts";
import assignClienteAndGestor from "./assignClienteAndGestor.ts"

// Esta función maneja una solicitud para agregar un nuevo Hipoteca.
const addHipoteca = async (req: Request, res: Response) => {
  try {
    // Obtiene el importe, cliente, gestor del cuerpo de la solicitud.
    const { importe, cliente, gestor, cuotas } = req.body;
    // Verifica si el importe, cliente, gestor están ausentes en la solicitud.
    if ( !importe || !cliente || !gestor ) {
      res.status(400).send("Importe, cliente, gestor are required");
      return;
    }

    if (importe > 1000000) {
      res.status(400).send("Hipoteca Importe can't be more than a million");
      return;
    }

    const gestorExists = await GestorModel.findOne({ dni: gestor }).exec();
    const clienteExists = await ClienteModel.findOne({ dni: cliente }).exec();

    if (!gestorExists || !clienteExists) {
      res.status(400).send("Cliente or Gestor not found");
      return;
    }

    // Caso contrario, crea un nuevo Hipoteca y lo guarda en la base de datos.
    const newHipoteca = new HipotecaModel({ importe, deuda: importe, cliente, cuotas, gestor, deudaImporte: importe });
    await newHipoteca.save();

    try {
      assignClienteAndGestor(cliente, gestor);
    } catch (error) {
      res.status(400).send(error);
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