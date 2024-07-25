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
  console.log(this.name, this.email, this.password, this.telephone);
  this.cadastro();
  localStorage.setItem('name', `${this.name}`);
  localStorage.setItem('email', `${this.email}`);
  localStorage.setItem('password', `${this.password}`);
  localStorage.setItem('telephone', `${this.telephone}`);

  if (this.type === tipoUsuario.estoquista) {
    this.router.navigate(['/cadastro-estoquista']);
  }
  else if (this.type === tipoUsuario.leitor) {
    this.router.navigate(['./cadastro-leitor']);
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

  this.auth.cadastro(this.name, this.email, this.password, this.telephone, this.type);

  this.type = tipoUsuario.leitor; 
}
}
