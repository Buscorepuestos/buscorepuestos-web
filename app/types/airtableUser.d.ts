export class UserModel {
    uid?: string;
    role: RoleEnum;
    name: string;
    password?: string;
    email: string;
    photoUrl?: string;
    phone?: string;
}

export interface AirtableUser {
    id?: string;
    uid?: string;
    "WhatsApp"?: string;
    "Solicitudes de Búsqueda"?: string;
    "correo electronico"?: string;
    "Incidencias"?: string[];
    "Logística"?: string[];
    "Nombre Cliente/Empresa"?: string;
    "Presupuestos cliente"?: string[];
    "DNI/CIF"?: string;
    "Tlf. Contacto"?: string;
    "Tipo usuario"?: "Profesional" | "Particular";
    "Estado Usuario"?: "Lead" | "Lead Caliente" | "Cliente";
    "Compras"?: string[];
    "Id. Cliente"?: number;
    "Rol": RoleEnum;
    "verified"?: boolean;
}

interface UserFields {
    FechaRegistro: string;
    Rol: string;
    uid: string;
    id: string;
}

interface UserRawJson {
    createdTime: string;
    fields: UserFields;
    id: string;
}

interface UserTable {
    _base: any; // Dependiendo de la estructura que tenga `_base`, podrías tiparlo mejor
    id: string | null;
    name: string;
}

interface AirtableUserResponse {
    id: string;
    fields: UserFields;
    _rawJson: UserRawJson;
    _table: UserTable;
}

export interface ResponseModel<T> {
    message: string;
    data?: T[];
}

export interface AirtableUserState {
    message: string;
    data?: AirtableUserResponse;
}