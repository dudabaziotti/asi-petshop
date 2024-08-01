import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

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
  selector: 'app-editar-produtos',
  templateUrl: './editar-produtos.component.html',
  styleUrls: ['./editar-produtos.component.scss']
})
export class EditarProdutosComponent implements OnInit {
  produtos: any[] = [];
  editarProdutoForm: FormGroup;
  edicaoProduto: any = null;
  produtoId: string | null = null;
  selectedFile: File | null = null;
  fotoUrl: string | null = null;
  editandoFoto: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private route: Router, 
    private auth: AuthService, 
    private fire: AngularFirestore, 
    private storage: AngularFireStorage, 
    private afauth: AngularFireAuth, 
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute
  ) {
    this.editarProdutoForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      categoria: ['', Validators.required],
      estoque: ['', Validators.required],
      codigo: ['', Validators.required],
      dataValidade: ['', Validators.required],
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoUrl = reader.result as string; 
      };
      reader.readAsDataURL(file);
      this.editandoFoto = true;
      console.log('Arquivo selecionado:', this.selectedFile);
    } else {
      this.selectedFile = null;
    }
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

  editorProduto(id: string): void {
    console.log('ID recebido:', id);
    this.fire.collection('produtos').doc(id).get().toPromise().then((doc) => {
      console.log('Documento recebido:', doc);
      if (doc && doc.exists) {
        const data = doc.data() as Produto;
        console.log('Dados do documento:', data);
        if (data) {
          this.fotoUrl = data.fotoUrl || null;
          this.editarProdutoForm.patchValue(data);
        }
      } else {
        console.log('Produto não encontrado!');
      }
    }).catch(error => {
      console.error('Erro ao buscar produto: ', error);
    });
  }

  editarProduto(): void {
    if (this.editarProdutoForm.valid && this.produtoId) {
      const produtoEditado = this.editarProdutoForm.value;
  
      if (this.selectedFile) {
        const oldFotoUrl = this.fotoUrl;
        const filePath = `produtos/${Date.now()}_${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);
  
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              produtoEditado.fotoUrl = url;
  
              if (oldFotoUrl && oldFotoUrl.includes('/o/')) {
                const oldFotoPath = extractFotoPath(oldFotoUrl);
                if (oldFotoPath) {
                  const oldFotoRef = this.storage.ref(oldFotoPath);
                  oldFotoRef.delete().subscribe(() => {
                    console.log('Foto antiga excluída com sucesso!');
                    this.updateProduto(produtoEditado);
                  }, error => {
                    console.error('Erro ao excluir a foto antiga: ', error);
                    this.updateProduto(produtoEditado);
                  });
                } else {
                  this.updateProduto(produtoEditado);
                }
              } else {
                this.updateProduto(produtoEditado);
              }
            });
          })
        ).subscribe({
          error: err => console.error('Erro ao fazer upload do arquivo: ', err)
        });
      } else {
        this.updateProduto(produtoEditado);
      }
    }
  }

  updateProduto(produto: Produto): void {
    if (this.produtoId) {
      this.fire.collection('produtos').doc(this.produtoId).update(produto).then(() => {
        alert('Produto editado!');
        this.editarProdutoForm.reset();
        this.route.navigate(['/produtos']);
      }).catch(error => {
        console.error('Erro ao editar produto: ', error);
      });
    }
  }
}
