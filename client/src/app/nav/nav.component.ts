import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import {
  faUsers,
  faHeart,
  faComments,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  user: User;
  faUsers = faUsers;
  faHeart = faHeart;
  faComments = faComments;
  faUserCog = faUserCog;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
  }

  login(form: NgForm) {
    this.accountService.login(this.model).subscribe((response) => {
      this.router.navigateByUrl('/members');
      form.resetForm();
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
