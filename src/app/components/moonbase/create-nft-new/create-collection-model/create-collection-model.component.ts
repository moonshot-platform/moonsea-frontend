import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-create-collection-model',
  templateUrl: './create-collection-model.component.html',
  styleUrls: ['./create-collection-model.component.scss']
})
export class CreateCollectionModelComponent implements OnInit {
  collection:FormGroup;

  constructor(  public dialogRef: MatDialogRef<CreateCollectionModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder) { }

  ngOnInit(): void {
    this.collection = this.fb.group({
      collectionName :[''],
      collectionDescription : [''],
      nftDescription:[''],
      royalties:[''],
      size : [''],
      properites:[''],
      typeofnft:[''],
    })
  }

}
