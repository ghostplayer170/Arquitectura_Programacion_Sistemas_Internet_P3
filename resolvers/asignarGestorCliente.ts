import { Request, Response } from "npm:express@4.18.2";
import assignClienteAndGestor from "./assignClienteAndGestor.ts"

const updateClientesGestor = (req: Request, res: Response) => {
  try {
    
    const dniCliente = req.params.id;
    const { dniGestor } = req.body;

    if (!dniCliente || !dniGestor) {
      res.status(400).send("Cliente DNI and Gestor DNI are required");
      return;
    }

    try {
      assignClienteAndGestor(dniCliente, dniGestor);
    } catch (error) {
      res.status(400).send(error);
    }

    res.status(200).send("Cliente and Gestor Updated");
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updateClientesGestor;
