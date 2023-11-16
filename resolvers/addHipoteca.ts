import { Request, Response } from "npm:express@4.18.2";
import HipotecaModel from "../db/hipotecas.ts";

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

    // Caso contrario, crea un nuevo Hipoteca y lo guarda en la base de datos.
    const newHipoteca = new HipotecaModel({ importe, deuda: importe, cliente, cuotas, gestor });
    await newHipoteca.save();

    // Responde con los datos del nuevo Hipoteca.
    res.status(200).send({
        id: newHipoteca._id.toString(),
        importe: newHipoteca.importe,
        deuda: newHipoteca.deuda,
        cuotas: newHipoteca.cuotas,
        cliente: newHipoteca.cliente,
        gestor: newHipoteca.gestor,
    });
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addHipoteca;