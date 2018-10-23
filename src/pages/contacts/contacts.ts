import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase'
import {FirebaseServices} from '../../providers/firebase.service';
/*Providers*/
import {RequestService} from '../../providers/request.service';
import {GlobalService} from '../../providers/singleton/global.service';
import {GeneralService} from '../../providers/general.service';
/*Pages*/
import {TrackPage} from '../track/track';
import {AddingContactPage} from '../adding-contact/adding-contact'

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage implements OnDestroy {
  list=[];
  myList=[];
  headers:Headers;
  beUrl:string;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private rs:RequestService,
              private gser:GlobalService,
              private loadCtrl: LoadingController,
              private fbs:FirebaseServices,
              private alertCtrl : AlertController,
              private gs: GeneralService) {
              this.beUrl=this.gser.myURL;
              this.headers=new Headers();
              const myLoadDisplay=this.loadCtrl.create({
                content: 'Fetching Contacts Please Wait...'
              });
              myLoadDisplay.present()
              this.headers.append('Content-Type', 'application/json');
              this.GetUserConnection(function(data){
                myLoadDisplay.dismiss();
              }.bind(this), function(){
                myLoadDisplay.dismiss();
              }.bind(this));
  }
  GetUserConnection(success, failed){
    this.rs.Get(this.beUrl+"Connections/GetUserConnections?ID="+this.gser.ID, this.headers).subscribe((data)=>{
      if(data.json().success){
        if(data.json().data.length > 0){
          data.json().data.forEach(item=>{
            if(item.Partner.ID != this.gser.ID){
              this.list.push({ID:item.ID, Name:item.Partner.Username, myKey:item.ID, Comms:item.Comms});
            }else{
              this.list.push({ID:item.ID, Name:item.Partner.Username, myKey:item.ID, Comms:item.Comms})
            }
          })
          this.ResetList();
        }
        success();
      }else{
        failed();
      }
    })
  }
  DeleteContact(item){
    this.PromptAlert(function(){
      const myLoadDisplay=this.loadCtrl.create({
        content: 'Removing Contacts Please Wait...'
      });
      var body=new FormData();
      body.append("cid", item.ID);
      this.rs.PostParam(this.beUrl+"Connections/Delete", this.headers, body).subscribe(data=>{
        if(data.json().success){
          var index=this.list.findIndex(d=>d.ID == item.ID);
          this.list.splice(index, 1);
          this.ResetList();
          this.gs.ShowAlert("Contact Deleted");
          myLoadDisplay.dismiss();
        }else{
          this.gs.ShowAlert("Failed deleting contact");
        }
      })
    }.bind(this), function(){}.bind(this));

  }
  ngOnDestroy(){
  //  this.navCtrl.pop(); 
  }
  ResetList(){
    this.myList=this.list;
  }
  ionViewDidLoad() {
  }
  getItems(ev) {
    // Reset items back to all of the items
    this.ResetList();
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.myList = this.myList.filter((item) => {
        return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }
  Back(){
    this.navCtrl.pop();
  }
  onClick(data){
    this.gser.Comms=data.Comms;
    this.gser.coms=data.ID;
    this.navCtrl.push(TrackPage);
  }
  PromptAlert(success, cancelled){
    const alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Are you sure? NOTE: You will not be able to track his/her location and vice versa.',
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
    this.gs.ShowAlert("Swipe right to remove the contact\n"+
                      "Click on Contact to view the current location of that person.")
  }
  AddNewContact(){
    this.navCtrl.push(AddingContactPage);
  }



}
