import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  private _showSideMenu$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly showSideMenu$ = this._showSideMenu$.asObservable();
  constructor() { }
  openSideMenu(){
    this._showSideMenu$.next(true);
  }
  hideSideMenu(){
    this._showSideMenu$.next(false);
  }
}
