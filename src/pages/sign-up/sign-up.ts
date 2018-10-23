import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
//providers
import {FirebaseServices} from '../../providers/firebase.service';
import {GeneralService} from '../../providers/general.service'
import {RequestService} from '../../providers/request.service';
//models
import {UserAuthViewModel} from '../../objects/PositionViewModel';
/*Singleton provider*/
import {GlobalService} from '../../providers/singleton/global.service';
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  userVM:UserAuthViewModel;
  beUrl:string;
  headers:Headers;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private fbs:FirebaseServices,
              private gs:GeneralService,
              private loadCtrl : LoadingController,
              private alertCtrl:AlertController,
              private rs:RequestService,
              private gser:GlobalService) {
    this.beUrl=this.gser.myURL;
    this.userVM=new UserAuthViewModel("", "");
    this.headers=new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  ionViewDidLoad() {
  }
  SignUp(){
    const myLoadDisplay=this.loadCtrl.create({
      content: 'Creating user...'
    });
    myLoadDisplay.present();
    if(this.userVM.confirmPassword == this.userVM.password){
      if(this.Authenticate().valueOf()){
        this.CreateUser(function(data){
            myLoadDisplay.dismiss();
            console.log(data);
            this.gs.ShowAlert("Success! "+data.message);
            this.navCtrl.pop();
        }.bind(this), function(data){
          console.log(data);
          myLoadDisplay.dismiss();          
          this.gs.ShowAlert(data.message);
        }.bind(this))
      }
    }else{
      myLoadDisplay.dismiss();
      this.gs.ShowAlert("Password do not match");
    }
  }
  Authenticate(){
    if(this.userVM.username != null && this.userVM.password != null){
      return true;
    }else{
      return false;
    }
  }
  Back(){
    this.navCtrl.pop();
  }
  CreateUser(success, failed){
    var body=new FormData();
    body.append("Username", this.userVM.username);
    body.append("Password", this.userVM.password);
    this.rs.PostParam(this.beUrl+"Users/CreateUser", this.headers, body).subscribe((data)=>{
      if(data.json().success){
          this.CreateUserLocationPosition(data.json().uid, function(){
            success(data.json());
          }.bind(this), function(){}.bind(this));
        }else{failed(data.json());}
    })
  }
  CreateUserLocationPosition(uid, success, failed){
    var body=new FormData();
    body.append("ID", uid);
    this.rs.PostParam(this.beUrl+"Location/Create", this.headers, body).subscribe((data)=>{
      if(data.json().success){
        success();
      }else{
        failed();
      }
    });
  }
  PromptAlert(title, message,success, cancelled){
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            cancelled();
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            success();
          }
        }
      ]
    });
    alert.present();
  }


}
