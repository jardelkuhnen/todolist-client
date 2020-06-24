import { Injectable, Injector } from '@angular/core';
import { OrderItem } from '../model/orderItem';
import { BaseResourceService } from '../shared/_services/base-resource.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends BaseResourceService<OrderItem> {

  constructor(public injector: Injector) { 
    super('itens_order', injector);
  }


  public getOrderItensByOrdersId(orderId): Observable<OrderItem[]> {
		return this.http.get<OrderItem[]>(`${this.url}/itens_order/${orderId}`, super.httpJsonAuth());
  }
  
  public deleteItem(itemId): Observable<any> {
    return this.http.delete(`${this.url}/itens_order/${itemId}`, super.httpJsonAuth());
  }

}
