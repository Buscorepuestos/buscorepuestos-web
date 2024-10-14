export enum Ubication {
    EnProcesoDedesMontaje = 0,
    Almacenada = 1,
    ConIncidencia = 2,
    EnReparto = 3,
    EnControlDeCalidad = 4,
    Desechada = 5,
    EnMostrador = 6,
    MontadaRevisada = 7,
    Vendida = 8,
    SituacionDesconocida = 9
}

export enum MaterialType {
    Revisado = 0,
    Nuevo = 1,
    DeSegundaMano = 2,
    Reparado = 3
}

export interface PartInterface {
    idEmpresa: number
    refLocal: number
    idVehiculo: number
    codFamilia: string
    descripcionFamilia: string
    codArticulo: string
    descripcionArticulo: string
    codVersion: string
    refPrincipal: string
    precio: number
    anyoStock: number
    peso: number
    ubicacion: Ubication
    observaciones: string
    reserva: number
    tipoMaterial: MaterialType
    urlsImgs: string[]
    fechaMod: string
    codAlmacen: string
}