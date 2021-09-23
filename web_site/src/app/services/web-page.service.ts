import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class WebPageService {

  private _webPageSubjectList$: Subject<{ [name: string]: WebPage[] }> = new Subject<{ [name: string]: WebPage[] }>();
  readonly webPageSubjectList$ = this._webPageSubjectList$.asObservable();
  private webPageData: { [name: string]: WebPage[] } = {};

  constructor(private http: HttpClient) { }
  /**
   * 透過論壇id取得其論壇的所有看版資料
   *
   * @param {(string | undefined)} id
   * @return {*}
   * @memberof WebPageService
   */
  getWebPageByForumID(id: string | undefined) {
    return this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage/byForum/${id}`)
      .pipe(share())
      .subscribe(r => {
        this.webPageData[String(id).toUpperCase()] = r;
        this._webPageSubjectList$.next(this.webPageData);
      })
  }
  getWebPageByID(id: string | undefined) {
    return this.http.get<WebPage>(`${environment.apiUrl}/api/webpage/${id}`)
      .pipe(share())
  }
  /**
   * 透過WebPage id，更新所有文章的相似度資料
   *
   * @param {(string | undefined)} id
   * @return {*}
   * @memberof WebPageService
   */
  updateWebPageItemSimilarity(id: string | undefined) {
    return this.http.get<{}>(`${environment.apiUrl}/api/webpage/similarity/${id}`)
      .pipe(share())
  }
}

