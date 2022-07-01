import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class NftInteractionService {

  constructor(private httpClient: HttpClient, private lsService: LocalstorageService,
    private toastrSrvice: ToastrService) {


   }

   placeBid(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/placeBid?nftAddress='+data.nftAddress+'&blockchainId='+data.blockchainId, data);
  }

  getDiscoverNFTList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'api/getHomePageNftList?sortingType=1&priceRange=1');
  }

  savePurchaseOrder(data: any) : Observable<any>
  {
    return this.httpClient.post(environment.apiUrl + 'api/purchaseOrderSave/', data);
  }

  getBidHistoryForNft(nftTokenId: any,walletAddress:any,nftAddress:any,blockchainId:any): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'api/getBidHistory?nftTokenId='+nftTokenId+'&loginAddress='+walletAddress+"&nftAddress="+nftAddress+'&blockchainId='+blockchainId);
  }

  getNftDetails(walletAddress: any,nftId:any,nftAddress:any,blockchainId:any): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'api/getNftDeatailsByWalletAddress?walletAddress='+walletAddress+"&nftId="+nftId+"&nftAddress="+nftAddress+"&blockchainId="+blockchainId);
  }

  showToastr(message: any, isSuccess: boolean) {
    if (isSuccess) {
      this.toastrSrvice.success(message);
    }
    else {
      this.toastrSrvice.error(message);
    }
  }
}
