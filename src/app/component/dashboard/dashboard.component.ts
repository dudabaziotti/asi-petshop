import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 

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
        console.log('Logged in user ID:', this.userId);
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
    if (this.userId) {
      this.auth.getUserType(this.userId).subscribe(userType => {
        console.log('User type from document:', userType); 
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
