import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }
  getLogData(name:string,offset: number = 0, limit: number = 20) {
    return this.http.get<[]>(`${environment.apiUrl}/api/log/${name}?offset=${offset}&limit=${limit}`)
  }

}
