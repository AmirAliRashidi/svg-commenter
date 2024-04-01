import { Component, Inject } from '@angular/core';
import { IActionLabel } from '../_interfaces/action-label-interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-label-dialog',
  template: `
    <div class="card-container" *ngIf="data.selectedLabel">
      <h2 mat-dialog-title>
        {{
          data.labelActionMode === 'delete'
            ? 'Are you sure you want to delete ' +
              data.selectedLabel.text +
              ' label?'
            : data.selectedLabel.text + 'Actions'
        }}
      </h2>
      <mat-dialog-content>
        <div *ngIf="data.labelActionMode === 'choose'" class="action-buttons">
          <button
            mat-button
            color="accent"
            (click)="data.labelActionMode = 'edit'"
          >
            <mat-icon>edit</mat-icon>
            <span>Edit Label</span>
          </button>
          <button
            mat-button
            color="warn"
            (click)="data.labelActionMode = 'delete'"
          >
            <mat-icon>delete</mat-icon>
            <span>Delete Label</span>
          </button>
        </div>
        <div *ngIf="data.labelActionMode === 'edit'">
          <mat-form-field style="width: 100%;">
            <mat-label>Label Color</mat-label>
            <input
              matInput
              [ngxMatColorPicker]="colorpicker"
              [(ngModel)]="data.selectedLabel.color"
            />
            <ngx-mat-color-toggle matSuffix [for]="colorpicker">
            </ngx-mat-color-toggle>
            <ngx-mat-color-picker #colorpicker color="primary">
            </ngx-mat-color-picker>
          </mat-form-field>
          <mat-form-field style="width: 100%;">
            <mat-label>Label BackGround Color</mat-label>
            <input
              matInput
              [ngxMatColorPicker]="backGroundColorpicker"
              [(ngModel)]="data.selectedLabel.backgroundColor"
            />
            <ngx-mat-color-toggle matSuffix [for]="backGroundColorpicker">
            </ngx-mat-color-toggle>
            <ngx-mat-color-picker #backGroundColorpicker color="primary">
            </ngx-mat-color-picker>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button
          mat-raised-button
          color="primary"
          (click)="data.labelActionMode = 'choose'"
          *ngIf="data.labelActionMode !== 'choose'"
        >
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
        <button mat-raised-button color="warn" [matDialogClose]="false">
          <mat-icon>cancel</mat-icon>
          {{ data.labelActionMode === 'choose' ? 'Close' : 'Cancel' }}
        </button>
        <button
          mat-raised-button
          color="warn"
          *ngIf="data.labelActionMode === 'delete'"
          (click)="closeDialog()"
        >
          <mat-icon>delete</mat-icon>
          Delete
        </button>
        <button
          mat-raised-button
          color="accent"
          *ngIf="data.labelActionMode === 'edit'"
          [disabled]="
            !data.selectedLabel.backgroundColor || !data.selectedLabel.color
          "
          (click)="closeDialog()"
        >
          <mat-icon>edit</mat-icon>
          Edit
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class EditLabelDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      selectedLabel: IActionLabel;
      labelActionMode: 'choose' | 'delete' | 'edit';
    },
    private _dialogRef: MatDialogRef<EditLabelDialogComponent>
  ) {}

  closeDialog() {
    this._dialogRef.close(this.data.labelActionMode);
  }
}
