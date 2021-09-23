import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { asyncScheduler, scheduled } from 'rxjs';
import { combineAll, debounceTime, distinctUntilChanged, map, share } from 'rxjs/operators';
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
  getMultiItemImageData(itemIDArray:string[]){
    const reqArray=itemIDArray.map(itemID=>this.http.get<Image[]>(`${environment.apiUrl}/api/image/${itemID}`))
    return scheduled(reqArray, asyncScheduler).pipe(combineAll(),map(data=>{
      let combinedData:Image[]=[]
      for (const d of data){
        combinedData=[...combinedData,...d]
      }
      return combinedData;
    }))
  }
}
