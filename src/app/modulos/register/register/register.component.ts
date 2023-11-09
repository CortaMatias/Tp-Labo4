import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  mostrarRegistroPacientes: boolean = false;
  mostrarRegistroEspecialistas: boolean = false;
  mostrarRegistroPaciente() {
    this.mostrarRegistroPacientes = true;
    this.mostrarRegistroEspecialistas = false;
  }
  mostrarRegistroEspecialista() {
    this.mostrarRegistroEspecialistas = true;
    this.mostrarRegistroPacientes = false;
  }
}
