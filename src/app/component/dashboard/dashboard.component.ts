import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  constructor (private route: Router) {}
  ngOnInit(): void {
    
  }

  dirperfil(){
    this.route.navigate(['/pagina-inicial']);
  }
  dirprodutos(){
    this.route.navigate(['/pagina-inicial']);
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
