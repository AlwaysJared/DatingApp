import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) {}

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    );
  }

  sendConfirmation(model: any) {
    // console.log("made it to send confirmation");
    // console.log(model);
    // console.log(this.baseUrl + 'email/send-email-confirmation');
    return this.http.post(this.baseUrl + 'email/send-email-confirmation', {ToEmail: model.ToEmail, ClientURI: model.ClientURI});
  }

  sendReset(model: any) {
    // console.log("made it to send reset");
    // console.log(model);
    // console.log(this.baseUrl + 'email/send-password-reset');
    return this.http.post(this.baseUrl + 'email/send-password-reset', {ToEmail: model.ToEmail, ClientURI: model.ClientURI});
  }

  confirmEmail(model: any){
    return this.http.get(this.baseUrl + 'account/confirm-email', {params: {email: model.email, token: model.token}});
  }

  resetPassword(model: any){
    return this.http.post(this.baseUrl + 'account/reset-password', {Email: model.email, Token: model.token, NewPassword: model.newPassword});
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]))
  }
}
