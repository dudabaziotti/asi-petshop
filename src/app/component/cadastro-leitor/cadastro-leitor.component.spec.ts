import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroLeitorComponent } from './cadastro-leitor.component';

describe('CadastroLeitorComponent', () => {
  let component: CadastroLeitorComponent;
  let fixture: ComponentFixture<CadastroLeitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroLeitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroLeitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
