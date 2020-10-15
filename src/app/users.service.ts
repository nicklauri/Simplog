import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = 'https://localhost:5001/api/Users';
  constructor(private http: HttpClient) { }

  getUsers() {
    // https://localhost:5001/api/Users/List
    return this.http.get<User[]>(`${this.url}/List`);
  }

  login(username: string, password: string) {
    // POST https://localhost:5001/api/Users
    let headers = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" });
    return this.http.post<string>(`${this.url}`, `username=${username}&password=${password}`,
      { headers });
  }
}
