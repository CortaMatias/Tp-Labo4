import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/clases/especialidad';
import { Especialista } from 'src/app/clases/especialista';
import { Paciente } from 'src/app/clases/paciente';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  loggedUser = this.authService.getLoggedUser();
  esPaciente: boolean = false;
  usuario: Especialista | Paciente | null = null;
  constructor(private authService: FirebaseService, private router: Router) {}
  ngOnInit(): void {
    this.esPaciente = localStorage.getItem('esPaciente') === 'true';
    this.user();
  }
  async user() {
    let user = this.authService.getCurrentUser();
    if (user) {
      const especialista = await this.authService.getEspecialistasByUid(
        user.uid
      );      
      const paciente = await this.authService.getPacientesByUid(user.uid);
      if (especialista) {
        this.esPaciente = false;
        this.usuario = especialista;
        localStorage.setItem('esPaciente', 'false');
      }
      if (paciente) {
        this.esPaciente = true;
        this.usuario = paciente;
        localStorage.setItem('esPaciente', 'true');
      }
    }
  }
  logOut() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, cerramos la sesión
        this.authService.logout();
        localStorage.removeItem('logueado');  
        this.router.navigate(['/bienvenida']);
      }
    });
  }
}
