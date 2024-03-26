import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-image-label',
  templateUrl: './image-label.component.html',
  styleUrls: ['./image-label.component.scss'],
})
export class ImageLabelComponent implements OnInit {
  canvasWidth: number = 500;
  canvasHeight: number = 500;
  @ViewChild('htmlCanvas') htmlCanvas!: ElementRef;
  private canvas!: fabric.Canvas;

  constructor() {

  }

  ngOnInit(): void {}

  changeSize() {
    console.log('alfkhadsjkfhsk')
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);
  }
}
