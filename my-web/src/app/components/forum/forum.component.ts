import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Observable, of } from 'rxjs';
import { Forum, WebPage } from '../../models/data.model';
import { WebPageService } from '../../services/web-page.service';
import { ItemService } from '../../services/item.service';

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
  selectedWebPage:WebPage={}
  startPageNumber:number=0;
  endPageNumber:number=0;
  constructor(private forumService: ForumService,private webPageService:WebPageService
    ,private itemService:ItemService
    ) { }

  ngOnInit(): void {
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
  onSubmit(){
    if(this.startPageNumber<=-1||this.endPageNumber<=-1){
      console.log('aa')
      return;
    }
    // if(this.startPageNumber>this.endPageNumber){
    //   console.log('bb')
    //   return;
    // }
    this.itemService.updateItems(this.selectedWebPage.ID,this.startPageNumber,this.endPageNumber).subscribe();
    this.display=false;
  }
}
