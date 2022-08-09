import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlaceBidModalComponent } from '../../nft-card/place-bid-modal/place-bid-modal.component';
import { checkIsAddress } from '../../shared/check-is-address.directive';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registerForm!:FormGroup;
  submitted = false;
  regBtnText ="Register";
  invalidAddress: boolean=false;
  walletAddress: string="";

  constructor(private toastr: ToastrService,private formBuilder: FormBuilder,private cs:ContractService,private getDataService:GetDataService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    private dialogRef : MatDialogRef<PlaceBidModalComponent>,) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      acceptFirst: ['', Validators.compose([Validators.required])],
      acceptSecond: ['', Validators.compose([Validators.required])],
      referralAddress : ['',checkIsAddress()]
    })
  }

  get f(){
    return this.registerForm.controls;
  }

  async register()
  {
    this.submitted=true;

    if(this.registerForm.valid){
      this.regBtnText="Waiting for signature"
      var signature = await this.cs.signMsgForRegister(this.items.walletAddress);
      this.regBtnText="Submitting data";
      if(signature){
          this.getDataService.registerUser({walletAddress:this.items.walletAddress,
            referralAddress:this.registerForm.controls.referralAddress.value,
            signature:signature})
          .subscribe(
            response => {
              var data=response;
              if(data.isSuccess)
              {
                this.toastr.success(data.message);
                this.closeDialog();
                localStorage.setItem('isRegistered',"true");
                location.href="/";
                this.regBtnText="Register"
              }
              else
              {
                this.toastr.error(data.message);
                this.regBtnText="Register"
              }
            });
          }
          else
          {
            this.regBtnText="Register"
          }
    }

  }

  closeDialog()
  {
    this.dialogRef.close();
  }

}
