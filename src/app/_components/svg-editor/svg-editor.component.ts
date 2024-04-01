import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import { fabric } from 'fabric';

import { SvgService } from '../../_services/svg-editor.service';
import { IActionLabel } from '../../_interfaces/action-label-interface';
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
  @Output() actionModeDialog = new EventEmitter<IActionLabel>();
  @Output() chartDialog = new EventEmitter();

  private _canvas!: fabric.Canvas;
  svgJson: any;
  svgString: string = '';
  previewMode: boolean = false;
  labelList: IActionLabel[] = [];

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

  editElements(elementData: IActionLabel) {
    const traverseSVG = (element: any) => {
      if (
        element &&
        element.hasOwnProperty('$') &&
        element['$'].hasOwnProperty('element-id') &&
        element['$']['element-id'] === elementData.elementID &&
        elementData.elementColor
      ) {
        const style = element['$']['style'];
        if (style) {
          element['$']['style'] = style.replace(
            /fill:[^;]*/,
            `fill:${'#' + elementData.elementColor.toHex()}`
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
        if (!this.previewMode) {
          const label = this.labelList.find((item) => item.id === labelID);
          this.actionModeDialog.emit(label);
        }
      });
      text.on('mousedown', (options) => {
        if (options.button === 3) {
          if (!this.previewMode) {
            options.e.preventDefault();
            setTimeout(() => {
              this.editLabelDialog.emit({
                text: labelText,
                id: labelID,
              });
            }, 100);
          }
        } else if (options.button === 1) {
          if (this.previewMode) {
            options.e.preventDefault();
            const label = this.labelList.find((item) => item.id === labelID);
            setTimeout(() => {
              if (label?.mode === 'color') {
                this.editElements(label);
              } else if (label?.mode === 'chart') {
                this.chartDialog.emit();
              }
            }, 100);
          }
        }
      });
      this.labelList.push({
        id: labelID,
        text: labelText,
        color: textLabel.color,
        backgroundColor: textLabel.backgroundColor,
      });
      this._canvas.add(text);
    }
  }

  saveAction(label: IActionLabel) {
    const index = this.labelList.findIndex((item) => item.id === label.id);
    if (index) {
      this.labelList[index] = label;
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

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  removeLabel(labelID: string) {
    const index = this.labelList.findIndex((item) => item.id === labelID);
    if (index !== -1) {
      this.labelList.splice(index, 1);
    }
    const objects: any = this._canvas.getObjects();
    objects.forEach((label: any) => {
      if (label.name === labelID) {
        this._canvas.remove(label);
      }
    });
  }
}
