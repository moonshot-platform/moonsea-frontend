import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetDataService } from 'src/app/services/get-data.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { DatePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { ContractService } from 'src/app/services/contract.service';
import { ModalForCreateNftComponent } from '../modal-for-create-nft/modal-for-create-nft.component';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent implements OnInit {
  @ViewChild('ejDatePicker') ejDatePicker: DatePickerComponent | undefined;
  public targetElement: HTMLElement | undefined;

  isApiLoading: boolean = false;
  isSubmitted = false;
  Address : any;
  categotyList: any;
  collectionId :any ;
  imagePath :any =''; 
  collectionDetails = 1;
  socialLinks = false;
  nftDetails = false;
  dateValue: Date = new Date();
  typeOfNft :any = 'single';

  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<CreateCollectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private createNFT:CreateNftService,
    private getDataService:GetDataService,private formbuider:FormBuilder,
    private cs: ContractService,) { 
    }
   
    imageUrl = "";
    isSuccess = false;

  ngOnInit(): void {

    this.Address =  localStorage.getItem('address');
    this.getCategotyList();

    if(Object.keys(this.data).length > 0){
      // console.log(Object.keys(this.data).length === 0);
      
      this.collectionId =  this.data.collectionId;
      this.imagePath = this.data.fileUrl;
      this.addCollectionForm.patchValue(
        {
          file:this.imagePath,
          tokenName :this.data.collectionName,
          symbol :this.data.symbol,
          description :this.data.description,
          categoryId :this.data.categoryId,
          yourSite :this.data.yourSite,
          discord :this.data.discord,
          twitter :this.data.twitter,
          instagram :this.data.instagram,
          medium :this.data.medium,
          telegram :this.data.telegram,
          royalties :this.data.royalties

        }
      )
      
    }
  }

  get formControls() { return this.addCollectionForm.controls; }

  addCollectionForm = this.formbuider.group(
    {
      // file : new FormControl(''),
      tokenName : ['',[Validators.required]],
      symbol : [''],
      description : ['',[Validators.required]],
      categoryId : [''],
      yourSite :[''],
      discord :[''],
      twitter :[''],
      instagram :[''],
      medium :[''],
      telegram :[''],
      royalties : ['',[Validators.required,Validators.pattern("^[0-9]{1,2}?$")]],
      // nft
      "descriptionNFT" :['',[Validators.required]],
      "size" :[''],
      "isForSale" :[''],
      "typeOfSale" :[''],
      "fixedPrice" : ['',[Validators.required]],
      "minimunBid" : ['',[Validators.required]],
      "startingDate" :['',[Validators.required]],
      "expirationDate" :['',[Validators.required]],
      "properties" : [''],


    }
  )
  
  saveCollection(data:any)
  {
    // debugger
    console.warn(data);
    this.isApiLoading = true;
    this.isSubmitted = true;
   
    data.nftId = this.data.ID;
    data.walletAddress = this.Address;
    data.fileUrl = this.imagePath;
    

    if(!this.collectionId){
      this.createNFT.addCollection(
        data
      ).subscribe((result:any)=>
      {
  
        if(result.isSuccess)
        {
          this.dialogRef.close();
        }
        this.isSuccess = result.isSuccess;
        this.getDataService.showToastr(result.message,result.isSuccess);
        this.isApiLoading = false;
      });
    }else{
      let url = "api/updateCollectionSave";
      this.createNFT.postRequest(url,data).subscribe(
        (res:any)=>{
          console.log(res);
          if(res.status == 200){
            this.getDataService.showToastr(res.message,res.isSuccess);
            this.isApiLoading = false;
          }else{
            this.getDataService.showToastr(res.message,res.isSuccess);
            this.isApiLoading = false;
          }
          
        }
      )
    }

    

  }

  close(): void {
    this.dialogRef.close();
  } 
  imageErrorMsg:boolean;

  onLogoFile(event: any) {  
    
    this.imageErrorMsg = false;
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      this.createNFT.uploadFile(file)
        .subscribe(
          (response:any) => {
            let data=response;
            console.log(data);


            if (response.type === HttpEventType.UploadProgress) {
             
            } else if (response instanceof HttpResponse) {
             if(response.body.isSuccess){
              this.imageErrorMsg = false;
                this.imagePath=response.body.data.path;
             }else{
              this.imageErrorMsg = true;
                this.imagePath="";
             }
            }
           },
          (error:any) => {
            this.imageErrorMsg = true;
            this.imagePath="";
          });
    }
  }

  getCategotyList()
  {
    
      this.createNFT.getCategotyList().subscribe((response:any)=>
        {
          if(response.isSuccess)
          {
            this.categotyList = response.data;
          }
        }
      );
     
  }

  isShowNameValidation :boolean = false;

  checkCollectionName(){
    console.log(this.addCollectionForm.controls['tokenName'].value.length);
    let body = {
      "collectionName":this.addCollectionForm.controls['tokenName'].value
    };

    let url = "api/checkCollectionNameValidation";
    if(this.addCollectionForm.controls['tokenName'].value.length >= 3){
    this.createNFT.postRequest(url,body).subscribe(
      (res:any)=>{
        console.log(res);
        if(res.status == 200){
          this.isShowNameValidation = true;
        }else{
          this.isShowNameValidation = false;
        }
      }
    );
    }else{
      this.isShowNameValidation = false;
    }
    
  }

  collectionDetailsFunc() {
    this.collectionDetails++;
  }

  prev() {
    this.collectionDetails--;
  }


  openDialogSubmitNFT(data: any): void {
    
    const dialogRef = this.dialog.open(ModalForCreateNftComponent, {
      width: 'auto',
      disableClose: true,
      data: {
        details: data,
        globalService: this.cs,
        typeOfNft: this.typeOfNft,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }
  
}
