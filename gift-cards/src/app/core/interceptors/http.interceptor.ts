import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { from, switchMap } from "rxjs";

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