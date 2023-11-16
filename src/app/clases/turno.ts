export class Turno {
  uid: string;
  idEspecialista: string;
  idEspecialidad: string;
  idPaciente: string;
  estado: string;
  fecha: string;
  hora: string;
  constructor(
    uid: string,
    idEspecialista: string,
    idEspecialidad: string,
    idPaciente: string,
    estado: string,
    fecha: string,
    hora: string,
  ) {
    this.uid = uid;
    this.idEspecialista = idEspecialista;
    this.idEspecialidad = idEspecialidad;
    this.idPaciente = idPaciente;
    this.estado = estado;
    this.fecha = fecha;
    this.hora = hora;
  }
}
