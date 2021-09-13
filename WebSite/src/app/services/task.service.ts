import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, retry, share } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TaskInfo, TaskResult } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _currentTaskStatusList$: Subject<{ [webPageId: string]: TaskInfo }> = new Subject<{ [webPageId: string]: TaskInfo }>();
  readonly currentTaskStatusList$ = this._currentTaskStatusList$.asObservable();
  private curretnTaskStatusList: { [webPageId: string]: TaskInfo } = {};
  private _taskResultsList$: Subject<TaskResult[]> = new Subject<TaskResult[]>();
  readonly taskResultsList$ = this._taskResultsList$.asObservable();
  constructor(private http: HttpClient) { }

  getTaskInfo(webPageId: string | undefined) {
    this.http.get<TaskResult[]>(`${environment.apiUrl}/api/task/results/${webPageId}`).pipe(
      share(),
      debounceTime(300),
      distinctUntilChanged(), retry(5)).subscribe(res => {
        this._taskResultsList$.next(res)
      })
  }
  getCurrentTaskStatus(webPageId?: string, taskId?: string) {
    if (webPageId == null) {
      this._currentTaskStatusList$.next(this.curretnTaskStatusList);
      this.http.get<{ [uuid: string]: TaskInfo }>(`${environment.apiUrl}/api/tasks`).pipe(
        share(),
        debounceTime(300),
        distinctUntilChanged(), retry(5))
        .subscribe(r => {
          for (const item of Object.keys(this.curretnTaskStatusList)) {
            this.curretnTaskStatusList[item] = r[this.curretnTaskStatusList[item].uuid!]
          }
          this._currentTaskStatusList$.next(this.curretnTaskStatusList);
        })
    } else {
      taskId = (taskId === undefined || taskId === null) ? this.curretnTaskStatusList[String(webPageId).toUpperCase()].uuid : taskId;
      this.http.get<TaskInfo>(`${environment.apiUrl}/api/task/${taskId}`).pipe(
        share(),
        debounceTime(300),
        distinctUntilChanged(), retry(5))
        .subscribe(r => {
          this.curretnTaskStatusList[String(webPageId).toUpperCase()] = r;
          this._currentTaskStatusList$.next(this.curretnTaskStatusList);
        })
    }
  }
}
