import ClienteModel from "../db/clientes.ts";
import HipotecaModel from "../db/hipotecas.ts";

export const payingCoutasHipotecas = async () => {
  try {
    // Encuentra todas las hipotecas con cuotas pendientes
    const hipotecasPendientes = await HipotecaModel.find({ deudaCuotas: { $gt: 0 } });

    // Encuentra y actualiza los clientes asociados a estas hipotecas
    await Promise.all(
      hipotecasPendientes.map(async (hipoteca) => {
        const cliente = await ClienteModel.findOneAndUpdate(
          { hipotecas: hipoteca._id, saldo: { $gte: hipoteca.importe / hipoteca.cuotas } },
          {
            $inc: { saldo: - (hipoteca.importe/hipoteca.cuotas) },
            $push: { movimientos: `Paid ${hipoteca.importe/hipoteca.cuotas}$ for Hipoteca ${hipoteca._id}` },
          },
          { new: true }
        );

        if (cliente) {
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
