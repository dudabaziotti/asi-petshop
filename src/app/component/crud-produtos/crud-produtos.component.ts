import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crud-produtos',
  templateUrl: './crud-produtos.component.html',
  styleUrl: './crud-produtos.component.scss'
})
export class CrudProdutosComponent implements OnInit{
  
  produtos: any[] = [];
  novoProdutoForm: FormGroup;
  
  constructor (private route: Router, private auth: AuthService, private fire: AngularFirestore, private afauth:AngularFireAuth, private fb: FormBuilder) {
    this.novoProdutoForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      categoria: ['', Validators.required],
      estoque: ['', Validators.required],
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      foto: ['', Validators.required],
      dataCadastro: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }

  novoProduto(): void {
    if (this.novoProdutoForm.valid) {
      let produto = this.novoProdutoForm.value;
      this.fire.collection('produtos').add(produto).then(() => {
        alert('Produto adicionado!');
        this.novoProdutoForm.reset();
        this.route.navigate(['/produtos']);
      }).catch(error => {
        console.error('Erro ao adicionar tarefa: ', error);
      });
    }
  }

  excluirProduto(): void {

  }

  editarProduto(): void {

  }
}
