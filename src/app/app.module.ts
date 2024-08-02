import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginaInicialComponent } from './component/pagina-inicial/pagina-inicial.component';
import { LoginComponent } from './component/login/login.component';
import { CadastroComponent } from './component/cadastro/cadastro.component';
import { CadastroLeitorComponent } from './component/cadastro-leitor/cadastro-leitor.component';
import { CadastroEstoquistaComponent } from './component/cadastro-estoquista/cadastro-estoquista.component';
import { RedefinirSenhaComponent } from './component/redefinir-senha/redefinir-senha.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { ProdutosComponent } from './component/produtos/produtos.component';
import { PerfilComponent } from './component/perfil/perfil.component';
import { AddProdutosComponent } from './component/add-produtos/add-produtos.component';
import { EditarProdutosComponent } from './component/editar-produtos/editar-produtos.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { EditarUserComponent } from './component/editar-user/editar-user.component';
import { EstoqueComponent } from './component/estoque/estoque.component';
import { ItemEstoqueComponent } from './component/item-estoque/item-estoque.component';
import { RegistrosComponent } from './component/registros/registros.component';

@NgModule({
  declarations: [
    AppComponent,
    PaginaInicialComponent,
    LoginComponent,
    CadastroComponent,
    CadastroLeitorComponent,
    CadastroEstoquistaComponent,
    RedefinirSenhaComponent,
    DashboardComponent,
    ProdutosComponent,
    PerfilComponent,
    AddProdutosComponent,
    EditarProdutosComponent,
    UsuariosComponent,
    EditarUserComponent,
    EstoqueComponent,
    ItemEstoqueComponent,
    RegistrosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    FirestoreModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
