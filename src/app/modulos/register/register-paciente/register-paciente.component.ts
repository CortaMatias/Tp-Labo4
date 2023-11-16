import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/clases/paciente';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register-paciente',
  templateUrl: './register-paciente.component.html',
  styleUrls: ['./register-paciente.component.css'],
})
export class RegisterPacienteComponent {
  selectedImage: any = null;
  imagenURL: string = '';
  selectedImage2: any = null;
  imagenURL2: string = '';
  form!: FormGroup;
  errorCheck: boolean = false;
  Message: string = '';
  user: any;

  constructor(private authService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      pacienteNombre: new FormControl('', [Validators.required]),
      pacienteApellido: new FormControl('', [Validators.required]),
      pacienteEdad: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(110),
      ]),
      pacienteDni: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000000),
      ]),
      pacienteObraSocial: new FormControl('',[Validators.required]),
      pacienteEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      pacienteClave: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      fotoPaciente: new FormControl(''),
      fotoPaciente2: new FormControl(''),
      recaptchaReactive: new FormControl(null, Validators.required),
    });
  }

  onImageSelected(event: any, foto: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (foto == 1) {
          this.selectedImage = e.target.result;

          this.imagenURL = reader.result as string;
        } else {
          this.selectedImage2 = e.target.result;

          this.imagenURL2 = reader.result as string;
        }
      };

      reader.readAsDataURL(file);
    }
  }
  resetImageInput(foto: number) {
    if (foto == 1) {
      const inputElement = document.getElementById(
        'fotoPaciente'
      ) as HTMLInputElement;
      inputElement.value = '';
    } else {
      const inputElement = document.getElementById(
        'fotoPaciente2'
      ) as HTMLInputElement;
      inputElement.value = '';
    }
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
        email: this.form.controls['pacienteEmail'].value,
        password: this.form.controls['pacienteClave'].value,
        nick: this.form.controls['pacienteNombre'].value,
      };
      this.user = await this.authService.register(data);

      let usuario = new Paciente(
        this.user.uid,
        this.form.controls['pacienteNombre'].value,
        this.form.controls['pacienteApellido'].value,
        this.form.controls['pacienteEdad'].value,
        this.form.controls['pacienteDni'].value,
        this.form.controls['pacienteObraSocial'].value,
        this.imagenURL,
        this.imagenURL2
      );
      await this.authService.guardarPacienteBD(usuario);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Bienvenido!',
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigate(['/login']);
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

  resolved(captchaResponse: string) {
  }

}
