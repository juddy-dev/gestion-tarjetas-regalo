import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateCardComponent } from './create-card.component';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../../core/services/alerts.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('CreateCardComponent', () => {
  let component: CreateCardComponent;
  let fixture: ComponentFixture<CreateCardComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['save']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [CreateCardComponent, ReactiveFormsModule],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar `isOpen` en `false` por defecto', () => {
    expect(component.isOpen).toBeFalse();
  });

  it('debería generar nuevos IDs y resetear el formulario cuando `isOpen` cambia a `true`', () => {
    spyOn(component, 'generateId').and.returnValue('test-id');
    spyOn(component, 'generateNumericId').and.returnValue('1234567890');
    spyOn(component.initialValueControl, 'reset');

    component.isOpen = true;

    expect(component.idCard).toBe('test-id');
    expect(component.codeCard).toBe('1234567890');
    expect(component.initialValueControl.reset).toHaveBeenCalled();
  });

  it('debería llamar a `dataService.create()` y mostrar mensaje de éxito si `save()` es exitoso', fakeAsync(() => {
    component.isOpen = true;
    component.initialValueControl.setValue(1000);
    dataServiceSpy.save.and.returnValue(of({}));

    component.save();
    tick();

    expect(dataServiceSpy.save).toHaveBeenCalled();
    expect(alertServiceSpy.success).toHaveBeenCalledWith('La tarjeta se ha generado.', 3);
    expect(component.isLoading).toBeFalse();
  }));

  it('debería mostrar un error si `save()` falla', fakeAsync(() => {
    component.isOpen = true;
    component.initialValueControl.setValue(1000);
    dataServiceSpy.save.and.returnValue(throwError(() => new Error('Error inesperado')));

    component.save();
    tick();

    expect(dataServiceSpy.save).toHaveBeenCalled();
    expect(alertServiceSpy.error).toHaveBeenCalledWith('Tuvimos un problema, vuelve a intentarlo.', 3);
  }));

  it('no debería llamar a `dataService.create()` si el formulario es inválido', () => {
    component.isOpen = true;
    component.initialValueControl.setValue(0); // Valor inválido

    component.save();

    expect(dataServiceSpy.save).not.toHaveBeenCalled();
  });

  it('debería resetear el formulario y emitir `closeModal` cuando se llame a `close()`', () => {
    spyOn(component.closeModal, 'emit');
    spyOn(component.initialValueControl, 'reset');

    component.close();

    expect(component.initialValueControl.reset).toHaveBeenCalled();
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
