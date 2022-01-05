import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { ConfirmService } from '../_services/confirm.service';
import { MembersService } from '../_services/members.service';
import { PresenceService } from '../_services/presence.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  member: Member;
  activeTab: TabDirective;
  user: User;
  enable = false;
  change = false;
  valueChange = false;
  changeEvent: MouseEvent;

  constructor(
    public presence: PresenceService,
    private route: ActivatedRoute,
    private memberService: MembersService,
    private toastr: ToastrService,
    public accountService: AccountService,
    private confirmService: ConfirmService,
    private router: Router
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.member = data.member;
    });
    // console.log(this.member);
    // this.loadMember();

    // this.route.queryParams.subscribe(params => {
    //   params.tab ? this.selectTab(params.tab) : this.selectTab(0)
    // })
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe((member) => {
      this.member = member;
    });
  }

  sendConfirmation(){
    this.accountService.sendConfirmation({ToEmail: this.user.email, ClientURI: location.origin + '/confirm-email'}).subscribe(respnse => {
      this.toastr.success('Confirmation email sent!');
    }, error => {
      this.toastr.error(error);
    });
  }

  deleteMember(member: Member) {
    this.confirmService
      .confirm(
        'Account Deletion',
        'Are you sure you want to delete your account? This cannot be undone.'
      )
      .subscribe((result) => {
        if (result) {
          this.memberService.deleteMember(member).subscribe(() => {
            this.toastr.success('account successfully deleted');
          });
          this.accountService.logout();
          this.router.navigateByUrl('/');
        }
      });
  }

  onChange(value: boolean) {
    this.change = value;
  }

  onChangeEvent(event: MouseEvent) {
    console.log(event, event.toString(), JSON.stringify(event));
    this.changeEvent = event;
  }

  onValueChange(value: boolean) {
    this.valueChange = value;
  }
}
