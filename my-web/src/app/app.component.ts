import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-web';
  display:boolean=true;
  items: MenuItem[]=[];

    ngOnInit() {
        this.items = [
            {label: '首頁', icon: 'pi pi-fw pi-home'},
            {label: '管理', icon: 'pi pi-fw pi-cog'},
        ];
    }
}
