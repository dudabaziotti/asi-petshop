import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';

  constructor(
    private route: Router,
    private authService: AuthService
  ){}
  
  ngOnInit(): void {
    this.authService.getUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários:', error);
      },
      complete: () => {
        console.log('Carga de usuários completa');
      }
    });
  }

  filterUsers(): void {
    const query = this.searchQuery.trim().toLowerCase();
    const sanitizedQuery = query.replace(/[\.\-]/g, '');
    if (sanitizedQuery === '') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => {
        const sanitizedCPF = user.cpf.replace(/[\.\-]/g, '');
        const sanitizedTelephone = user.telephone.replace(/[\-\(\)\s]/g, '');
        return user.name.toLowerCase().includes(query) || user.type.includes(query) || sanitizedCPF.includes(sanitizedQuery) || sanitizedTelephone.includes(sanitizedQuery);
      });
    }
  }

  dirperfil() {
    this.route.navigate(['/perfil']);
  }
  dirprodutos() {
    this.route.navigate(['/produtos']);
  }
  direstoque() {
    this.route.navigate(['/pagina-inicial']);
  }
  dirregistro() {
    this.route.navigate(['/pagina-inicial']);
  }
  dirusuarios() {
    this.route.navigate(['/usuarios']);
  }

}
