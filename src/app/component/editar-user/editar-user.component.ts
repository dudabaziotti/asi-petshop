import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Usuario {

  name: string;
  cpf: string;
  cep: string;
  email: string;
  endereco: string;
  estado: string;
  bairro: string;
  numero: string;
  complemento: string;
  telephone: string;
  data: string;
  identificacao: string;
  uid: string;
  photoUrl: string | null;
}

const extractFotoPath = (fotoUrl: string): string | null => {
  const match = fotoUrl.match(/o\/(.+?)\?alt/);
  return match ? match[1].replace('%2F', '/') : null; 
};

@Component({
  selector: 'app-editar-user',
  templateUrl: './editar-user.component.html',
  styleUrl: './editar-user.component.scss'
})
export class EditarUserComponent {

  editarUsuarioForm: FormGroup;

  constructor(
    private route: Router, 
    private auth: AuthService, 
    private fire: AngularFirestore, 
    private storage: AngularFireStorage, 
    private afauth: AngularFireAuth, 
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute
  ) {
    this.editarUsuarioForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      categoria: ['', Validators.required],
      estoque: ['', Validators.required],
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      dataCadastro: ['', Validators.required]
    });
  }

}
