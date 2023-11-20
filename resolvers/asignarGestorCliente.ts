// deno-lint-ignore-file
// @ts-ignore
import { Request, Response } from "npm:express@4.18.2";
import assignClienteAndGestor, { assignClienteAndGestorError } from "./assignClienteAndGestor.ts";

const updateClientesGestor = async (req: Request, res: Response) => {
  try {
    
    const dniCliente = req.params.id;
    const { dniGestor } = req.body;

    if (!dniCliente || !dniGestor) {
      res.status(400).send("Cliente DNI and Gestor DNI are required");
      return;
    }

    try {
      await assignClienteAndGestor(dniCliente, dniGestor);
      res.status(200).send("Cliente and Gestor Updated");
    } catch (error) {
      if (error instanceof assignClienteAndGestorError) {
        res.status(400).send(error.message);
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default updateClientesGestor;