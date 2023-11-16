import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/clases/admin';
import { Especialista } from 'src/app/clases/especialista';
import { Horario } from 'src/app/clases/horario';
import { Paciente } from 'src/app/clases/paciente';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
})
export class MiPerfilComponent implements OnInit {
  identidad: string | null = '';
  usuario: any = null;
  horario: { [key: string]: string } = {};
  mostrarHorarios = false;
  estadoInicialHorarios: any;

  constructor(private authService: FirebaseService) {}

  ngOnInit(): void {
    this.user();
    this.identidad = localStorage.getItem('identidad');
  }

  guardar() {
    this.usuario.turnos = [];
    for (let especialidadId in this.horario) {
      let turno = this.horario[especialidadId];
      let nuevoHorario = {
        especialidad: especialidadId,
        especialista: this.usuario.uid,
        turno: turno,
      };
      this.usuario.turnos.push(nuevoHorario);
    }
    this.authService.actualizarHorariosEspecialista(
      this.usuario.uid,
      this.usuario.turnos
    );
    this.estadoInicialHorarios = { ...this.horario };
  }

  sonIguales(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  async user() {
    let user = localStorage.getItem('logueado');
    if (user) {
      const especialista = await this.authService.getEspecialistasByUid(user);
      if (especialista) {
        const especialidades = await this.authService.obtenerEspecialidades();
        this.identidad = 'especialista';
        console.log(especialista);
        this.usuario = {
          ...especialista,
          especialidades: especialista.especialidades.map(
            (especialidadId: string) => {
              const especialidad = especialidades.find(
                (esp: any) => esp.id === especialidadId
              );
              return especialidad
                ? especialidad.nombre
                : 'Especialidad Desconocida';
            }
          ),
          especialidadesMap: especialista.especialidades.reduce(
            (map: any, especialidadId: string) => {
              const especialidad = especialidades.find(
                (esp: any) => esp.id === especialidadId
              );
              if (especialidad) {
                map[especialidad.nombre] = especialidadId;
              }
              return map;
            },
            {}
          ),
        };

        this.horario = this.usuario.turnos.reduce(
          (map: any, turno: Horario) => {
            map[turno.especialidad] = turno.turno;
            return map;
          },
          {}
        );

        this.estadoInicialHorarios = { ...this.horario };

        localStorage.setItem('identidad', 'especialista');
      } else {
        const paciente = await this.authService.getPacientesByUid(user);
        if (paciente) {
          this.identidad = 'paciente';
          this.usuario = paciente;
          localStorage.setItem('identidad', 'paciente');
        } else {
          const admin = await this.authService.getAdminByUid(user);
          this.identidad = 'admin';
          this.usuario = admin;
          localStorage.setItem('identidad', 'admin');
        }
      }
    }
  }
}
