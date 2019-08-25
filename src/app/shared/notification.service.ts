import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {
  }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  successMessage(message: string) {
    this.config['panelClass'.toString()] = ['notification', 'success'];
    this.snackBar.open(message, '', this.config);
  }

  warnMessage(message: string) {
    this.config['panelClass'.toString()] = ['notification', 'warn'];
    this.snackBar.open(message, '', this.config);
  }
}
