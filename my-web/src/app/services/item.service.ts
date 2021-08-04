import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Item } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }
  getItems(id: string|undefined, offset: number, limit: number) {
    return this.http.get<Item[]>(`${environment.apiUrl}/api/item/${id}?offset=${offset}&limit=${limit}`)
  }
}
