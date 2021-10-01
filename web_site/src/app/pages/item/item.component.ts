import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { ItemService } from '../../services/item.service';
import { Observable, of } from 'rxjs';
import { Item ,WebPage} from '../../models/data.model';
import { Image } from '../../models/data.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzImageService } from 'ng-zorro-antd/image';
import { map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

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
  loading = true;
  keyWord: string = "";
  sortColumnName: string = ''
  sortFiled: string | undefined = '';
  sortOrder: string | undefined = '';
  pageTitle: Observable<any>=of();
  constructor(private itemService: ItemService, private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private nzImageService: NzImageService, private messageService: NzMessageService,
    private modalService: NzModalService) { }

  ngOnInit(): void {
    this.pageTitle=this.itemService.getItemPageTitle(this.route.snapshot.params.id);
    this.itemList$ = this.itemService.itemSubjectList$;
    this.itemService.getItems(this.route.snapshot.params.id);
    this.loading = false;
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || undefined;
    const sortOrder = (currentSort && currentSort.value) || undefined;
    this.offset = pageIndex;
    this.sortFiled = sortField;
    this.sortOrder = sortOrder;
    this.itemService.getItems(this.route.snapshot.params.id, this.offset! - 1, pageSize, this.keyWord, this.sortFiled, this.sortOrder);
  }
  onSearch() {
    this.loading = true;
    this.offset = 1;
    this.itemService.getItems(this.route.snapshot.params.id, this.offset - 1, this.limit, this.keyWord);
    this.loading = false;
  }
  onOpenGallery(id: string) {
    this.imageService.getImageData(id).pipe(
      map(data => data.map(a => { return { src: a.Url } }))
    ).subscribe(r => {
      this.nzImageService.preview(r, { nzZoom: 1, nzRotate: 0 });
    })
  }
  onDeleteItem(item: Item) {
    this.modalService.confirm({
      nzTitle: `你確定要刪除 ${item.Title} 嗎？`,
      nzOnOk: () => {
        this.itemService.deleteItems(item.ID).subscribe((r: any) => {
          this.messageService.warning(`已刪除 => ${item.Title}`);
          this.itemService.getItems(this.route.snapshot.params.id, this.offset! - 1, this.limit, this.keyWord, this.sortFiled, this.sortOrder);
        });
      }
    });
  }

}
