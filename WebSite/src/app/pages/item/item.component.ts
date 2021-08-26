import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { ItemService } from '../../services/item.service';
import { WebPageService } from '../../services/web-page.service';
import { Observable, of } from 'rxjs';
import { Item, WebPage } from '../../models/data.model';
import { Image } from '../../models/data.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

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

  constructor(private itemService: ItemService, private route: ActivatedRoute, private imageService: ImageService, private webPageService:WebPageService,) { }

  ngOnInit(): void {
    this.webPageData$=this.webPageService.getWebPageByID(this.route.snapshot.params.id)
    this.itemService.getItems(this.route.snapshot.params.id);
    this.itemList$ = this.itemService.itemSubjectList$;
    this.loading=false;
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    this.loading=true;
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.itemService.getItems(this.route.snapshot.params.id,pageIndex-1,pageSize);
    this.loading=false;

  }

}
