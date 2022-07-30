import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GetDataService } from 'src/app/services/get-data.service';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import blockchainjson from '../../../../../../assets/blockchainjson/blockchain.json'

@Component({
  selector: 'app-import-collection',
  templateUrl: './import-collection.component.html',
  styleUrls: ['./import-collection.component.scss'],
})
export class ImportCollectionComponent implements OnInit {
  myCollection: any = [];
  isLoading: any = false;
  blockchainArray = blockchainjson[environment.configFile];
  constructor(private homeService: HomeService, private router: Router, public dialogRef: MatDialogRef<ImportCollectionComponent>,
    private getDataService: GetDataService) { }

  ngOnInit(): void { }

  get formControls() {
    return this.importForm.controls;
  }

  importForm = new FormGroup({
    contractaddress: new FormControl('', Validators.required),
    blockchainId:new FormControl(1)
  });

  saveOtherCollectionsList(contractaddress: any) {
    console.warn(contractaddress.contractaddress);
    this.isLoading = true;
    this.homeService
      .getOtherCollections(contractaddress.contractaddress,contractaddress.blockchainId)
      .subscribe((response: any) => {
        this.getDataService.showToastr('Imported successfully it will take some time to reflect.',true)
        this.myCollection = response.data;
      });

   
    setTimeout(() => {
      this.dialogRef.close();
      this.isLoading = false;
    }, 5000);
    }

  close(): void {
    this.dialogRef.close();
  }

}
