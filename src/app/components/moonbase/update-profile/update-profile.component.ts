import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common'
import { GetDataService } from 'src/app/services/get-data.service';
import { ContractService } from 'src/app/services/contract.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  imagePath: string = "";
  submitted: boolean = false;
  referralAddress: string = "";

  updateProfile: FormGroup = new FormGroup({
    name: new FormControl(),
    customUrl: new FormControl(),
    bio: new FormControl(),
    twitterUsername: new FormControl(),
    portfolioWebsite: new FormControl(),
    emailId: new FormControl(),

  });
  isButtonDisabled: boolean = false;
  isUploadButtonDisabled: boolean = false;
  imageUrl: string = "";
  updateBtnText: string = "Update profile";
  userDetails: any;
  userAddress: any;
  constructor(private toastrService: ToastrService,
     private location: Location,
      private formBuilder: FormBuilder,
       private getDataService: GetDataService,
        private cs: ContractService,
        private route: Router)
         { }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.updateProfile = this.formBuilder.group({
      name: [null, Validators.required],
      customUrl: [null, Validators.required],
      bio: ['', Validators.required],
      twitterUsername: [''],
      portfolioWebsite: [''],
      emailId: ['', Validators.email],
      facebook: [''],
      discord: ['']
    })

    this.cs.getWalletObs().subscribe((data: any) => {
      this.userAddress = data;
      console.log(this.cs.checkValidAddress(this.userAddress))
      if (!this.cs.checkValidAddress(this.userAddress)) {
        this.route.navigate(['connect']);
      }
      else {
        this.fetchData();
      }
    });





  }

  back() {
    this.location.back()
  }

  get name() {
    return this.updateProfile.get('name');
  }


  setValidators() {
    this.updateProfile.get('name')?.clearValidators();
    this.updateProfile.get('bio')?.clearValidators();
    this.updateProfile.get('twitterUsername')?.clearValidators();
    this.updateProfile.get('portfolioWebsite')?.clearValidators();
    this.updateProfile.get('emailId')?.setValidators([Validators.email]);
    this.updateProfile.get('facebook')?.clearValidators();
    this.updateProfile.get('discord')?.clearValidators();

    this.updateProfile.get('name')?.updateValueAndValidity();
    this.updateProfile.get('bio')?.updateValueAndValidity();
    this.updateProfile.get('twitterUsername')?.updateValueAndValidity();
    this.updateProfile.get('portfolioWebsite')?.updateValueAndValidity();
    this.updateProfile.get('emailId')?.updateValueAndValidity();
    this.updateProfile.get('facebook')?.updateValueAndValidity();
    this.updateProfile.get('discord')?.updateValueAndValidity();

  }

  fetchData() {
    this.getDataService.getUserDetails(this.userAddress, null).subscribe((response: any) => {
      this.userDetails = response.data[0];

      this.setInitialDataForUser();
    })
  }

  setInitialDataForUser() {
    this.updateProfile.controls.name.setValue(this.userDetails.name);
    this.updateProfile.controls.customUrl.setValue(this.userDetails.customUrl);
    this.updateProfile.controls.bio.setValue(this.userDetails.bio);
    this.updateProfile.controls.portfolioWebsite.setValue(this.userDetails.portfolioWebsite);
    this.updateProfile.controls.emailId.setValue(this.userDetails.emailId);
    this.updateProfile.controls.twitterUsername.setValue(this.userDetails.twitterUsername);
    this.updateProfile.controls.facebook.setValue(this.userDetails.facebook)
    this.updateProfile.controls.discord.setValue(this.userDetails.discord)
    this.userAddress;
    this.imagePath = this.userDetails.profilePic;
    this.referralAddress = this.userDetails.referralAddress
  }



  onLogoFile(event: any) {
    this.isUploadButtonDisabled = true;
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result?.toString() ?? "";
      };
      this.isButtonDisabled = true;
      this.getDataService.uploadProfilePic(file)
        .subscribe(
          (response: any) => {
            this.isUploadButtonDisabled = false;
            let data = response;
            if (data.isSuccess) {
              this.imagePath = data.data.path;
            }
            else {
              this.imagePath = "";
            }

          },
          error => {
            this.isButtonDisabled = false;
            this.imagePath = "";
          });
    }
  }

  get f() {
    return this.updateProfile.controls;
  }

  async updateProfileSubmit() {

    this.submitted = true;
    this.setValidators();

    if (this.updateProfile.valid) {

      var formData = {
        name: this.updateProfile.controls.name.value,
        customUrl: this.updateProfile.controls.customUrl.value,
        bio: this.updateProfile.controls.bio.value,
        portfolioWebsite: this.updateProfile.controls.portfolioWebsite.value,
        emailId: this.updateProfile.controls.emailId.value,
        facebook: this.updateProfile.controls.facebook.value,
        discord: this.updateProfile.controls.discord.value,
        walletAddress: this.userAddress,
        profilePic: this.imagePath,
        lodingProPic: "./../../assets/img/WPngtreectoruserssicon3762775.png"
      };
      this.updateBtnText = "Signing message...";
      var signature = await this.cs.signMsgForUpdateProfile(formData);
      if (signature) {
        this.updateBtnText = "Saving Data..."
        var formDataWithSignature = {
          name: this.updateProfile.controls.name.value,
          customUrl: this.updateProfile.controls.customUrl.value,
          bio: this.updateProfile.controls.bio.value,
          portfolioWebsite: this.updateProfile.controls.portfolioWebsite.value,
          emailId: this.updateProfile.controls.emailId.value,
          walletAddress: this.userAddress,
          profilePic: this.imagePath,
          twitterUsername: this.updateProfile.controls.twitterUsername.value,
          facebook: this.updateProfile.controls.facebook.value,
          discord: this.updateProfile.controls.discord.value,
          signature: signature
        };
        this.getDataService.updateProfile(formDataWithSignature)
          .subscribe(
            response => {
              var data = response;
              this.toastrService.success("Profile updated successfully...")
              this.updateBtnText = "Update Profile";
            });
      }
      else {
        this.updateBtnText = "Update Profile";
        this.toastrService.error("Signature cancelled");
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

}
