import { Component } from '@angular/core';

import { IDialogData } from '../_interfaces/dialog-data-interface';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ dialogContent.title }}</h2>
    <mat-dialog-content>
      <p>{{ dialogContent.description }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" [matDialogClose]="false">
        <mat-icon>cancel</mat-icon>
        No
      </button>
      <button mat-raised-button color="warn" [matDialogClose]="true">
        <mat-icon>check_circle</mat-icon>
        Yes
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialogComponent {
  dialogContent: IDialogData = {
    title: 'Confirmation',
    description: 'Are you sure you want to clear the page?',
  };
}
