import { Component, Inject, LOCALE_ID, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { getLocaleDateFormat, FormatWidth, DatePipe } from '@angular/common';
import { Menu } from './model/menu';
import { of, Observable } from 'rxjs';
import { AuthenticationService } from './shared/_services/authentication.service';
import { StorageService } from './shared/_services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  constructor(
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private router: Router) {}

  title: string = 'Todo App';
  menus$: Observable<Menu[]>;
  
  isLogged = this.storageService.getItem('currentUser') != null ? true : false;


  ngOnInit(): void {
    this.menus$ = this.getMenus();
    this.title = 'Task List';

    this.storageService.watchStorage().subscribe(data => {
      if(data === 'removed'){ 
        this.isLogged = false;
      } else {
        this.isLogged = true;
      }
    });
  }

    getMenus() {
      return of([
          new Menu('Orders', 'orders'),
      ]);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('login');
  }
  
}
