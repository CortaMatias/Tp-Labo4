import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/clases/especialidad';
import { Especialista } from 'src/app/clases/especialista';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register-especialista',
  templateUrl: './register-especialista.component.html',
  styleUrls: ['./register-especialista.component.css'],
})
export class RegisterEspecialistaComponent {
  selectedImage: any = null;
  imagenURL: string = '';
  form!: FormGroup;
  errorCheck: boolean = false;
  Message: string = '';
  user: any;
  especialidadesSeleccionadas: Especialidad[] = [];
  nuevaEspecialidad: string = '';
  especialidades: Especialidad[] = [];

  constructor(private authService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      especialistaNombre: new FormControl('', [Validators.required]),
      especialistaApellido: new FormControl('', [Validators.required]),
      especialistaEdad: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(110),
      ]),
      especialistaDni: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000000),
      ]),
      OtraEspecialidad: new FormControl(''),
      agregarOtraEspecialidad: new FormControl(''),
      especialistaEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      especialistaClave: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      fotoespecialista: new FormControl(''),
      recaptchaReactive: new FormControl(null, Validators.required),
    });

    this.cargarEspecialidades();
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
      'fotoespecialista'
    ) as HTMLInputElement;
    inputElement.value = '';
  }

  async cargarEspecialidades() {
    const especialidadesData = await this.authService.obtenerEspecialidades();
    this.especialidades = especialidadesData.map((especialidadData: any) => {
      const especialidad = new Especialidad(especialidadData.id, especialidadData.nombre);
      this.form.addControl(`especialidad_${especialidad.uid}`, new FormControl(false));
      return especialidad;
    });
  }
  async agregarEspecialidad() {
    const especialidadNombre =
      this.form.controls['OtraEspecialidad'].value.trim();
    if (especialidadNombre !== '') {
       await this.authService.guardarEspecialidad(especialidadNombre);
      this.form.controls['OtraEspecialidad'].setValue('');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'La especialidad ya existe en la lista.',
        timer: 4000,
      });
    }
    this.cargarEspecialidades();
  }

  
  onSubmit() {
    const especialidadesSeleccionadas = this.especialidades.filter(especialidad => this.form.get(`especialidad_${especialidad.uid}`)?.value);
    console.log(especialidadesSeleccionadas);
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
      const especialidadesSeleccionadas = this.especialidades.filter(especialidad => this.form.get(`especialidad_${especialidad.uid}`)?.value);
      let data = {
        email: this.form.controls['especialistaEmail'].value,
        password: this.form.controls['especialistaClave'].value,
        nick: this.form.controls['especialistaNombre'].value,
      };
      this.user = await this.authService.register(data);

      let usuario = new Especialista(
        this.user.uid,
        this.form.controls['especialistaNombre'].value,
        this.form.controls['especialistaApellido'].value,
        this.form.controls['especialistaEdad'].value,
        this.form.controls['especialistaDni'].value,
        especialidadesSeleccionadas.map(especialidad => especialidad.uid), 
        this.imagenURL,
        'false'
      );
      await this.authService.guardarEspecialistaBD(usuario);
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
