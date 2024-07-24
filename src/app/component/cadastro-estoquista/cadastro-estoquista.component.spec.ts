import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEstoquistaComponent } from './cadastro-estoquista.component';

describe('CadastroEstoquistaComponent', () => {
  let component: CadastroEstoquistaComponent;
  let fixture: ComponentFixture<CadastroEstoquistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroEstoquistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroEstoquistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
