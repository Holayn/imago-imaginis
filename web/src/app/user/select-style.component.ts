/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { DBService } from '../services/db.service';
import { GeneralService } from '../services/general.service';

// Import the modal component
import { ModalComponent } from '../modal/app-modal.component';

@Component({
  selector: 'select-style',
  templateUrl: './select-style.component.html',
  styleUrls: ['../css/app.component.css', '../css/select-style.component.css']
})
export class SelectStyleComponent {
  @ViewChild('modal') modal;
  @ViewChild('uploading') uploading;
  freeUser: boolean = true;
  selectedStyle: Object = {"filter_id": "Select a style", "name":"Select a Style", "path":"../../assets/brush.png"};
  // styles: Array<Object> = [{"style":"Cubism", "example":"../assets/cubism.jpg"}, {"style":"Flowers", "example":"../assets/flowers.jpg"}, {"style":"Starry Night", "example":"../assets/starrynight.jpg"}, {"style":"Oil Painting", "example":"../assets/oil.jpg"}, {"style":"Impressionism", "example":"../assets/impress.jpg"}];
  styles: Array<any> = null; // Comes from DB as [{"filter_id":1,"name":"VanGogh"},...]
  // uploadedImage: File = null;
  filterToUpload: File;
  video: any;
  modalText: String;
  uploadingFilter: boolean = false;
  constructor(private us: UserService, private router: Router, private db: DBService, private gen: GeneralService){
    // Checks to see if the user uploaded a photo from the previous page
    if(this.us.uploadedPhoto != null){
      console.log("Photo user selected");
      // this.uploadedImage = this.gen.uploadedImage;
      // Gets list of filters/styles
      this.db.getFilters().then(filters => {
        this.styles = filters;
        // Convert paths
        for(var i=0; i<this.styles.length; i++){
          this.styles[i].path = this.db.url + this.styles[i].path;
        }
        console.log(this.styles);
      });
    }
    // If the user has not uploaded a photo, redirect them to upload page
    else{
      this.router.navigate(['upload']);
    }
  }

  /**
   * This changes the style example image based on user selection
   */
  selectStyle = function(style) {
    this.selectedStyle = style;
    // this.selectedStyle.path = this.db.url + "/" + this.selectedStyle.path;
    console.log(this.selectedStyle);
  }

  /**
   * This uploads the user photo with appropriate filter id to be styled with
   */
  upload = function() {
    // Check to see if the user already has two photos if they're a free user
    this.db.getNumPhotos(this.us.userId).then(async res => {
      if(res.status == 605){
        this.modalText = "You have reached your maximum number of uploaded photos. Please delete some photos before continuing, or upgrade your account. You will be redirected automatically in 5 seconds...";
        this.modal.show();
        var router = this.router;
        setTimeout(function(){
          router.navigate(['home']);
        }, 5000);
      }
      if(this.selectedStyle.filter_id != "Select a style"){
        // Calls the database service
        // While waiting for an upload response (aka upload finished), display an unremovable modal displaying upload status
        this.uploading.show();
        // If the file being uploaded is a video, then...
        if(this.gen.isVideoUpload){
          // Used to get dimensions of the video uploaded
          // TODO: GET DIMENSIONS OF VIDEO UPLOAD
          // Upload the filter if custom is selected
          if(this.selectedStyle.filter_id == "uploadStyle"){
            this.db.uploadFilter(this.filterToUpload, this.us.userId).then(res => {
              // res._body returns the filter id that was just added
              // TODO: Display loading animation while uploading, stop when response received.
              this.db.uploadVideo(this.us.userId, this.us.uploadedPhoto, res._body).then(result => {
                this.router.navigate(['library']);
              });
            });
          }
          else{
            this.db.uploadVideo(this.us.userId, this.us.uploadedPhoto, this.selectedStyle['filter_id']).then(result => {
              this.router.navigate(['library']);
            });
          }
        }
        else{
          // Used to get dimensions of the photo uploaded
          var img = new Image();
          img.src = this.gen.uploadedImage;
          // Upload the filter if custom is selected
          console.log(this.selectedStyle)
          console.log(this.filterToUpload)
          if(this.selectedStyle.filter_id == "uploadStyle"){
            this.db.uploadFilter(this.filterToUpload, this.us.userId).then(res => {
              console.log(res)
              this.db.uploadPhoto(this.us.userId, this.us.uploadedPhoto, res._body, img).then(result => {
                if(result.status == 501){
                  // File size was too large
                  this.modalText = "Max image file size exceeded! 7MB max.";
                  this.uploading.hide();
                  this.modal.show();
                }
                else{
                  this.router.navigate(['library']);
                }
              });
            });
          }
          else{
            this.db.uploadPhoto(this.us.userId, this.us.uploadedPhoto, this.selectedStyle['filter_id'], img).then(result => {
              if(result.status == 501){
                // File size was too large
                this.modalText = "Max image file size exceeded! 7MB max.";
                this.uploading.hide();
                this.modal.show();
              }
              else{
                this.router.navigate(['library']);
              }
            });
          }
        }
      }
      else{
        this.modalText = "Please select a style!";
        this.modal.show();
      }
    });
  }
  

  /**
   * This event fires when a user uploads a filter
   */
  fileChangeEvent = function(fileInput: any) {
    // Verify their upload file type. Only allow .jpg or .png
    if(fileInput.target.files[0].type == "image/jpeg" || fileInput.target.files[0].type == "image/png"){
      this.filterToUpload = fileInput.target.files[0];
      console.log(this.filterToUpload);
      this.uploadingFilter = true;
      this.selectedStyle = {"filter_id": "uploadStyle", "name":"Upload a Style", "path":"../../assets/brush.png"};
      let reader = new FileReader();
      reader.onload = (e: any) => {
          this.selectedStyle.path = e.target.result;
          this.uploadingFilter = false;
      }
      reader.readAsDataURL(this.filterToUpload);
      console.log(this.filterToUpload);
    }
    else{
      this.modalText = "Error: Filetypes accepted: JPG or PNG";
      this.modal.show();
    }
  }
}
