import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

interface Produto {
  nome: string;
  preco: string;
  categoria: string;
  estoque: string;
  codigo: string;
  dataValidade: string;
  dataCadastro: string;
  fotoUrl?: string;
}

const extractFotoPath = (fotoUrl: string): string | null => {
  const match = fotoUrl.match(/o\/(.+?)\?alt/);
  return match ? match[1].replace('%2F', '/') : null; 
};

@Component({
  selector: 'app-item-estoque',
  templateUrl: './item-estoque.component.html',
  styleUrls: ['./item-estoque.component.scss']
})

export class ItemEstoqueComponent implements OnInit {
  verProdutoForm: FormGroup;
  produtoId: string | null = null;
  fotoUrl: string | null = null;

  constructor(
    private route: Router, 
    private fire: AngularFirestore, 
    private storage: AngularFireStorage, 
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private db: AngularFirestore,
  ) {
    this.verProdutoForm = this.fb.group({
      nome: [{value: '', disabled: true}],
      preco: [{value: '', disabled: true}],
      categoria: [{value: '', disabled: true}],
      estoque: [{value: '', disabled: true}],
      codigo: [{value: '', disabled: true}],
      dataValidade: [{value: '', disabled: true}],
      dataCadastro: [{value: '', disabled: true}]
    });
  }

  ngOnInit(): void {
    this.loadProduto();

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
        const produto = doc.data() as Produto; 
        this.verProdutoForm.patchValue(produto);
        this.fotoUrl = produto.fotoUrl || null;
      } else {
        console.log('Produto não encontrado!');
      }
    });
  }

  loadProduto(): void{
    this.db.collection('produtos').doc('id').valueChanges().subscribe({
      next: (produto: any) => {
        if(produto){
          this.verProdutoForm.patchValue({
            nome: produto.nome,
            preco: produto.preco,
            categoria: produto.categoria,
            estoque: produto.estoque,
            codigo: produto.codigo,
            dataValidade: produto.dataValidade,
            dataCadastro: produto.dataCadastro
          });
          this.fotoUrl = produto.fotoUrl || '';
        } else {
          console.warn('Produto nao encontrado');
        }
      },
      error: (error: any) => {
        console.error('Erro ao  carregar produto:', error)
      }
    })
  }
}
