import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private _itemSubjectList$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  readonly itemSubjectList$ = this._itemSubjectList$.asObservable();
  constructor(private http: HttpClient) { }
  /**
   * 取得Item資料
   *
   * @param {(string | undefined)} id
   * @param {number} [offset=0]
   * @param {number} [limit=10]
   * @memberof ItemService
   */
   getItems(id: string | undefined, offset: number = 0, limit: number = 10) {
    this.http.get<Item[]>(`${environment.apiUrl}/api/item/${id?.toString().toUpperCase()}?offset=${offset}&limit=${limit}`)
      .pipe(
        debounceTime(300),
        distinctUntilChanged())
      .subscribe(data => {
        this._itemSubjectList$.next(data);
        console.log(data);
      }, error => console.log(error));
  }
}
