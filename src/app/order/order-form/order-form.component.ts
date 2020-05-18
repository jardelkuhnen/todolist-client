import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderItem } from 'src/app/model/orderItem';
import { OrderServiceService } from '../order-service.service';
import { Order } from 'src/app/model/order';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { OrderItemService } from '../order-item.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  orderForm = this.fb.group({
    orderId: [null, []],
    orderDescription: ['', [Validators.required, Validators.minLength(2)]],
    itemDescription: ['', [Validators.required, Validators.minLength(2)]],
    itemIsFinished: [false, []]
  });

  editTitle: boolean = true;
  orderItens: OrderItem[];
  isFinished = false;
  
  displayedColumns: string[] = ['description', 'finished', 'actions'];

  dataSource = new MatTableDataSource<OrderItem>(this.orderItens);

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messages: MatSnackBar,
    private fb: FormBuilder,
    private orderService: OrderServiceService,
    private orderItemServie: OrderItemService
  ) { }

  ngOnInit(): void {

    this.orderItens = [{id: 1, description: 'Feijão', isFinished: false}, {id: 1, description: 'Arroz', isFinished: true}];
    const orderId = this.route.snapshot.paramMap.get('id');

    if('new' === orderId) {
      return;
    }
    
    this.populateForm(orderId);
    
    this.orderItemServie.getOrderItensByOrdersId(orderId)
      .pipe(
        takeUntil( this.unsubscribe$ )
      )
      .subscribe((data: OrderItem[]) => {
        this.dataSource = new MatTableDataSource<OrderItem>(data);
      });


  }

  changeStatusItem(item: OrderItem, event) {

    let orderItem: OrderItem = {
      id: item.id,
      description: item.description,
      isFinished: event.checked,
      orderId: this.orderForm.get('orderId').value
    }

    this.orderItemServie.update(orderItem).subscribe();
  }

  populateForm(orderId)  {
    this.orderService.getById(orderId).subscribe(data => {
      let order: Order = data.content[0];

      this.orderForm.get('orderDescription').setValue(order.description);
      this.orderForm.get('orderId').setValue(order.id);
      this.editTitle = false;

    });
  }


  onSubmit() {
    let orderItem: OrderItem = {
      description: this.orderForm.get('itemDescription').value,
      isFinished: this.orderForm.get('itemIsFinished').value,
      orderId: this.orderForm.get('orderId').value
    }

    this.orderItemServie.create(orderItem).subscribe();

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  deleteItem(id: number) {
    this.orderItemServie.deleteItem(id).subscribe();
  }

}
