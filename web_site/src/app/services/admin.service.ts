import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminForumCount, CrawlTaskCountModel } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  /**
   * 取得論壇底下各個類別的文章數量
   *
   * @return {*}  {Observable<AdminForumCount[]>}
   * @memberof AdminService
   */
  getForumCount(): Observable<AdminForumCount[]> {
    return this.http.get<AdminForumCount[]>(`${environment.apiUrl}/api/admin/forum-count`)
  }
  getCrawlTaskCount(): Observable<CrawlTaskCountModel[]> {
    return this.http.get<CrawlTaskCountModel[]>(`${environment.apiUrl}/api/admin/crawl-task-count`)
  }
}
