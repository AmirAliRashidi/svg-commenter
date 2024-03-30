import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableRightClick]'
})
export class DisableRightClickDirective {

  constructor() { }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}