import { Component, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { combineAll, debounceTime, distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';
import { Item, WebPage } from './models/data.model';
import { WebpageService } from './services/webpage.service';
import { ItemService } from './services/item.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '女神牆';
  display: boolean = true;
  webPageList$: Observable<WebPage[]> = of();
  selectWebPage: WebPage = {};
  constructor(private webPageService: WebpageService, private itemService: ItemService
    ) { }
  ngOnInit() {
    this.webPageList$ = this.webPageService.getPageList().pipe(
      tap(d => {
        this.selectWebPage = d[0];
        this.webPageService.setSelectPage(this.selectWebPage.ID)
      }));
  }
  onChangeWebPage() {
    this.itemService.resetItems();
    this.webPageService.setSelectPage(this.selectWebPage.ID);
    this.itemService.getItems(this.selectWebPage.ID);
  }

}
