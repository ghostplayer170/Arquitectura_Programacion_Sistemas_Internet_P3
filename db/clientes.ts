import mongoose from "npm:mongoose@7.6.3";
import { Cliente } from "../types.ts";
import { Transaccion } from "../types.ts"

const Schema = mongoose.Schema; //Que campos tiene doc en la coleccion

const ClienteSchema = new Schema(
  {
    nombre: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    saldo: { type: Number, required: false, default: 0},
    hipotecas: { type: [String], required: false, default: [] },
    movimientos: { type: [Transaccion], required: false, default: [] },
    gestor: { type: String, required: false },
  },
  // { timestamps: true } //Añade dos campos creado y modificado
);

export type ClienteModelType = mongoose.Document & Omit<Cliente, "id">; //Modelo sirve para comunicar con la db

export default mongoose.model<ClienteModelType>("Cliente", ClienteSchema);

