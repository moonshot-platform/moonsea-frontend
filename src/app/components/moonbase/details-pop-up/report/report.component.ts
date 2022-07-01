import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-report',
  template: ` Say {{ message }} `,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @Input() ID: any;

  isSubmitted: boolean = false;
  isSuccess: any;
  errorMsg: any;
  Address: any;
  isApiLoading: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getDataService: GetDataService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.Address = localStorage.getItem('address');
  }
  close(): void {
    this.dialogRef.close();
  }

  get formControls() {
    return this.reportform.controls;
  }

  reportform = new FormGroup({
    message: new FormControl('', Validators.required),
  });

  reportSave(data: any) {
    this.isApiLoading = true;
    this.isSubmitted = true;

    data.nftId = this.data.ID;
    data.walletAddress = this.Address;

    this.getDataService.reportSave(data,this.data.nftAddress,this.data.blockchainId).subscribe((result: any) => {
      if (!result.isSuccess) {
        this.isSuccess = result.isSuccess;
        this.errorMsg = result.message;

        this.toastrService.success(result.message);
        this.isApiLoading = false;
        this.dialogRef.close();
      } else {
        this.isSuccess = result.isSuccess;
        this.errorMsg = result.message;
        this.isApiLoading = false;
        this.toastrService.success(result.message);
      }
    });
  }
}
