# 🚀 Angular 19 + AWS (Amplify + Api Gateway + Lambda)

→→→ [INGRESA AQUÍ PARA TESTEAR](https://juddy-dev.github.io/gestion-tarjetas-regalo/#/)
 - Correo: test@juddy.dev
 - Contraseña: T3st*123

Este proyecto es una aplicación Angular 19 que utiliza **AWS Amplify** para la autenticación y Api Gateway, Lambdas, Dynamo para un backend **Serveless**. La aplicación está diseñada para ser segura y escalable, implementando buenas prácticas en autenticación, autorización y consumo de APIs.

## 📌 Características

✅ **Desarrollado con Angular 19**  
✅ **Autenticación con AWS Amplify (Cognito)**  
✅ **Protección de rutas con AuthGuard**  
✅ **Consumo de API GATEWAY privada protegida con JWT**  
✅ **Backend Serveless con Lambda y Dynamo**  
✅ **Interceptor HTTP para inyección automática del `idToken` en las peticiones al backend**  

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) → [Descargar Node.js](https://nodejs.org/)  
- **Angular CLI** → `npm install -g @angular/cli`   
- Una cuenta en **AWS** y un grupo de usuarios configurado en **Cognito**  → [AWS Cognito](https://docs.aws.amazon.com/es_es/cognito/latest/developerguide/what-is-amazon-cognito.html)

---

## 🚀 Instalación y Configuración

1️⃣ **Clonar el repositorio**  
```sh
git clone https://github.com/juddy-dev/gestion-tarjetas-regalo.git
cd gift-cards
```
2️⃣ **Instalar dependencias**
```sh
npm install
```
3️⃣ **Configurar el environment.ts**
(también configurar el de producción `environment.prod.ts`)
```ts
export const environment = {
    production: false,
    apiUrl: '', //endpoint del backend
    userPoolId: '',//id del grupo de usuario de Cognito
    userPoolClientId: '',//id del cliente de aplicación relacionado con el grupo de usuario de Cognito
    region: ''//region del grupo de usuario de Cognito
  };
  
```

---
## 🔑 Uso de AWS Amplify (Autenticación y API)

1️⃣ **Login con AWS Amplify (Cognito)**

El login/validación de la sesión y obtención del token se maneja con `AWS Amplify` en `auth.service.ts`:

(src/app/core/services/auth.service.ts)

Ingreso:
```ts
import { signIn } from 'aws-amplify/auth'

async signIn(email: string, password: string) {
    return await signIn({
        username: email,
        password: password,
    })
}
```

La validación de la sesión:

```ts
async getCurrentUser() {
    const { username, userId } = await getCurrentUser();
    this.user$.next(new User(username, userId));
}

```

Obtención del token:

```ts
async getTokenSession() {
    const { tokens } = await fetchAuthSession();
    return tokens?.idToken?.toString();
}

```

2️⃣ **Protección de Rutas con AuthGuard**

Para restringir acceso a rutas, usamos `AuthGuard` en `auth.guard.ts`:

(src/app/core/guards/auth.guard.ts)

```ts

import { AuthService } from "../services/auth.service";

export class AuthGuard implements CanActivate {
    async canActivate(): Promise<boolean>  {
        try {
            await this.authService.getCurrentUser();
            return true;
        } catch {
            this.router.navigate(['/']);
            return false;
        }
    }
}

```

3️⃣ **Interceptor para Incluir el idToken en las Peticiones**

Para autenticar las llamadas a la API, usamos un interceptor `http.interceptor.ts`:

(src/app/core/interceptors/http.interceptor.ts)

```ts

import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { AuthService } from "../services/auth.service";

export function httpInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);
    return from(authService.getTokenSession()).pipe(
      switchMap(token => {
        const newReq = req.clone({
          headers: req.headers.append('Authorization', token ?? ''),
        });
        return next(newReq);
      })
    );
}

```
---

## 🏗 Arquitectura de la Aplicación
📌 Frontend: Angular 19 + AWS Amplify

📌 Autenticación: AWS Cognito

📌 Backend(api privada)

## 📊 Flujo de Autenticación

1. Usuario inicia sesión con AWS Cognito.
2. Amplify devuelve un idToken (JWT).
3. Las peticiones a la API incluyen el idToken en el header.
4. La API valida el token para procesar las solicitudes.

---

## 📦 Comandos

Ejecutar en local
```sh
ng serve
```

Compilar para producción
```sh
npm run prod

```

---


