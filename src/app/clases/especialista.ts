export class Especialista {
  uid: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  especialidad: string;
  foto1: string;
  verificado:string;
  constructor(
    uid: string,
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    especialidad: string,
    foto1: string,
    verificado:string
  ) {
    this.uid = uid;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.especialidad = especialidad;
    this.foto1 = foto1;
    this.verificado = verificado;
  }
}
