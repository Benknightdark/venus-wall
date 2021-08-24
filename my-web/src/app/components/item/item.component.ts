import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Observable, of } from 'rxjs';
import { Item, WebPage } from '../../models/data.model';
import { ConfirmationService, MenuItem, MessageService, SortEvent } from 'primeng/api';
import { Image } from '../../models/data.model';
import { ImageService } from '../../services/image.service';
import { GalleryComponent } from '../../utils/gallery/gallery.component';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { WebPageService } from '../../services/web-page.service';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  offset?: number = 0;
  limit?: number = 10;
  itemList$: Observable<{ totalDataCount?: number, data?: Item[] }> = of();
  imageList$: Observable<Image[]> = of();
  buttonItems: MenuItem[] = [];
  selectedItem: Item = {};
  display: boolean = false;
  keyWord: string = "";
  sort: string = "";
  mode: string = "";
  webPageData$!: Observable<WebPage>;
  @ViewChild('appGallery') appGallery!: GalleryComponent;
  @ViewChild('p', { static: false }) paginator!: Paginator;
  @ViewChild('dt', { static: false }) dt!: Table;
  isStackLayout:boolean=false;
  constructor(private itemService: ItemService, private route: ActivatedRoute, private imageService: ImageService, private messageService: MessageService, private webPageService:WebPageService,
    private confirmationService: ConfirmationService,private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {

    this.breakpointObserver.observe([Breakpoints.WebLandscape]).subscribe(result => {
      console.log(`Handset: ${result.matches}`);
      this.isStackLayout=!result.matches?true:false;
    });
    this.webPageData$=this.webPageService.getWebPageByID(this.route.snapshot.params.id)
    this.itemService.getItems(this.route.snapshot.params.id);
    this.itemList$ = this.itemService.itemSubjectList$;
    this.buttonItems = [
      {
        label: '看美照', icon: 'pi pi-search', command: () => {
          this.display = true;
          this.appGallery.displayGallery = this.display;
          this.imageList$ = this.imageService.getImageData(this.selectedItem.ID)
        }
      },
      {
        label: '外部連結', icon: 'pi pi-external-link', command: () => {
          window.open(this.selectedItem.Url);
        }
      },
      { separator: true },
      {
        label: '刪除', icon: 'pi pi-trash', badgeStyleClass: "{backgroundColor:'var(--blue-500)'}", command: () => {
          this.confirmationService.confirm({
            message: `你確定要刪除 ${this.selectedItem.Title}`,
            accept: () => {
              this.itemService.deleteItems(this.selectedItem.ID).subscribe((r: any) => {
                this.messageService.add({ severity: 'success', summary: `${r["message"]}`, detail: `已刪除 => ${this.selectedItem.Title}` });
                this.itemService.getItems(this.route.snapshot.params.id, this.offset, this.limit);
              })
            }
          });
        }
      },
    ];
  }
  onSelectRow(itemData: Item) {
    this.selectedItem = itemData;
  }
  onPaginate(event: any) {
    this.dt.resetScrollTop()
    this.offset = event.page;
    this.itemService.getItems(this.route.snapshot.params.id, this.offset, this.limit, this.keyWord, this.sort, this.mode);
  }
  onSearch() {
    this.offset = 0;
    this.paginator.changePage(0);
  }
  onSort(event: SortEvent) {
    this.sort = event.field!;
    this.mode = event.order == -1 ? "desc" : "asc";
    this.onSearch();
  }
}
