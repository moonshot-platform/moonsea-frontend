import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CollectionApiService } from 'src/app/services/collection-api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  failedBlockList:any=[];
  displayedColumns: string[] = ['Failed Block No', 'Date', 'Blockchain'];
  constructor(
    private dataServices: CollectionApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.getBlockFailedList();
  }

  getBlockFailedList(){
    this.dataServices.getRequest('admin/getFailBlockReport').subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.status == '200'){
          this.failedBlockList = res.data;
        }
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }

  logOut(){
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/admin'])
  }
}
