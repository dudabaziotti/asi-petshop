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

  constructor(private fireauth: AngularFireAuth, private router: Router) { }

   // login
   login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      if (res.user?.emailVerified) {
        localStorage.setItem('token', 'true');
        this.router.navigate(['/dashboard']);
      } else {
        alert("Login incorreto");
      }
    }).catch(err => {
      alert(err.message);
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
      alert('Verifique o seu email para mudar a sua senha.')
      this.router.navigate(['/login']);
    }).catch(err => {
      alert('Algo deu errado');
    });
  }

    // cadastro
    cadastro(name: string, email: string, password: string, telephone: string, type: tipoUsuario) {
      if (type === tipoUsuario.leitor) {
        this.router.navigate(['/cadastro-leitor']);
        this.cadastroLeitor(email, password);
      }
      else if (type === tipoUsuario.estoquista) {
        this.router.navigate(['/cadastro-estoquista']);
        this.cadastroEstoquista(email, password);
      }
    }

    cadastroLeitor (email: string, password: string) {
      this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
        const user = userCredential.user;
        if (user) {
          const cpf = 'cpf_leitor';
          const especie = 'especie_leitor';
          const raca = 'raca_leitor';
          const sexo = 'sexo_leitor';
          this.salvarDadosLeitor(user.uid, cpf, especie, raca, sexo);
        }
      })
      .catch(error => {
        console.error('Erro ao criar usuário:', error);
      });
    }

    cadastroEstoquista (email: string, password: string) {
       return this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
        const user = userCredential.user;
        if (user) {
          const identificacao = 'identificacao_estoquista'; 
          const cpf = 'cpf_estoquista'; 
          const foto = new File([""], "foto.png");
          return this.salvarDadosEstoquista(user.uid, cpf, identificacao, foto).then(() => user.uid);
      } else {
        throw new Error('Não foi possível obter o UID do usuário.')
        }
      })
      .catch(error => {
        console.error('Erro ao criar usuário:', error);
      });
    }

    salvarDadosLeitor(uid: string, cpf: string, especie: string, raca: string, sexo: string) {
      // Implemente a lógica para salvar as informações do leitor no banco de dados
      
    }
  
    salvarDadosEstoquista(uid: string, cpf: string, identificacao: string, foto: File | null): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        if (!foto) {
          reject(new Error('Foto não fornecida.'));
          return;
        }
      });
    }
  }

