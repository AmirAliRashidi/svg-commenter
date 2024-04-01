import { Component, Inject } from '@angular/core';
import { IDialogData } from '../_interfaces/dialog-data-interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IActionLabel } from '../_interfaces/action-label-interface';

@Component({
  selector: 'app-action-modal-dialog',
  template: `
    <h2 mat-dialog-title>{{ dialogContent.title }}</h2>
    <mat-dialog-content>
      <p>{{ dialogContent.description }}</p>
      <mat-form-field appearance="fill">
        <mat-label>Choose an option</mat-label>
        <mat-select [(value)]="data.label.mode">
          <mat-option value="color">Change Color</mat-option>
          <mat-option value="chart">Chart</mat-option>
        </mat-select>
      </mat-form-field>
      <ng-container *ngIf="data.label.mode === 'color'">
        <mat-form-field style="width: 100%;">
          <mat-label>Label ID</mat-label>
          <input matInput [(ngModel)]="data.label.elementID" />
        </mat-form-field>
        <mat-form-field style="width: 100%;">
          <mat-label>Label Color</mat-label>
          <input
            matInput
            [ngxMatColorPicker]="colorpicker"
            [(ngModel)]="data.label.elementColor"
          />
          <ngx-mat-color-toggle matSuffix [for]="colorpicker">
          </ngx-mat-color-toggle>
          <ngx-mat-color-picker #colorpicker color="primary">
          </ngx-mat-color-picker>
        </mat-form-field>
      </ng-container>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" [matDialogClose]="false">
        <mat-icon>cancel</mat-icon>
        Cancel
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="closeDialog()"
        [disabled]="
          !data.label.mode ||
          (data.label.mode === 'color' &&
            (!data.label.elementID || !data.label.elementColor))
        "
      >
        <mat-icon>check_circle</mat-icon>
        Submit
      </button>
    </mat-dialog-actions>
  `,
})
export class ActionModeDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { label: IActionLabel },
    private _dialogRef: MatDialogRef<ActionModeDialogComponent>
  ) {}
  dialogContent: IDialogData = {
    title: 'Label Action',
    description: 'Choose the element action:',
  };
  closeDialog() {
    this._dialogRef.close(this.data.label);
  }
}
