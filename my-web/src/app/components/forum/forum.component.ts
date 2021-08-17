import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Observable, of } from 'rxjs';
import { Forum, ForumWebPage, WebPage } from '../../models/data.model';
import { WebPageService } from '../../services/web-page.service';
import { ItemService } from '../../services/item.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  itemList$: Observable<Forum[]> = of();
  webPageList$: Observable<{ [name: string]: WebPage[] } > = of();
  expanded: Boolean = false;
  display:Boolean=false;
  displayCreate:Boolean=false;
  selectedWebPage:WebPage={}
  startPageNumber:number=0;
  endPageNumber:number=0;
  cols: any[]=[];
    forumWebPageData:ForumWebPage={forum:{},webPageList:[]};
  constructor(private forumService: ForumService,private webPageService:WebPageService
    ,private itemService:ItemService,private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'Name', header: '看版名稱' },
      { field: 'Url', header: '連結' },
  ];
    this.itemList$ = this.forumService.getForumData();
    this.webPageList$=this.webPageService.webPageSubjectList$;
  }
  onGetDetail(item: Forum) {
    item.Expanded=!item.Expanded;
    if(item.Expanded){
      this.webPageService.getItemByForumID(item.ID);
    }
  }
  onOpenExecuteCrawlerModal(webPageData:WebPage){
    this.display=true;
    this.selectedWebPage=webPageData;
  }
  onOpenCreateModal(){
    this.forumWebPageData.webPageList=[];
    this.forumWebPageData.webPageList.push({ID:"",Name:"",Url:""})
    this.displayCreate=true;
  }
  onAddNewRow(){
    this.forumWebPageData.webPageList?.push({ID:"",Name:"",Url:""})
  }
  onCreateSubmit(){
      console.log(this.forumWebPageData)
  }
  onSubmit(){
    if(this.startPageNumber<=-1||this.endPageNumber<=-1){
      return;
    }
    this.itemService.updateItems(this.selectedWebPage.ID,this.startPageNumber,this.endPageNumber).subscribe();
    this.display=false;
    this.messageService.add({severity:'success', summary:'執行爬蟲工作', detail:`抓取 => ${this.selectedWebPage.Name} 看版資料`});
  }
}
