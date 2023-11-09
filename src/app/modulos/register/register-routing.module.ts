import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from 'src/app/modulos/register/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/register/options', pathMatch: 'full' },
  { path: 'options', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
