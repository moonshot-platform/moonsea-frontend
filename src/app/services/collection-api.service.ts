import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionApiService {

  constructor(private httpClient: HttpClient) {
  }

  updateCoverPhoto(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/collectionCoverPhotoUpdate/', data);
  }

  getCollectionDetails(name: any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getCollectionDetailsByName?collectionName=' + name);
  }


  getNFTListAll(collectionId:any,walletAddress:any,sortingType:any,priceRangeMin:any,priceRangeMax:any,size:any,propertiesKey:any,propertiesValue:any,searchText:any,categoryId:any,status:any,json:any): Observable<any> {
    // return this.httpClient.get(environment.apiUrl + 'api/getNftDetailsByCollectionId?collectionId=' + collectionId + "&walletAddress=" + walletAddress + "&sortingType=" + sortingType + "&priceRangeMin=" + priceRangeMin + "&priceRangeMax=" + priceRangeMax + "&orderBy=" + orderBy + "&size=" + size + "&propertiesValue=" + propertiesValue +"&searchText="+searchText+"&categoryId="+categoryId+"&sortByPrice="+sortByPrice+"&propertiesKey=" + propertiesKey);
 
    return this.httpClient.get(environment.apiUrl +"api/getNftDetailsByCollectionId?collectionId="+collectionId+"&walletAddress="+walletAddress+"&sortingType="+sortingType+"&priceRangeMin="+priceRangeMin+"&priceRangeMax="+priceRangeMax+"&size="+size+"&propertiesKey="+propertiesKey+"&propertiesValue="+propertiesValue+"&searchText="+searchText+"&categoryId="+categoryId+"&status="+status+"&json="+json);
  }

  uploadCoverPic(file: File, walletAddress: string) {
    let formData = new FormData();
    formData.append("file", file);
    let headersforfile = new HttpHeaders()
      .set('APPKEY', 'nft');
    return this.httpClient.post(environment.apiUrl + 'api/uploadCollectionCoverPhotoPic', formData, { headers: headersforfile });
  }

  getRequest(url){
    return this.httpClient.get(environment.apiUrl+url);
  }

  postRequest(body,url){
    return this.httpClient.post(environment.apiUrl+url,body);
  }

  getTemparory(url){
   const tempUrl = "https://infinixx.io/marketplace/api/" ;
   return this.httpClient.get(environment.apiUrl+url);
  }

  uploadCover(body:any , url){
      return this.httpClient.post(environment.apiUrl+url,body);
  }

}
