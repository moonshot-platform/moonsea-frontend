import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CollectionApiService } from 'src/app/services/collection-api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  bannerList: any = [];
  bannerIndex: any;
  path: any = '';
  bannerSave: FormGroup;

  currency: FormGroup;
  constructor(
    private dataServices: CollectionApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.bannerSave = this.formBuilder.group({
      bannerName: ['', Validators.required],
      fileUrl: [''],
      bannerImage: ['', Validators.required],
    });

    this.currency = this.formBuilder.group({
      name: ['', Validators.required],
      image: [''],
      contractAddress: ['', Validators.required],
      decimals: ['', Validators.required],
      currencuImage: ['', Validators.required],
    });

    this.getBanerList();
  }

  getBanerList() {
    this.bannerList = [];
    const url = 'admin/getBannerList';
    this.dataServices.getRequest(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.bannerList = res.data;
          this.bannerIndex = this.bannerList.length - 1;
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getImagePath(event) {
    const file = event.target.files[0];
    const fomdata = new FormData();
    fomdata.append('file', file);
    const url = 'admin/uploadBannerImage';
    this.dataServices.uploadCover(fomdata, url).subscribe((res: any) => {
      if (res.status == 200) {
        this.toastr.success('Successfully uploaded');
        this.path = res.data.path;
        this.bannerSave.controls['fileUrl'].setValue(this.path);
        // console.log(this.bannerSave.value);
      }
    });
  }

  onSubmit() {
    const url = 'admin/bannerSave';
    const data = {
      bannerName: this.bannerSave.value.bannerName,
      fileUrl: this.bannerSave.value.fileUrl,
    };

    this.dataServices.postRequest(data, url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.bannerSave.reset();
          this.bannerSave.get('bannerName').clearValidators();
          this.bannerSave.get('bannerName').updateValueAndValidity();
          this.bannerSave.get('bannerImage').clearValidators();
          this.bannerSave.get('bannerImage').updateValueAndValidity();
          this.toastr.success(res.message);
          this.getBanerList();
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addCurrencyImage(event) {
    const file = event.target.files[0];
    const fomdata = new FormData();
    fomdata.append('file', file);

    const url = 'admin/uploadCurrencyImage';
    this.dataServices.uploadCover(fomdata, url).subscribe((res: any) => {
      if (res.status == 200) {
        this.toastr.success('Successfully Uploaded');
        this.currency.controls['image'].setValue(res.data.path);
      } else {
        this.toastr.error('Something Went Wrong');
      }
    });
  }

  onSubmitCurrency() {
    const data = {
      name: this.currency.value.name,
      image: this.currency.value.image,
      contractAddress: this.currency.value.contractAddress,
      decimals: this.currency.value.decimals,
    };

    const url = 'admin/addCurrency';
    this.dataServices.postRequest(data, url).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == 200) {
          // -----remove Validation error after submit form ----//
          this.currency.reset();
          this.currency.get('name').clearValidators();
          this.currency.get('name').updateValueAndValidity();
          this.currency.get('contractAddress').clearValidators();
          this.currency.get('contractAddress').updateValueAndValidity();
          this.currency.get('decimals').clearValidators();
          this.currency.get('decimals').updateValueAndValidity();
          this.currency.get('currencuImage').clearValidators();
          this.currency.get('currencuImage').updateValueAndValidity();
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
