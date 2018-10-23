import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//providers
import {RequestService} from '../../providers/request.service';
import {GeneralService} from '../../providers/general.service';
//singleton service
import {GlobalService} from '../../providers/singleton/global.service';

@Component({
  selector: 'page-adding-contact',
  templateUrl: 'adding-contact.html',
})
export class AddingContactPage {
  findUserList=[];
  requestUserInfo={ID:"", Name:""};
  headers:Headers;
  beUrl:string;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public gser:GlobalService,
              public loadCtrl:LoadingController,
              public alertCtrl:AlertController,
              public rs:RequestService,
              public gs:GeneralService){
                this.headers=new Headers();
                this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
                this.beUrl=this.gser.myURL;

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddingContactPage');
  }
  SearchUser(){
    const myLoadDisplay=this.loadCtrl.create({
      content: 'Searching User Please Wait...'
    });
    myLoadDisplay.present();
    this.findUserList=[];
    console.log(this.requestUserInfo.Name);

    this.rs.Get(this.beUrl+"Users/LikeUsername?username="+this.requestUserInfo.Name, this.headers).subscribe((response)=>{
      if(response.json().success){
        myLoadDisplay.dismiss();
        if(response.json().data.length > 0){
          response.json().data.forEach((item)=>{
            this.findUserList.push({ID:item.ID, Name:item.Username});
          })
        }else{
          this.gs.ShowAlert("No Match Found.");
        }
      }else{
        this.gs.ShowAlert("Failed searching for the user. Please try again.");
        myLoadDisplay.dismiss();
      }
    })
  }
  AddUser(item){
    if(item.ID != this.gser.ID){
      this.PromptAlert("Warning", "Are you sure?\n\n NOTE: You will be sharing your information such as your location with this user.", 
      function(){
        var body=new FormData();
        body.append("requestedID", item.ID);
        body.append("requestorID", this.gser.ID);
        this.rs.PostParam(this.beUrl+"Request/Add", this.headers, body).subscribe((response)=>{
          if(response.json().success){
            this.gs.ShowAlert("User request sent!");
          }else{
            this.gs.ShowAlert(response.json().message);
          }
        });
      }.bind(this), 
      function(){}.bind(this))
    }else{
      this.gs.ShowAlert("Unable to send a request to self.");
    }
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
  ShowHelp(){
    this.gs.ShowAlert("Enter the email address of the person you are searching for. Hit the search button. A list of users that will be displayed. \n\n");
  }
  Back(){
    this.navCtrl.pop();
  }


}
