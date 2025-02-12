import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoaderService } from "../services/loader.service";
import { finalize } from "rxjs";

export function loaderInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const loadingService = inject(LoaderService);
  loadingService.show();
  return next(req).pipe(
    finalize(()=>{
      loadingService.hide();
    })
  );

}