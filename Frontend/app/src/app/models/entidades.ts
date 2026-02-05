export interface Usuario {
  id?: number; nombre: string; email: string; password?: string; rol: string; perfil?: Perfil;
}
export interface Proyecto {
  id?: number; nombre: string; descripcion: string; seccion: string; urlRepo: string; tecnologias: string; usuarioId?: number;
}
export interface Asesoria {
  id?: number; fecha: string; hora: string; tema: string; estado: string;
}

export interface Perfil {
  id?: number;
  descripcion?: string;
  especialidad?: string;
  github?: string;
  whatsapp?: string;
}

