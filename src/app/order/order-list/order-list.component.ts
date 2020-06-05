import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { OrderServiceService } from '../order-service.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Order } from 'src/app/model/order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  private unsubscribe$: Subject<any> = new Subject<any>();
  
  orders: Observable<Order[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messages: MatSnackBar,
    private fb: FormBuilder,
    private orderService: OrderServiceService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders() {
    this.orderService.getAll()
      .pipe(takeUntil(this.unsubscribe$), tap(p => console.log(p)))
      .subscribe();
    this.orders = this.orderService.getAll();
  }

  onRemove(e: Event, order: Order) {
    this.orderService.delete(order.id).subscribe((data)=> { this.loadOrders(); }, 
    (err)=> {
      console.log(err);
    })
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
