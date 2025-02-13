import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateMultipleCardsComponent } from './create-multiple-cards.component';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../../core/services/alerts.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('CreateMultipleCardsComponent', () => {
  let component: CreateMultipleCardsComponent;
  let fixture: ComponentFixture<CreateMultipleCardsComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['createMultiple']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [CreateMultipleCardsComponent, ReactiveFormsModule],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMultipleCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar `isOpen` en `false` por defecto', () => {
    expect(component.isOpen).toBeFalse();
  });

  it('debería llamar a `dataService.createMultiple()` y mostrar mensaje de éxito si `save()` es exitoso', fakeAsync(() => {
    component.initialValueControl.setValue(1000);
    component.qunatityCardsControl.setValue(5);
    dataServiceSpy.createMultiple.and.returnValue(of({}));

    component.save();
    tick();

    expect(dataServiceSpy.createMultiple).toHaveBeenCalled();
    expect(alertServiceSpy.success).toHaveBeenCalledWith(
      'Las tarjetas se han generado, tal vez tarden un poco en visualizarse.', 5
    );
    expect(component.isLoading).toBeFalse();
  }));

  it('debería mostrar un error si `save()` falla', fakeAsync(() => {
    component.initialValueControl.setValue(1000);
    component.qunatityCardsControl.setValue(5);
    dataServiceSpy.createMultiple.and.returnValue(throwError(() => new Error('Error inesperado')));

    component.save();
    tick();

    expect(dataServiceSpy.createMultiple).toHaveBeenCalled();
    expect(alertServiceSpy.error).toHaveBeenCalledWith('Tuvimos un problema, vuelve a intentarlo.', 3);
  
  }));

  it('no debería llamar a `dataService.createMultiple()` si los formularios son inválidos', () => {
    component.initialValueControl.setValue(0); // Valor inválido
    component.qunatityCardsControl.setValue(0); // Cantidad inválida

    component.save();

    expect(dataServiceSpy.createMultiple).not.toHaveBeenCalled();
  });

  it('debería resetear los formularios y emitir `closeModal` cuando se llame a `close()`', () => {
    spyOn(component.closeModal, 'emit');
    spyOn(component.initialValueControl, 'reset');
    spyOn(component.qunatityCardsControl, 'reset');

    component.close();

    expect(component.initialValueControl.reset).toHaveBeenCalled();
    expect(component.qunatityCardsControl.reset).toHaveBeenCalled();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('debería generar un ID único con `generateId()`', () => {
    const id1 = component.generateId();
    const id2 = component.generateId();
    expect(id1).not.toBe(id2);
  });

  it('debería generar un ID numérico único con `generateNumericId()`', () => {
    const id1 = component.generateNumericId();
    const id2 = component.generateNumericId();
    expect(id1).not.toBe(id2);
  });
});
