import { Injectable, Injector } from '@angular/core';
import { Order } from '../model/order';
import { BaseResourceService } from '../shared/base-resource.service';
import { Observable } from 'rxjs';
import { OrderItem } from '../model/orderItem';
import { transition } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService extends BaseResourceService<Order> {

  constructor(public injector: Injector) { 
    super('order', injector);
  }


  
}
