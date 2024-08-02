import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  usuario: string = '';  
  cpf: string = '';
  name: string = '';
  cep: string = '';
  endereco: string = '';
  estado: string = '';
  bairro: string = '';
  numero: string = '';
  complemento: string = '';
  telephone: string = '';
  data: string = '';
  identificacao: string = '';
  uid: string = '';
  photoUrl: string | null = '';
  perfilForm: FormGroup;
  isLeitor: boolean = false;
  isEstoquista: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private route: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private auth: AuthService
  ) {
    this.perfilForm = this.fb.group({
      name: ['', Validators.required],
      data: ['', Validators.required],
      cpf: ['', Validators.required],
      identificacao: ['', Validators.required],
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      estado: ['', Validators.required],
      bairro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUser();

    this.afAuth.user.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.loadUserData();
      } else {
        console.log('No user is logged in');
        this.isLeitor = false;
        this.isEstoquista = false;
        this.isAdmin = false;
      }
    });
  }

  loadUserData(): void {
    if (this.uid) {
      this.auth.getUserType(this.uid).subscribe(userType => { 
        if (userType === 'estoquista') {
          this.isEstoquista = true;
        } else if (userType === 'leitor') {
          this.isLeitor = true;
        } else if (userType === 'administrador') {
          this.isAdmin = true;
        } 
      });
    }
  }
  
  dirperfil() {
    this.route.navigate(['/perfil']);
  }
  dirprodutos() {
    this.route.navigate(['/produtos']);
  }
  direstoque() {
    this.route.navigate(['/estoque']);
  }
  dirregistro() {
    this.route.navigate(['/registros']);
  }
  dirusuarios() {
    this.route.navigate(['/usuarios']);
  }

  loadUser(): void {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.uid = user.uid;
        this.db.collection('users').doc(this.uid).valueChanges().subscribe({
          next: (user: any) => {
            if (user) {
              this.perfilForm.patchValue({
                name: user.name,
                data: user.data,
                cpf: user.cpf,
                identificacao: user.identificacao,
                cep: user.cep,
                endereco: user.endereco,
                estado: user.estado,
                bairro: user.bairro,
                numero: user.numero,
                complemento: user.complemento
              });
              this.photoUrl = user.photoUrl || '';
            } else {
              console.warn('Usuário não encontrado.');
            }
          },
          error: (error: any) => {
            console.error('Erro ao carregar usuário:', error);
          }
        });
      } else {
        console.error('Usuário não autenticado.');
      }
    });
  }

  onSave(): void {
    if (this.perfilForm.valid) {
      const userData = this.perfilForm.value;
      userData.photoUrl = this.photoUrl;
      if (this.uid) {
        this.db.collection('users').doc(this.uid).update(userData)
          .then(() => {
            alert('Dados do usuário salvos com sucesso!');
            this.route.navigate(['/perfil']);
          })
          .catch((error) => {
            console.error('Erro ao atualizar dados do usuário:', error);
            alert('Erro ao atualizar dados do usuário.');
          });
      } else {
        console.error('ID do usuário não fornecido.');
        alert('ID do usuário não fornecido.');
      }
    } else {
      alert('Formulário inválido');;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const filePath = `users/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().subscribe({
        next: () => {},
        error: (error) => {
          console.error('Erro ao fazer upload da imagem:', error);
        },
        complete: () => {
          fileRef.getDownloadURL().subscribe({
            next: (url) => {
              this.photoUrl = url;
              if (this.uid) {
                this.db.collection('users').doc(this.uid).update({ photoUrl: url })
                  .then(() => {
                    console.log('URL da foto do perfil atualizada com sucesso!');
                  })
                  .catch((error) => {
                    console.error('Erro ao atualizar URL da foto do perfil:', error);
                  });
              } else {
                console.error('ID do usuário não fornecido.');
              }
            },
            error: (error) => {
              console.error('Erro ao obter URL da foto:', error);
            }
          });
        }
      });
    }
  }

  openFileDialog(event: MouseEvent): void {
    event.preventDefault(); 
    this.fileInput.nativeElement.click();
  }
}
