import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }
  getWorkerLog(offset: number = 0, limit: number = 20) {
    return this.http.get(`${environment.apiUrl}/api/log/worker?offset=${offset}&limit=${limit}`)
  }
  getCrawlerLog(offset: number = 0, limit: number = 20) {
    return this.http.get(`${environment.apiUrl}/api/log/crawler?offset=${offset}&limit=${limit}`)
  }
  getProcessorLog(offset: number = 0, limit: number = 20) {
    return this.http.get(`${environment.apiUrl}/api/log/processor?offset=${offset}&limit=${limit}`)
  }
}
