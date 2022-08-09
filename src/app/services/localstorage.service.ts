import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  store(key:string,content:any) {
    localStorage.setItem(key, content);
  }

  retrieve(key:string) {
    let storedKey: any = localStorage.getItem(key);
    if (!storedKey) {
      storedKey='not found';
    };
    return storedKey;
  }

  remove(key:string){
    let storedKey: any = localStorage.getItem(key);
    if (!storedKey) {
      return;
    };
    localStorage.removeItem(key);
  }

  
}
