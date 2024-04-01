import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SvgEditorComponent } from '../svg-editor/svg-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Color } from '@angular-material-components/color-picker';

import { ITextLabel } from 'src/app/_interfaces/text-label-interface';
import { IElementData } from 'src/app/_interfaces/element-label.interface';
import { IManual } from '../../_interfaces/manual-interface';
import { IActionLabel } from '../../_interfaces/action-label-interface';
import { EditingManualDialogComponent } from '../../_dialogs/editing-manual-dialog.component';
import { ConfirmationDialogComponent } from '../../_dialogs/confirmation-dialog.component';
import { EditElementDialogComponent } from '../../_dialogs/edit-element-dialog.component';
import { EditLabelDialogComponent } from '../../_dialogs/edit-label-dialog.component';

@Component({
  selector: 'app-image-label',
  templateUrl: './image-label.component.html',
  styleUrls: ['./image-label.component.scss'],
})
export class ImageLabelComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas!: SvgEditorComponent;

  labelActionMode: 'choose' | 'delete' | 'edit' = 'choose';
  selectedLabel!: IActionLabel;
  labelManualData: MatTableDataSource<IManual> | undefined;
  textLabel: ITextLabel = {
    text: '',
    color: new Color(255, 255, 255),
    backgroundColor: new Color(63, 81, 181),
  };
  elementData: IElementData = {
    id: '',
    color: new Color(255, 255, 255),
  };
  constructor(private _dialog: MatDialog, private _httpClient: HttpClient) {}

  ngOnInit(): void {
    this._httpClient
      .get<IManual[]>('assets/svg-manual.json')
      .subscribe((data) => {
        this.labelManualData = new MatTableDataSource<IManual>(data);
      });
  }

  changeSize() {
    this.canvas.changeSize();
  }

  addText() {
    this.canvas.addTextLabel(this.textLabel);
    this.textLabel = {
      text: '',
      color: new Color(255, 255, 255),
      backgroundColor: new Color(63, 81, 181),
    };
  }

  changeMode() {
    this.canvas.previewModeAction();
  }

  clearEditorDialog() {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.canvas.clear();
      }
    });
  }

  editingManualDialog() {
    this._dialog.open(EditingManualDialogComponent, {
      width: '600px',
      data: { tableData: this.labelManualData },
    });
  }

  editElementDialog() {
    const dialogRef = this._dialog.open(EditElementDialogComponent, {
      width: '600px',
      data: { elementForm: this.elementData },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.canvas.editElements(this.elementData);
        this.elementData = {
          id: '',
          color: new Color(255, 255, 255),
        };
      }
    });
  }

  editLabelDialog(event: IActionLabel) {
    this.selectedLabel = event;
    const dialogRef = this._dialog.open(EditLabelDialogComponent, {
      width: '600px',
      data: {
        labelActionMode: this.labelActionMode,
        selectedLabel: this.selectedLabel,
      },
    });
    dialogRef.afterClosed().subscribe((result: false | 'edit' | 'delete') => {
      if (result) {
        this.labelActionMode = result;
        if (this.labelActionMode === 'delete') {
          this.canvas.removeLabel(this.selectedLabel.id);
        } else if (this.labelActionMode === 'edit') {
          this.canvas.editLabel(this.selectedLabel);
        }
      }
      this.labelActionMode = 'choose';
      (this.selectedLabel as any) = null;
    });
  }
}
