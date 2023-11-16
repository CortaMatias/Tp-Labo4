import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from 'src/app/modulos/register/register/register.component';
import { RegisterEspecialistaComponent } from 'src/app/modulos/register/register-especialista/register-especialista.component';
import { RegisterPacienteComponent } from 'src/app/modulos/register/register-paciente/register-paciente.component';
import { RegisterAdministradorComponent } from 'src/app/modulos/register/register-administrador/register-administrador.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { MiDirectivaColorDirective } from 'src/app/mi-directiva-color.directive';
@NgModule({
  declarations: [
    RegisterComponent,
    RegisterEspecialistaComponent,
    RegisterPacienteComponent,
    RegisterAdministradorComponent,
    MiDirectivaColorDirective,
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
})
export class RegisterModule {}
