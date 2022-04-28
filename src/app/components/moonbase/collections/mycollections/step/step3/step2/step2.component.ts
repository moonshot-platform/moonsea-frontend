import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
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

  constructor(
    private createNFTService: CreateNftService,
    private toastr: ToastrService,
    private _activatedRoute : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(
      (res:any)=>{
        this.collectionName = res.collectionName;
        this.collectionId = res.collectionId;
      }
    )
  }

  // onLogoFile(event: any) {
  //   this.showerrormsg = 'hide';
  //   this.isShowMatspinner = 'show';
  //   this.isUploadButtonDisabled = true;
  //   const file: File = event.target.files[0];
  //   console.log(file.size / 1024);
  //   if (file.size / 1024 < 5000) {
  //     if (
  //       file.type == 'image/jpeg' ||
  //       file.type == 'image/png' ||
  //       file.type == 'image/jpg' ||
  //       file.type == 'video/mp4' ||
  //       file.type == 'image/gif'
  //     ) {
  //       if (file) {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file);

  //         reader.onload = (event) => {
  //           this.imageUrl = reader.result?.toString() ?? '';
  //           // console.log("this.imageUrl===>",this.imageUrl);
  //         };
  //         this.createNFTService.uploadFile(file).subscribe(
  //           (response: any) => {
  //             this.isUploadButtonDisabled = false;
  //             if (response.isSuccess) {
  //               this.isShowMatspinner = 'hide';
  //               this.imagePath = response.data.path;
  //             } else {
  //               this.showerrormsg = 'show';
  //               this.isShowMatspinner = 'hide';
  //               this.imagePath = '';
  //             }
  //           },
  //           (error: any) => {
  //             this.isShowMatspinner = 'hide';
  //             this.showerrormsg = 'show';
  //             this.isUploadButtonDisabled = false;
  //             this.imagePath = '';
  //           }
  //         );
  //       }
  //     } else {
  //       this.toastr.error('please check file format....');
  //       this.isShowMatspinner = 'hide';
  //     }
  //   } else {
  //     this.toastr.error('file size should be less than 5mb');
  //     this.isShowMatspinner = 'hide';
  //     this.imagePath = '';
  //   }
  // }

  onLogoFile(event: any) {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
   
    this.uploadFiles();
  }

  forloopend :boolean;

  uploadFiles(): void {
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
          //  console.log(event);
           if(idx == this.selectedFiles.length -1){
            this.toastr.success('upload completed ....');
          }
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