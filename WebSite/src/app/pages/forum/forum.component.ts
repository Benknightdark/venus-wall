import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Observable, of } from 'rxjs';
import { Forum, ForumWebPage, TaskInfo, WebPage } from '../../models/data.model';
import { DashboardService } from '../../services/dashboard.service';
import { ItemService } from '../../services/item.service';
import { WebPageService } from '../../services/web-page.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormType } from '../../models/data.enum';
import { v4 as uuidv4 } from 'uuid';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  itemList$: Observable<Forum[]> = of();
  webPageList$: Observable<{ [name: string]: WebPage[] }> = of();
  hideCrawlerForm: boolean = true;
  selectedWebPage!: WebPage;
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  displayFormModal: boolean = false;
  formModalTitle: string = "";
  formModalType: FormType = FormType.Create;
  forumWebPageData: ForumWebPage = { forum: {}, webPageList: [] };
  cols!: any[];
  curretnTaskStatusList$: Observable<{ [webPageId: string]: TaskInfo }> = of();

  constructor(
    private forumService: ForumService,
    private webPageService: WebPageService,
    private itemService: ItemService,
    private dashBoardService: DashboardService,
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.itemList$ = this.forumService.getForumData();
    this.webPageList$ = this.webPageService.webPageSubjectList$;
    this.forumService.forumDetailSubject$.subscribe(a => {
      this.forumWebPageData = a;
    })
    this.curretnTaskStatusList$ = this.taskService.currentTaskStatusList$;
    this.cols = [
      { field: 'Name', header: '看版名稱' },
      { field: 'Url', header: '連結' },
    ];
  }
  showChange(data: Forum, event: any) {
    const isExpanded = event as boolean
    data.Expanded = isExpanded;
    this.webPageService.getWebPageByForumID(data.ID)
  }
  handleCrawlerFormCancel() {
    this.hideCrawlerForm = true;
  }
  handlCrawlerFormeOk() {
    this.hideCrawlerForm = true;
  }
  onCrawlerFormSubmit(formData: any) {
    if (this.startPageNumber <= -1 || this.endPageNumber <= -1) {
      return;
    }
    this.itemService.updateItems(this.selectedWebPage.ID, this.startPageNumber, this.endPageNumber).subscribe((r: any) => {
      this.taskService.getCurrentTaskStatus(this.selectedWebPage.ID!, r['task-id'])
    });
    this.hideCrawlerForm = true;
    this.messageService.info(`抓取 => ${this.selectedWebPage.Name} 看版資料`);
  }
  onOpenEditModal(item: Forum) {
    this.forumService.getForumDetailData(item.ID);
    this.formModalTitle = "編輯資料"
    this.formModalType = FormType.Edit;
    this.displayFormModal = true;
  }
  onOpenCreateModal() {
    this.forumWebPageData.webPageList = [];
    this.forumWebPageData.webPageList.push({ ID: uuidv4(), Name: "", Url: "", Enable: true });
    this.formModalTitle = "新增資料"
    this.formModalType = FormType.Create;
    this.displayFormModal = true;
  }
  onAddNewRow() {
    this.forumWebPageData.webPageList = [...this.forumWebPageData.webPageList!, { ID: uuidv4(), Name: "", Url: "", Enable: true }];
  }
  onDeleteRow(deleteRow: WebPage) {
    this.forumWebPageData.webPageList = this.forumWebPageData.webPageList?.filter(a => a.ID != deleteRow.ID);
  }
  onFormSubmit() {
    let i = 1;
    switch (this.formModalType) {
      case FormType.Create:
        this.forumWebPageData.forum!.ID = uuidv4();
        this.forumWebPageData.forum!.CreatedTime = Date.now().toLocaleString();
        this.forumWebPageData.forum!.Enable = true;
        for (const iterator of this.forumWebPageData.webPageList!) {
          iterator.Seq = i;
          iterator.ForumID = this.forumWebPageData.forum!.ID;
          i++;
        }
        console.log(this.forumWebPageData)
        this.forumService.createForumData(this.forumWebPageData).subscribe((a: any) => {
          this.displayFormModal = false;
          this.messageService.success(`新增資料 => ${a["message"]}`);
        })
        this.itemList$ = this.forumService.getForumData();
        this.dashBoardService.getPageListSubject()
        break;
      case FormType.Edit:
        for (const iterator of this.forumWebPageData.webPageList!) {
          iterator.Seq = i;
          iterator.ForumID = this.forumWebPageData.forum!.ID;
          iterator.Enable = true;
          i++;
        }
        this.forumService.updateForumData(this.forumWebPageData).subscribe((a: any) => {
          this.displayFormModal = false;
          this.messageService.success(`修改資料 => ${a["message"]}`);
        })
        this.itemList$ = this.forumService.getForumData();
        this.dashBoardService.getPageListSubject();
        break;
      default:
        break;
    }
  }

  onDeleteForum(item: Forum) {
    this.modalService.confirm({
      nzTitle: `你確定要刪除 ${item.Name} 嗎？`,
      nzOnOk: () => {
        this.forumService.deleteForum(item.ID).subscribe((r: any) => {
          this.messageService.warning(`已刪除 => ${item.Name}`);
          this.itemList$ = this.forumService.getForumData();
        });
      }
    });


  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.forumWebPageData.webPageList!, event.previousIndex, event.currentIndex);
    const temp = this.forumWebPageData.webPageList!;
    this.forumWebPageData.webPageList = [];
    this.forumWebPageData.webPageList = [...this.forumWebPageData.webPageList, ...temp]
  }
  onRefreshCurrentTaskInfo(webPageId: string | undefined) {
    this.taskService.getCurrentTaskStatus(webPageId!);
  }

}
