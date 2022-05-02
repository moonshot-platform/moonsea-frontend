import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { CreateNftService } from 'src/app/services/create-nft.service';


@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {



  @Output() newItemEvent = new EventEmitter<any>();

  isShowMatspinner = 'hide';
  showerrormsg = 'hide';
  isUploadButtonDisabled: boolean = false;
  imageUrl: string =
    'https://moonboxes.io/assets/media/images/astro_painter.svg';
  imagePath: any;
  array = [1, 2, 3];

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  fileInfos?: Observable<any>;
  collectionName : any ="";
  collectionId :any;
  imageUploadignStatus :boolean=false;
  uploadBatchCnt = 0;
  collectionDetails :any = {};
  imDoneUploadingButton:boolean;
  isImgLoaded:boolean = false;


  constructor(
    private createNFTService: CreateNftService,
    private toastr: ToastrService,
    private _activatedRoute : ActivatedRoute,
    private _getDataService : CollectionApiService,
  ) {}

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(
      (res:any)=>{
        this.collectionName = res.collectionName;
        this.collectionId = res.collectionId;
      }
    );

    this.getCollectionDetails();
  }

  

  getCollectionDetails(){
    let url = 'api/getCollectionDetails?collectionId=' + this.collectionId;
    this._getDataService.getRequest(url).subscribe((res:any)=>{
      if(res.status == 200){
        this.collectionDetails = res.data;
        this.imageUrl = this.collectionDetails.fileUrl;
      }
  },(err:any)=>{

  })
  }

  onLogoFile(event: any) {
    this.imageUploadignStatus = true;
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    
    
    this.uploadFiles();
  }

  forloopend :boolean;

  uploadFiles(): void {
    this.imDoneUploadingButton = true;
    this.forloopend = false;
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (this.selectedFiles[i].size / 1024 < 5000) {
          if (
            this.selectedFiles[i].type == 'image/jpeg' ||
            this.selectedFiles[i].type == 'image/png' ||
            this.selectedFiles[i].type == 'image/jpg' ||
            this.selectedFiles[i].type == 'video/mp4' ||
            this.selectedFiles[i].type == 'image/gif'
          ) {
            this.upload(i, this.selectedFiles[i]);
          }else{
            this.toastr.error('please check file format....');
          }
        }else{
          this.toastr.error('file size should be less than 5mb');
        }

        
      }
      
    }
  }

  upload(idx: number, file: any): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    if (file) {

      this.createNFTService.collectionWiseNftSave(file,this.collectionName).subscribe(
        (event: any) => {
         

          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(
              (100 * event.loaded) / event.total
            );
         

          } else if (event instanceof HttpResponse) {
           console.log(event);
           if(idx == this.selectedFiles.length -1){
            this.toastr.success('upload completed ....');
            this.imageUploadignStatus = false;
            this.uploadBatchCnt++;
            this.imDoneUploadingButton = false;
          }

          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.progressInfos[idx].imagePath = reader.result; 
          };

           file.imagePath = event.body.data.path;
           
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
          }
          // console.log(event);
          
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }
      );
    }
  }

  gotoTab3(){
    this.createNFTService.subject.next({tabIndex:3,collectionId:this.collectionId})
  }
}