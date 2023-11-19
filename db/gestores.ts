import mongoose from "npm:mongoose@7.6.3";
import { Gestor } from "../types.ts";

const Schema = mongoose.Schema; //Que campos tiene doc en la coleccion

const GestorSchema = new Schema(
  {
    nombre: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    clientes: { type: [String], required: false, default: [] },
  },
  // { timestamps: true } //Añade dos campos creado y modificado
);

export type GestorModelType = mongoose.Document & Omit<Gestor, "id">; //Modelo sirve para comunicar con la db

export default mongoose.model<GestorModelType>("Gestor", GestorSchema);

