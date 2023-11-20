// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import assignClienteAndGestor, { assignClienteAndGestorError } from "./assignClienteAndGestor.ts";

const updateClientesGestor = async (req: Request, res: Response) => {
  try {
    
    // Obtiene el DNI del cliente y el DNI del gestor desde el cuerpo y parámetros de la solicitud.
    const dniCliente = req.params.id;
    const { dniGestor } = req.body;
    
    // Verifica si el DNI del cliente y el DNI del gestor está ausente en la solicitud.
    if (!dniCliente || !dniGestor) {
      res.status(400).send("Cliente DNI and Gestor DNI are required");
      return;
    }
    
    // Asignar el cliente al gestor.
    try {
      await assignClienteAndGestor(dniCliente, dniGestor);
      res.status(200).send(`Cliente: ${dniCliente} and Gestor: ${dniGestor} Updated`);
    } catch (error) {
      if (error instanceof assignClienteAndGestorError) {
        res.status(400).send(error.message);
        return;
      } else {
        res.status(500).send("Internal Server Error");
        return;
      }
    }

  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default updateClientesGestor;