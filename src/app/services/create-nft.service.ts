import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateNftService {

  constructor(private httpClient: HttpClient) {

   }
   getCategotyList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'admin/getCategoryList');
  }

   addCollection(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/collectionSave/', data);
  }

   getCollectionList(walletAddress: any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getCollectionList?walletAddress=' + walletAddress);
  }

  getTokenIdLatest(data: any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getTokenid?walletaddress=' + data);
  }

  getCurrencyList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getCurrencyList');
  }

  getBlockchainList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getBlockchain');
  }
  
  createNft(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/createNftToken/', data);
  }

  uploadFile(file: File) {
    let formData = new FormData();
    formData.append("file", file);
    let headersforfile = new HttpHeaders()
      .set('APPKEY', 'nft');
    return this.httpClient.post(environment.apiUrl + 'api/nftTokenImageSave', formData, { headers: headersforfile });
  }
  
  listingUpdateSignature(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/listSignatureSave/', data);
  }

  postRequest(url:any,body){
    return this.httpClient.post(environment.apiUrl+url,body);
  }

}
