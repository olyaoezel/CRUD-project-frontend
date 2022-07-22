import { Component } from '@angular/core';

@Component({
  selector: 'svg-heart',
  styles: ["div { margin-top: 20px; width: 34px; height: 32px; cursor: pointer; position: absolute; right: 30px; top: 105px; }", "div:hover {transform: scale(1.2);}","svg { width: 100%; height: 100%}"],
  template: `
    <div (click)="toggleFavouriteButton()">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" [attr.fill]="fillColor">
      <path d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z"></path>
      </svg>
    </div>
`
})
export class SvgHeartComponent {

  fillColor: string = "black";
  
  toggleFavouriteButton() {
    if (this.fillColor === "#FF0000") this.fillColor = "black";
    else this.fillColor = "#FF0000";
   }
}
