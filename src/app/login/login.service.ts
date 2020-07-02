import { Injectable, Injector } from '@angular/core';
import { User } from '../model/user';
import { BaseResourceService } from '../shared/_services/base-resource.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseResourceService<User>{

  constructor(public injector: Injector) { 
    super('login', injector);
  }


}
