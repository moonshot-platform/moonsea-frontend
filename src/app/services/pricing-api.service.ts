import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PricingApiService {
  bnbPriceInUsd = 400;
  serviceFees = 2.5;
  constructor(private httpClient: HttpClient) {

   }

   getPriceForBNB()
   {
    return this.httpClient.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=USD').subscribe((response:any)=>
    {
      this.bnbPriceInUsd = response.binancecoin.usd;
    })
   }

   getServiceFee()
   {
    return this.httpClient.get(environment.apiUrl+'admin/getServiceFees').subscribe((response:any)=>
    {
      
      this.serviceFees = response.data.serviceFees;
      
    })
   }


}
