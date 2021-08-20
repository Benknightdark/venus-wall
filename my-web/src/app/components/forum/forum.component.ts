import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Observable, of } from 'rxjs';
import { Forum, ForumWebPage, WebPage } from '../../models/data.model';
import { WebPageService } from '../../services/web-page.service';
import { ItemService } from '../../services/item.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { v4 as uuidv4 } from 'uuid';
import { FormType } from '../../models/data.enum'
import { DashboardService } from '../../services/dashboard.service';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  itemList$: Observable<Forum[]> = of();
  webPageList$: Observable<{ [name: string]: WebPage[] }> = of();
  expanded: Boolean = false;
  display: Boolean = false;
  displayFormModal: Boolean = false;
  formModalTitle: string = "";
  formModalType: FormType = FormType.Create;
  selectedWebPage: WebPage = {}
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  cols: any[] = [];
  forumWebPageData: ForumWebPage = { forum: {}, webPageList: [] };
  constructor(
    private forumService: ForumService,
    private webPageService: WebPageService,
    private itemService: ItemService,
    private dashBoardService: DashboardService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'Name', header: '看版名稱' },
      { field: 'Url', header: '連結' },
    ];
    this.itemList$ = this.forumService.getForumData();
    this.webPageList$ = this.webPageService.webPageSubjectList$;
    this.forumService.forumDetailSubject$.subscribe(a => {
      this.forumWebPageData = a;
    })
  }
  onGetDetail(item: Forum) {
    item.Expanded = !item.Expanded;
    if (item.Expanded) {
      this.webPageService.getWebPageByForumID(item.ID);
    }

  }
  onOpenExecuteCrawlerModal(webPageData: WebPage) {
    this.display = true;
    this.selectedWebPage = webPageData;
  }
  onSubmit() {
    if (this.startPageNumber <= -1 || this.endPageNumber <= -1) {
      return;
    }
    this.itemService.updateItems(this.selectedWebPage.ID, this.startPageNumber, this.endPageNumber).subscribe();
    this.display = false;
    this.messageService.add({ severity: 'success', summary: '執行爬蟲工作', detail: `抓取 => ${this.selectedWebPage.Name} 看版資料` });
  }
  onDeleteForum(item: Forum) {
    this.confirmationService.confirm({
      message: `你確定要刪除 ${item.Name}`,
      accept: () => {
        this.forumService.deleteForum(item.ID).subscribe((r: any) => {
          this.messageService.add({ severity: 'success', summary: `${r["message"]}`, detail: `已刪除 => ${item.Name}` });
          this.itemList$ = this.forumService.getForumData();
        });
      }
    });

  }
  //#region form functions
  onOpenCreateModal() {
    this.forumWebPageData.webPageList = [];
    this.forumWebPageData.webPageList.push({ ID: uuidv4(), Name: "", Url: "", Enable: true });
    this.formModalTitle = "新增資料"
    this.formModalType = FormType.Create;
    this.displayFormModal = true;
  }
  onOpenEditModal(item: Forum) {
    this.forumService.getForumDetailData(item.ID);
    this.formModalTitle = "編輯資料"
    this.formModalType = FormType.Edit;
    this.displayFormModal = true;
  }
  onAddNewRow() {
    this.forumWebPageData.webPageList?.push({ ID: uuidv4(), Name: "", Url: "" })
  }
  onDeleteRow(index: number) {
    this.forumWebPageData.webPageList?.splice(index, 1);
  }
  onFormSubmit() {
    let i = 1;
    switch (this.formModalType) {
      case FormType.Create:
        this.forumWebPageData.forum!.ID = uuidv4();
        this.forumWebPageData.forum!.CreatedTime = Date.now().toLocaleString();
        for (const iterator of this.forumWebPageData.webPageList!) {
          iterator.Seq = i;
          iterator.ForumID = this.forumWebPageData.forum!.ID;
          i++;
        }
        this.forumService.createForumData(this.forumWebPageData).subscribe((a: any) => {
          console.log(a)
          this.displayFormModal = false;
          this.messageService.add({ severity: 'success', summary: '新增資料', detail: `${a["message"]}` });
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
          this.messageService.add({ severity: 'success', summary: '修改資料', detail: `${a["message"]}` });
        })
        this.itemList$ = this.forumService.getForumData();
        this.dashBoardService.getPageListSubject();
        break;
      default:
        break;
    }


  }
  //#endregion
}
