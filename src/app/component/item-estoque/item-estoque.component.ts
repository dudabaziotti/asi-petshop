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
  editarProdutoForm: FormGroup;
  produtoId: string | null = null;
  fotoUrl: string | null = null;

  constructor(
    private route: Router, 
    private fire: AngularFirestore, 
    private storage: AngularFireStorage, 
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute
  ) {
    this.editarProdutoForm = this.fb.group({
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
        this.editarProdutoForm.patchValue(produto);
        this.fotoUrl = produto.fotoUrl || null;
      } else {
        console.log('Produto não encontrado!');
      }
    });
  }

  excluirProduto(): void {
    if (this.produtoId) {
      this.fire.collection('produtos').doc(this.produtoId).get().subscribe(doc => {
        if (doc.exists) {
          const produto = doc.data() as Produto;
          if (produto.fotoUrl) {
            const fotoPath = extractFotoPath(produto.fotoUrl);
            if (fotoPath) {
              const storageRef = this.storage.ref(fotoPath);
              storageRef.delete().toPromise().then(() => {
                console.log('Foto excluída com sucesso!');
                this.fire.collection('produtos').doc(this.produtoId!).delete().then(() => {
                  alert('Produto excluído com sucesso!');
                  this.route.navigate(['/produtos']);
                }).catch(error => {
                  console.error('Erro ao excluir produto: ', error);
                });
              }).catch(error => {
                console.error('Erro ao excluir a foto: ', error);
                this.fire.collection('produtos').doc(this.produtoId!).delete().then(() => {
                  alert('Produto excluído, mas a foto não pôde ser excluída.');
                  this.route.navigate(['/produtos']);
                }).catch(error => {
                  console.error('Erro ao excluir produto: ', error);
                });
              });
            } else {
              this.fire.collection('produtos').doc(this.produtoId!).delete().then(() => {
                alert('Produto excluído com sucesso!');
                this.route.navigate(['/produtos']);
              }).catch(error => {
                console.error('Erro ao excluir produto: ', error);
              });
            }
          } else {
            this.fire.collection('produtos').doc(this.produtoId!).delete().then(() => {
              alert('Produto excluído com sucesso!');
              this.route.navigate(['/produtos']);
            }).catch(error => {
              console.error('Erro ao excluir produto: ', error);
            });
          }
        } else {
          console.log('Produto não encontrado!');
        }
      });
    }
  }

}
