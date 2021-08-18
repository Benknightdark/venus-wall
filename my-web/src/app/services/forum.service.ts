import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { asyncScheduler, scheduled, Subject } from 'rxjs';
import {  combineAll } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Forum, ForumWebPage, WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private _forumDetailSubject$: Subject<ForumWebPage> = new Subject<ForumWebPage>();
  readonly forumDetailSubject$ = this._forumDetailSubject$.asObservable();
  constructor(private http: HttpClient) { }
  getForumData(){
    return this.http.get<Forum[]>(`${environment.apiUrl}/api/forum`);
  }
  getForumDetailData(id: string | undefined){
      scheduled([this.http.get<Forum>(`${environment.apiUrl}/api/forum/${id}`), this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage/byForum/${id}`)], asyncScheduler).pipe(combineAll()).subscribe(a=>{
        console.log(a)
        let  p:ForumWebPage={};
        p.forum=(a[0] as Forum[])[0];
        p.webPageList=a[1]as WebPage[];
        this._forumDetailSubject$.next(p);
      })
  }//
  createForumData(data:ForumWebPage){
    return this.http.post(`${environment.apiUrl}/api/forum`,data);
  }
}
