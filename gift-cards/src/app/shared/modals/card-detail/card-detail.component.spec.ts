import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardDetailComponent } from './card-detail.component';
import { Card } from '../../../models/card.model';
import { CommonModule } from '@angular/common';

describe('CardDetailComponent', () => {
  let component: CardDetailComponent;
  let fixture: ComponentFixture<CardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailComponent, CommonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar `isOpen` en false por defecto', () => {
    expect(component.isOpen).toBeFalse();
  });

  it('debería inicializar `card` con un objeto vacío por defecto', () => {
    expect(component.card).toEqual(new Card());
  });

  it('debería emitir `closeModal` cuando se llame a `close()`', () => {
    spyOn(component.closeModal, 'emit');

    component.close();

    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('debería devolver `true` en `hasTransactions()` si hay transacciones', () => {
    component.card = new Card();
    component.card.transactions = [{ type: '', value: 100, date: '' }];

    expect(component.hasTransactions()).toBeTrue();
  });

  it('debería devolver `false` en `hasTransactions()` si no hay transacciones', () => {
    component.card = new Card();
    component.card.transactions = [];

    expect(component.hasTransactions()).toBeFalse();
  });
/*
  it('debería devolver `false` en `hasTransactions()` si `transactions` es `undefined`', () => {
    component.card = new Card();
    component.card.transactions = undefined;

    expect(component.hasTransactions()).toBeFalse();
  });
*/
});
