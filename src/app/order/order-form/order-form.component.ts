import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ɵangular_packages_router_router_b } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderItem } from 'src/app/model/orderItem';
import { OrderServiceService } from '../order-service.service';
import { Order } from 'src/app/model/order';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { OrderItemService } from '../order-item.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  orderForm = this.fb.group({
    orderId: [null, []],
    orderDescription: ['', [Validators.required, Validators.minLength(2)]],
    itemDescription: ['', []],
    itemIsFinished: [false, []],
    itemPrice: ['', []]
  });

  editTitle: boolean = true;
  orderItens: OrderItem[] = [];
  isFinished = false;
  checked = false;
  totalCount = 0;
  
  displayedColumns: string[] = ['description', 'finished', 'actions'];

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
        this.orderItens = data;
        this.populateCountPrice(this.orderItens);
      });

  }

  changeStatusItem(item: OrderItem, event) {

    let orderItem: OrderItem = {
      id: item.id,
      description: item.description,
      isFinished: event.checked,
      price: item.price
    }

    this.orderItemServie.update(orderItem).subscribe();
  }

  edit(item: OrderItem) {
    this.orderForm.get('itemDescription').setValue(item.description);
    this.orderForm.get('itemIsFinished').setValue(item.isFinished);
    this.orderForm.get('itemPrice').setValue(item.price);

    let index: number = this.orderItens.indexOf(item);
    this.orderItens.splice(index, 1);
    
    this.totalCount -= item.price;
  }

  populateForm(orderId)  {
    this.orderService.getById(orderId).subscribe(data => {
      let order: Order = data;

      this.orderForm.get('orderDescription').setValue(order.description);
      this.orderForm.get('orderId').setValue(order.id);
      this.editTitle = false;

    });
  }


  populateCountPrice(itens: OrderItem[]) {
    
    itens.forEach(item => {
        if(item.isFinished) {
          this.totalCount += item.price;
        }  
    });
  }

  updatePriceCountListagem(item: OrderItem) {

    if(item.isFinished) {
      this.totalCount -= item.price;
      return;
    }

    this.totalCount += item.price;
  }

  existsItemSameDescriotion(itemDescription: string): Boolean {

    let exists = false;

    this.orderItens.forEach(item => {
       if(item.description === itemDescription) {
         exists = true;
       }    
    });

    return exists;
  }

  addItem() {
    
    let itemDescription = this.orderForm.get('itemDescription').value;

    if(itemDescription === '') {
      this.messages.open("Insert the item description", "OK", {duration: 2000 });
      return;
    }

    if(this.existsItemSameDescriotion(itemDescription)) {
      this.messages.open("Exists a item with same description!", "OK", {duration: 2000 });
      return;
    }

    let orderItem: OrderItem = {
      description: this.orderForm.get('itemDescription').value,
      isFinished: this.orderForm.get('itemIsFinished').value,
      price: Number(this.orderForm.get('itemPrice').value)
    }  

    if(orderItem.isFinished) {
      this.totalCount += orderItem.price;
    }

    this.orderItens.push(orderItem);
    
    this.orderForm.controls['itemDescription'].setValue('');
    this.orderForm.controls['itemPrice'].setValue('');

  }


  onSubmit() {
    let order: Order = {
      id: this.orderForm.get('orderId').value,
      description: this.orderForm.get('orderDescription').value,
      itens: this.orderItens
    }

    this.orderService.create(order).subscribe((data) => {
      this.messages.open('Itens saved!', "OK", {duration: 5000 });
    }, 
    (err)=> {
      let message = err.error.errors[0].defaultMessage;

      this.messages.open(message, "OK", {duration: 5000 });
    });


    let itemUnfinished: boolean;
    order.itens.forEach(item => {
      if(!item.isFinished) {
        itemUnfinished = true;
        return;
      }
    });      

    if(!itemUnfinished) {
      this.orderForm.reset();
      this.router.navigateByUrl('/');
    }

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  deleteItem(item: OrderItem) {
    let index = this.orderItens.findIndex((it) => it.description === item.description)
    this.orderItens.splice(index, 1);

    this.totalCount -= item.price;
  }

}
