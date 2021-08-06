import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WebPage, Item } from '../../models/data.model';
import { DashboardService } from '../../services/dashboard.service';

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
  constructor(private dashBoardService: DashboardService
  ) { }
  ngOnInit() {
    this.itemList$ = this.dashBoardService.itemSubjectList$;
    this.dashBoardService.webPageIDSubject$.subscribe(id => {
      this.selectWebPageId = id;
      this.dashBoardService.resetItems();
      this.dashBoardService.getItems(this.selectWebPageId);
    })
  }

  onOpenWebSite(url: string) {
    window.open(url);
  }
  onWindowScroll(event: any) {
    if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) {
      this.offset = this.offset + this.limit;
      this.dashBoardService.getItems(this.selectWebPageId, this.offset, this.limit);
    }
  }

}
