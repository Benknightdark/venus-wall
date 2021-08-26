import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { ItemService } from '../../services/item.service';
import { WebPageService } from '../../services/web-page.service';
import { Observable, of } from 'rxjs';
import { Item, WebPage } from '../../models/data.model';
import { Image } from '../../models/data.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzImageService } from 'ng-zorro-antd/image';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  offset?: number = 1;
  limit?: number = 10;
  itemList$: Observable<{ totalDataCount?: number, data?: Item[] }> = of();
  imageList$: Observable<Image[]> = of();
  webPageData$!: Observable<WebPage>;
  loading = true;
  keyWord: string = "";
  sortColumnName: string = ''
  constructor(private itemService: ItemService, private route: ActivatedRoute, private imageService: ImageService, private webPageService: WebPageService, private nzImageService: NzImageService) { }

  ngOnInit(): void {
    this.webPageData$ = this.webPageService.getWebPageByID(this.route.snapshot.params.id)
    this.itemService.getItems(this.route.snapshot.params.id);
    this.itemList$ = this.itemService.itemSubjectList$;
    this.loading = false;
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || undefined;
    const sortOrder = (currentSort && currentSort.value) || undefined;
    this.offset = pageIndex;
    this.itemService.getItems(this.route.snapshot.params.id, pageIndex - 1, pageSize, this.keyWord, sortField, sortOrder);
  }
  onSearch() {
    this.loading = true;
    this.offset = 1;
    this.itemService.getItems(this.route.snapshot.params.id, this.offset - 1, this.limit, this.keyWord);
    this.loading = false;
  }
  onOpenGallery(item: WebPage) {
    this.imageService.getImageData(item.ID).pipe(
      map(data => data.map(a => { return { src: a.Url } }))
      ).subscribe(r => {
      this.nzImageService.preview(r, { nzZoom: 1, nzRotate: 0 });
    })
  }

}
