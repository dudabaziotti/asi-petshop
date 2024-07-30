import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudProdutosComponent } from './crud-produtos.component';

describe('CrudProdutosComponent', () => {
  let component: CrudProdutosComponent;
  let fixture: ComponentFixture<CrudProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudProdutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
