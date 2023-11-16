import mongoose from "npm:mongoose@7.6.3";
import { Hipoteca } from "../types.ts";

const Schema = mongoose.Schema; //Que campos tiene doc en la coleccion

const HipotecaSchema = new Schema(
  {
    importe: { type: Number, required: true },
    cuotas: { type: Number, required: false , default: 20},
    cliente: { type: String, required: true },
    gestor: { type: String, required: true },    
    deuda: { type: Number, required: true},
  },
  // { timestamps: true } //Añade dos campos creado y modificado
);

export type HipotecaModelType = mongoose.Document & Omit<Hipoteca, "id">; //Modelo sirve para comunicar con la db

export default mongoose.model<HipotecaModelType>("Hipoteca", HipotecaSchema);