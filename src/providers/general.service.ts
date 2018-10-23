import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';


@Injectable()
export class GeneralService{
    constructor(private alertCtrl: AlertController){}
    //comparison functionality
    IsEqual(v1:any, v2:any){
        return v1 == v2 ? true : false;
    }
    ObservableIntervalSubscribe(time:number, event:Function){
        return Observable.interval(time).subscribe(x => {
            event();
        });
    }
    //end here
    //alert
    ShowAlert(message:string){
        const alert = this.alertCtrl.create({
            title: '',
            message: message,
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          alert.present();
    }

    //end here

}