import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private errorHandler:ErrorHandlerService,private ngxService: NgxUiLoaderService,) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return new Observable((observer)=>{
      next.handle(request).subscribe({
        next:(res:HttpResponse<any>)=>{
          observer.next(res);
        },
        error : (err :HttpErrorResponse)=>{
          this.errorHandler.handleError(err);
          this.ngxService.stop();
        }
      })
    })

 }
}
