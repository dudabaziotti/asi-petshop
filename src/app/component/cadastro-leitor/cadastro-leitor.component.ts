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
  isFormValid: boolean = false;

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

  validateForm() {
    this.isFormValid = 
      this.cpf!== '' &&
      this.especie!== '' &&
      this.raca!== '' &&
      this.sexo!== '';
  }

  cadastroLeitor () {
    this.auth.cadastroLeitor(this.name, this.email, this.password, this.telephone, this.usuario, this.cpf, this.especie, this.raca, this.sexo).then(() => { }).catch(error => {
      alert('Erro ao realizar cadastro: ' + error.message);
    });
  }
}
