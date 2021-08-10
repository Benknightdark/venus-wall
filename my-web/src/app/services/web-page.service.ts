import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class WebPageService {
  private _webPageSubjectList$: Subject<WebPage[]> = new Subject<WebPage[]>();
  readonly webPageSubjectList$ = this._webPageSubjectList$.asObservable();

  constructor(private http:HttpClient) { }
  getItemByForumID(id:string|undefined){
    return this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage/byForum/${id}`).subscribe(r=>{
      this._webPageSubjectList$.next(r);
    })
  }
}
