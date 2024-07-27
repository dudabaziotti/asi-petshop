import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit{

  constructor (private route: Router) {}

  ngOnInit(): void {
    
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
