import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Observable, of } from 'rxjs';
import { Forum, WebPage } from '../../models/data.model';
import { WebPageService } from '../../services/web-page.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  itemList$: Observable<Forum[]> = of();
  webPageList$: Observable<WebPage[]> = of();
  expanded: Boolean = false;
  constructor(private forumService: ForumService,private webPageService:WebPageService) { }

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
}
