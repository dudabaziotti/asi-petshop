import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit{
  userId: string | null = null;
  isLeitor: boolean = false;
  isEstoquista: boolean = false;
  isAdmin: boolean = false;
  produtos: any[] = [];

  constructor (private route: Router, private auth: AuthService, private fire: AngularFirestore, private afauth:AngularFireAuth, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.afauth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log('Logged in user ID:', this.userId);
        if (this.userId) {
          this.auth.getUserType(this.userId).subscribe(userType => {
            console.log('User type from document:', userType); 
            if (userType === 'estoquista') {
              this.isEstoquista = true;
            } else if (userType === 'leitor') {
              this.isLeitor = true;
            } else if (userType === 'administrador') {
              this.isAdmin = true;
            } 
          });
        }
      } else {
        console.log('No user is logged in');
        this.isLeitor = false;
        this.isEstoquista = false;
        this.isAdmin = false;
      }
    });
    this.carregarProdutos();
  }

  navegarParaEditar(produtoId: string): void {
    this.route.navigate(['/editar-produtos', produtoId]);
  }

  addProdutos() {
    this.route.navigate(['/add-produtos']);
  }

  trackProdutos(index: number, produto: any): any {
    return produto ? produto.id : undefined;
  }

  carregarProdutos(): void {
    this.fire.collection('produtos').valueChanges({ idField : 'id'}).subscribe(produtos => {
      this.produtos = produtos;
    }, error => {
      console.error('Erro ao carregar produtos: ', error);
    });
  }

  dirperfil(){
    this.route.navigate(['/perfil']);
  }
  dirprodutos(){
    this.route.navigate(['/produtos']);
  }
  direstoque(){
    this.route.navigate(['/pagina-inicial']);
  }
  dirregistro(){
    this.route.navigate(['/pagina-inicial']);
  }
  dirusuarios(){
    this.route.navigate(['/usuarios']);
  }
}
