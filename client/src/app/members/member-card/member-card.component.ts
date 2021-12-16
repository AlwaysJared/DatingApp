import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;
  @Output("loadLikes") loadLikes: EventEmitter<any> = new EventEmitter();
  faHeart = faHeart;
  faHeartBroken = faHeartBroken;

  constructor(private memberService: MembersService,
    private toastr: ToastrService,
    public presence: PresenceService) { }

  ngOnInit(): void {
  }

  addLike(member: Member){
    this.memberService.addLike(member.username).subscribe(() => {
      this.loadLikes.emit();
      this.toastr.success('You liked ' + member.knownAs);
    })
  }

  removeLike(member: Member){
    this.memberService.removeLike(member.username).subscribe(() => {
      this.loadLikes.emit();
      this.toastr.warning('You unliked ' + member.knownAs);
    })
  }
}
