import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ImageService } from '../../services/image.service';
import { Observable, of } from 'rxjs';
import { WebPage, Item, Image } from '../../models/data.model';
import { NzImageService } from 'ng-zorro-antd/image';
import { map } from 'rxjs/operators';

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
  constructor(private dashBoardService: DashboardService, private imageService: ImageService, private nzImageService: NzImageService) { }

  ngOnInit(): void {
    this.itemList$ = this.dashBoardService.itemSubjectList$;
    this.dashBoardService.webPageIDSubject$.subscribe(id => {
      console.log(id)
      this.selectWebPageId = id;
      this.dashBoardService.resetItems();
      this.dashBoardService.getItems(this.selectWebPageId,this.offset,this.limit);
    })
  }
  onWindowScroll(event:any){
    if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) {
      this.offset = this.offset + 1;
      this.dashBoardService.getItems(this.selectWebPageId, this.offset, this.limit);
    }
  }
  onOpenGallery(id:any) {
    this.imageService.getImageData(id).pipe(
      map(data => data.map(a => { return { src: a.Url } }))
      ).subscribe(r => {
      this.nzImageService.preview(r, { nzZoom: 1, nzRotate: 0 });
    })
  }
}
