import { Injectable, Injector } from '@angular/core';
import { Order } from '../model/order';
import { BaseResourceService } from '../shared/base-resource.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService extends BaseResourceService<Order> {

  constructor(
    public injector: Injector) { 
    super('order', injector);
  }

}
