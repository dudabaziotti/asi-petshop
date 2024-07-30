import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';

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
  selectedFile: File | null = null;
  photoUrl: string | null = null;
  uid: string = '';
  isFormValid: boolean = false;

  constructor (private auth: AuthService, private router: Router, private storage: AngularFireStorage, private firestore: AngularFirestore) {
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
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.photoUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  validateForm() {
    this.isFormValid = 
      this.cpf!== '' &&
      this.selectedFile !== null;
  }

  cadastroLeitor(): void {
    if (this.isFormValid && this.selectedFile) {
      const filePath = `images/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.auth.cadastroLeitor(
              this.name, this.email, this.password, this.telephone, 
              this.usuario, url, this.cpf
            )
          });
        })
      ).subscribe();
    } else {
      alert('Por favor, preencha todos os campos e selecione um arquivo.');
    }
  }
}
