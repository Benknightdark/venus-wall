import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Forum, ForumWebPage } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  constructor(private http: HttpClient) { }
  getForumData(){
    return this.http.get<Forum[]>(`${environment.apiUrl}/api/forum`);
  }
  createForumData(data:ForumWebPage){
    return this.http.post(`${environment.apiUrl}/api/forum`,data);
  }
}
