import ClienteModel from "../db/clientes.ts";
import HipotecaModel from "../db/hipotecas.ts";

export const payingCoutasHipotecas = async () => {
  try {
    // Encuentra todas las hipotecas con cuotas pendientes.
    const hipotecasPendientes = await HipotecaModel.find({ deudaCuotas: { $gt: 0 } });

    // Encuentra y actualiza los clientes asociados a estas hipotecas.
    await Promise.all(
      hipotecasPendientes.map(async (hipoteca) => {
        const cliente = await ClienteModel.findOneAndUpdate(
          // Obtiene un cliente con la hipoteca pendiente y saldo suficiente para pagar la cuota.
          { hipotecas: hipoteca._id, saldo: { $gte: hipoteca.importe/hipoteca.cuotas } },
          // Reduce el saldo del cliente, y añade un movimiento al historial del cliente.
          { $inc: { saldo: -(hipoteca.importe/hipoteca.cuotas) }, $push: { movimientos: `Paid ${hipoteca.importe/hipoteca.cuotas}$ for Hipoteca ${hipoteca._id}` } },
          // Devuelve el nuevo documento actualizado.
          { new: true }
        );

        // Si se encuentra el cliente y se actualiza su información.
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