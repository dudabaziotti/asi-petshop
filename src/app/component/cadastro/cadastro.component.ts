import { Component, OnInit } from '@angular/core';
import { AuthService, tipoUsuario } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit{

email: string ='';
password: string = '';
name: string = '';
telephone: string = '';
type: tipoUsuario = tipoUsuario.leitor; 
tipoUsuario = tipoUsuario;

constructor (private auth: AuthService, private router: Router) {}

ngOnInit(): void {
  
}

avancar () {
  if (this.type === tipoUsuario.estoquista) {
    this.router.navigate(['/cadastro-estoquista']);
    this.cadastro();
  }
  else if (this.type === tipoUsuario.leitor) {
    this.router.navigate(['./cadastro-leitor']);
    this.cadastro();
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

  this.auth.cadastro(this.email, this.password, this.name, this.telephone, this.type);

  this.email = '';
  this.password = '';
  this.name = '';
  this.telephone = '';
  this.type = tipoUsuario.leitor; 
}
}
