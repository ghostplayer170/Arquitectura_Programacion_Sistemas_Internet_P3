import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";

import addCliente from "./resolvers/addCliente.ts";
import addGestor from "./resolvers/addGestor.ts";
import addHipoteca from "./resolvers/addHipoteca.ts";
import deleteCliente from "./resolvers/deleteCliente.ts";
import updateClientesGestor from "./resolvers/updateClientesGestor.ts";
//import updateHipotecaCliente from "./resolvers/updateHipotecaCliente.ts";
//import updateMovimientosCliente from "./resolvers/updateMovimientosCliente.ts";
//import updateSaldoCliente from "./resolvers/updateSaldoCliente.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts"; //Leer variables de entorno
const env = await load(); //Carga Variables de entorno

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL") || "mongodb+srv://rmontenegrop:Lllubo6BT2sVncJg@clusteruni.pagju8q.mongodb.net/BancoNebrija?retryWrites=true&w=majority"; //Variable del sistema operativo
const PORT = env.PORT || Deno.env.get("PORT") || 3020;

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
  .post("/api/BancoNebrija/addGestor/", addGestor)
  .post("/api/BancoNebrija/addHipoteca/", addHipoteca)
  .delete("/api/BancoNebrija/deleteCliente/:id", deleteCliente)
  .put("/api/BancoNebrija/updateClientesGestor/:id", updateClientesGestor)
  //.put("/api/BancoNebrija/updateHipotecaCliente/:id", updateHipotecaCliente)
  //.put("/api/BancoNebrija/updateMovimientosCliente/:id", updateMovimientosCliente)
  //.put("/api/BancoNebrija/updateSaldoCliente/:id", updateSaldoCliente);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});