import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-produtos',
  templateUrl: './add-produtos.component.html',
  styleUrls: ['./add-produtos.component.scss']
})
export class AddProdutosComponent implements OnInit {
  novoProdutoForm: FormGroup;
  selectedFile: File | null = null;
  fileSelected: boolean = false;

  constructor(
    private route: Router,
    private fire: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder
  ) {
    this.novoProdutoForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      categoria: ['', Validators.required],
      estoque: ['', Validators.required],
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      dataCadastro: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileSelected = !!file;
      console.log('Arquivo selecionado:', this.selectedFile);
    } else {
      this.selectedFile = null;
    }
  }

  adicionarProduto(): void {
    if (this.novoProdutoForm.invalid) {
      console.error('Formulário inválido');
      return;
    }

    if (!this.selectedFile) {
      console.error('Nenhum arquivo foi selecionado');
      return;
    }

    const produto = this.novoProdutoForm.value;

    const filePath = `produtos/${Date.now()}_${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          produto.fotoUrl = url;
          this.fire.collection('produtos').add(produto).then(() => {
            alert('Produto adicionado!');
            this.novoProdutoForm.reset();
            this.route.navigate(['/produtos']);
          }).catch(error => {
            console.error('Erro ao salvar o produto: ', error);
          });
        });
      })
    ).subscribe({
      error: err => console.error('Erro ao fazer upload do arquivo: ', err)
    });
  }
}
