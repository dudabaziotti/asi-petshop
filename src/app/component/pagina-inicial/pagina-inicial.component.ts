import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.scss'
})
export class PaginaInicialComponent implements OnInit{

  constructor (private router: Router){}

  logar () {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    
  }

}
