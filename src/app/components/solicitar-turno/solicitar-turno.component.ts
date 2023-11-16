import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/clases/especialidad';
import { Especialista } from 'src/app/clases/especialista';
import { Paciente } from 'src/app/clases/paciente';
import { Turno } from 'src/app/clases/turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css'],
})
export class SolicitarTurnoComponent {
  selectedImage: any = null;
  imagenURL: string = '';
  user: any;
  form!: FormGroup;
  errorCheck: boolean = false;
  Message: string = '';
  especialidades: Especialidad[] = [];
  especialistas: Especialista[] = [];
  especialistasFiltrados: Especialista[] = [];
  pacientes: Paciente[] = [];
  especialidadSeleccionada: string = '';
  esAdmin: boolean = false;
  fechaObtenida: boolean = false;
  especialista: string | undefined = undefined;
  especialistaFalso:boolean = false;
  constructor(
    private authService: FirebaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      especialidad: new FormControl('', [Validators.required]),
      especialista: new FormControl('', [Validators.required]),
      paciente: new FormControl('', this.esAdmin ? [Validators.required] : []),
      hora: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
    });
    this.cargarEspecialidades();
    let id = localStorage.getItem('logueado');
    this.esAdmin = localStorage.getItem('admin') === 'true';
    if (id) {
      let admin = await this.authService.getAdminByUid(id);
      if (admin != null) {
        this.esAdmin = true;
        this.cargarPacientes();
        localStorage.setItem('admin', 'true');
      }
    }
  }
  onEspecialidadChange(event: any) {
    this.especialidadSeleccionada = this.form.controls['especialidad'].value;
    this.filtrarEspecialistas();
    this.especialista = undefined;
    this.fechaObtenida = false;
  }
  onEspecialistaChange(event: any) {
    this.especialista = undefined;
    this.especialista = this.form.controls['especialista'].value;
    this.fechaObtenida = false;
    this.cdr.detectChanges();
  }
  async cargarPacientes() {
    this.pacientes = await this.authService.getAllPacientes();
  }
  async cargarEspecialidades() {
    const especialidadesData = await this.authService.obtenerEspecialidades();
    this.especialidades = especialidadesData.map((especialidadData: any) => {
      const especialidad = new Especialidad(
        especialidadData.id,
        especialidadData.nombre
      );
      return especialidad;
    });

    this.cargarEspecialistas();
  }
  async cargarEspecialistas() {
    const especialistasData = await this.authService.obtenerEspecialistas();
    const especialidades = this.especialidades;

    this.especialistas = especialistasData.map((especialistaData: any) => {
      const especialidadesDelEspecialista = Array.isArray(
        especialistaData.especialidades
      )
        ? especialistaData.especialidades.map((especialidadId: string) => {
            const especialidad = especialidades.find(
              (esp: any) => esp.uid === especialidadId
            );
            return especialidad ? especialidad.uid : 'Especialidad Desconocida';
          })
        : [];
      let esp = new Especialista(
        especialistaData.uid,
        especialistaData.nombre,
        especialistaData.apellido,
        especialistaData.edad,
        especialistaData.dni,
        especialidadesDelEspecialista,
        especialistaData.foto1,
        especialistaData.verificado
      );
      esp.turnos = especialistaData.turnos;
      return esp;
    });
  }
  filtrarEspecialistas() {
    this.especialistasFiltrados = this.especialistas.filter(
      (especialista: any) =>
        especialista.especialidades.includes(this.especialidadSeleccionada)
    );
  }
  onTurnoSeleccionado(turno: { dia: Date; hora: string }) {
    if(turno.hora == ''){
      this.fechaObtenida = false;
      this.especialista = undefined;
      this.especialistaFalso =  true;
      Swal.fire({
        icon: 'error',
        title: 'Error, el especialista no tiene horarios cargados...',
        timer: 2500,
      })
      return;
    }
    const fechaSeleccionada: Date = turno.dia;
    const horaSeleccionada: string = turno.hora;
    const fechaCompleta: Date = new Date(
      fechaSeleccionada.getFullYear(),
      fechaSeleccionada.getMonth(),
      fechaSeleccionada.getDate(),
      parseInt(horaSeleccionada.split(':')[0]),
      parseInt(horaSeleccionada.split(':')[1])
    );
    this.form.controls['fecha'].setValue(fechaCompleta);
    this.form.controls['hora'].setValue(horaSeleccionada);
    this.fechaObtenida = true;
    // Formatear la fecha y la hora
    const fechaFormateada = fechaCompleta.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const horaFormateada = fechaCompleta.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    Swal.fire({
      icon: 'warning',
      text:
        'La fecha seleccionada es ' +
        fechaFormateada +
        ' y la hora es ' +
        horaFormateada,
      title: '¡Fecha!',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  async onSubmit() {
    if (this.form.valid && this.especialistaFalso == false) {
      let paciente = localStorage.getItem('logueado');
      if (this.esAdmin) {
        paciente = this.form.controls['paciente'].value;
      }
      if (paciente) {
        const puedeCargarTurno = await this.validarTurno(paciente);
        if (puedeCargarTurno) {
          this.cargarTurno(paciente);
        }
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error, complete los datos correctamente',
        timer: 2500,
      });
    }
  }
  async validarTurno(pacienteId: string) {
    const especialidad = this.form.controls['especialidad'].value;

    const turnosDelPaciente = await this.authService.obtenerTurnosDelPaciente(
      pacienteId
    );

    const turnosEnLaMismaEspecialidad = turnosDelPaciente.filter(
      (turno) => turno.idEspecialidad == especialidad
    );

    if (turnosEnLaMismaEspecialidad.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El paciente ya tiene un turno en esta especialidad.',
        timer: 2500,
      });
      return false;
    } else {
      return true;
    }
  }

  async cargarTurno(paciente: string) {
    try {
      let turno = new Turno(
        '',
        this.form.controls['especialista'].value,
        this.form.controls['especialidad'].value,
        paciente,
        'espera',
        this.form.controls['fecha'].value,
        this.form.controls['hora'].value
      );
      await this.authService.guardarTurno(turno);
      Swal.fire({
        icon: 'success',
        text: 'debera esperar que el especialista acepte!',
        title: '¡Turno solicitado!',
        showConfirmButton: false,
        timer: 1500,
      });
      this.form.reset();
      this.especialista = undefined;
      this.fechaObtenida = false;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al solicitar turno',
        text: this.Message,
        timer: 4000,
      });
    }
  }
}
