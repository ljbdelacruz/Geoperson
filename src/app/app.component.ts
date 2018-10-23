import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import {LoginPage} from '../pages/login/login'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    //this.initializeFirebase();
    firebase.initializeApp({
      apiKey: "AIzaSyDVk8yQecJ62bc0_FIj2f4Hl_qslCVVs5A",
      authDomain: "goperson-8a228.firebaseapp.com",
      databaseURL: "https://goperson-8a228.firebaseio.com",
      storageBucket: "goperson-8a228.appspot.com",
      messagingSenderId: "133448380830"
    });
    console.log("Initialize App");
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  initializeFirebase(){
    firebase.initializeApp({
      apiKey: "AIzaSyDVk8yQecJ62bc0_FIj2f4Hl_qslCVVs5A",
      authDomain: "goperson-8a228.firebaseapp.com",
    });
  }

}

