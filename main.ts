import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";

import addCliente from "./resolvers/addCliente.ts";
import addGestor from "./resolvers/addGestor.ts";
import addHipoteca from "./resolvers/addHipoteca.ts";
import deleteCliente from "./resolvers/deleteCliente.ts";
import asignarGestorCliente from "./resolvers/asignarGestorCliente.ts";
import amortizarHipotecaCliente from "./resolvers/amortizarHipotecaCliente.ts";
import transaccionParaCliente from "./resolvers/transaccionParaCliente.ts";
import ingresarDineroCliente from "./resolvers/ingresarDineroCliente.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts"; //Leer variables de entorno
const env = await load(); //Carga Variables de entorno

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL"); //Variable del sistema operativo
const PORT = env.PORT || Deno.env.get("PORT") ;

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

try{
  await mongoose.connect(MONGO_URL);
  console.info("Mongo Connected");
}catch(e){
  console.error(e);
}

const app = express();
app.use(express.json());

app
  .post("/api/BancoNebrija/addCliente", addCliente)
  .post("/api/BancoNebrija/addGestor", addGestor)
  .post("/api/BancoNebrija/addHipoteca", addHipoteca)
  .delete("/api/BancoNebrija/deleteCliente/:id", deleteCliente)
  .put("/api/BancoNebrija/asignarGestorCliente/:id", asignarGestorCliente)
  .put("/api/BancoNebrija/amortizarHipotecaCliente/:id", amortizarHipotecaCliente)
  .put("/api/BancoNebrija/transaccionParaCliente/:id", transaccionParaCliente)
  .put("/api/BancoNebrija/ingresarDineroCliente/:id", ingresarDineroCliente);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});