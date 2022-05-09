import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-import-collection',
  templateUrl: './import-collection.component.html',
  styleUrls: ['./import-collection.component.scss'],
})
export class ImportCollectionComponent implements OnInit {
  myCollection: any = [];
  isLoading: any = false;

  constructor(private homeService: HomeService, private router: Router, public dialogRef: MatDialogRef<ImportCollectionComponent>) {}

  ngOnInit(): void {}

  get formControls() {
    return this.importForm.controls;
  }

  importForm = new FormGroup({
    contractaddress: new FormControl('', Validators.required),
  });

  saveOtherCollectionsList(contractaddress: any) {
    console.warn(contractaddress.contractaddress);

    this.homeService
      .getOtherCollections(contractaddress.contractaddress)
      .subscribe((response: any) => {
        this.myCollection = response.data;
      });

    this.isLoading = true;
    this.homeService.getCollectionId().subscribe((response: any) => {
      console.warn('9999999999999999999999999999999999999');
      console.warn(response.data.collectionName);

      this.router.navigate(['/mycollection/collection', response.data.collectionName]);

      // login successful so redirect to return url
      //this.router.navigateByUrl('collection/'+response.data);
    });
    this.isLoading = false;
  }

  close(): void {
    this.dialogRef.close();
  }

}
