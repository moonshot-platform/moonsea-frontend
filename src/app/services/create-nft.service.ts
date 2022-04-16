import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateNftService {

  subject = new Subject();
  subject01 = new Subject();


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

  // uploadFile(file: File) {
  //   let formData = new FormData();
  //   formData.append("file", file);
  //   let headersforfile = new HttpHeaders()
  //     .set('APPKEY', 'nft');
  //   return this.httpClient.post(environment.apiUrl + 'api/nftTokenImageSave', formData, { headers: headersforfile });
  // }
  uploadFile(file: File): Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append("file", file);
    let headersforfile = new HttpHeaders()
      .set('APPKEY', 'nft');
    const req = new HttpRequest('POST',environment.apiUrl + 'api/nftTokenImageSave', formData, { headers: headersforfile,reportProgress:true, responseType: "json"});
  
    return this.httpClient.request(req);

  }
  
  listingUpdateSignature(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/listSignatureSave/', data);
  }

  postRequest(url:any,body){
    return this.httpClient.post(environment.apiUrl+url,body);
  }

}
