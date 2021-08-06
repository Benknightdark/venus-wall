import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebPage, Item } from '../../models/data.model';
import { ItemService } from '../../services/item.service';
import { WebpageService } from '../../services/webpage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = '女神牆';
  display: boolean = true;
  webPageList$: Observable<WebPage[]> = of();
  selectWebPageId: string | undefined = "";
  itemList$: Observable<Item[]> = of();
  offset: number = 0;
  limit: number = 10;
  constructor(private webPageService: WebpageService, private itemService: ItemService
  ) { }
  ngOnInit() {
    this.itemList$ = this.itemService.itemSubjectList$;
    this.webPageService.webPageIDSubject$.subscribe(id => {
      this.selectWebPageId = id;
      this.itemService.resetItems();
      this.offset = 0;
      this.limit = 10;
      this.itemService.getItems(this.selectWebPageId, this.offset, this.limit);
    })
  }

  onOpenWebSite(url: string) {
    window.open(url);
  }
  onWindowScroll(event: any) {
    if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) {
      this.offset = this.offset + this.limit;
      this.itemService.getItems(this.selectWebPageId, this.offset, this.limit);
    }
  }

}
