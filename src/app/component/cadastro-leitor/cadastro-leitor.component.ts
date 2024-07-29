import { Component, Input, OnInit } from '@angular/core';
import { AuthService, tipoUsuario } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-leitor',
  templateUrl: './cadastro-leitor.component.html',
  styleUrl: './cadastro-leitor.component.scss'
})
export class CadastroLeitorComponent implements OnInit{

  @Input() name: string;
  @Input() email: string;
  @Input() password: string;
  @Input() telephone: string;
  @Input() usuario: string;

  cpf: string = '';
  especie: string = '';
  raca: string = '';
  sexo: string = '';
  uid: string = '';

  constructor (private auth: AuthService, private router: Router) {
    this.name = '';
    this.email = '';
    this.password = '';
    this.telephone = '';
    this.usuario = '';
  }

  ngOnInit(): void {
    console.log(this.name);
    console.log(this.email);
    console.log(this.password);
    console.log(this.telephone);
    console.log(this.usuario);
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

    this.auth.cadastroLeitor(this.name, this.email, this.password, this.telephone, this.usuario, this.cpf, this.especie, this.raca, this.sexo).then(() => { }).catch(error => {
      alert('Erro ao realizar cadastro: ' + error.message);
    });
  }
}
