import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Item, WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private itemList: Item[] = [];
  private _itemSubjectList$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  readonly itemSubjectList$ = this._itemSubjectList$.asObservable();
  private _webPageIDSubject$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>("");
  readonly webPageIDSubject$ = this._webPageIDSubject$.asObservable();


  private _webPageSubjectList$: Subject<WebPage[]> = new Subject();
  readonly webPageSubjectList$ = this._webPageSubjectList$.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * 重設Item資料
   *
   * @memberof ItemService
   */
  resetItems() {
    this.itemList = [];
    this._itemSubjectList$.next(this.itemList);
  }

  /**
   * 取得Item資料
   *
   * @param {(string | undefined)} id
   * @param {number} [offset=0]
   * @param {number} [limit=10]
   * @memberof ItemService
   */
  getItems(id: string | undefined, offset: number = 0, limit: number = 10) {
    if (id !== '' && id!==undefined) {
      this.http.get<Item[]>(`${environment.apiUrl}/api/item/${id}?offset=${offset}&limit=${limit}`)
        .pipe(
          share(),
          debounceTime(300),
          distinctUntilChanged())
        .subscribe(data => {
          this.itemList = [...this.itemList, ...data]
          this._itemSubjectList$.next(this.itemList);
        }, error => console.log(error));
    }
  }

  // getPageList() {
  //   return this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage`)
  // }

  /**
   * 取得WebPage資料
   *
   * @memberof DashboardService
   */
  getPageListSubject() {
    this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage`).subscribe(r => {
      this._webPageSubjectList$.next(r)
    })
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
