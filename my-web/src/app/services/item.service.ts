import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private _itemSubjectList$: Subject<{totalDataCount?:number,data?:Item[]}> = new Subject<{totalDataCount?:number,data?:Item[]}>();
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
getItems(id: string | undefined, offset: number = 0, limit: number = 10) {
    this.http.get<{totalDataCount?:number,data?:Item[]}>(`${environment.apiUrl}/api/item/table/${id?.toString().toUpperCase()}?offset=${offset}&limit=${limit}`)
      .pipe(
        share(),
        debounceTime(300),
        distinctUntilChanged())
      .subscribe(data => {
        this._itemSubjectList$.next(data);
        console.log(data);
      }, error => console.log(error));
  }
}
