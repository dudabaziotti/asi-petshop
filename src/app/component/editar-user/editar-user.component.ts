import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface Usuario {
  name: string;
  cpf: string;
  email: string;
  telephone: string;
  identificacao: string;
  usuario: string;
  photoUrl: string | null;
}

const extractFotoPath = (photoUrl: string): string | null => {
  const match = photoUrl.match(/o\/(.+?)\?alt/);
  return match ? match[1].replace('%2F', '/') : null; 
};

@Component({
  selector: 'app-editar-user',
  templateUrl: './editar-user.component.html',
  styleUrl: './editar-user.component.scss'
})
export class EditarUserComponent {

  editarUsuarioForm: FormGroup;
  usuarios: any[] = [];
  edicaoUsuario: any = null;
  userId: string | null = null;
  selectedFile: File | null = null;
  photoUrl: string | null = null;
  editandoFoto: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private route: Router, 
    private fire: AngularFirestore, 
    private storage: AngularFireStorage,  
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private auth: AngularFireAuth,
  ) {
    this.editarUsuarioForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      cpf: ['', Validators.required],
      telephone: ['', Validators.required],
      usuario: ['', Validators.required],
      identificacao: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        this.buscarUsuario(this.userId);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoUrl = reader.result as string; 
      };
      reader.readAsDataURL(file);
      this.editandoFoto = true;
    } else {
      this.selectedFile = null;
    }
  }

  buscarUsuario(uid: string): void {
    this.fire.collection('users').doc(uid).get().subscribe(doc => {
      if (doc.exists) {
        const usuario = doc.data() as Usuario; 
        this.editarUsuarioForm.patchValue(usuario);
        this.photoUrl = usuario.photoUrl || null;
      } else {
        console.log('Usuario não encontrado!');
      }
    });
  }

  excluirUsuario(): void {
    if (this.userId) {
      this.fire.collection('users').doc(this.userId).get().subscribe(doc => {
        if (doc.exists) {
          const user = doc.data() as Usuario;
          const deleteUserFromAuth = () => {
            this.auth.currentUser.then(currentUser => {
              if (currentUser) {
                currentUser.delete().then(() => {
                  console.log('Autenticação do usuário excluída com sucesso!');
                  this.route.navigate(['/usuarios']);
                }).catch(error => {
                  console.error('Erro ao excluir autenticação do usuário: ', error);
                });
              }
            }).catch(error => {
              console.error('Erro ao obter usuário atual: ', error);
            });
          };
          if (user.photoUrl) {
            const fotoPath = extractFotoPath(user.photoUrl);
            if (fotoPath) {
              const storageRef = this.storage.ref(fotoPath);
              storageRef.delete().toPromise().then(() => {
                console.log('Foto excluída com sucesso!');
                this.fire.collection('users').doc(this.userId!).delete().then(() => {
                  alert('Usuário excluído com sucesso!');
                  deleteUserFromAuth();
                }).catch(error => {
                  console.error('Erro ao excluir usuário: ', error);
                });
              }).catch(error => {
                console.error('Erro ao excluir a foto: ', error);
                this.fire.collection('users').doc(this.userId!).delete().then(() => {
                  alert('Usuário excluído, mas a foto não pôde ser excluída.');
                  deleteUserFromAuth();
                }).catch(error => {
                  console.error('Erro ao excluir usuário: ', error);
                });
              });
            } else {
              this.fire.collection('users').doc(this.userId!).delete().then(() => {
                alert('Usuário excluído com sucesso!');
                deleteUserFromAuth();
              }).catch(error => {
                console.error('Erro ao excluir usuário: ', error);
              });
            }
          } else {
            this.fire.collection('users').doc(this.userId!).delete().then(() => {
              alert('Usuário excluído com sucesso!');
              deleteUserFromAuth();
            }).catch(error => {
              console.error('Erro ao excluir usuário: ', error);
            });
          }
        } else {
          console.log('Usuário não encontrado!');
        }
      });
    }
  }

  editorUsuario(uid: string): void {
    this.fire.collection('users').doc(uid).get().toPromise().then((doc) => {
      if (doc && doc.exists) {
        const data = doc.data() as Usuario;
        if (data) {
          this.photoUrl = data.photoUrl || null;
          this.editarUsuarioForm.patchValue(data);
        }
      } else {
        console.log('Usuario não encontrado!');
      }
    }).catch(error => {
      console.error('Erro ao buscar usuario: ', error);
    });
  }

  editarUsuario(): void {
    if (this.editarUsuarioForm.valid && this.userId) {
      const usuarioEditado = this.editarUsuarioForm.value;
  
      if (this.selectedFile) {
        const oldPhotoUrl = this.photoUrl;
        const filePath = `users/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);
  
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              usuarioEditado.photoUrl = url;
  
              if (oldPhotoUrl && oldPhotoUrl.includes('/o/')) {
                const oldPhotoPath = extractFotoPath(oldPhotoUrl);
                if (oldPhotoPath) {
                  const oldPhotoRef = this.storage.ref(oldPhotoPath);
                  oldPhotoRef.delete().subscribe(() => {
                    console.log('Foto antiga excluída com sucesso!');
                    this.updateUsuario(usuarioEditado);
                  }, error => {
                    console.error('Erro ao excluir a foto antiga: ', error);
                    this.updateUsuario(usuarioEditado);
                  });
                } else {
                  this.updateUsuario(usuarioEditado);
                }
              } else {
                this.updateUsuario(usuarioEditado);
              }
            });
          })
        ).subscribe({
          error: err => console.error('Erro ao fazer upload do arquivo: ', err)
        });
      } else {
        this.updateUsuario(usuarioEditado);
      }
    }
  }

  updateUsuario(usuario: Usuario): void {
    if (this.userId) {
      this.fire.collection('users').doc(this.userId).update(usuario).then(() => {
        alert('Usuario editado!');
        this.editarUsuarioForm.reset();
        this.route.navigate(['/usuarios']);
      }).catch(error => {
        console.error('Erro ao editar usuario: ', error);
      });
    }
  }
  voltar() {
    this.route.navigate(['/usuarios']);
  }
}
