import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrl: './redefinir-senha.component.scss'
})
export class RedefinirSenhaComponent implements OnInit {

  email : string = '';

  constructor (private auth: AuthService) {}

  ngOnInit(): void { }

  redefinirSenha() {
    this.auth.redefinirSenha(this.email);
    this.email = '';
  }

}
