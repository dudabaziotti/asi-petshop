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

constructor (private auth: AuthService, private router: Router) {
}

ngOnInit(): void {
  
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
  if (this.email === '') {
    alert('Por favor digite o seu email');
    this.router.navigate(['/cadastro']);
    return;
  }

  if (this.password === '') {
    alert('Por favor digite uma senha');
    this.router.navigate(['/cadastro']);
    return;
  }

  if (this.name === '') {
    alert('Por favor digite o seu nome');
    this.router.navigate(['/cadastro']);
    return;
  }

  if (this.telephone === '') {
    alert('Por favor digite o seu telefone');
    this.router.navigate(['/cadastro']);
    return;
  }
  
  this.auth.cadastro(this.name, this.email, this.password, this.telephone, this.type, this.usuario);
 
}
}
