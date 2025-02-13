import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCardComponent } from './edit-card.component';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../../core/services/alerts.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Card } from '../../../models/card.model';
import { Transaction } from '../../../models/transaction.model';

describe('EditCardComponent', () => {
  let component: EditCardComponent;
  let fixture: ComponentFixture<EditCardComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const dataServiceMock = jasmine.createSpyObj('DataService', ['save']);
    const alertServiceMock = jasmine.createSpyObj('AlertService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditCardComponent],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCardComponent);
    component = fixture.componentInstance;
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería inicializar el control del formulario', () => {
    expect(component.initialValueControl).toBeDefined();
  });

  it('Debería resetear el control del formulario cuando isOpen es true', () => {
    const resetSpy = spyOn(component.initialValueControl, 'reset');
    component.isOpen = true;
    expect(resetSpy).toHaveBeenCalled();
  });

  it('Debería agregar una transacción de compra', () => {
    component.card = new Card();
    component.card.transactions = [{ type: '', value: 100, date: '' }];
    component.initialValueControl.setValue(100);
    dataServiceSpy.save.and.returnValue(of({}));

    component.addPayTransaction();

    expect(component.isLoading).toBeFalse();
    expect(component.card.transactions.length).toBe(2);
    expect(component.card.transactions[1].type).toBe('COMPRA');
    expect(dataServiceSpy.save).toHaveBeenCalledWith(component.card);
    expect(alertServiceSpy.success).toHaveBeenCalledWith('Se ha agregado el movimiento.', 3);
  });

  it('Debería mostrar un error cuando falla agregar una transacción de compra', () => {
    component.card = new Card();
    component.card.transactions = [{ type: '', value: 100, date: '' }];
    component.initialValueControl.setValue(100);
    dataServiceSpy.save.and.returnValue(throwError(() => new Error('Error')));

    component.addPayTransaction();

    expect(alertServiceSpy.error).toHaveBeenCalledWith('Tuvimos un problema, vuelve a intentarlo.', 3);

  });

  it('Debería agregar una transacción de recarga', () => {
    component.card = new Card();
    component.card.transactions = [{ type: '', value: 100, date: '' }];
    component.initialValueControl.setValue(200);
    dataServiceSpy.save.and.returnValue(of({}));

    component.addBalanceTransaction();

    expect(component.isLoading).toBeFalse();
    expect(component.card.transactions.length).toBe(2);
    expect(component.card.transactions[1].type).toBe('RECARGA');
    expect(dataServiceSpy.save).toHaveBeenCalledWith(component.card);
    expect(alertServiceSpy.success).toHaveBeenCalledWith('Se ha agregado el movimiento', 3);
  });

  it('Debería resetear el formulario y emitir el evento de cerrar', () => {
    spyOn(component.closeModal, 'emit');
    const resetSpy = spyOn(component.initialValueControl, 'reset');

    component.close();

    expect(resetSpy).toHaveBeenCalled();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
