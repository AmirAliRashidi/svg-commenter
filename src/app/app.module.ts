import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import {
  MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
  NGX_MAT_COLOR_FORMATS,
} from '@angular-material-components/color-picker';

import { AppComponent } from './app.component';
import { ImageLabelComponent } from './_components/image-label/image-label.component';
import { SvgEditorComponent } from './_components/svg-editor/svg-editor.component';
import { EditingManualDialogComponent } from './_dialogs/editing-manual-dialog.component';
import { ConfirmationDialogComponent } from './_dialogs/confirmation-dialog.component';
import { EditElementDialogComponent } from './_dialogs/edit-element-dialog.component';
import { EditLabelDialogComponent } from './_dialogs/edit-label-dialog.component';
import { DisableRightClickDirective } from './_directives/disable-right-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    ImageLabelComponent,
    SvgEditorComponent,
    DisableRightClickDirective,
    // dialogs
    EditingManualDialogComponent,
    ConfirmationDialogComponent,
    EditElementDialogComponent,
    EditLabelDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    // angular materials
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    NgxMatColorPickerModule,
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
  bootstrap: [AppComponent],
})
export class AppModule {}
