import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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

  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }

  // login
  login(email: string, password: string, rememberMe: boolean) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user?.emailVerified) {
          if (rememberMe) {
            localStorage.setItem('token', 'true'); // Armazena o token para "lembrar-me"
          } else {
            sessionStorage.setItem('token', 'true'); // Armazena o token na sessão
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

  cadastroLeitor(name: string, email: string, password: string, telephone: string, usuario: string, cpf: string, especie: string, raca: string, sexo: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        user.sendEmailVerification().then(() => { }).catch(error => {
          console.error('Erro ao enviar email de verificação:', error);
        });
        alert('Cadastro de leitor realizado com sucesso! Verifique seu email antes de fazer o login.');
        this.router.navigate(['/login']);
        return this.salvarDadosLeitor(user.uid, name, email, telephone, usuario, cpf, especie, raca, sexo).then(() => user.uid);
      } else {
        throw new Error('Não foi possível obter o UID do usuário.');
      }
    })
    .catch(error => {
      console.error('Erro ao criar usuário:', error);
      throw error;
    });
  }
  
  cadastroEstoquista(name: string, email: string, password: string, telephone: string, usuario: string, fotoBase64: string, identificacao: string, cpf: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        user.sendEmailVerification().then(() => { }).catch(error => {
          console.error('Erro ao enviar email de verificação:', error);
        });
        alert('Cadastro de estoquista realizado com sucesso! Verifique seu email antes de fazer o login.');
        this.router.navigate(['/login']);
        return this.salvarDadosEstoquista(user.uid, name, email, telephone, usuario, fotoBase64, identificacao, cpf).then(() => user.uid);
      } else {
        throw new Error('Não foi possível obter o UID do usuário.');
      }
    })
    .catch(error => {
      console.error('Erro ao criar usuário:', error);
      throw error;
    });
  }

  salvarDadosLeitor(uid: string, name: string, email: string, telephone: string, usuario: string, cpf: string, especie: string, raca: string, sexo: string) {
    return this.firestore.collection(`users`).add({
      name,
      email,
      telephone,
      usuario,
      cpf,
      especie,
      raca,
      sexo
    });
  }

  salvarDadosEstoquista(uid: string, name: string, email: string, telephone: string, usuario: string, fotoBase64: string, identificacao: string, cpf: string) {
    return this.firestore.collection(`users`).add({
      name,
      email,
      telephone,
      usuario,
      fotoBase64,
      identificacao,
      cpf
    });
  }
}
