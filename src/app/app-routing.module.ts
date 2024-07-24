import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaInicialComponent } from './component/pagina-inicial/pagina-inicial.component';
import { LoginComponent } from './component/login/login.component';

const routes: Routes = [
  {path: 'pagina-inicial', component : PaginaInicialComponent},
  {path: 'login', component : LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
