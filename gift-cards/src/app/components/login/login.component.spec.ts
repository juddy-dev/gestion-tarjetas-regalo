import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alerts.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signIn']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería validar los campos del formulario', () => {
    component.emailControl.setValue('');
    component.passwordControl.setValue('');
    expect(component.emailControl.valid).toBeFalse();
    expect(component.passwordControl.valid).toBeFalse();

    component.emailControl.setValue('correo@ejemplo.com');
    component.passwordControl.setValue('123456');
    expect(component.emailControl.valid).toBeTrue();
    expect(component.passwordControl.valid).toBeTrue();
  });

  it('no debería llamar a signIn si los campos son inválidos', fakeAsync(() => {
    component.emailControl.setValue('');
    component.passwordControl.setValue('');
    component.login();
    tick();

    expect(authServiceSpy.signIn).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it('debería llamar a signIn y navegar a /dashboard si la autenticación es exitosa', fakeAsync(() => {
    authServiceSpy.signIn.and.returnValue(Promise.resolve({isSignedIn: true, nextStep: { signInStep: 'DONE' }}));

    component.emailControl.setValue('correo@ejemplo.com');
    component.passwordControl.setValue('123456');
    component.login();
    tick();

    expect(authServiceSpy.signIn).toHaveBeenCalledWith('correo@ejemplo.com', '123456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.isLoading).toBeTrue();
  }));

  it('debería manejar errores en el login y mostrar mensaje', fakeAsync(() => {
    authServiceSpy.signIn.and.returnValue(Promise.reject('Error'));

    component.emailControl.setValue('correo@ejemplo.com');
    component.passwordControl.setValue('123456');
    component.login();
    tick();

    expect(authServiceSpy.signIn).toHaveBeenCalled();
    expect(alertServiceSpy.error).toHaveBeenCalledWith('Tu usuario y/o contraseña no coinciden.', 2);
    expect(component.isLoading).toBeFalse();
  }));

});
