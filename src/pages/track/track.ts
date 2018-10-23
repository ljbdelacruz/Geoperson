import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {Observable} from 'rxjs/Rx';
//providers
import {GeneralService} from '../../providers/general.service';
import {RequestService} from '../../providers/request.service';
import {LocationTrackerProvider} from '../../providers/location-tracker/location-tracker'
/*Singleton provider*/
import {GlobalService} from '../../providers/singleton/global.service';
//models
import {PositionViewModel, UserViewModel} from '../../objects/PositionViewModel'
@Component({
  selector: 'page-track',
  templateUrl: 'track.html',
})
export class TrackPage implements OnDestroy {
  view1=new PositionViewModel("",0,0);
  isFirstInstance=true;
  position=new PositionViewModel("",0,0);
  position1=new PositionViewModel("",0,0);
  userProfile=new UserViewModel("2ee", "p2");
  changeFlag=false;
  updateDisplay:string="UPDATE 0";
  uindex:number=0;
  myLoadDisplay:any;
  beUrl:string;
  partnerName:string;
//observables
  locationObserve:any;
  locationPartnerObserve:any;
  locationUpdatedObserve:any;
  headers:Headers;
  constructor(public navCtrl: NavController, 
              private geolocation: Geolocation, 
              private gs:GeneralService,
              private rs:RequestService,
              private ltp:LocationTrackerProvider,
              private gser:GlobalService,
              private loadCtrl: LoadingController) {
                this.beUrl=this.gser.myURL;
                this.myLoadDisplay=this.loadCtrl.create({
                  content: 'Getting Partner Location Please Wait...'
                });
                this.myLoadDisplay.present();
                this.headers=new Headers();
                this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
                this.IdentifyWhichComms();
                this.view1.long=0;
                this.view1.lat=0;
                this.locationObserve=this.gs.ObservableIntervalSubscribe(100*60, this.FindMyLocation.bind(this));
                this.locationPartnerObserve=this.gs.ObservableIntervalSubscribe(100*60, this.FindPartnerLocation.bind(this));
                this.locationUpdatedObserve=this.gs.ObservableIntervalSubscribe(300*80, this.UpdateMyLocation.bind(this));
  }
  IdentifyWhichComms(){
    if(this.gser.Comms.p1.User.ID == this.gser.ID){
      this.position.lat=this.gser.Comms.p1.latitude;
      this.position.long=this.gser.Comms.p1.longitude;
      this.position.id=this.gser.Comms.p1.ID;
      this.position1.lat=this.gser.Comms.p2.latitude;
      this.position1.long=this.gser.Comms.p2.longitude;
      this.position1.id=this.gser.Comms.p2.ID;
    }else{
      this.position1.id=this.gser.Comms.p1.ID;
      this.position1.lat=this.gser.Comms.p1.latitude;
      this.position1.long=this.gser.Comms.p1.longitude;
      
      this.position.id=this.gser.Comms.p2.ID;      
      this.position.lat=this.gser.Comms.p2.latitude;
      this.position.long=this.gser.Comms.p2.longitude;
    }
  }
  RequestLocationData(ID:String, success, failed){
    this.rs.Get(this.beUrl+"Location/GetByID?ID="+ID, this.headers).subscribe((data)=>{
      if(data.json().success){
        success(data.json().data);
      }else{
        failed(data.json());
      }
    });
  }
  UpdateLocation(data:any){
    var body=new FormData();
    body.append("ID", ""+data.id);
    body.append("latitude", ""+data.lat);
    body.append("longitude", ""+data.long);
    this.rs.PostParam(this.beUrl+"Location/Update", this.headers, body).subscribe((response)=>{
      if(response.json().success){}
    })
  }
  FindMyLocation(){
    var resp=this.ltp.StartTracking();
    if(this.position.lat != resp.lat && this.position.long != resp.long){
      this.position.long=resp.long;
      this.position.lat=resp.lat;
      if(this.isFirstInstance){
        this.MoveViewToMe();
        this.isFirstInstance=false;
      }
      this.myLoadDisplay.dismiss();
    }
  }
  FindPartnerLocation(){
    this.RequestLocationData(this.position1.id, function(data){
        this.position1.long=data.longitude;
        this.position1.lat=data.latitude;
        this.partnerName=data.User.Username;
    }.bind(this), function(){}.bind(this))
  }
  MoveViewToMe(){
    this.view1.lat=this.position.lat;
    this.view1.long=this.position.long;
  }
  UpdateMyLocation(){
    this.UpdateLocation(this.position);
  }
  ngOnDestroy(){
    this.locationObserve.unsubscribe();
    this.locationPartnerObserve.unsubscribe();
    this.locationUpdatedObserve.unsubscribe();
  }
  myID="1ee";
  chatLog=[{ID:"1eee", Description:"Hi Maria", uid:"1ee"}, 
           {ID:"2eee", Description:"Hi John", uid:"2ee"},
           {ID:"1eee", Description:"How Is Work", uid:"2ee"},
           {ID:"1eee", Description:"Great", uid:"1ee"},
           {ID:"1eee", Description:"You?", uid:"2ee"},
           {ID:"1eee", Description:"Awsome!asdasdasdasdasdasdasdasdasdsadasdsadasdsadsadasdsadasdsadasdasdadasdasd", uid:"1ee"}]
  Back(){
    this.navCtrl.pop();
  }
}
