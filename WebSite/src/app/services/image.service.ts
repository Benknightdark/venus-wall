import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Image } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  getImageData(itemID: string|undefined) {
   return  this.http.get<Image[]>(`${environment.apiUrl}/api/image/${itemID}`)
      .pipe( debounceTime(300),
      distinctUntilChanged())

  }
}
