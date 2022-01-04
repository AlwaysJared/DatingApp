import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  baseUrl = environment.apiUrl;
  email: string;
  token: string;
  resetForm: FormGroup;
  validationErrors: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public accountService: AccountService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.email = this.route.snapshot.queryParamMap.get('email');
    // console.log('User email: ' + this.email);
    this.token = this.route.snapshot.queryParamMap.get('token');
    // console.log('Reset token: ' + this.token);
  }

  initializeForm() {
    this.resetForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}'),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.resetForm.controls.password.valueChanges.subscribe(() => {
      this.resetForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: true };
    };
  }

  resetPassword() {
    this.accountService
      .resetPassword({
        email: this.email,
        token: this.token,
        newPassword: this.resetForm.controls['confirmPassword'].value,
      })
      .subscribe(
        (response) => {
          this.toastr.success(
            'Password for ' + this.email + ' successfully changed!'
          );
          this.router.navigateByUrl('/');
        },
        (error) => {
          this.toastr.error(error.error);
        }
      );
  }
}
