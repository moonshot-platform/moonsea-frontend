import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateCollectionModelComponent } from '../create-collection-model/create-collection-model.component';

@Component({
  selector: 'app-collectioncreation',
  templateUrl: './collectioncreation.component.html',
  styleUrls: ['./collectioncreation.component.scss']
})
export class CollectioncreationComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openModel(){
    const dialogRef = this.dialog.open(CreateCollectionModelComponent, {
      width: '350px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
