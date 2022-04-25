import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { HttpParams } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from './localstorage.service';


@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  subjectTo = new Subject<any>()



  userInfo: any;
  constructor(private httpClient: HttpClient, private lsService: LocalstorageService,
    private toastrSrvice: ToastrService) {
    let info = this.lsService.retrieve('userInfo');
    if (info != 'not found') {
      this.userInfo = JSON.parse(this.lsService.retrieve('userInfo'));
    }
  }




  registerUser(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/registration/', data);
  }

  showToastr(message: any, isSuccess: boolean) {
    if (isSuccess) {
      this.toastrSrvice.success(message);
    }
    else {
      this.toastrSrvice.error(message);
    }
  }

  transferSave(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'user/transferTokenSave/', data);
  }

  reportSave(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'Social/reportSave/', data);
  }

  updatePriceSave(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/updateListingPrice/', data);
  }

  burnTokenSave(data: any): Observable<any> {

    return this.httpClient.post(environment.apiUrl + 'user/burnTokenSave/', data);
  }

  removeFromSaleSave(data: any): Observable<any> {

    return this.httpClient.post(environment.apiUrl + 'api/removeFromSale/', data);
  }


  getCurrencyList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getCurrencyList');
  }


  getBlockchainList(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getBlockchain');
  }


  addInListingForSaleSave(data: any): Observable<any> {

    return this.httpClient.post(environment.apiUrl + 'api/addInListingForSale/', data);
  }

  nftDetails(nftTokenId: any, walletAddress: any,nftAddress:any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getDetails?nftTokenId=' + nftTokenId + '&walletAddress=' + walletAddress+"&nftAddress="+nftAddress);
  }

  getListBidHistory(nftTokenId: any,nftAddress:any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'user/getActivityList?nftId=' + nftTokenId+"&nftAddress="+nftAddress);
  }

  getListOwners(nftTokenId: any, walletAddress: any,nftAddress:any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getListOwners?nftTokenId=' + nftTokenId + '&walletAddress=' + walletAddress+'&nftAddress='+nftAddress);
  }


  getCategoryNames(data: any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getCategory');

  }

  getListInfo(nftTokenId: any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'api/getListInfo?nftTokenId=' + nftTokenId);
  }

  notificationCount(address: any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'Social/notificationCount?walletAddress=' + address);
  }

  notificationList(address: any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'Social/notificationList?walletAddress=' + address);
  }

  notificationListAll(address: any): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'Social/notificationListAll?walletAddress=' + address);
  }

  updateProfile(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/updateProfile/', data);
  }

  login(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'Customer/Login/', data);
  }



  updateCoverPhoto(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/coverPhotoUpdate/', data);
  }

  updateApprovalTransactionHash(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'api/listingUpdateTransactionHash/', data);
  }


  checkIsRegister(address: any): Observable<any> {

    return this.httpClient.get(environment.apiUrl + 'api/isregister?address=' + address);
  }

  searchResult(searchText: any): Observable<any> {

    return this.httpClient.get(environment.apiUrl + 'api/getAutocomplete?searchText=' + searchText);
  }



  uploadProfilePic(file: File) {
    let formData = new FormData();
    formData.append("file", file);
    let headersforfile = new HttpHeaders()
      .set('APPKEY', 'nft');
    return this.httpClient.post(environment.apiUrl + 'api/profilePicSave', formData, { headers: headersforfile });
  }

  uploadCoverPic(file: File, walletAddress: string) {
    let formData = new FormData();
    formData.append("file", file);
    let headersforfile = new HttpHeaders()
      .set('APPKEY', 'nft');
    return this.httpClient.post(environment.apiUrl + 'api/coverPhotoSave', formData, { headers: headersforfile });
  }

  loginAddress =  localStorage
  getUserDetails(username: string,connectedAddress : any): Observable<any> {

    return this.httpClient.get(environment.apiUrl + `api/getUserDetails?walletAddress=${username}&loginAddress=${connectedAddress}`);
  }
  getItemsForUser(username: string, type: number): Observable<any> {
    return this.httpClient.get(environment.apiUrl + `api/getUserNftDetailsList?walletAddress=${username}&type=${type}`);
  }

  getItemsForFollowing(username: string, loginAddress: string): Observable<any> {
    return this.httpClient.get(environment.apiUrl + `social/followingList?walletAddress=${username}&loginAddress=${loginAddress}`);
  }

  getItemsForFollowers(username: any, loginAddress: string): Observable<any> {
    return this.httpClient.get(environment.apiUrl + `social/followList?walletAddress=${username}&loginAddress=${loginAddress}`);
  }

  followUser(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'Social/followSave/', data);
  }

  unFollowUser(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'Social/unfollowSave/', data);
  }

  saveNewsLetter(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'Social/newsLetterSave/', data);
  }

  getUser(loginAddress: string): Observable<any> {
    return this.httpClient.get(environment.apiUrl + `api/getUser?walletAddress=${loginAddress}`);
  }

  likedNft(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + `Social/likedSave`, data);
  }

  unlikeNft(data: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + `Social/unlikedSave`, data);
  }

  getRequest(url:any){
    return this.httpClient.get(environment.apiUrl+url);
  }

}
