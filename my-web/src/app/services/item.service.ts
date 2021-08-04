import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Item } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemList: Item[] = [];
  private _itemSubjectList$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  readonly itemSubjectList$ = this._itemSubjectList$.asObservable();

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
   * @param {number} offset
   * @param {number} limit
   * @memberof ItemService
   */
  getItems(id: string | undefined, offset: number, limit: number) {
    this.http.get<Item[]>(`${environment.apiUrl}/api/item/${id}?offset=${offset}&limit=${limit}`)
      .pipe(
        debounceTime(300),
        distinctUntilChanged())
      .subscribe(data => {
        this.itemList = [...this.itemList, ...data]
        this._itemSubjectList$.next(this.itemList);
      }, error => console.log(error));
  }
}
