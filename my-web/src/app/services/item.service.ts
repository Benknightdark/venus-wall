import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private _itemSubjectList$: Subject<{ totalDataCount?: number, data?: Item[] }> = new Subject<{ totalDataCount?: number, data?: Item[] }>();
  readonly itemSubjectList$ = this._itemSubjectList$.asObservable();
  constructor(private http: HttpClient) { }
  /**
   * 取得Item資料 (form table)
   *
   * @param {(string | undefined)} id
   * @param {number} [offset=0]
   * @param {number} [limit=10]
   * @memberof ItemService
   */
  getItems(id: string | undefined, offset: number = 0, limit: number = 10, keyWord: string | undefined = undefined, sort: string | undefined = undefined, mode: string | undefined = undefined) {
    let keywordQueryParam = ""
    if (keyWord != undefined) {
      keywordQueryParam = keyWord.replace(/\s/g, '');
      console.log(keywordQueryParam)
      if (keywordQueryParam !== "") {
        keywordQueryParam = `&keyword=${keywordQueryParam}`
      }
    }
    let sortQueryParam = ""
    if (sort != undefined) {
      sortQueryParam = sort.replace(/\s/g, '');
      console.log(sortQueryParam)
      if (sortQueryParam !== "") {
        sortQueryParam = `&sort=${sortQueryParam}`
      }
    }
    let modeQueryParam = ""
    if (mode != undefined) {
      modeQueryParam = mode.replace(/\s/g, '');
      console.log(modeQueryParam)
      if (modeQueryParam !== "") {
        modeQueryParam = `&mode=${modeQueryParam}`
      }
    }
    this.http.get<{ totalDataCount?: number, data?: Item[] }>(`${environment.apiUrl}/api/item/table/${id?.toString().toUpperCase()}?offset=${offset}&limit=${limit}${sortQueryParam}${modeQueryParam}${keywordQueryParam}`)
      .pipe(
        share(),
        debounceTime(300),
        distinctUntilChanged())
      .subscribe(data => {
        this._itemSubjectList$.next(data);
      }, error => console.log(error));
  }

  deleteItems(id: string | undefined) {
    return this.http.delete(`${environment.apiUrl}/api/item/${id?.toString().toUpperCase()}`);
  }

  /**
   * 啟動爬蟲更新資料
   *
   * @param {(string | undefined)} id
   * @param {number} start
   * @param {number} end
   * @return {*}
   * @memberof ItemService
   */
  updateItems(id: string | undefined, start: number | undefined, end: number | undefined) {
    let endString = end != 0 ? `&end=${end}` : ''
    return this.http.post<{ totalDataCount?: number, data?: Item[] }>(`${environment.apiUrl}/api/item/${id?.toString().toUpperCase()}?start=${start}${endString}`, {});
  }
}
