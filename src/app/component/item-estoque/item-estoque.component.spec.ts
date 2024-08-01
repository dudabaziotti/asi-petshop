import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEstoqueComponent } from './item-estoque.component';

describe('ItemEstoqueComponent', () => {
  let component: ItemEstoqueComponent;
  let fixture: ComponentFixture<ItemEstoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemEstoqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
