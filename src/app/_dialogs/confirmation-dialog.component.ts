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
      <button mat-button color="primary" [matDialogClose]="false">No</button>
      <button mat-button color="warn" [matDialogClose]="true">Yes</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialogComponent {
  dialogContent: IDialogData = {
    title: 'Confirmation',
    description: 'Are you sure you want to clear the page?',
  };
}
