import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { asyncScheduler, scheduled, Subject } from 'rxjs';
import { combineAll } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Forum, ForumWebPage, WebPage } from '../models/data.model';
@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private _forumDetailSubject$: Subject<ForumWebPage> = new Subject<ForumWebPage>();
  readonly forumDetailSubject$ = this._forumDetailSubject$.asObservable();
  constructor(private http: HttpClient) { }

  /**
   * 取得所有論壇資料
   *
   * @return {*}
   * @memberof ForumService
   */
  getForumData() {
    return this.http.get<Forum[]>(`${environment.apiUrl}/api/forum`);
  }

  /**
   * 取得特定id的論壇和看版資料
   *
   * @param {(string | undefined)} id
   * @memberof ForumService
   */
  getForumDetailData(id: string | undefined) {
    scheduled([this.http.get<Forum>(`${environment.apiUrl}/api/forum/${id}`), this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage/byForum/${id}`)], asyncScheduler).pipe(combineAll()).subscribe(a => {
      let p: ForumWebPage = {};
      p.forum = (a[0] as Forum[])[0];
      p.webPageList = a[1] as WebPage[];
      this._forumDetailSubject$.next(p);
    })
  }
  /**
   * 刪除特定id的論壇資料
   *
   * @param {(string | undefined)} id
   * @return {*}
   * @memberof ForumService
   */
  deleteForum(id: string | undefined) {
    return this.http.delete(`${environment.apiUrl}/api/forum/${id}`);
  }
  /**
   * 新增論壇和看版資料
   *
   * @param {ForumWebPage} data
   * @return {*}
   * @memberof ForumService
   */
  createForumData(data: ForumWebPage) {
    return this.http.post(`${environment.apiUrl}/api/forum`, data);
  }

  /**
   * 修改論壇和看版資料
   *
   * @param {ForumWebPage} data
   * @return {*}
   * @memberof ForumService
   */
  updateForumData(data: ForumWebPage) {
    return this.http.put(`${environment.apiUrl}/api/forum`, data);
  }
}
