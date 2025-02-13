import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsComponent } from './transactions.component';
import { DataService } from '../../shared/services/data.service';
import { AlertService } from '../../core/services/alerts.service';
import { of, throwError } from 'rxjs';
import { Card } from '../../models/card.model';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { NgxPaginationModule } from 'ngx-pagination';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['getAll', 'save']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TransactionsComponent, LoaderComponent, NgxPaginationModule],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar loadCards() en ngOnInit', () => {
    spyOn(component, 'loadCards');
    component.ngOnInit();
    expect(component.loadCards).toHaveBeenCalled();
  });

  it('debería cargar tarjetas en loadCards()', () => {
    const mockCards: Card[] = [{ id: '1', codeCard: 'ABC123', transactions: [], initialValue: 0, initialDate: '' }];
    mockDataService.getAll.and.returnValue(of(mockCards));

    component.loadCards();
    expect(component.giftCards.length).toBe(1);
    expect(component.giftCardsFiltered.length).toBe(1);
  });

  it('debería filtrar tarjetas correctamente', () => {
    component.giftCards = [
      { id: '1', codeCard: 'ABC123', transactions: [], initialValue: 0, initialDate: '' },
      { id: '2', codeCard: 'XYZ789', transactions: [], initialValue: 0, initialDate: '' }
    ];

    component.filterlControl.setValue('ABC');
    expect(component.giftCardsFiltered.length).toBe(1);
    expect(component.giftCardsFiltered[0].codeCard).toBe('ABC123');
  });

  
});
