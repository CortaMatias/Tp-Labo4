import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterAdministradorComponent } from 'src/app/modulos/register/register-administrador/register-administrador.component';
import { AdmistradorComponent } from './admistrador/admistrador.component';
import { AdmistrarEspecialistassComponent } from './admistrar-especialistass/admistrar-especialistass.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdmistradorComponent,
    children: [
      { path: 'registerAdmin', component: RegisterAdministradorComponent },
      {
        path: 'administrar-especialistas',
        component: AdmistrarEspecialistassComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule {}
