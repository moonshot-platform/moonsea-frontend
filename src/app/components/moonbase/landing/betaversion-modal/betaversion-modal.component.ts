import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-betaversion-modal',
  templateUrl: './betaversion-modal.component.html',
  styleUrls: ['./betaversion-modal.component.scss']
})
export class BetaversionModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<BetaversionModalComponent>) { }

  ngOnInit(): void {
  }
  
  continue(){
    this.dialogRef.close();
  }
  feedback(){
    window.open('https://t.me/MoonShotChat','_black')
  }
}
