import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TaskInfo } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _currentTaskStatusList$: Subject<{ [webPageId: string]:  TaskInfo }> = new Subject<{ [webPageId: string]: TaskInfo }>();
  readonly currentTaskStatusList$ = this._currentTaskStatusList$.asObservable();
  private curretnTaskStatusList: { [webPageId: string]: TaskInfo } = {};

  constructor(private http: HttpClient) { }

  getCurrentTaskStatus(webPageId: string, taskId: string) {
    this.http.get<TaskInfo>(`${environment.apiUrl}/api/task/${taskId}`).pipe(share())
      .subscribe(r => {
        this.curretnTaskStatusList[String(webPageId).toUpperCase()] = r;
        this._currentTaskStatusList$.next(this.curretnTaskStatusList);
      })
  }
}
