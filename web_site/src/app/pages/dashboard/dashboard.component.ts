import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ImageService } from '../../services/image.service';
import { Observable, of, Subscription } from 'rxjs';
import { WebPage, Item, Image } from '../../models/data.model';
import { NzImageService } from 'ng-zorro-antd/image';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  webPageList$: Observable<WebPage[]> = of();
  selectWebPageId: string | undefined = "";
  itemList$: Observable<Item[]> = of();
  offset: number = 0;
  limit: number = 30;
  selectedWebPageSub$!: Subscription
  constructor(private dashBoardService: DashboardService, private imageService: ImageService, private nzImageService: NzImageService) { }

  ngOnInit(): void {
    this.itemList$ = this.dashBoardService.itemSubjectList$;
    this.selectedWebPageSub$ = this.dashBoardService.webPageIDSubject$.subscribe(id => {
      this.selectWebPageId = id;
      this.dashBoardService.resetItems();
      this.dashBoardService.getItems(this.selectWebPageId);
    })
  }
  ngOnDestroy(): void {
    this.selectedWebPageSub$.unsubscribe();
  }
  onWindowScroll(event: any) {
    if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) {
      this.offset = this.offset + 1;
      this.dashBoardService.getItems(this.selectWebPageId, this.offset, this.limit);
    }
  }
  onOpenGallery(id: any) {
    this.imageService.getImageData(id).pipe(
      map(data => data.map(a => { return { src: a.Url } }))
    ).subscribe(r => {
      this.nzImageService.preview(r, { nzZoom: 1, nzRotate: 0 });
    })
  }
  onOpenSimilarityGallery(data:Item) {
    const ItemIDArray:string[]=[]
    ItemIDArray.push(data.ID!)
    for (const iterator of data.WebPageSimilarity!) {
      ItemIDArray.push(iterator.SimilarityItemID!)
    }

    this.imageService.getMultiItemImageData(ItemIDArray!).pipe(
    map(data => data.map(a => { return { src: a.Url } }))
    ).subscribe(r => {
      this.nzImageService.preview(r, { nzZoom: 1, nzRotate: 0 });
    })
  }
}
