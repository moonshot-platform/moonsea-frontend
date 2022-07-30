import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  heroesUrl: string = "";
  data: any;
  

  constructor(private httpClient: HttpClient, private lsService: LocalstorageService,
    private toastrSrvice: ToastrService) {


   }

   addCollection(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/collectionSave/', data);
  }

  getStats(blockchainId:any,serachText:any,pageNo:any,PageSize:any): Observable<any> {

    return this.httpClient.get(environment.apiUrl +'api/getStats?serachText='+serachText+'&blockchainId='+blockchainId+'&pageNo='+pageNo+'&PageSize='+PageSize);
}


getDiscoverNFTList(walletAddress: any,type: any,orderBy :any,priceRange:any,size :any,categoryId:any,lastPrice:any): Observable<any> {

  return this.httpClient.get(environment.apiUrl +'home/getHomePageNftList?sortingType='+type+'&priceRange='+priceRange+'&walletAddress='+walletAddress+'&orderBy='+orderBy+'&size='+size +"&categoryId="+ categoryId+"&lastPrice="+lastPrice);
}


  getCollectionList(walletAddress:any): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'home/getCollectionDetails?walletAddress='+walletAddress);
  }


  getBrowseBycategoryCollectionList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'admin/getCategoryList');
  }
  getBrowseSelectedBycategoryCollectionList(catId:any):Observable<any>{
    return this.httpClient.get(environment.apiUrl +'api/getCollectionsListByCategoryId?categoryId='+catId)
  }

  getTopSellerCreatorsList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'home/getTopSellerCreatorsList');
  }

  getHotBidCollectionList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'home/getHotBidCollectionList');
  }

  getNewCollections(): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'home/newCollectionList');
  }

  myCollectionList(walletAddress:any): Observable<any> {
    return this.httpClient.get(environment.apiUrl +'api/getMyCollectionByAddress?walletAddress='+walletAddress);
  }

  getOtherCollections(contractaddress:any,blockchainId:any): Observable<any> {

    return this.httpClient.get(environment.apiUrl +'Script/importOtherContract?contractAddress='+contractaddress+'&blockchainId='+blockchainId);

  }
 
  getCollectionId(): Observable<any> {

    return this.httpClient.get(environment.apiUrl +'api/getCollectionName');

  }

  getHompageStatics(){
    return this.httpClient.get(environment.apiUrl+'api/getCollectionStatisticsForHomePage');
  }

  getUpcommingCollection(){
    return this.httpClient.get(environment.apiUrl+'home/upcomingCollectionList');
  }

  getTopCollectionlist(){
    return this.httpClient.get(environment.apiUrl+'home/topCollectionList');
  }

  getRequest(url:any){
    return this.httpClient.get(environment.apiUrl+url);
  }
}
