import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { WebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class WebpageService {

  constructor(private http: HttpClient) { }
  getPageList(){
  return this.http.get<WebPage[]>(`${environment.apiUrl}/api/webpage`)
  }
}
