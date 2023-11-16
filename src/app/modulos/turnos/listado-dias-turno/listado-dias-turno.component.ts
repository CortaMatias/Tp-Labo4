import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Especialista } from 'src/app/clases/especialista';
import { Turno } from 'src/app/clases/turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-dias-turno',
  templateUrl: './listado-dias-turno.component.html',
  styleUrls: ['./listado-dias-turno.component.css'],
})
export class ListadoDiasTurnoComponent implements OnInit, OnChanges {
  @Input() especialista: string | undefined;
  @Input() especialidad: string | undefined;
  @Output() turnoSeleccionado = new EventEmitter<{ dia: Date; hora: string }>();
  especialistaData: any;
  diasDisponibles: { dia: Date; horarios: string[] }[] = [];
  loading: boolean = false;
  selectedDay: Date | undefined;
  selectedHour: string | undefined;
  periodos = ['mañana', 'tarde'];

  constructor(private auth: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    if (this.especialista) {
      this.especialistaData = await this.auth.getEspecialistasByUid(
        this.especialista
      );
    }
    this.diasDisponibles = await this.obtenerDiasDisponibles();
    if (this.diasDisponibles.length == 0) {
      this.turnoSeleccionado.emit({
        dia: new Date(),
        hora: '',
      });
    }
    this.loading = false;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['especialista']) {
      // const previo = changes['especialista'].previousValue;
      const actual = changes['especialista'].currentValue;
      this.especialista = actual;
      this.loading = true;
      if (this.especialista) {
        this.especialistaData = await this.auth.getEspecialistasByUid(
          this.especialista
        );
      }
      this.diasDisponibles = await this.obtenerDiasDisponibles();
      this.loading = false;
    }
  }

  seleccionarTurno() {
    if (this.selectedDay && this.selectedHour) {
      this.turnoSeleccionado.emit({
        dia: this.selectedDay,
        hora: this.selectedHour,
      });
    }
  }

  obtenerFechaFormateada(fecha: Date): string {
    const opcionesFecha = {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    } as any;
    return fecha.toLocaleDateString('es-ES', opcionesFecha);
  }

  seleccionarHora(dia: Date, hora: string): void {
    this.selectedDay = dia;
    this.selectedHour = hora;
  }

  async obtenerDiasDisponibles(): Promise<{ dia: Date; horarios: string[] }[]> {
    const today = new Date();
    const diasDisponibles = [];
    // Obtener todos los turnos del especialista a la vez
    const todosLosTurnos = this.especialista
      ? await this.auth.obtenerTurnos(this.especialista)
      : [];
    // Calcular los horarios disponibles para la 'mañana' y la 'tarde'
    const horariosManana = this.obtenerHorariosDisponibles('mañana');
    const horariosTarde = this.obtenerHorariosDisponibles('tarde');
    const horariosPosibles = horariosManana.concat(horariosTarde);
    if (horariosPosibles.length == 0) {
      return [];
    }
    for (let i = 0; i < 15; i++) {
      const dia = new Date(today);
      dia.setDate(today.getDate() + i);

      // Filtrar los turnos del especialista para el día actual
      const turnosDelDia = todosLosTurnos.filter((turno) =>
        this.mismoDia(turno.fecha, dia)
      );

      // Convertir los horarios tomados en un Set para acelerar las búsquedas
      const horariosTomados = new Set(turnosDelDia.map((turno) => turno.hora));

      // Filtrar los horarios que ya están tomados
      const horariosDisponibles = horariosPosibles.filter(
        (horario) => !horariosTomados.has(horario)
      );

      // Solo agregar el día a la lista si hay al menos un horario disponible
      if (horariosDisponibles.length > 0) {
        diasDisponibles.push({ dia, horarios: horariosDisponibles });
      }
    }
    return diasDisponibles;
  }

  mismoDia(timestamp: any, dia: Date): boolean {
    const turnoFecha = this.convertirTimestampADate(timestamp);
    return (
      turnoFecha.getDate() === dia.getDate() &&
      turnoFecha.getMonth() === dia.getMonth() &&
      turnoFecha.getFullYear() === dia.getFullYear()
    );
  }

  convertirTimestampADate(timestamp: any): Date {
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }

  async obtenerTurnosDelEspecialista(dia: Date): Promise<Turno[]> {
    if (!this.especialista) {
      return [];
    }
    const turnos = await this.auth.obtenerTurnos(this.especialista);
    return turnos.filter((turno) => {
      const turnoFecha = this.convertirTimestampADate(turno.fecha);
      return (
        turnoFecha.getDate() === dia.getDate() &&
        turnoFecha.getMonth() === dia.getMonth() &&
        turnoFecha.getFullYear() === dia.getFullYear()
      );
    });
  }
  /// MAÑANA 8 A 13 HS Y TARDE 14 A 19 HS
  obtenerHorariosDisponibles(periodo: string): string[] {
    let horariosDisponibles: string[] = [];
    if (this.especialistaData && this.especialistaData.turnos) {
      const turnoEspecialista = this.especialistaData.turnos.find(
        (turno: any) => turno.especialidad === this.especialidad
      );
      if (turnoEspecialista && turnoEspecialista.turno === periodo) {
        if (periodo === 'mañana') {
          horariosDisponibles = Array.from({ length: 6 }, (_, index) => {
            const hora = 8 + index;
            return `${hora}:00`;
          });
        } else if (periodo === 'tarde') {
          horariosDisponibles = Array.from({ length: 6 }, (_, index) => {
            const hora = 14 + index;
            return `${hora}:00`;
          });
        } else {
          return [];
        }
      }
    }
    return horariosDisponibles;
  }
}
