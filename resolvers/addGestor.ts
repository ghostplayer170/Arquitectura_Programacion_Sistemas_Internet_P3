// deno-lint-ignore-file
// @ts-ignore

import { Request, Response } from "npm:express@4.18.2";
import GestorModel from "../db/gestores.ts";

// Esta función maneja una solicitud para agregar un nuevo Gestor.
const addGestor = async (req: Request, res: Response) => {
  try {
    // Obtiene el dni, nombre, clientes del cuerpo de la solicitud.
    const { dni, nombre, clientes } = req.body;
    
    // Verifica si el nombre, dni están ausentes en la solicitud.
    if ( !nombre || !dni ) {
      res.status(400).send("Nombre, dni, gestor are required");
      return;
    }

    // Verifica si ya existe un Gestor con el mismo dni en la base de datos.
    const alreadyExists = await GestorModel.findOne({ dni: dni }).exec();

    if (alreadyExists) {
      res.status(400).send("Gestor already exists");
      return;
    }

    // Caso contrario, crea un nuevo Gestor y lo guarda en la base de datos.
    const newGestor = new GestorModel({ nombre, dni, clientes });
    await newGestor.save();

    // Responde con los datos del nuevo Gestor.
    res.status(200).send({
        id: newGestor._id.toString(),
        nombre: newGestor.nombre,
        dni: newGestor.dni,
        clientes: newGestor.clientes,
    });
    
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addGestor;