import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Color } from '@angular-material-components/color-picker';

import { fabric } from 'fabric';

import { SvgService } from '../svg-editor.service';

@Component({
  selector: 'app-svg-editor',
  templateUrl: './svg-editor.component.html',
  styleUrls: ['./svg-editor.component.scss'],
  providers: [SvgService],
})
export class SvgEditorComponent implements AfterViewInit {
  @ViewChild('htmlCanvas') htmlCanvas!: ElementRef;

  private canvas!: fabric.Canvas;
  public colorList: {
    value: string;
    color?: Color;
  }[] = [];
  public textString: string = '';
  public labelColor: Color = new Color(255, 255, 255);
  public labelBackgroundColor: Color = new Color(63, 81, 181);
  public size: {
    width: number | string;
    height: number | string;
  } = {
    width: 800,
    height: 500,
  };
  svgJson: any;
  svgString: string = '';

  constructor(private svgService: SvgService) {
    this.loadSvgAsJson();
  }

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
      isDrawingMode: false,
    });
    this.changeSize();
    this.createBackGround('assets/bg.svg');
  }

  loadSvgAsJson() {
    this.svgService.getSvgAsJson().then((svgJson) => {
      this.svgJson = svgJson;
      this.getFilledColor();
    });
  }

  getFilledColor() {
    const fillValuesSet: Set<string> = new Set();
    const traverseSVG = (element: any) => {
      if (
        element &&
        element.hasOwnProperty('$') &&
        element['$'].hasOwnProperty('style')
      ) {
        const style = element['$']['style'];
        if (style) {
          const fillValue = style
            .split(';')
            .find((attr: string) => attr.trim().startsWith('fill:'));
          if (fillValue) {
            const value = fillValue.split(':')[1];
            fillValuesSet.add(value);
          }
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
    this.colorList = Array.from(fillValuesSet).map((item) => ({
      value: item,
    }));
  }

  changeColor(targetColor: string, newColor: string) {
    const colorIndex = this.colorList.findIndex(
      (item) => item.value === targetColor
    );
    this.colorList[colorIndex].value = newColor;
    const traverseSVG = (element: any) => {
      if (
        element &&
        element.hasOwnProperty('$') &&
        element['$'].hasOwnProperty('style')
      ) {
        const style = element['$']['style'];
        if (style) {
          const fillValue = style
            .split(';')
            .find((attr: string) => attr.trim().startsWith('fill:'));
          if (fillValue) {
            const currentValue = fillValue.split(':')[1];
            if (currentValue === targetColor) {
              element['$']['style'] = style.replace(currentValue, newColor);
            }
          }
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
    this.svgService.convertJsonToSvg(this.svgJson).then((svgString) => {
      this.svgString = svgString;
      this.createBackGround(
        'data:image/svg+xml;base64,' + btoa(this.svgString)
      );
    });
  }

  changeSize() {
    this.canvas.setHeight(this.size.height);
    this.canvas.setWidth(this.size.width);
  }

  addText() {
    if (this.textString) {
      const text = new fabric.IText(this.textString, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: this.labelColor.toHexString(),
        backgroundColor: this.labelBackgroundColor.toHexString(),
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        hasRotatingPoint: true,
      });
      // text.on('mousedblclick', (options) => {
      //   console.log('double');
      // });
      // this.canvas.on('mouse:down', (options) => {
      //   console.log('default mouse click')
      //   if (options.e.button === 3) {
      //     options.e.preventDefault();
      //   }
      // });      
      // text.on('mousedown', (options) => {
      //   console.log(options)
      //   if (options.button === 3) {
      //     console.log('user right clicked')
      //   }
      // });
      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
    }
  }

  clear() {
    this.canvas.clear();
  }

  createBackGround(path: string) {
    const imgElement = new Image();
    imgElement.onload = () => {
      const fabricImage = new fabric.Image(imgElement, {
        width: this.canvas.width,
        height: this.canvas.height,
        originX: 'left',
        originY: 'top',
      });
      this.canvas.setBackgroundImage(
        fabricImage,
        this.canvas.renderAll.bind(this.canvas)
      );
    };
    imgElement.src = path;
  }

  removeBackground() {
    this.canvas.setBackgroundImage(
      null as any,
      this.canvas.renderAll.bind(this.canvas)
    );
  }

  // loadSvgAsBackground() {
  //   const canvasElement = this.htmlCanvas.nativeElement;
  //   this.canvas = new fabric.Canvas(canvasElement);
  //   const imgElement = new Image();
  //   imgElement.onload = () => {
  //     const fabricImage = new fabric.Image(imgElement, {
  //       width: this.canvas.width,
  //       height: this.canvas.height,
  //       originX: 'left',
  //       originY: 'top',
  //     });
  //     this.canvas.setBackgroundImage(
  //       fabricImage,
  //       this.canvas.renderAll.bind(this.canvas)
  //     );
  //   };
  //   imgElement.src = 'data:image/svg+xml;base64,' + btoa(this.svgString);
  // }

  changeFigureColor(color: string) {
    this.canvas.getActiveObject()?.set('fill', color);
    this.canvas.renderAll();
  }

  extend(obj: any, id: any) {
    obj.toObject = ((toObject) => {
      return function () {
        return fabric.util.object.extend(toObject.call(), {
          id,
        });
      };
    })(obj.toObject);
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  selectItemAfterAdded(obj: any) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }
}
