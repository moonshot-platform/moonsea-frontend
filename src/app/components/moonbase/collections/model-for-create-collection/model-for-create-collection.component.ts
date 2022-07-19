import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-model-for-create-collection',
  templateUrl: './model-for-create-collection.component.html',
  styleUrls: ['./model-for-create-collection.component.scss']
})
export class ModelForCreateCollectionComponent implements OnInit {
  mintStatusText:any='Submit';
  isApiLoading:boolean=false;
  startSaleButton:any ='Submit';
  signSellorderButton:any = "submit";
  constructor(public dialogRef: MatDialogRef<ModelForCreateCollectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  closePopupSignature(){
    this.dialogRef.close();
  }
}
