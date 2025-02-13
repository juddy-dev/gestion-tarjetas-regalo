import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DataService } from '../../shared/services/data.service';
import { LoaderService } from '../../core/services/loader.service';
import { BehaviorSubject, of } from 'rxjs';
import { Card } from '../../models/card.model';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { CreateCardComponent } from '../../shared/modals/create-card/create-card.component';
import { CreateMultipleCardsComponent } from '../../shared/modals/create-multiple-cards/create-multiple-cards.component';
import { CardDetailComponent } from '../../shared/modals/card-detail/card-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let isLoadingSubject: BehaviorSubject<boolean>;
  let loaderServiceMock: any;

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getAll']);
    isLoadingSubject = new BehaviorSubject<boolean>(false);
    loaderServiceMock = {
      status: () => isLoadingSubject,
      show: () => isLoadingSubject.next(true),
      hide: () => isLoadingSubject.next(false)
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HeaderComponent, CommonModule, ReactiveFormsModule, 
          CardDetailComponent, CreateCardComponent, CreateMultipleCardsComponent, NgxPaginationModule],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: LoaderService, useValue: loaderServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    dataServiceSpy.getAll.and.returnValue(of([]));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar tarjetas correctamente', () => {
    const mockCards: Card[] = [
      { id: '1', codeCard: 'ABC123', transactions: [], initialDate: '', initialValue: 0 } as Card,
      { id: '2', codeCard: 'DEF456', transactions: [], initialDate: '', initialValue: 0 } as Card
    ];
    dataServiceSpy.getAll.and.returnValue(of(mockCards));

    component.loadCards();
    expect(component.giftCards.length).toBe(2);
    expect(component.isEmpty).toBeFalse();
  });

  it('debería filtrar tarjetas por ID o código', () => {
    const mockCards: Card[] = [
      { id: '123', codeCard: 'ABC123', transactions: [], initialDate: '', initialValue: 0 } as Card,
      { id: '456', codeCard: 'DEF456', transactions: [], initialDate: '', initialValue: 0 } as Card
    ];
    dataServiceSpy.getAll.and.returnValue(of(mockCards));
    component.giftCards = mockCards
    component.filterlControl.setValue('123');

    expect(component.giftCardsFiltered.length).toBe(1);
    expect(component.giftCardsFiltered[0].id).toBe('123');
  });

  it('debería alternar la vista de tarjetas', () => {
    expect(component.isGridView).toBeFalse();
    component.toggleCarView();
    expect(component.isGridView).toBeTrue();
    component.toggleCarView();
    expect(component.isGridView).toBeFalse();
  });

  it('debería abrir y cerrar modales correctamente', () => {
    component.createCard();
    expect(component.isOpenModalCreateCard).toBeTrue();

    component.closeModalCreateCard();
    expect(component.isOpenModalCreateCard).toBeFalse();

    component.createMultiplesCard();
    expect(component.isOpenModalCreateMultipleCards).toBeTrue();

    component.closeModalCreateMulitpleCards();
    expect(component.isOpenModalCreateMultipleCards).toBeFalse();
  });

  it('debería abrir el modal de detalles con la tarjeta seleccionada', () => {
    const mockCard: Card = { id: '1', codeCard: 'ABC123', transactions: [], initialDate: '', initialValue: 0 } as Card;
    component.viewTransactions(mockCard);

    expect(component.isOpenModalCardDetail).toBeTrue();
    expect(component.cardSelected).toBe(mockCard);
  });

  it('debería cerrar el modal de detalles de tarjeta', () => {
    component.isOpenModalCardDetail = true;
    component.closeModalCardDetail();
    expect(component.isOpenModalCardDetail).toBeFalse();
  });
});
