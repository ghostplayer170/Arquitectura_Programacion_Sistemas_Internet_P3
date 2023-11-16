import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clientes.ts";

// Esta función maneja una solicitud para agregar un nuevo Cliente.
const addCliente = async (req: Request, res: Response) => {
  try {
    // Obtiene el nombre, dni, saldo, hipotecas, movimientos, gestor del cuerpo de la solicitud.
    const { nombre, dni, saldo, hipotecas, movimientos, gestor } = req.body;
    
    // Verifica si el nombre, dni, saldo, hipotecas, movimientos, gestor están ausentes en la solicitud.
    if (!nombre || !dni ) {
      res.status(400).send("Nombre, dni, gestor are required");
      return;
    }

    // Verifica si ya existe un Cliente con el mismo nombre y codigo_postal en la base de datos.
    const alreadyExists = await ClienteModel.findOne({ dni }).exec();

    if (alreadyExists) {
      res.status(400).send("Cliente already exists");
      return;
    }

    // Caso contrario, crea un nuevo Cliente y lo guarda en la base de datos.
    const newCliente = new ClienteModel({ nombre, dni, saldo, hipotecas, movimientos, gestor });
    await newCliente.save();

    // Responde con los datos del nuevo Cliente.
    res.status(200).send({
        id: newCliente._id.toString(),
        nombre: newCliente.nombre,
        dni: newCliente.dni,
        saldo: newCliente.saldo,
        hipotecas: newCliente.hipotecas,
        movimientos: newCliente.movimientos,
        gestor: newCliente.gestor,
    });
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addCliente;