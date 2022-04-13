import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/services/home.service';
import { ContractService } from 'src/app/services/contract.service';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { CreateCollectionComponent } from '../../create-nft/create-collection/create-collection.component';
import { ImportCollectionComponent } from './import-collection/import-collection.component';

@Component({
  selector: 'app-mycollections',
  templateUrl: './mycollections.component.html',
  styleUrls: ['./mycollections.component.scss']
})
export class MycollectionsComponent implements OnInit {

  myCollection: any =[];
  connectedAddress: any;
  isShowMatspinner = 'hide';
  showerrormsg = 'hide';
  isUploadButtonDisabled: boolean = false;
  imageUrl: string = 'https://moonboxes.io/assets/media/images/astro_painter.svg';
  imagePath: any;

  constructor(private route:Router,
    private location: Location,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private homeService: HomeService,
    private cs: ContractService,
    private createNFTService: CreateNftService) { }

  ngOnInit(): void {
    
    this.cs.getWalletObs().subscribe((data: any) => {
      this.connectedAddress = data;
      this.getmyCollectionList();

    });
  }

  createSignleNFT()
  {
    this.route.navigate(['createNft/type','single']);
  }

  createMultipleNFT()
  {
    this.route.navigate(['createNft/type','multiple']);
  }

  goBack(): void {
    this.location.back();
  }

  openDialogCreateCollection(): void {
    let isWalletConnected ;
    isWalletConnected  =  localStorage.getItem('wallet')
    if( isWalletConnected == 1){
      const dialogRef = this.dialog.open(CreateCollectionComponent, {
        width: 'auto',
        data: {
        }
      });
      dialogRef.afterClosed().subscribe(result => {
      
      });
    }else{
      this.toastr.error("please connect the wallet...");
    }
   
  }

  getmyCollectionList() {

    this.homeService.myCollectionList(this.connectedAddress).subscribe((response: any) => {
      if(response.status == 200){
        for (let i = 0; i < response.data.length; i++) {
          for (let j = 0; j < response.data[i].nftDetailsList.length; j++) {
            response.data[i].nftFileUrl01 =
              response.data[i].nftDetailsList[0].nftFileUrl;
            response.data[i].nftTokenID01 =
              response.data[i].nftDetailsList[0].nftTokenID;
            response.data[i].nftAddress =
              response.data[i].nftDetailsList[0].nftAddress;
          }
        }
  
        this.myCollection = response.data;
        console.log("%%%%%=>",this.myCollection);
          
      }
     
    });
  }

  edit(item:any){
   
    const dialogRef = this.dialog.open(CreateCollectionComponent, {
      width: 'auto',
      data:item
    });
    dialogRef.afterClosed().subscribe(result => {
    
    });
  }


  onLogoFile(event: any) {
    this.showerrormsg = 'hide';
    this.isShowMatspinner = 'show';
    this.isUploadButtonDisabled = true;
    const file: File = event.target.files[0];
    console.log(file.size /1024);
    if((file.size / 1024) < 5000){
      if (
        file.type == 'image/jpeg' ||
        file.type == 'image/png' ||
        file.type == 'image/jpg' ||
        file.type == 'video/mp4' ||
        file.type == 'image/gif'
      ) {
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
  
          reader.onload = (event) => {
            this.imageUrl = reader.result?.toString() ?? '';
            // console.log("this.imageUrl===>",this.imageUrl);
            
          };
          this.createNFTService.uploadFile(file).subscribe(
            (response: any) => {
              this.isUploadButtonDisabled = false;
              if (response.isSuccess) {
                this.isShowMatspinner = 'hide';
                this.imagePath = response.data.path;
              } else {
                this.showerrormsg = 'show';
                this.isShowMatspinner = 'hide';
                this.imagePath = '';
              }
            },
            (error: any) => {
              this.isShowMatspinner = 'hide';
              this.showerrormsg = 'show';
              this.isUploadButtonDisabled = false;
              this.imagePath = '';
            }
          );
        }
      } else {
        this.toastr.error('please check file format....');
        this.isShowMatspinner = 'hide';
      }
    }else{
      this.toastr.error('file size should be less than 5mb');
      this.isShowMatspinner = 'hide';
      this.imagePath = '';
    }
  }

  importcollection() {
    const dialogRef = this.dialog.open(ImportCollectionComponent, {
      width: 'auto',
    });
  }

}

