import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SvgEditorComponent } from '../svg-editor/svg-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { Color } from '@angular-material-components/color-picker';

@Component({
  selector: 'app-image-label',
  templateUrl: './image-label.component.html',
  styleUrls: ['./image-label.component.scss'],
})
export class ImageLabelComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas!: SvgEditorComponent;
  @ViewChild('confirmationDialogTemplate')
  confirmationDialogTemplate!: TemplateRef<any>;
  newColor: any;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  changeSize() {
    this.canvas.changeSize();
  }

  public addText() {
    this.canvas.addText();
  }

  clearingPage() {
    const dialogRef = this.dialog.open(this.confirmationDialogTemplate, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.canvas.clear();
      }
    });
  }

  onInputChange(newColor: Color, previsColor: string) {
    this.canvas.changeColor(previsColor, '#' + newColor.hex);
  }
}
