import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Observable, of } from 'rxjs';
import { Forum, ForumWebPage, WebPage } from '../../models/data.model';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  itemList$: Observable<Forum[]> = of();

  constructor(    private forumService: ForumService) { }

  ngOnInit(): void {
    this.itemList$ = this.forumService.getForumData();

  }

}
