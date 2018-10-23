import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
//models
import {PositionViewModel} from '../../objects/PositionViewModel';
@Injectable()
export class LocationTrackerProvider {

  public model=new PositionViewModel("", 0,0);
  constructor(private geolocation: Geolocation) {
    console.log('Hello LocationTrackerProvider Provider');
  }
  StartTracking():PositionViewModel {
    //parameters inside response
    // this.lat=resp.coords.latitude;
    // this.lon=resp.coords.longitude;
     this.geolocation.getCurrentPosition().then((response) => {
      this.model.lat=response.coords.latitude;
      this.model.long=response.coords.longitude;
      return this.model;
     }).catch((error) => {
        console.log('Error getting location', error);
     });
     return this.model;
  }

}
