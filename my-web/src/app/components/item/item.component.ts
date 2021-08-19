import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Observable, of } from 'rxjs';
import { Item } from '../../models/data.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Image } from '../../models/data.model';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  offset?: number=0;
  limit?: number=10;
  itemList$:Observable<{totalDataCount?:number,data?:Item[]}> = of();
  imageList$:Observable<Image[]> = of();
  buttonItems: MenuItem[]=[];
  selectedItem:Item={};
  display: boolean = false;
  @ViewChild('appGallery') appGallery:any;
  constructor(private itemService:ItemService,private route: ActivatedRoute,private imageService:ImageService,    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
   console.log( this.route.snapshot.params.id)
    this.itemService.getItems( this.route.snapshot.params.id);
    this.itemList$=this.itemService.itemSubjectList$;
    this.buttonItems = [
      {label: '看美照', icon: 'pi pi-search', command:()=>{
        this.display = true;
        this.appGallery.displayGallery=this.display;
        this.imageList$=this.imageService.getImageData(this.selectedItem.ID)
        // this.imageDialog.maximize()
      }},
      {label: '外部連結', icon: 'pi pi-external-link',command: () => {
        window.open(this.selectedItem.Url);
      }},
      {separator:true},
      {label: '刪除', icon: 'pi pi-trash',badgeStyleClass:"{backgroundColor:'var(--blue-500)'}", command: () => {

        this.confirmationService.confirm({
          message: `你確定要刪除 ${this.selectedItem.Title}`,
          accept: () => {
            this.itemService.deleteItems(this.selectedItem.ID).subscribe((r:any)=>{
              this.messageService.add({ severity: 'success', summary: `${r["message"]}`, detail: `已刪除 => ${this.selectedItem.Title}` });
              this.itemService.getItems( this.route.snapshot.params.id,this.offset,this.limit);
            })
          }
        });
      }},
  ];
  }
  onSelectRow(itemData:Item){
    this.selectedItem=itemData;
  }
  paginate(event:any){
    console.log(event.page)
    this.offset=event.page;
  this.itemService.getItems( this.route.snapshot.params.id,this.offset,this.limit);
  }


}
