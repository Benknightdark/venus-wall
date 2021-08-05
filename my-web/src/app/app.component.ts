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
  offset: number = 0;
  limit: number = 10;
  constructor(private webPageService: WebpageService, private itemService: ItemService) { }
  ngOnInit() {
    this.itemList$ = this.itemService.itemSubjectList$;

    this.webPageList$ = this.webPageService.getPageList().pipe(
      tap(d => {
        this.selectWebPage = d[0];
        this.itemService.resetItems();
        this.offset = 0;
        this.limit = 10;
        this.itemService.getItems(this.selectWebPage.ID, this.offset, this.limit);
      }));
    this.items = [
      { label: '首頁', icon: 'pi pi-fw pi-home' },
      { label: '管理', icon: 'pi pi-fw pi-cog' },
    ];
  }
  onChangeWebPage() {
    this.offset = 0;
    this.limit = 10;
    this.itemService.resetItems();
    this.itemService.getItems(this.selectWebPage.ID, this.offset, this.limit);
  }
  onWindowScroll(event: any) {
    if (event.target.documentElement.scrollHeight - event.target.documentElement.scrollTop === event.target.documentElement.clientHeight) {
      console.log('scrolled');
      this.offset = this.offset + this.limit;
      this.itemService.getItems(this.selectWebPage.ID, this.offset, this.limit);
    }
  }
}
