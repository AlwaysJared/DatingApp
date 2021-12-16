import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';

@Injectable({
  providedIn: 'root'
})
export class MemberAccountResolver implements Resolve<boolean> {
  user: User;
  constructor(private memberService: MembersService, private accountService: AccountService)
  {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe(user => {this.user = user});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.memberService.getMember(this.user.username);
  }
}
