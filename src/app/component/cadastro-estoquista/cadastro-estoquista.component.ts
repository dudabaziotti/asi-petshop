import { Component, Input, OnInit } from '@angular/core';
import { AuthService, tipoUsuario } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-estoquista',
  templateUrl: './cadastro-estoquista.component.html',
  styleUrls: ['./cadastro-estoquista.component.scss']
})
export class CadastroEstoquistaComponent implements OnInit {

  @Input() name: string;
  @Input() email: string;
  @Input() password: string;
  @Input() telephone: string;
  @Input() usuario: string;

  cpf: string = '';
  identificacao: string = '';
  foto: File | null = null;
  uid: string = '';
  photoUrl: string | ArrayBuffer | null = '';

  constructor(private auth: AuthService, private router: Router) {
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
      this.auth.cadastroEstoquista(this.name, this.email, this.password, this.telephone,  this.usuario, base64Foto, this.identificacao, this.cpf).then(() => { }).catch(error => {
        alert('Erro ao realizar cadastro: ' + error.message);
      });

    }).catch(error => {
      alert('Erro ao converter a foto: ' + error.message);
    });
  }
}
