import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router) { }

   // Login method
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
}
