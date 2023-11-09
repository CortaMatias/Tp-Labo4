import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from 'src/app/modulos/register/register/register.component';
import { RegisterEspecialistaComponent } from 'src/app/modulos/register/register-especialista/register-especialista.component';
import { RegisterPacienteComponent } from 'src/app/modulos/register/register-paciente/register-paciente.component';
import { RegisterAdministradorComponent } from 'src/app/modulos/register/register-administrador/register-administrador.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterEspecialistaComponent,
    RegisterPacienteComponent,
    RegisterAdministradorComponent,
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class RegisterModule {}
