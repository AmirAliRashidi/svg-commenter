import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IManual } from '../_interfaces/manual-interface';

@Component({
  selector: 'app-editing-manual-dialog',
  template: `
    <h2 mat-dialog-title>{{ dialogContent.title }}</h2>
    <mat-dialog-content *ngIf="data.tableData" class="mat-typography">
      <p style="text-align: justify;">{{ dialogContent.description }}</p>
      <table mat-table [dataSource]="data.tableData">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let row">{{ row.id }}</td>
        </ng-container>
        <ng-container matColumnDef="color">
          <th mat-header-cell *matHeaderCellDef>Color Value</th>
          <td mat-cell *matCellDef="let row">{{ row.color }}</td>
        </ng-container>
        <ng-container matColumnDef="bg-color">
          <th mat-header-cell *matHeaderCellDef>Color</th>
          <td mat-cell *matCellDef="let row">
            <div class="bg-colors" [style.background]="row.color"></div>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button
        mat-raised-button
        color="primary"
        [matDialogClose]="false"
        color="primary"
      >
        OK
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .bg-colors {
        width: 20px;
        height: 20px;
        border: 3px solid #e2e2e2;
      }
    `,
  ],
})
export class EditingManualDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { tableData: MatTableDataSource<IManual> }
  ) {}
  displayedColumns: string[] = ['id', 'color', 'bg-color'];
  dialogContent: {
    title: string;
    description: string;
  } = {
    title: 'Editing Manual',
    description: `After adding labels, you can edit or delete them by right-clicking.
    Additionally, there is an action mode: double-clicking on labels
    triggers a modal where you can enter two parameters. The first parameter
    is the element ID, and the second one is the element color. I have
    displayed the colors of each element to help you identify which element
    you're enabling actions on.`,
  };
}
