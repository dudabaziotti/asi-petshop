import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private authService: AuthService,
    private fire: AngularFirestore
  ){}
  
  ngOnInit(): void {
    this.getUsers().subscribe({
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
  
  getUsers(): Observable<any[]> {
    return this.fire.collection('users').snapshotChanges().pipe(
      map((actions: any[]) => actions.map((a: any) => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  navegarParaEditar(userId: string): void {
    this.route.navigate(['/editar-user', userId]);
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
    this.route.navigate(['/estoque']);
  }
  dirregistro() {
    this.route.navigate(['/registros']);
  }
  dirusuarios() {
    this.route.navigate(['/usuarios']);
  }
}
