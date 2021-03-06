import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import { HomeService } from './home.service';
import { AuthService } from '../+auth/auth.service';


import { DataRetrievalService } from '../shared/data/data-retrieval.service';


import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms'
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  events: MicrosoftGraph.Event[];
  me: MicrosoftGraph.User;
  message: MicrosoftGraph.Message;
  emailSent: Boolean;
  subsGetUsers: Subscription;
  subsGetMe: Subscription;
  subsSendMail: Subscription;
   user: microsoftgraph.User;

  // Form and Data Retrieval variables

  getDataForm: FormGroup;

  dataReturned: any[];

  queryType: string;

  inputTypes = [
    'Email',
    'Rfid'
  ];

  queryTypes = [
    'Summary',
    'Details'
  ];

  errorMessage: string;



  constructor(private homeService: HomeService, private authService: AuthService, private dataService: DataRetrievalService) {



  }


  inputSelected;
  querySelected;

  ngOnInit() {

    this.subsGetMe = this.homeService.getMe().subscribe(me => this.me = me);
   
    this.getDataForm = new FormGroup({
      'queryValue': new FormControl(null, Validators.required),
      'ipType': new FormControl('Email'),
      'queryType': new FormControl('Summary')
    });


    
    this.errorMessage = '';

    setTimeout(() => {
      
      this.querySelected = this.me.mail;

      // console.log(this.me);

      this.getdata();

    }, 1000);

  

  }

  
  ngOnDestroy() {

    this.subsGetMe.unsubscribe();
   // this.subsGetPhoto.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onLogin() {
    this.authService.login();
  }

  getUserName() {

    return this.me.displayName;

  }

  getEmail() {

    return this.me.mail;

  }

  getPhoto() {

    //console.log(this.user.photo);

   return  this.homeService.getImageFromService();


  }


  setInputData() {

    this.querySelected = this.getDataForm.controls.queryValue.value;

    this.getdata();

  }


  getdata() {

    this.dataReturned = null;

    this.queryType = this.getDataForm.controls.queryType.value;

    this.inputSelected = this.getDataForm.controls.ipType.value;


    let query;


    query = this.queryType.concat('/').concat(this.inputSelected).concat('/').concat(this.querySelected);



    this.dataService.getData(query)
      .subscribe(
        (data: any[]) => {


          this.dataReturned = data;

          console.log('data returned', this.dataReturned);

        },
        (error) => {

          this.errorMessage = 'No Data Found for : ' + this.querySelected;

        }
      )
      ;

    this.errorMessage = '';

  }


 


}
