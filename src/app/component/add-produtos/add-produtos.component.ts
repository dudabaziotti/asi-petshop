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
      foto: [null, Validators.required] // Mantenha este controle, mas não é utilizado diretamente
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('Arquivo selecionado:', this.selectedFile); // Adicione isto para verificar
    }
  }
  
  novoProduto(): void {
    if (this.novoProdutoForm.valid && this.selectedFile) {
      const produto = this.novoProdutoForm.value;
      const filePath = `produto-fotos/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);
  
      console.log('Iniciando upload do arquivo:', filePath);
  
      // Observe as mudanças no upload
      task.snapshotChanges().pipe(
        finalize(() => {
          console.log('Upload concluído, tentando obter URL...');
          fileRef.getDownloadURL().subscribe(
            (url) => {
              console.log('URL da foto:', url);
              produto.foto = url;
  
              // Agora adiciona o produto ao Firestore
              this.fire.collection('produtos').add(produto).then(() => {
                alert('Produto adicionado!');
                this.novoProdutoForm.reset();
                this.route.navigate(['/produtos']);
              }).catch(error => {
                console.error('Erro ao adicionar produto: ', error);
              });
            },
            (error) => {
              console.error('Erro ao obter URL da foto:', error);
            }
          );
        })
      ).subscribe(
        () => console.log('Upload concluído com sucesso'),
        (error) => console.error('Erro durante o upload:', error)
      );
    } else {
      alert('Preencha todos os campos e selecione uma foto.');
    }
  }
  
}
