import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alerts.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signOut']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/dashboard' });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el título según la ruta', () => {
    expect(component.title).toBe('Panel de tarjetas');
  });

  it('debería llamar a authService.signOut() y redirigir a "/" en logout()', fakeAsync(() => {
    authServiceSpy.signOut.and.returnValue(Promise.resolve());

    component.logout();
    expect(component.isLoading).toBeTrue();
    tick(); // Espera a que se resuelva la promesa

    expect(authServiceSpy.signOut).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('debería mostrar un error si signOut() falla', fakeAsync(() => {
    authServiceSpy.signOut.and.returnValue(Promise.reject('Error inesperado'));

    component.logout();
    expect(component.isLoading).toBeTrue();
    tick(); // Espera a que se resuelva la promesa

    expect(authServiceSpy.signOut).toHaveBeenCalled();
    expect(alertServiceSpy.error).toHaveBeenCalledWith('Tuvimos un problema, vuelve a intentar más tarde.', 3);
    expect(component.isLoading).toBeFalse();
  }));
});
