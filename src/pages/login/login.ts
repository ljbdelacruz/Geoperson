import { Component } from '@angular/core';
import {Storage} from '@ionic/storage'
import { NavController, NavParams } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
//providers
import {GeneralService} from '../../providers/general.service';
import {RequestService} from '../../providers/request.service';
//objects
import {UserAuthViewModel} from '../../objects/PositionViewModel';
/*Pages*/
import {HomePage} from '../home/home';
import {SignUpPage} from '../sign-up/sign-up'
import {HelpPage} from '../help/help';
/*Singleton provider*/
import {GlobalService} from '../../providers/singleton/global.service';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  isAuthenticating=false;
  userAuth:UserAuthViewModel;  
  userProfile: any = null;
  headers:Headers;
  beUrl:string;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController,
              private rs:RequestService,
              private gs:GeneralService,
              private storage:Storage,
              private loadingCtrl:LoadingController,
              public gser:GlobalService) {
                this.beUrl=this.gser.myURL;
                this.headers=new Headers();
                this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
                this.userAuth=new UserAuthViewModel("", "");
                this.CheckIfFirstTimeLogin()
  }
  ionViewDidLoad() {
  }
  SetLocalLogin(){
    this.storage.set('username', this.userAuth.username);
    this.storage.set('password', this.userAuth.password);
  }
  CheckIfFirstTimeLogin(){
    this.storage.get('username').then((val) => {
      if(val != null){
        this.isAuthenticating=true;
        this.userAuth.username=val
        this.storage.get('password').then((pass) => {
          this.userAuth.password=pass
          this.Authenticate()
        })
      }
    });
  }
  Authenticate(){
    const myLoadDisplay=this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    myLoadDisplay.present()
    this.AuthBackend(function(data){
      myLoadDisplay.dismiss();
      this.SetLocalLogin();
      this.navCtrl.push(HomePage);
    }.bind(this), function(data){
      myLoadDisplay.dismiss();
      this.gs.ShowAlert(data.message);
    }.bind(this));
  }
  SignUpPage(){
    this.navCtrl.push(SignUpPage);
  }
  HelpPage(){
    this.navCtrl.push(HelpPage);
  }
  AuthBackend(event, failed){
    let body=new FormData();
    body.append('username', this.userAuth.username);
    body.append('password', this.userAuth.password);
    this.rs.PostParam(this.beUrl+"Users/Authenticate", 
                      this.headers, 
                     body).subscribe((data)=>{
                       if(data.json().success){
                         event();
                       }else{
                         failed(data.json());
                       }
    }, error=>{
      failed();
    });
  }
}
