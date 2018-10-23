import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
/*Providers*/
import {RequestService} from '../../providers/request.service';
import {GeneralService} from '../../providers/general.service';
/*Singleton provider*/
import {GlobalService} from '../../providers/singleton/global.service';
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage implements OnDestroy {
  list=[];
  myList=[];
  searchList=[];
  findUserList=[];
  requestUserInfo={ID:"", Name:""};
  headers:Headers;
  beUrl:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public rs:RequestService,
              public gser:GlobalService,
              public gs:GeneralService,
              private loadCtrl:LoadingController,
              private alertCtrl: AlertController) {
                this.headers=new Headers();
                this.beUrl=this.gser.myURL;
                // this.headers.append('Access-Control-Allow-Origin', '*');
                this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
                this.list=[];
                this.LoadMyRequest();
  }
  //MyNew Code Server
  LoadMyRequest(){
    this.rs.Get(this.beUrl+"Request/GetByOwnerID?ID="+this.gser.ID, this.headers).subscribe((response)=>{
      if(response.json().success){
        this.list=[];
        response.json().data.forEach(item=>{
          this.list.push({ID:item.ID, Name:item.Requestor.Username, RequestorID:item.Requestor.ID});
        })
        this.ResetList();
      }
    });
  }
  MyAcceptRequest(item){
    const myLoadDisplay=this.loadCtrl.create({
      content: 'Accepting Request Please Wait...'
    });
    this.PromptAlert("Warning", "Are You Sure You Want To Share your Location to this Person? Accepting the Request Will Allow That", function(){
      myLoadDisplay.present();
      var body=new FormData();
      body.append("RID", item.ID);
      body.append("OID", item.RequestorID);
      body.append("PID", this.gser.ID);
      this.rs.PostParam(this.beUrl+"Request/AcceptRequest", this.headers, body).subscribe(response=>{
        if(response.json().success){
          myLoadDisplay.dismiss();
          this.gs.ShowAlert("Request Accepted");
          var index=this.list.findIndex(d=>d.ID == item.ID);
          this.list.splice(index, 1);
          this.ResetList();
        }else{
          myLoadDisplay.dismiss();
          this.gs.ShowAlert("Accepting Request Failed!");
        }
      })
    }.bind(this), function(){}.bind(this));
  }
  MyDeleteRequest(item){
    const myLoadDisplay=this.loadCtrl.create({
      content: 'Deleting Request Please Wait...'
    });
    this.PromptAlert("Warning", "Are you sure you want to delete this request?", 
                    function(){
                      myLoadDisplay.present();
                      var body=new FormData();
                      body.append("ID", item.ID);
                      this.rs.PostParam(this.beUrl+"Request/Delete", this.headers, body).subscribe(data=>{
                        if(data.json().success){
                          myLoadDisplay.dismiss();
                          this.gs.ShowAlert("Request deleted");
                          var index=this.list.findIndex(d=>d.ID == item.ID);
                          this.list.splice(index, 1);
                          this.ResetList();
                        }else{
                          myLoadDisplay.dismiss();
                          this.gs.ShowAlert("Failed to delete request.");
                        }
                      })
                    }.bind(this), function(){}.bind(this));
  }
  //end Here
  ionViewDidLoad() {
  }
  Back(){
    this.navCtrl.pop();
  }
  ngOnDestroy(){
  }
  //filter list
  ResetList(){
    this.myList=this.list;
  }
  //event for filtering item when typing in search bar
  getItems(ev) {
    // Reset items back to all of the items
    this.ResetList();
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.myList = this.myList.filter((item) => {
        return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
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
}
