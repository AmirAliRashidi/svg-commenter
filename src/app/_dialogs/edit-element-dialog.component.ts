import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IElementData } from '../_interfaces/element-label.interface';
import { IDialogData } from '../_interfaces/dialog-data-interface';

@Component({
  selector: 'app-edit-element-dialog',
  template: `
    <h2 mat-dialog-title>{{ dialogContent.title }}</h2>
    <mat-dialog-content>
      <mat-form-field style="width: 100%;">
        <mat-label>Label Color</mat-label>
        <input matInput [(ngModel)]="data.elementForm.id" />
      </mat-form-field>
      <mat-form-field style="width: 100%;">
        <mat-label>Label Color</mat-label>
        <input
          matInput
          [ngxMatColorPicker]="colorpicker"
          [(ngModel)]="data.elementForm.color"
        />
        <ngx-mat-color-toggle matSuffix [for]="colorpicker">
        </ngx-mat-color-toggle>
        <ngx-mat-color-picker #colorpicker color="primary">
        </ngx-mat-color-picker>
      </mat-form-field>
      <app-label-chart></app-label-chart>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" [matDialogClose]="false">
        <mat-icon>cancel</mat-icon>
        Cancel
      </button>
      <button
        mat-raised-button
        color="primary"
        [matDialogClose]="true"
        [disabled]="
          !data.elementForm.color ||
          !data.elementForm.id ||
          data.elementForm.id === ''
        "
      >
        <mat-icon>check_circle</mat-icon>
        Enble Action
      </button>
    </mat-dialog-actions>
  `,
})
export class EditElementDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { elementForm: IElementData }
  ) {}
  dialogContent: IDialogData = {
    title: 'Edit Element',
  };
}
