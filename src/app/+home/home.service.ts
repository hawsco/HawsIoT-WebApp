/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client"
import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { HttpService } from '../shared/smartadmin.http.service';
import { Router } from '@angular/router';
import { ImageService } from './image.service';

@Injectable()
export class HomeService {
  url = 'https://graph.microsoft.com/v1.0';
  file = 'demo.xlsx';
  table = 'Table1';

  imageToShow: any;
  isImageLoading = false;

   private graphUri = "https://graph.microsoft.com/v1.0/me/photo/$value";


   loggedIn = false;

  constructor(
    
    private httpService: HttpService, private zone: NgZone,
    private router: Router , private imageService : ImageService) {
  }

 
  getClient(): MicrosoftGraphClient.Client {
    var client = MicrosoftGraphClient.Client.init({
      authProvider: (done) => {
        done(null, this.httpService.getAccessToken()); //first parameter takes an error if you can't get an access token
      }
    });
    return client;
  }

  getEmail() {

    let email: string;

    this.getMe().subscribe(
      (response) => {
        // console.log('Home Service ',response.mail);
        email = response.mail;
      }
    )

    return email;
  }


  getMe(): Observable<MicrosoftGraph.User> {
    var client = this.getClient();
    return Observable.fromPromise(client
      .api('me')
      .select("displayName, userPrincipalName, id, mail")
      .get()
      .then((res => {

        //console.log(res);
        return res;
      }))
    );
  }


  checkDomain() {

    let email: string;

    let domain = '@Hawsco.com';

    this.getMe().subscribe(

      (response) => {

        email = response.userPrincipalName;

        if (email.search(domain) == -1) {

          // console.log('Not Haws Login');

          this.router.navigate(['/home/miscellaneous/domain']);

        } else {

          // console.log('Haws Login');

          this.zone.run(() => {

            this.setLogIn(true);

            this.router.navigate(['/home/home']);
          });

        }
      }
    )
  }


  isLoggedIn() {

    return this.loggedIn;

  }

  setLogIn(log : boolean){

    this.loggedIn = log;

    console.log(this.loggedIn);

  }

  // Microsoft graph API returns a blob data which is converted into image

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {

     //console.log(reader.result);
       this.imageToShow = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

 getImageFromService() {
   this.isImageLoading = true;
   this.imageService.getImage(this.graphUri).subscribe(data => {
     //console.log(data);
     this.createImageFromBlob(data);
     this.isImageLoading = false;
     
   }, error => {
     this.isImageLoading = false;
     console.log(error);
   });

   return this.imageToShow ;
}







}
