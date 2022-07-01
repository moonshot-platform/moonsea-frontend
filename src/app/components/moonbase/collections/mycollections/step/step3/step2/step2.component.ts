import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  collectionName: any = "";
  collectionId: any;
  imageUploadignStatus: boolean = false;
  uploadBatchCnt = 0;
  collectionDetails: any = {};
  imDoneUploadingButton: boolean;
  isImgLoaded: boolean = false;
  progressValue: any;
  cnt = 0;
  isApiLoading: boolean;
  signature: any;

  constructor(
    private createNFTService: CreateNftService,
    private toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private _getDataService: CollectionApiService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(
      (res: any) => {
        this.collectionName = res.collectionName;
        this.collectionId = res.collectionId;
      }
    );
    this.signature = sessionStorage.getItem('createCollectionSignature');
    this.getCollectionDetails();
  }



  getCollectionDetails() {
    this.ngxLoader.start();
    let url = 'api/getCollectionDetails?collectionId=' + this.collectionId;
    this._getDataService.getRequest(url).subscribe((res: any) => {
      if (res.status == 200) {
        this.ngxLoader.stop();
        this.collectionDetails = res.data;
        this.imageUrl = this.collectionDetails.fileUrl;
      } else {
        this.ngxLoader.stop();
      }
    }, (err: any) => {
      this.ngxLoader.stop();
    })
  }

  onLogoFile(event: any) {
    this.imageUploadignStatus = true;
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;


    this.uploadFiles();
  }

  forloopend: boolean;

  uploadFiles(): void {
    this.imDoneUploadingButton = true;
    this.forloopend = false;
    this.message = [];
    debugger
    if (this.selectedFiles) {
      
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if ((this.selectedFiles[i].type == 'video/mp4' && this.selectedFiles[i].size / 1024 < 50000) || ((this.selectedFiles[i].type == 'image/jpeg' ||
          this.selectedFiles[i].type == 'image/png' ||
          this.selectedFiles[i].type == 'image/jpg' ||
          this.selectedFiles[i].type == 'image/gif' ||
          this.selectedFiles[i].type == 'image/webp') && this.selectedFiles[i].size / 1024 < 5000)) {


          this.upload(i, this.selectedFiles[i]);

        } else {
          if(this.selectedFiles[i].type == 'video/mp4'){
          //50mb  
          this.toastr.error(`item ${this.selectedFiles[i].name} exceeds the file upload limit`);
          }else{
            //5mb
            this.toastr.error(`item ${this.selectedFiles[i].name} exceeds the file upload limit`);
          }
          
        }


      }

    }
  }

  delay(ms: any) {
    return new Promise((resolve, reject) => { setTimeout(resolve, ms) })
  }

  upload(idx: number, file: any): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    if (file) {

      this.createNFTService.collectionWiseNftSave(file, this.collectionName, this.signature).subscribe(
        async (event: any) => {


          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(
              (100 * event.loaded) / event.total
            );
            // console.log("idx=>"+idx+"==>  "+this.progressInfos[idx].value);


            if (this.progressInfos[idx].value === 100) {
              this.cnt++;
            }

            this.progressValue = (this.cnt / this.selectedFiles.length) * 100;

          } else if (event instanceof HttpResponse) {
            //  console.log(event);
            //  console.log(event.body.status);
              if(event.body.status == 200){
                if (idx == this.selectedFiles.length - 1) {
                  this.isApiLoading = true;
                  this.toastr.success('upload completed');
                  this.imageUploadignStatus = false;
                  this.uploadBatchCnt++;
                  this.imDoneUploadingButton = false;
                  this.isApiLoading = false;
                }
    
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  this.progressInfos[idx].imagePath = reader.result;
                };
    
                file.imagePath = event.body.data.path;
    
                const msg = 'Uploaded the file successfully: ' + file.name;
                this.message.push(msg);
              }else{
                this.toastr.success('Something went wrong');
                this.imDoneUploadingButton = false;
              }
           
          }
          // console.log(event);

        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
          this.imDoneUploadingButton = false;

        }
      );
    }
  }

  gotoTab3() {
    this.createNFTService.subject.next({ tabIndex: 3, collectionId: this.collectionId })
  }
}