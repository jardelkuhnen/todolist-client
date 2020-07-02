import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  protected url = environment.url;

  getAll() {
      return this.http.get<User[]>(`${this.url}/users`);
  }

  getById(id: number) {
      return this.http.get<User>(`${this.url}/users/${id}`);
  }
}