import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class WebpageService {
  private _webPageIDSubject$: BehaviorSubject<string| undefined> = new BehaviorSubject<string| undefined>("");
  readonly webPageIDSubject$ = this._webPageIDSubject$.asObservable();
  constructor(private http: HttpClient) { }
  getPageList(){
  return this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage`)
  }
  setSelectPage(newData:string | undefined){
    this._webPageIDSubject$.next(newData);
  }
}
