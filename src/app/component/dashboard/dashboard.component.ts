import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';  
import { switchMap } from 'rxjs/operators';  

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  userId: string | null = null;
  isLeitor: boolean = false;
  isEstoquista: boolean = false;
  isAdmin: boolean = false;

  constructor (private route: Router, private auth: AuthService, private fire: AngularFirestore, private afauth:AngularFireAuth) {}
  
  ngOnInit(): void {
    this.afauth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log('Logged in user ID:', this.userId); // Log do userId
        this.loadUserData();
      } else {
        console.log('No user is logged in');
        this.isLeitor = false;
        this.isEstoquista = false;
      }
    });
  }

  loadUserData(): void {
    if (this.userId) {
      this.auth.getUserType(this.userId).subscribe(userType => {
        console.log('User type from document:', userType); // Log do tipo de usuário
        if (userType === 'estoquista') {
          this.isLeitor = false;
          this.isEstoquista = true;
        } else if (userType === 'leitor'){
          this.isLeitor = true;
          this.isEstoquista = false;
        } else {
          this.isLeitor = false;
          this.isEstoquista = false;
        }
      });
    }
  }
  
  
  dirperfil(){
    this.route.navigate(['/pagina-inicial']);
  }
  dirprodutos(){
    this.route.navigate(['/produtos']);
  }
  direstoque(){
    this.route.navigate(['/pagina-inicial']);
  }
  dirregistro(){
    this.route.navigate(['/pagina-inicial']);
  }
  dirusuarios(){
    this.route.navigate(['/pagina-inicial']);
  }
}
