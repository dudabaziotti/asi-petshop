import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export enum tipoUsuario {
  leitor = 'Leitor',
  estoquista = 'Estoquista'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router) {
    this.checkAuth();
  }

  // verifica usuário autenticado
  checkAuth() {
    this.fireauth.onAuthStateChanged(user => {
      if (user) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  // Login
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
  cadastro(name: string, email: string, password: string, telephone: string, type: tipoUsuario) {
    if (type === tipoUsuario.leitor) {
      this.router.navigate(['/cadastro-leitor'], { state: { email, password } });
    }
    else if (type === tipoUsuario.estoquista) {
      this.router.navigate(['/cadastro-estoquista'], { state: { email, password } });
    }
  }

  cadastroLeitor(email: string, password: string, cpf: string, especie: string, raca: string, sexo: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        return this.salvarDadosLeitor(user.uid, cpf, especie, raca, sexo);
      } else {
        throw new Error('Não foi possível obter o UID do usuário.');
      }
    })
    .catch(error => {
      console.error('Erro ao criar usuário:', error);
      throw error;
    });
  }

  cadastroEstoquista(email: string, password: string, cpf: string, identificacao: string, fotoBase64: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        return this.salvarDadosEstoquista(user.uid, cpf, identificacao, fotoBase64).then(() => user.uid);
      } else {
        throw new Error('Não foi possível obter o UID do usuário.');
      }
    })
    .catch(error => {
      console.error('Erro ao criar usuário:', error);
      throw error;
    });
  }

  salvarDadosLeitor(uid: string, cpf: string, especie: string, raca: string, sexo: string) {
    // lógica para salvar as informações do leitor no banco de dados
  }

  salvarDadosEstoquista(uid: string, cpf: string, identificacao: string, fotoBase64: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!fotoBase64) {
        reject(new Error('Foto não fornecida.'));
        return;
      }

      // lógica para salvar as informações do estoquista no banco de dados,
      // incluir a string base64 da foto

      resolve();
    });
  }
}
