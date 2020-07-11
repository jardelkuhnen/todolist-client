import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  protected url = environment.url;

  constructor(
        private http: HttpClient,
        private storageService: StorageService) {
          
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
      return this.http.post<any>(`${this.url}/auth`, { email, password })
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                
                this.storageService.setItem('currentUser', JSON.stringify(user));  
                // localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }

            return user;
        }));
  }

  register(userRegister: User) {
    return this.http.post<any>(`${this.url}/auth/register`, userRegister);
  }

  resetPassword(resetPassword) {
    return this.http.post<any>(`${this.url}/auth/reset`, resetPassword);
  }

  logout() {
      // remove user from local storage to log user out
      this.storageService.removeItem('currentUser');
      // localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}