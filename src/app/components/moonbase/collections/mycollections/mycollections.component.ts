import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CreateNftService } from 'src/app/services/create-nft.service';

@Component({
  selector: 'app-mycollections',
  templateUrl: './mycollections.component.html',
  styleUrls: ['./mycollections.component.scss']
})
export class MycollectionsComponent implements OnInit {
  tabIndex :any =1;
  multipleImage:any =[]; 
  constructor(private location: Location,private createNftService:CreateNftService) { }

  ngOnInit(): void {
    this.createNftService.subject.subscribe(
      (res:any)=>{
       this.tabIndex = res.tabIndex; 
      }
    )
  }

  goBack(): void {
    this.location.back();
  }

  addItem(event:any){
    this.multipleImage.push(event);
  }
}