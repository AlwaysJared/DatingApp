import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {
  baseUrl = environment.apiUrl;
  email: string;
  token: string;

  constructor(private route: ActivatedRoute,
    private accountService: AccountService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
    // console.log("User email: " + this.email);
    this.token = this.route.snapshot.queryParamMap.get('token');
    // console.log("Confirmation token: " + this.token);
    this.confirmEmail();
  }

  confirmEmail() {
    this.accountService.confirmEmail({email: this.email, token: this.token}).subscribe(response => {
      this.toastr.success(this.email + ' successfully confirmed!');
    }, error => {
      // this.toastr.error(error)
      console.log(error);
    });
  }
  
}
