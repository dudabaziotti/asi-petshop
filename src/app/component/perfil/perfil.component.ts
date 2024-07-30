import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

  usuario: string = '';  
  cpf: string = '';
  name: string = '';
  cep: string = '';
  endereco: string = '';
  estado: string = '';
  bairro: string = '';
  numero: string = '';
  complemento: string = '';
  telephone: string = '';
  data: string = '';
  identificacao: string = '';
  uid: string = '';
  photoUrl: string | ArrayBuffer | null = '';

  constructor (private route: Router, private db: AngularFirestore, private storage: AngularFireStorage) {}

  ngOnInit(): void {
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
    this.route.navigate(['/pagina-inicial']);
  }


}
