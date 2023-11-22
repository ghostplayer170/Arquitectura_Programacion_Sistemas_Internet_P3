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
import depositDineroClientes from "./tasks/depositDineroClientes.ts";
import payingCoutasHipotecas from "./tasks/payingCoutasHipotecas.ts";

// Importación de función 'load' de Deno para cargar variables de entorno.
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts"; // Leer variables de entorno
const env = await load(); // Carga Variables de entorno

// Variables de entorno.
const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");
const PORT = env.PORT || Deno.env.get("PORT") ;

// Verifica variables de entorno.
if (!MONGO_URL || !PORT) {
  console.log("No mongo URL or Port found");
  Deno.exit(1);
}

// Conexión a la base de datos MongoDB.
try{
  await mongoose.connect(MONGO_URL);
  console.info("Mongo Connected");
}catch(e){
  console.error(e);
}

// Creación de una instancia de Express.
const app = express();
app.use(express.json());

// Rutas y controladores.
app
  .post("/api/BancoNebrija/addCliente", addCliente)
  .post("/api/BancoNebrija/addGestor", addGestor)
  .post("/api/BancoNebrija/addHipoteca", addHipoteca)
  .delete("/api/BancoNebrija/deleteCliente/:id", deleteCliente)
  .put("/api/BancoNebrija/asignarGestorCliente/:id", asignarGestorCliente)
  .put("/api/BancoNebrija/amortizarHipotecaCliente/:id", amortizarHipotecaCliente)
  .put("/api/BancoNebrija/transaccionParaCliente/:id", transaccionParaCliente)
  .put("/api/BancoNebrija/ingresarDineroCliente/:id", ingresarDineroCliente);

// Ejecutar las funciones cada 5 minutos
const tiempoEjecucion = 1 * 60 * 1000; // 5 minutos en milisegundos

// Ejecuta la función de depositar dinero a todos los clientes repetidamente cada cierto tiempo.
setInterval(depositDineroClientes, tiempoEjecucion);
// Ejecuta la función de pagar las hipotecas de asociadas a cada cliente repetidamente cada cierto tiempo.
setInterval(payingCoutasHipotecas, tiempoEjecucion);

// Iniciar el servidor.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});