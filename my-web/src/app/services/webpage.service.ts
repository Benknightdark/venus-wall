import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class WebpageService {
  private _webPageIDSubject$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>("");
  readonly webPageIDSubject$ = this._webPageIDSubject$.asObservable();
  constructor(private http: HttpClient) { }

  /**
   * 取得WebPage資料
   *
   * @return {*}
   * @memberof WebpageService
   */
  getPageList() {
    return this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage`)
  }

/**
 * 設定被選取的WebPage
 *
 * @param {(string | undefined)} newData
 * @memberof WebpageService
 */
setSelectPage(newData: string | undefined) {
    this._webPageIDSubject$.next(newData);
  }
}
