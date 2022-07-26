import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PricingApiService {
  bnbPriceInUsd = 0;
  serviceFees = 0;
  constructor(private httpClient: HttpClient) {

   }

   getPriceForBNB(coin:any)
   {
    return this.httpClient.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=USD`);
   }

   getPriceofBNB(){
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
