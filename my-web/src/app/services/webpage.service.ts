import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebpageService {

  constructor(private http: HttpClient) { }
  getPageList(){
  return this.http.get<[]>(`${environment.apiUrl}/api/webpage`)
  }
}
