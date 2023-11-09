import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/clases/admin';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-administrador',
  templateUrl: './register-administrador.component.html',
  styleUrls: ['./register-administrador.component.css'],
})
export class RegisterAdministradorComponent {
  selectedImage: any = null;
  imagenURL: string = '';
  user: any;
  form!: FormGroup;
  errorCheck: boolean = false;
  Message: string = '';

  constructor(private authService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      adminNombre: new FormControl('', [Validators.required]),
      adminApellido: new FormControl('', [Validators.required]),
      adminEdad: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(110),
      ]),
      adminDni: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000000),
      ]),
      adminEmail: new FormControl('', [Validators.required, Validators.email]),
      adminClave: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      fotoadmin: new FormControl(''),
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;

        this.imagenURL = reader.result as string;
      };

      reader.readAsDataURL(file);
    }  
  }
  resetImageInput() {
    const inputElement = document.getElementById(
      'fotoadmin'
    ) as HTMLInputElement;
    inputElement.value = '';
  }
  onSubmit() {
    if (this.form.valid) {
      this.cargarUsuario();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error, complete los datos correctamente',
        timer: 2500,
      });
    }
  }

  async cargarUsuario() {
    try {
      let data = {
        email: this.form.controls['adminEmail'].value,
        password: this.form.controls['adminClave'].value,
        nick: this.form.controls['adminNombre'].value,
      };
      
      console.log(this.authService.getCurrentUser());
      this.user = await this.authService.registerAdmin(data);      

      let usuario = new Admin(
        this.user.uid,
        this.form.controls['adminNombre'].value,
        this.form.controls['adminApellido'].value,
        this.form.controls['adminEdad'].value,
        this.form.controls['adminDni'].value,
        this.imagenURL
      );
      await this.authService.guardarAdminBD(usuario);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Bienvenido!',
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(this.authService.getCurrentUser());
    } catch (error: any) {
      this.errorCheck = true;
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.Message = 'Ya se encuentra un usuario registrado con ese email';
          break;
        default:
          this.Message = 'Hubo un problema al registrar.';
          break;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: this.Message,
        timer: 4000,
      });
    }
  }
}
