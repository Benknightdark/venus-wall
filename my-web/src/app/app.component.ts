import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { WebpageService } from './services/webpage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-web';
  display: boolean = true;
  items: MenuItem[] = [];
  myProperty$ = new BehaviorSubject<[]>([]);
  constructor(private webPageService: WebpageService) { }
  ngOnInit() {

    this.webPageService.getPageList().subscribe(r => {
      console.log(r)
      this.myProperty$.next(r);
    })
    this.items = [
      { label: '首頁', icon: 'pi pi-fw pi-home' },
      { label: '管理', icon: 'pi pi-fw pi-cog' },
    ];
  }
}
