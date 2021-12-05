import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/_models/Pagination';
import { Photo } from 'src/app/_models/photo';
import { PhotoParams } from 'src/app/_models/PhotoParams';
import { AdminService } from 'src/app/_services/admin.service';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-photo-managment',
  templateUrl: './photo-managment.component.html',
  styleUrls: ['./photo-managment.component.css']
})
export class PhotoManagmentComponent implements OnInit {
  photos: Photo[] = [];
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  photoParams: PhotoParams;

  constructor(private adminService: AdminService, private confirmService: ConfirmService) {
    this.photoParams = this.adminService.getPhotoParams();
  }
  

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval(){
    this.adminService.setPhotoParams(this.photoParams);
    this.loading = true;
    this.adminService
      .getPhotosForApproval(this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.photos = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      });
  }

  approvePhoto(id: Number){
    this.confirmService
      .confirm(
        'Photo Approval Confirmation',
        'Are you sure you want to approve this photo?'
      )
      .subscribe((result) => {
        if (result) {
          this.adminService.approvePhoto(id).subscribe(() => {
            this.photos.splice(
              this.photos.findIndex((m) => m.id === id),
              1
            );
          });
        }
      });
  }

  rejectPhoto(id: Number){
    this.confirmService
      .confirm(
        'Photo Rejection Confirmation',
        'Are you sure you want to reject this photo?'
      )
      .subscribe((result) => {
        if (result) {
          this.adminService.rejectPhoto(id).subscribe(() => {
            this.photos.splice(
              this.photos.findIndex((m) => m.id === id),
              1
            );
          });
        }
      });
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.getPhotosForApproval();
    }
  }

}
