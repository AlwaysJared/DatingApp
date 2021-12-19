import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  user: User;
  isAdmin: boolean;

  constructor(public accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      if(this.user.roles.includes("Admin"))
        this.isAdmin = true;
      else
        this.isAdmin = false;
    });
  }

  ngOnInit(): void {
  }

}
