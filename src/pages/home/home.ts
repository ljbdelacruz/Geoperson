import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import firebase from 'firebase'
import {Storage} from '@ionic/storage'
//providers
import {GlobalService} from '../../providers/singleton/global.service';
//models 
//pages
import {LoginPage} from '../login/login';
import {ContactsPage} from '../contacts/contacts';
import {RequestsPage} from '../requests/requests';
import {RequestService} from '../../providers/request.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  headers:Headers;
  beUrl:string;
  constructor(public navCtrl: NavController, 
              private gser:GlobalService,
              private rs:RequestService,
              private storage:Storage,
              private platform:Platform) {
    this.beUrl=this.gser.myURL;
    platform.registerBackButtonAction(()=>{});
    this.headers=new Headers();
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Content-Type', 'application/json');
    this.GetUserLogin();
  }
  GetUserLogin(){
    this.storage.get("username").then((val)=>{
      this.gser.username=val;
      this.rs.Get(this.beUrl+"Users/GetUserInformationByUsername?username="+this.gser.username, this.headers).subscribe((data)=>{
        if(data.json().success){
          this.gser.ID=data.json().data.ID;
          this.gser.username=this.gser.username.slice(0, this.gser.username.indexOf("@"));
        }
      })
    })
  }

  ViewContacts(){
    this.navCtrl.push(ContactsPage);
  }
  ViewRequest(){
    this.navCtrl.push(RequestsPage);
  }
  Logout(){
    this.storage.set('username', null);
    this.storage.set('password', null);
    this.gser.username="";
    firebase.auth().signOut();
    this.navCtrl.pop();
  }

}