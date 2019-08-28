import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {MatConfirmDialogComponent} from '../mat-confirm-dialog/mat-confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {
  }

  openConfirmDialog(msg: string) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      position: {top: '10px'},
      disableClose: true,
      data: {
        message: msg
      }
    });
  }
}
