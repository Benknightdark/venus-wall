import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Observable, of } from 'rxjs';
import { Item } from '../../models/data.model';
import { MenuItem } from 'primeng/api';
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
  constructor(private itemService:ItemService,private route: ActivatedRoute,private imageService:ImageService) { }

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
      }},
  ];
  }
  onSelectRow(itemData:Item){
    this.selectedItem=itemData;
  }
  paginate(event:any){
  this.itemService.getItems( this.route.snapshot.params.id,event.page,this.limit);
  }


}
