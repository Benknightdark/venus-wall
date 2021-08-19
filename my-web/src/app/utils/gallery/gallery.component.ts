import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Image } from '../../models/data.model';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements  OnChanges {

  constructor() { }
  @Input() imageData: Observable<Image[]> = of();

  @Input() get displayGallery(): boolean {
    return this._displayGallery;
  };

  set displayGallery(displayGallery: boolean) {
    this._displayGallery = displayGallery;
  }
  _displayGallery: boolean = false;
  @Output() displayGalleryChange: EventEmitter<boolean> = new EventEmitter();

  ngOnChanges(): void {
    console.log(this.displayGallery)
  }

}
