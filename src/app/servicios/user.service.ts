import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(public router: Router) {}

  public showSuccessMessageAndNavigate(route: string[]) {
    Swal.fire({
      icon: 'success',
      title: 'Inicio de sesión exitoso',
      text: '¡Bienvenido!',
      showConfirmButton: false,
      timer: 1500,
    });
    this.router.navigate(route);
  }

  public showRejectedMessage() {
    Swal.fire({
      icon: 'error',
      title: 'Su cuenta ha sido rechazada',
      text: 'Por favor, comuníquese con administración.',
      timer: 4000,
    });
  }

  public showNotApprovedMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Su cuenta aún no ha sido aprobada',
      text: 'Por favor, comuníquese con administración.',
      timer: 4000,
    });
  }

  public showVerifyEmailMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Verifique su email',
      text: 'Por favor, verifique su correo electrónico para continuar.',
      timer: 4000,
    });
  }

  public showErrorMessage(errorMessage: string) {
    Swal.fire({
      icon: 'error',
      title: 'Hubo un problema',
      text: errorMessage,
      timer: 4000,
    });
  }
}
