import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetDataService } from 'src/app/services/get-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateNftService } from 'src/app/services/create-nft.service';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent implements OnInit {
  isApiLoading: boolean = false;
  isSubmitted = false;
  Address : any;
  categotyList: any;

  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<CreateCollectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private createNFT:CreateNftService,
    private getDataService:GetDataService) { }
    imagePath =  "";
    imageUrl = "";
    isSuccess = false;

  ngOnInit(): void {
    this.Address =  localStorage.getItem('address');
    this.getCategotyList();
  }

  get formControls() { return this.addCollectionForm.controls; }

  addCollectionForm = new FormGroup(
    {
      file : new FormControl('',Validators.required),
      tokenName : new FormControl('',Validators.required),
      symbol : new FormControl('',Validators.required),
      description : new FormControl('',Validators.required),
      categoryId : new FormControl('',Validators.required),
      yourSite : new FormControl(),
      discord : new FormControl(),
      twitter : new FormControl(),
      instagram : new FormControl(),
      medium : new FormControl(),
      telegram : new FormControl(),
      royalties : new FormControl('',[Validators.required,Validators.pattern("^[0-9]{1,2}?$")]) 
    }
  )
  
  saveCollection(data:any)
  {
    console.warn(data);
    this.isApiLoading = true;
    this.isSubmitted = true;
   
    data.nftId = this.data.ID;
    data.walletAddress = this.Address;
    data.fileUrl = this.imagePath;
    
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

  }

  close(): void {
    this.dialogRef.close();
  }

  onLogoFile(event: any) {  
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      this.createNFT.uploadFile(file)
        .subscribe(
          (response:any) => {
            let data=response;
            if(data.isSuccess){
              this.imagePath=data.data.path;
            }
            else
            {
              this.imagePath="";
            }
           },
          (error:any) => {
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

}
