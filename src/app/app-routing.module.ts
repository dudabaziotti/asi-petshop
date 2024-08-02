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
import { AddProdutosComponent } from './component/add-produtos/add-produtos.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { EditarProdutosComponent } from './component/editar-produtos/editar-produtos.component';
import { EditarUserComponent } from './component/editar-user/editar-user.component';
import { EstoqueComponent } from './component/estoque/estoque.component';
import { ItemEstoqueComponent } from './component/item-estoque/item-estoque.component';
import { RegistrosComponent } from './component/registros/registros.component';
import { AuthService } from './shared/auth.service';

const routes: Routes = [
  {path: '', redirectTo: '/pagina-inicial', pathMatch: 'full'},
  {path: 'pagina-inicial', component : PaginaInicialComponent},
  {path: 'login', component : LoginComponent},
  {path: 'cadastro', component: CadastroComponent},
  {path: 'cadastro-leitor', component: CadastroLeitorComponent},
  {path: 'cadastro-estoquista', component: CadastroEstoquistaComponent},
  {path: 'redefinir-senha', component: RedefinirSenhaComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthService]},
  {path:'produtos', component: ProdutosComponent, canActivate: [AuthService]},
  {path:'add-produtos', component: AddProdutosComponent, canActivate: [AuthService]},
  {path: 'editar-produtos/:id', component: EditarProdutosComponent, canActivate: [AuthService]},
  {path:'perfil', component: PerfilComponent, canActivate: [AuthService]},
  {path: 'usuarios', component: UsuariosComponent, canActivate: [AuthService]},
  {path: 'estoque', component: EstoqueComponent, canActivate: [AuthService]},
  {path: 'item-estoque/:id', component: ItemEstoqueComponent, canActivate: [AuthService]},
  {path: 'editar-user/:id', component: EditarUserComponent, canActivate: [AuthService]},
  {path: 'registros', component: RegistrosComponent, canActivate: [AuthService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
