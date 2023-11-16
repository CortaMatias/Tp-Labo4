import { Component } from '@angular/core';
import { Especialista } from 'src/app/clases/especialista';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-admistrar-especialistass',
  templateUrl: './admistrar-especialistass.component.html',
  styleUrls: ['./admistrar-especialistass.component.css'],
})
export class AdmistrarEspecialistassComponent {
  especialistas: Especialista[] = [];

  constructor(private authService: FirebaseService) {}

  ngOnInit(): void {
    this.cargarEspecialistas();
  }

  async cargarEspecialistas() {
    const especialistasData = await this.authService.obtenerEspecialistas();
    const especialidades = await this.authService.obtenerEspecialidades();
  
    this.especialistas = especialistasData.map((especialistaData: any) => {
      const especialidadesDelEspecialista = Array.isArray(especialistaData.especialidades)
        ? especialistaData.especialidades.map((especialidadId: string) => {
            const especialidad = especialidades.find((esp: any) => esp.id === especialidadId);
            return especialidad ? especialidad.nombre : 'Especialidad Desconocida';
          })
        : [];
  
      return new Especialista(
        especialistaData.uid,
        especialistaData.nombre,
        especialistaData.apellido,
        especialistaData.edad,
        especialistaData.dni,
        especialidadesDelEspecialista, 
        especialistaData.foto1,
        especialistaData.verificado
      );
    });
  }
  

  async aceptarEspecialista(especialista: Especialista): Promise<void> {
    try {
      await this.authService.actualizarVerificadoEspecialista(
        especialista.uid,
        'true'
      );
      especialista.verificado = 'true';
    } catch (error) {
      console.error('Error al aceptar al especialista: ', error);
      throw error;
    }
  }

  async rechazarEspecialista(especialista: Especialista) {
    try {
      await this.authService.actualizarVerificadoEspecialista(
        especialista.uid,
        'null'
      );
      especialista.verificado = 'null';
    } catch (error) {
      console.error('Error al rechazar al especialista: ', error);
      throw error;
    }
  }
}
