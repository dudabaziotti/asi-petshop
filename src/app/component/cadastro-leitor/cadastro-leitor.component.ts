import { Component, OnInit } from '@angular/core';
import { AuthService, tipoUsuario } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-leitor',
  templateUrl: './cadastro-leitor.component.html',
  styleUrl: './cadastro-leitor.component.scss'
})
export class CadastroLeitorComponent implements OnInit{
  telephone: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  cpf: string = '';
  especie: string = '';
  raca: string = '';
  sexo: string = '';
  uid: string = '';

  constructor (private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.password = localStorage.getItem('password') || '';
    this.name = localStorage.getItem('name') || '';
    this.telephone = localStorage.getItem('telephone') || '';
  }

  cadastroLeitor () {
    if (this.cpf === '') {
      alert('Por favor digite o CPF');
      this.router.navigate(['/cadastro-leitor']);
      return;
    }

    if (this.especie === '') {
      alert('Por favor digite a espécie');
      this.router.navigate(['/cadastro-leitor']);
      return;
    }

    if (this.raca === '') {
      alert('Por favor digite a raça');
      this.router.navigate(['/cadastro-leitor']);
      return;
    }

    if (this.sexo === '') {
      alert('Por favor digite o sexo');
      this.router.navigate(['/cadastro-leitor']);
      return;
    }

    this.auth.cadastroLeitor(this.email, this.password, this.cpf, this.especie, this.raca, this.sexo).then(() => { }).catch(error => {
      alert('Erro ao realizar cadastro: ' + error.message);
    });
  }

  ngOnDestroy() {
    localStorage.clear();
  }
}
