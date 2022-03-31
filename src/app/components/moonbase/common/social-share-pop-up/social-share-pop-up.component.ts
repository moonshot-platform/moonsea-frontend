import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateCollectionComponent } from '../../create-nft/create-collection/create-collection.component';

@Component({
  selector: 'app-social-share-pop-up',
  templateUrl: './social-share-pop-up.component.html',
  styleUrls: ['./social-share-pop-up.component.scss']
})
export class SocialSharePopUpComponent implements OnInit {

  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<SocialSharePopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
