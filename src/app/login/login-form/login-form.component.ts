import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/model/user';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loading = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private messages: MatSnackBar,
    private loginService: LoginService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {

    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) { 
      this.router.navigate(['/']);
    }

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {

    if (!this.loginForm.valid) {
      this.messages.open('Email and Password is required!', "OK", {duration: 15000 });
      return;
    }
    
    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
              data => {
                  this.router.navigateByUrl('/');
              },
              error => {
                  console.log(error);
                  this.messages.open(error, "OK", {duration: 5000 });
                  this.loading = false;
              });

  }

}
