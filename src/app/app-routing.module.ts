import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaInicialComponent } from './component/pagina-inicial/pagina-inicial.component';
import { LoginComponent } from './component/login/login.component';
import { CadastroComponent } from './component/cadastro/cadastro.component';
import { CadastroLeitorComponent } from './component/cadastro-leitor/cadastro-leitor.component';
import { CadastroEstoquistaComponent } from './component/cadastro-estoquista/cadastro-estoquista.component';
import { RedefinirSenhaComponent } from './component/redefinir-senha/redefinir-senha.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ProdutosComponent } from './component/produtos/produtos.component';
import { PerfilComponent } from './component/perfil/perfil.component';
import { CrudProdutosComponent } from './component/crud-produtos/crud-produtos.component';

const routes: Routes = [
  {path: '', redirectTo: '/pagina-inicial', pathMatch: 'full'},
  {path: 'pagina-inicial', component : PaginaInicialComponent},
  {path: 'login', component : LoginComponent},
  {path: 'cadastro', component: CadastroComponent},
  {path: 'cadastro-leitor', component: CadastroLeitorComponent},
  {path: 'cadastro-estoquista', component: CadastroEstoquistaComponent},
  {path: 'redefinir-senha', component: RedefinirSenhaComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path:'produtos', component: ProdutosComponent},
  {path:'crud-produtos', component: CrudProdutosComponent},
  {path:'perfil', component: PerfilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
