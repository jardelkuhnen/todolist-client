import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getLocaleDateFormat, FormatWidth, DatePipe } from '@angular/common';
import { Menu } from './model/menu';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  title: string = 'Listagem de Tarefas';
  menus$: Observable<Menu[]>;

  constructor() {}
    
    ngOnInit(): void {
      this.menus$ = this.getMenus();
      this.title = 'Listagem de Tarefas';
    }

    getMenus() {
      return of([
          new Menu('Orders', 'orders'),
      ]);
  }


 

  
}
