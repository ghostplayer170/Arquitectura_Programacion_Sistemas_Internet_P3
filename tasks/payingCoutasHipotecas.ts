import ClienteModel from "../db/clientes.ts";
import HipotecaModel from "../db/hipotecas.ts";

export const payingCoutasHipotecas = async () => {
  try {
    const now = new Date();
    const horaActual = now.toLocaleTimeString(); // Obtiene la hora actual como una cadena en el formato local
  
    // Obtiene todas las hipotecas con cuotas pendientes.
    const hipotecasPendientes = await HipotecaModel.find({ deudaCuotas: { $gt: 0 } });

    // Obtiene y actualiza los clientes asociados a estas hipotecas.
    await Promise.all(
      hipotecasPendientes.map(async (hipoteca) => {
        // Mensaje del movimiento/transaccion.
        const movimiento = `${horaActual}: Paid ${hipoteca.importe/hipoteca.cuotas}$ for Hipoteca ${hipoteca._id}`;
        // Actualiza la información del cliente en la base de datos.
        const cliente = await ClienteModel.findOneAndUpdate(
          // Obtiene un cliente con la hipoteca pendiente de pagar y que tenga saldo suficiente para pagar la cuota.
          { hipotecas: hipoteca._id, saldo: { $gte: hipoteca.importe/hipoteca.cuotas } },
          // Reduce el saldo del cliente, y añade un movimiento al historial del cliente.
          { $inc: { saldo: -(hipoteca.importe/hipoteca.cuotas) }, $push: { movimientos: movimiento } },
          // Devuelve el nuevo documento actualizado.
          { new: true }
        );

        // Si el cliente existe, actualiza información en la hipoteca.
        if (cliente) {
          // Reduce la deuda de cuotas e importe en la hipoteca.
          hipoteca.deudaCuotas -= 1;
          hipoteca.deudaImporte -= hipoteca.importe / hipoteca.cuotas;
          await hipoteca.save();
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export default payingCoutasHipotecas;