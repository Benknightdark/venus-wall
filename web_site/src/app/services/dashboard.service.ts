import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ForumWebpageList, Item, WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private itemList: Item[] = [];
  private _itemSubjectList$: Subject<Item[]> = new Subject<Item[]>();
  readonly itemSubjectList$ = this._itemSubjectList$.asObservable();
  private _webPageIDSubject$: Subject<string | undefined> = new Subject<string | undefined>();
  readonly webPageIDSubject$ = this._webPageIDSubject$.asObservable();
  private _webPageSubjectList$: Subject<ForumWebpageList[]> = new Subject();
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
  getItems(id: string | undefined, offset: number = 0, limit: number = 30, filterIDs: string | undefined = undefined) {
    if (id !== '' && id !== undefined) {
      filterIDs = filterIDs === undefined ? '' : `&filterId=${filterIDs}`
      this.http.get<Item[]>(`${environment.apiUrl}/api/item/${id}?offset=${offset}&limit=${limit}${filterIDs}`)
        .pipe(
          share(),
          map(m => {
            for (const item of m) {
              item.WebPageSimilarityCount = item.WebPageSimilarity?.length;
            }
            return m
          }),
          debounceTime(300),
          distinctUntilChanged())
        .subscribe(data => {
          this.itemList = [...this.itemList, ...data]
          this._itemSubjectList$.next(this.itemList);
        }, error => console.log(error));
    }
  }



  /**
   * 取得WebPage資料
   *
   * @memberof DashboardService
   */
  getPageListSubject() {
    this.http.get<ForumWebpageList[]>(`${environment.apiUrl}/api/webpage`).pipe(share(),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(r => {
      this._webPageSubjectList$.next(r)
    })
  }
  /**
   * 設定被選取的WebPage
   *
   * @param {(string | undefined)} newData
   * @memberof WebpageService
   */
  setSelectWebPage(newData: string | undefined) {
    this._webPageIDSubject$.next(newData);
  }
}
