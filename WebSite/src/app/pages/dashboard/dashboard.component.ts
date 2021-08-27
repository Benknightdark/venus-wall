import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ImageService } from '../../services/image.service';
import { Observable, of } from 'rxjs';
import { WebPage, Item, Image } from '../../models/data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  webPageList$: Observable<WebPage[]> = of();
  selectWebPageId: string | undefined = "";
  itemList$: Observable<Item[]> = of();
  offset: number = 0;
  limit: number = 30;
  constructor(private dashBoardService: DashboardService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.itemList$ = this.dashBoardService.itemSubjectList$;
    this.dashBoardService.webPageIDSubject$.subscribe(id => {
      console.log(id)
      this.selectWebPageId = id;
      this.dashBoardService.resetItems();
      this.dashBoardService.getItems(this.selectWebPageId,this.offset,this.limit);
    })
  }
  onWindowScroll(ev:any){
    console.log(ev)
  }

}
