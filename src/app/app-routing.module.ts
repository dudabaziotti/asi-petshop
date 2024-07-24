import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaInicialComponent } from './component/pagina-inicial/pagina-inicial.component';
import { LoginComponent } from './component/login/login.component';
import { CadastroComponent } from './component/cadastro/cadastro.component';
import { CadastroLeitorComponent } from './component/cadastro-leitor/cadastro-leitor.component';
import { CadastroEstoquistaComponent } from './component/cadastro-estoquista/cadastro-estoquista.component';
import { RedefinirSenhaComponent } from './component/redefinir-senha/redefinir-senha.component';

const routes: Routes = [
  {path: '', redirectTo: '/pagina-inicial', pathMatch: 'full'},
  {path: 'pagina-inicial', component : PaginaInicialComponent},
  {path: 'login', component : LoginComponent},
  {path: 'cadastro', component: CadastroComponent},
  {path: 'cadastro-leitor', component: CadastroLeitorComponent},
  {path: 'cadastro-estoquista', component: CadastroEstoquistaComponent},
  {path: 'redefinir-senha', component: RedefinirSenhaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
