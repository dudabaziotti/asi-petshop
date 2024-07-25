import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-estoquista',
  templateUrl: './cadastro-estoquista.component.html',
  styleUrl: './cadastro-estoquista.component.scss'
})
export class CadastroEstoquistaComponent implements OnInit{

  email: string = '';
  password: string = '';
  cpf: string = '';
  identificacao: string = '';
  foto: File | null = null;
  uid: string = '';
  photoUrl: string | ArrayBuffer | null = '';

  constructor (private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.foto = file;

      // Criar URL para pré-visualização
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  cadastroEstoquista () {
    if (this.cpf === '') {
      alert('Por favor digite o CPF');
      this.router.navigate(['/cadastro-estoquista']);
      return;
    }

    if (this.identificacao === '') {
      alert('Por favor digite o número de identificação');
      this.router.navigate(['/cadastro-estoquista']);
      return;
    }

    if (!this.foto) {
      alert('Por favor adicione uma foto');
      this.router.navigate(['/cadastro-estoquista']);
      return;
    }

    this.auth.cadastroEstoquista(this.email, this.password).then(uid => {
      if (uid) {
        this.auth.salvarDadosEstoquista(uid, this.cpf, this.identificacao, this.foto);
        alert('Cadastro de estoquista realizado com sucesso! Faça seu login.');
        this.router.navigate(['/login']);
      }
    }).catch(error => {
      console.error('Erro ao criar usuário:', error);
    });

    this.email = '';
    this.password = '';
    this.cpf = '';
    this.identificacao = '';
    this.foto = null;
    this.photoUrl = '';
  }
}
