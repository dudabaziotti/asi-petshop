import { Component, OnInit } from '@angular/core';
import { AuthService, tipoUsuario, tipoCadastro } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit{

  usuario: string = '';  
  email: string ='';
  password: string = '';
  name: string = '';
  telephone: string = '';
  type: tipoUsuario = tipoUsuario.leitor;
  tipoUsuario = tipoUsuario;
  tipoCadastro: tipoCadastro = tipoCadastro.inicial;
  isFormValid: boolean = false;

  constructor (private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void { }

  validateForm() {
    this.isFormValid = 
      this.name !== '' &&
      this.email!== '' &&
      this.password!== '' &&
      this.telephone!== '' &&
      (this.type === tipoUsuario.estoquista || this.type === tipoUsuario.leitor);
    }

  avancar () {
    if (this.type === tipoUsuario.estoquista) {
      this.tipoCadastro = tipoCadastro.estoquista;
      this.usuario = 'estoquista';
    }
    else if (this.type === tipoUsuario.leitor) {
      this.tipoCadastro = tipoCadastro.leitor;
      this.usuario = 'leitor';
    }
  }

  cadastro() {
    this.auth.cadastro(this.name, this.email, this.password, this.telephone, this.type, this.usuario);
  }
}
