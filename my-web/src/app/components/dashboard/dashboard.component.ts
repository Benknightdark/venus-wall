import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WebPage, Item } from '../../models/data.model';
import { DashboardService } from '../../services/dashboard.service';
import { Image } from '../../models/data.model'
import { ImageService } from '../../services/image.service';
import { GalleryComponent } from '../../utils/gallery/gallery.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = '女神牆';
  display: boolean = false;
  webPageList$: Observable<WebPage[]> = of();
  selectWebPageId: string | undefined = "";
  itemList$: Observable<Item[]> = of();
  offset: number = 0;
  limit: number = 10;
  @ViewChild('appGallery') appGallery!: GalleryComponent;
  imageList$: Observable<Image[]> = of();

  constructor(private dashBoardService: DashboardService, private imageService: ImageService
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
      this.offset = this.offset + 1;
      this.dashBoardService.getItems(this.selectWebPageId, this.offset, this.limit);
    }
  }
  showGallery(item: Item) {
    console.log(item)
    this.imageList$ = this.imageService.getImageData(item.ID);
    this.display = true;
    this.appGallery.displayGallery = this.display;
  }
}
