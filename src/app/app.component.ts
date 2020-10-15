import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsersService } from './users.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Simplog';
  loginForm;
  loginMessage = '';
  isSubmitted = false;  // TODO: use state instead of a lot of booleans.
  isSuccessful = false;
  isListing = false;
  userInfo = { id: 0, username: '' };
  data: User[];

  constructor(private usersService: UsersService, private formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      username: '',
      password: '',
    });
  }

  login(userData) {
    this.isListing = false;
    this.isSubmitted = true;
    this.loginMessage = '';
    this.userInfo.username = userData.username;

    this.usersService.login(userData.username, userData.password)
      .pipe(catchError(error => {
        // catch errors.
        if (error.error instanceof ErrorEvent) {
          this.loginMessage = `Error: ${error.error.message}`;
        } else {
          this.loginMessage = `Error: ${error.message}`;
        }
        return of(this.loginMessage);
      }))
      .subscribe(result => {
        this.isSuccessful = false;
        // `result` value:
        //    <=0     : wrong username or password.
        //    >0      : found a matched password with username, result is user ID.
        //    `string`: other kind of error.
        let id = parseInt(result);
        if (isNaN(id)) {
          this.loginMessage = `${result}`;
        } else if (id <= 0) {
          this.loginMessage = `Wrong username or password (responsed: ${id}).`;
        } else {
          this.isSuccessful = true;
          this.userInfo.id = id;
          this.loginMessage = '';
        }
      });

  }

  logout() {
    this.isListing = false;
    this.isSubmitted = false;
    this.isSuccessful = false;
    this.userInfo = { id: 0, username: '' };
  }

  getUsers() {
    this.isSubmitted = false;
    this.isListing = true;
    this.loginMessage = '';
    this.usersService.getUsers()
      .pipe(catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.loginMessage = `Error: ${error.error.message}`;
        } else {
          this.loginMessage = `Error: ${error.message}`;
        }
        return of([]);
      }))
      .subscribe(data => this.data = data);
  }
}


