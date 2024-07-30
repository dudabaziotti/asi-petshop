import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';

export enum tipoUsuario {
  leitor = 'leitor',
  estoquista = 'estoquista'
}

export enum tipoCadastro {
  inicial = 'inicial',
  leitor = 'leitor',
  estoquista = 'estoquista'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore, private storage: AngularFireStorage) {}
  //obtem tipo de usuario
  getUserType(uid: string): Observable<string | null> {
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map((user:any) => user ? user.usuario : null)
    );
  }

  // login
  login(email: string, password: string, rememberMe: boolean) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user?.emailVerified) {
          if (rememberMe) {
            localStorage.setItem('token', 'true'); 
          } else {
            sessionStorage.setItem('token', 'true'); 
          }
          this.router.navigate(['/dashboard']);
        } else {
          alert('Email não verificado. Verifique seu e-mail.');
        }
      })
      .catch(err => {
        alert('Erro ao fazer login: ' + err.message);
        this.router.navigate(['/login']);
      });
  }

  // sair
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
    }).catch(err => {
      alert(err.message);
    });
  }

  // redefinir a senha
  redefinirSenha(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      alert('Verifique o seu email para mudar a sua senha.');
      this.router.navigate(['/login']);
    }).catch(err => {
      alert('Algo deu errado');
    });
  }

  // cadastro
  cadastro(name: string, email: string, password: string, telephone: string, type: tipoUsuario, usuario: string) {
    if (type === tipoUsuario.leitor) {
      this.router.navigate(['/cadastro-leitor'], { state: { email, password } });
    }
    else if (type === tipoUsuario.estoquista) {
      this.router.navigate(['/cadastro-estoquista'], { state: { email, password } });
    }
  }

  cadastroLeitor(name: string, email: string, password: string, telephone: string, usuario: string, photoUrl: string, cpf: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        user.sendEmailVerification().then(() => { }).catch(error => {
          console.error('Erro ao enviar email de verificação:', error);
        });
        alert('Cadastro de leitor realizado com sucesso! Verifique seu email antes de fazer o login.');
        this.router.navigate(['/login']);
        return this.salvarDadosLeitor(user.uid, name, email, telephone, usuario, photoUrl, cpf).then(() => user.uid);
      } else {
        throw new Error('Não foi possível obter o UID do usuário.');
      }
    })
    .catch(error => {
      console.error('Erro ao criar usuário:', error);
      throw error;
    });
  }
  
  cadastroEstoquista(name: string, email: string, password: string, telephone: string, usuario: string, photoUrl: string, identificacao: string, cpf: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        user.sendEmailVerification().then(() => {}).catch(error => {
          console.error('Erro ao enviar email de verificação:', error);
        });

        return this.salvarDadosEstoquista(user.uid, name, email, telephone, usuario, photoUrl, identificacao, cpf).then(() => {
          alert('Cadastro de estoquista realizado com sucesso! Verifique seu email antes de fazer o login.');
          this.router.navigate(['/login']);
        });
      } else {
        throw new Error('Não foi possível obter o UID do usuário.');
      }
    }).catch(error => {
      console.error('Erro ao criar usuário:', error);
      throw error;
    });
  }

  salvarDadosLeitor(uid: string, name: string, email: string, telephone: string, usuario: string, photoUrl: string, cpf: string) {
    return this.firestore.collection(`users`).doc(uid).set({
      name,
      email,
      telephone,
      usuario,
      photoUrl,
      cpf
    });
  }

  salvarDadosEstoquista(uid: string, name: string, email: string, telephone: string, usuario: string, photoUrl: string, identificacao: string, cpf: string) {
    return this.firestore.collection(`users`).doc(uid).set({
      name,
      email,
      telephone,
      usuario,
      photoUrl,
      identificacao,
      cpf
    });
  }

  salvarProdutos(uid: string, nome: string, preco: string, categoria: string, estoque: number, codigo: number, descricao: string, dataCadastro: string, fotoUrl: string) {
    return this.firestore.collection(`produtos`).doc(uid).set({
      nome,
      preco,
      categoria,
      estoque,
      codigo,
      descricao,
      dataCadastro,
      fotoUrl
    });
  }
}
