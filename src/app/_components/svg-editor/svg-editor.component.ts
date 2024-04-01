import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Color } from '@angular-material-components/color-picker';

import { fabric } from 'fabric';

import { SvgService } from '../../_services/svg-editor.service';
import { IActionLabel } from '../../_interfaces/action-label-interface';
import { IElementData } from '../../_interfaces/element-label.interface';
import { ITextLabel } from 'src/app/_interfaces/text-label-interface';

@Component({
  selector: 'app-svg-editor',
  templateUrl: './svg-editor.component.html',
  styleUrls: ['./svg-editor.component.scss'],
  providers: [SvgService],
})
export class SvgEditorComponent implements AfterViewInit {
  @ViewChild('svgEditor') svgEditor!: ElementRef;
  @Output() editLabelDialog = new EventEmitter<IActionLabel>();
  @Output() editElementDialog = new EventEmitter();

  private _canvas!: fabric.Canvas;
  svgJson: any;
  svgString: string = '';
  previewMode: boolean = false;

  constructor(private _svgService: SvgService) {
    this.loadSvgAsJson();
  }

  ngAfterViewInit(): void {
    this._canvas = new fabric.Canvas(this.svgEditor.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
      isDrawingMode: false,
      fireRightClick: true,
      width: 800,
      height: 500,
    });
    this.createBackGround('assets/bg.svg');
  }

  previewModeAction() {
    const labels = this._canvas.getObjects();
    for (let label of labels) {
      label.selectable = !this.previewMode;
    }
    this._canvas.renderAll();
  }

  loadSvgAsJson() {
    this._svgService.getSvgAsJson().then((svgJson) => {
      this.svgJson = svgJson;
    });
  }

  editElements(elementData: IElementData) {
    const traverseSVG = (element: any) => {
      if (
        element &&
        element.hasOwnProperty('$') &&
        element['$'].hasOwnProperty('element-id') &&
        element['$']['element-id'] === elementData.id
      ) {
        const style = element['$']['style'];
        if (style) {
          element['$']['style'] = style.replace(
            /fill:[^;]*/,
            `fill:${'#' + elementData.color.toHex()}`
          );
        }
      }
      if (element && typeof element === 'object') {
        for (const key in element) {
          if (element.hasOwnProperty(key) && typeof element[key] === 'object') {
            traverseSVG(element[key]);
          }
        }
      }
    };
    traverseSVG(this.svgJson);
    this.convertJsonToSvg();
  }

  convertJsonToSvg() {
    this._svgService.convertJsonToSvg(this.svgJson).then((svgString) => {
      this.svgString = svgString;
      this.createBackGround(
        'data:image/svg+xml;base64,' + btoa(this.svgString)
      );
    });
  }

  addTextLabel(textLabel: ITextLabel) {
    if (textLabel) {
      const labelText: string = textLabel.text;
      const labelID: string = this.randomId().toString();
      const text = new fabric.IText(labelText, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: textLabel.color.toHexString(),
        backgroundColor: textLabel.backgroundColor.toHexString(),
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        hasRotatingPoint: true,
        name: labelID,
        selectable: !this.previewMode,
      });
      text.on('mousedblclick', () => {
        if (this.previewMode) {
          this.editElementDialog.emit({
            text: labelText,
            id: labelID,
          });
        }
      });
      text.on('mousedown', (options) => {
        if (options.button === 3) {
          if (this.previewMode) {
            options.e.preventDefault();
            setTimeout(() => {
              this.editLabelDialog.emit({
                text: labelText,
                id: labelID,
              });
            }, 100);
          }
        }
      });
      this._canvas.add(text);
    }
  }

  editLabel(label: IActionLabel) {
    const selectedLabel = this._canvas
      .getObjects()
      .find((obj) => obj.name === label.id);
    if (selectedLabel) {
      if (label.color) {
        selectedLabel.set('fill', '#' + label.color.toHex());
      }
      if (label.backgroundColor) {
        selectedLabel.set(
          'backgroundColor',
          '#' + label.backgroundColor.toHex()
        );
      }
      this._canvas.renderAll();
    }
  }

  clear() {
    this._canvas.clear();
    this.createBackGround('assets/bg.svg');
    this.loadSvgAsJson();
  }

  createBackGround(path: string) {
    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImage = new fabric.Image(imgElement, {
        width: this._canvas.width,
        height: this._canvas.height,
        originX: 'left',
        originY: 'top',
      });
      this._canvas.setBackgroundImage(
        fabricImage,
        this._canvas.renderAll.bind(this._canvas)
      );
    };
    imgElement.src = path;
  }

  changeFigureColor(color: string) {
    this._canvas.getActiveObject()?.set('fill', color);
    this._canvas.renderAll();
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  removeLabel(labelID: string) {
    const objects: any = this._canvas.getObjects();
    objects.forEach((label: any) => {
      if (label.name === labelID) {
        this._canvas.remove(label);
      }
    });
  }
}
