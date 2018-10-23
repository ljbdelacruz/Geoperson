import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import firebase from 'firebase';
import {IonicStorageModule} from '@ionic/storage'
//af2
import {AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { MyApp } from './app.component';
import {AgmCoreModule} from 'angular2-google-maps/core'
import {Geolocation} from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import {HttpModule} from '@angular/http'
import { Facebook } from '@ionic-native/facebook';
/*Pages*/
import { HomePage } from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {SignUpPage} from '../pages/sign-up/sign-up';
import {ContactsPage} from '../pages/contacts/contacts';
import {TrackPage} from '../pages/track/track';
import {RequestsPage} from '../pages/requests/requests';
import {HelpPage} from '../pages/help/help';
import {AddingContactPage} from '../pages/adding-contact/adding-contact';
/*Providers*/
import {FBAuthorization} from '../providers/auth/fbAuth';
import {LocationTrackerProvider} from '../providers/location-tracker/location-tracker';
import {FirebaseServices} from '../providers/firebase.service';
import {GeneralService} from '../providers/general.service';
import {RequestService} from '../providers/request.service';
/*Singleton*/
import {GlobalService} from '../providers/singleton/global.service';
/*Components*/
import {PageHeaderComponents} from '../components/page-header/pageHeader.components';


//put config here about firebase
export const firebaseConfig={
  apiKey: "AIzaSyCAsqQ6w0Gb412EIzT_McYyt-6Gflmx9JM",
  authDomain: "accouting-system-software.firebaseapp.com",
  databaseURL: "https://accouting-system-software.firebaseio.com",
  storageBucket: "accouting-system-software.appspot.com",
  messagingSenderId: "528814504050"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignUpPage,
    ContactsPage,
    TrackPage,
    RequestsPage,
    HelpPage,
    AddingContactPage,
    /*Components*/
    PageHeaderComponents
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //google map api key
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyBNI85-ifPGBXdiDlOz3CRHVBnBMv-iZtI'
    }),
    HttpModule,
    //initialize firebase
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignUpPage,
    ContactsPage,
    TrackPage,
    RequestsPage,
    HelpPage,
    AddingContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    BackgroundGeolocation,
    HttpModule,
    /*Providers*/
    FBAuthorization,
    FirebaseServices,
    LocationTrackerProvider,
    GeneralService,
    RequestService,
    Facebook,
    GlobalService
  ]
})
export class AppModule {}
