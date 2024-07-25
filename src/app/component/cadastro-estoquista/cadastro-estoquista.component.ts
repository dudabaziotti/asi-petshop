import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-estoquista',
  templateUrl: './cadastro-estoquista.component.html',
  styleUrls: ['./cadastro-estoquista.component.scss']
})
export class CadastroEstoquistaComponent implements OnInit {
  email: string = '';
  password: string = '';
  cpf: string = '';
  identificacao: string = '';
  foto: File | null = null;
  uid: string = '';
  photoUrl: string | ArrayBuffer | null = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

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

  convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  cadastroEstoquista() {
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

    this.convertFileToBase64(this.foto).then(base64Foto => {
      this.auth.cadastroEstoquista(this.email, this.password, this.cpf, this.identificacao, base64Foto).then(uid => {
        alert('Cadastro de estoquista realizado com sucesso! Faça seu login.');
        this.router.navigate(['/login']);
      }).catch(error => {
        alert('Erro ao realizar cadastro: ' + error.message);
      });

      this.email = '';
      this.password = '';
      this.cpf = '';
      this.identificacao = '';
      this.foto = null;
      this.photoUrl = '';
    }).catch(error => {
      alert('Erro ao converter a foto: ' + error.message);
    });
  }
}
