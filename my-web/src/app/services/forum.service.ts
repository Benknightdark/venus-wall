import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { asyncScheduler, forkJoin, Observable, of, scheduled } from 'rxjs';
import {  combineAll, concatAll, mergeAll, mergeMap, observeOn, switchAll, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Forum, ForumWebPage, WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  constructor(private http: HttpClient) { }
  getForumData(){
    return this.http.get<Forum[]>(`${environment.apiUrl}/api/forum`);
  }
  getForumDetailData(id: string | undefined){
    return  scheduled([this.http.get<Forum>(`${environment.apiUrl}/api/forum/${id}`), this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage/byForum/${id}`)], asyncScheduler).pipe(combineAll())
  }//
  createForumData(data:ForumWebPage){
    return this.http.post(`${environment.apiUrl}/api/forum`,data);
  }
}
