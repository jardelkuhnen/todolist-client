import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/_services/authentication.service';
import { Role } from 'src/app/model/role';
import { first } from 'rxjs/operators';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-login-new',
  templateUrl: './login-new.component.html',
  styleUrls: ['./login-new.component.css']
})
export class LoginNewComponent implements OnInit {

  roles: Role[] = this.getRoles();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private messages: MatSnackBar,
    private loginService: LoginService,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

   // convenience getter for easy access to form fields
   get f() { return this.loginForm.controls; }


  getRoles() {
    return [Role.Admin, Role.User];
  }

  onSubmit() {

    if (!this.loginForm.valid) {
      this.messages.open('Fields required!', "OK", {duration: 5000 });
      return;
    }
    
    let loginRegister: User = {
      email: this.f.email.value,
      password: this.f.password.value,
      role: this.f.role.value
    }

    debugger;

    this.authenticationService.register(loginRegister)
          .subscribe(
              data => {
                  this.router.navigateByUrl('/');
              },
              error => {
                  this.messages.open(error, "OK", {duration: 5000 });
              });

  }
  
}
