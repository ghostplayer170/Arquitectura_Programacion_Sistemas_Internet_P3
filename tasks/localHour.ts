export function obtenerHoraActual(): string {
    // Obtiene la hora actual como una cadena en el formato local
    const now = new Date();
    const horaActual = now.toLocaleTimeString();
    return horaActual;
}