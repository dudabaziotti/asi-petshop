import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface Produto {
  nome: string;
  preco: string;
  categoria: string;
  estoque: string;
  codigo: string;
  descricao: string;
  foto: string;
  dataCadastro: string;
}

@Component({
  selector: 'app-editar-produtos',
  templateUrl: './editar-produtos.component.html',
  styleUrl: './editar-produtos.component.scss'
})
export class EditarProdutosComponent implements OnInit{
  produtos: any[] = [];
  editarProdutoForm: FormGroup;
  edicaoProduto: any = null;
  produtoId: string | null = null;

  constructor(private route: Router, private auth: AuthService, private fire: AngularFirestore, private afauth:AngularFireAuth, private fb: FormBuilder, private activatedRoute: ActivatedRoute){
    this.editarProdutoForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      categoria: ['', Validators.required],
      estoque: ['', Validators.required],
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      foto: ['', Validators.required],
      dataCadastro: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.produtoId = params.get('id');
      if (this.produtoId) {
        this.buscarProduto(this.produtoId);
      }
    });
  }

  buscarProduto(id: string): void {
    this.fire.collection('produtos').doc(id).get().subscribe(doc => {
      if (doc.exists) {
        const produto = doc.data() as Produto; // Assegura que produto é do tipo Produto
        this.editarProdutoForm.patchValue(produto);
      } else {
        console.log('Produto não encontrado!');
      }
    });
  }

  excluirProduto(): void {
    if(this.produtoId) {
      this.fire.collection('produtos').doc(this.produtoId).delete().then(() => {
        alert('Produto excluído com sucesso!');
        this.route.navigate(['/produtos']);
      }).catch(error => {
        console.error('Erro ao excluir produto: ', error);
      });
    }
    
  }

  editorProduto(id: string): void {
    console.log('ID recebido:', id);
    this.fire.collection('produtos').doc(id).get().toPromise().then((doc) => {
      console.log('Documento recebido:', doc);
      if (doc && doc.exists) {
        const data = doc.data();
        console.log('Dados do documento:', data);
        if (data) {
          this.edicaoProduto = { id: doc.id, ...data };
          this.editarProdutoForm.patchValue(this.edicaoProduto);
        }
      } else {
        console.log('Produto não encontrado!');
      }
    }).catch(error => {
      console.error('Erro ao buscar produto: ', error);
    });
  }

  editarProduto(): void {
    if(this.editarProdutoForm.valid && this.produtoId) {
      const produtoEditado = this.editarProdutoForm.value;
      this.fire.collection('produtos').doc(this.produtoId).update(produtoEditado).then (() => {
        alert('Produto editado!');
        this.editarProdutoForm.reset();
        this.edicaoProduto = null;
        this.route.navigate(['/produtos']);
      }).catch(error => {
        console.error('Erro ao editar tarefa: ', error);
      });
    }
  }
}
