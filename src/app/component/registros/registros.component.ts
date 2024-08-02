import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss'
})
export class RegistrosComponent implements OnInit{
  userName: string | null = null;
  userId: string | null = null;
  isLeitor: boolean = false;
  isEstoquista: boolean = false;
  isAdmin: boolean = false;
  produtos: any[] = [];
  filteredProdutos: any[] = [];
  searchQuery: string = '';
  selectedCategories: Set<string> = new Set<string>();
  filterDate: string | null = null;

  constructor(
    private route: Router,
    private auth: AuthService,
    private fire: AngularFirestore,
    private afauth: AngularFireAuth,
    private fb: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.afauth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.fire.collection('users').doc(this.userId).valueChanges().subscribe({
          next: (user: any) => {
            if (user) {
              this.userName = user.name;
            }
          },
          error: (error) => {
            console.error('Error ao carregar usuário:', error);
          }
        });
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
      } else {
        console.log('No user is logged in');
        this.isLeitor = false;
        this.isEstoquista = false;
        this.isAdmin = false;
      }
    });
    this.carregarProdutos();
  }
  trackProdutos(index: number, produto: any): any {
    return produto ? produto.id : undefined;
  }

  carregarProdutos(): void {
    this.fire.collection('produtos', ref => ref.orderBy('dataCadastro', 'desc'))
      .valueChanges({ idField: 'id' }).subscribe(produtos => {
        this.produtos = produtos;
        this.filteredProdutos = produtos;
        this.filterProdutos();
      }, error => {
        console.error('Erro ao carregar produtos: ', error);
      });
  }

  sortItems(event: any): void {
    const sortBy = event.target.value;

    this.filteredProdutos.sort((a, b) => {
      if (sortBy === 'recentes') {
        return new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
      } else if (sortBy === 'antigos') {
        return new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime();
      } else if (sortBy === 'alfabetica') {
        const nomeA = a.nome.toLowerCase();
        const nomeB = b.nome.toLowerCase();
        if (nomeA < nomeB) return -1;
        if (nomeA > nomeB) return 1;
        return 0;
      }
      return 0;
    });
  }

  filterProdutos(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredProdutos = this.produtos.filter(produto => {
      const matchesSearchQuery = produto.nome.toLowerCase().includes(query);
      const matchesCategory = this.selectedCategories.size === 0 || this.selectedCategories.has(produto.categoria);
      const matchesDate = !this.filterDate || produto.dataCadastro === this.filterDate;
      return matchesSearchQuery && matchesCategory && matchesDate;
    });
  }

  filterByDate(event: any): void {
    this.filterDate = event.target.value;
    this.filterProdutos();
  }

  toggleCategory(category: string): void {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.filterProdutos();
  }

  dirperfil() {
    this.route.navigate(['/perfil']);
  }

  dirprodutos() {
    this.route.navigate(['/produtos']);
  }

  direstoque() {
    this.route.navigate(['/estoque']);
  }

  dirregistro() {
    this.route.navigate(['/registros']);
  }

  dirusuarios() {
    this.route.navigate(['/usuarios']);
  }
}
