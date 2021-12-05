import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Photo } from '../_models/photo';
import { PhotoParams } from '../_models/PhotoParams';
import { User } from '../_models/user';
import { AccountService } from './account.service';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  photoParams: PhotoParams;
  user: User;

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.photoParams = new PhotoParams(user);
    })
  }

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }

  getPhotosForApproval(pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber, pageSize);

    return getPaginatedResults<Photo[]>(
      this.baseUrl + 'admin/photos-to-moderate',
      params,
      this.http
    );
  }

  approvePhoto(id: Number){
    return this.http.post(this.baseUrl + 'admin/approve-photo/' + id, {});
  }

  rejectPhoto(id: Number){
    return this.http.post(this.baseUrl + 'admin/reject-photo/' + id, {});
  }

  getPhotoParams() {
    return this.photoParams;
  }

  setPhotoParams(params: PhotoParams){
    this.photoParams = params;
  }

  resetPhotoParams() {
    this.photoParams = new PhotoParams(this.user);
    return this.photoParams
  }
}
