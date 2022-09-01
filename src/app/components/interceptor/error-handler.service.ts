import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toaster:ToastrService) { }

public handleError(err :HttpErrorResponse){
  let errorMessage :  string;

  if(err.error instanceof ErrorEvent){
    errorMessage = `An error occurd: ${err.error.message}`;
  }else{
    switch(err.status){
      case 400:
         errorMessage = `${err.status}: bad Request.`;
        break;
      case 401:
         errorMessage = `${err.status}: You are unauthorized for this action.`;
        break;
      case 403:
         errorMessage = `${err.status}: You dont have permision to access the requested resource.`;
        break;
      case 404:
         errorMessage = `${err.status}: The requested resouce does not exist.`;
        break;
      case 412:
         errorMessage = `${err.status}: Precoudition failed.`;
        break;
      case 500:
         errorMessage = `${err.status}: internal server error.`;
        break;
      case 503:
         errorMessage = `${err.status}: The requested service is not available.`;
        break;
     default :
         errorMessage = `Something went wrong`;
      
    }
  }

  this.toaster.error(errorMessage)

}
}
