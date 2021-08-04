import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { combineAll, concat, debounceTime, distinctUntilChanged, flatMap, map, merge, mergeMap, tap } from 'rxjs/operators';

import { Item, WebPage } from './models/data.model';
import { WebpageService } from './services/webpage.service';
import { ItemService } from './services/item.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-web';
  display: boolean = true;
  items: MenuItem[] = [];
  webPageList$: Observable<WebPage[]> = of();
  selectWebPage: WebPage = {};
  itemList$: Observable<Item[]> = of();
  itemSubjectList$: BehaviorSubject<Observable<Item[]>> = new BehaviorSubject<Observable<Item[]>>(of());

  constructor(private webPageService: WebpageService, private itemService: ItemService) { }
  ngOnInit() {
    this.itemSubjectList$.subscribe(newData => {
      this.itemList$=newData
    });
    this.webPageList$ = this.webPageService.getPageList().pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(d => {
        this.selectWebPage = d[0];
        this.itemSubjectList$.next(this.itemService.getItems(this.selectWebPage.ID, 0, 10));
      }));
    this.items = [
      { label: '首頁', icon: 'pi pi-fw pi-home' },
      { label: '管理', icon: 'pi pi-fw pi-cog' },
    ];
  }
  onChangeWebPage() {
    this.itemSubjectList$.next(this.itemService.getItems(this.selectWebPage.ID, 0, 10));
  }
}
