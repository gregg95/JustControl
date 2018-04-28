import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { RegisterPage } from '../pages/register/register';
import { GooglePlus } from '@ionic-native/google-plus';
import { MainPage } from '../pages/main/main';

const firebaseConfig = {
  apiKey: "AIzaSyCpJ_KAdkIpjqwcE6SNcea4jCfiZ1juzWM",
  authDomain: "justcontrol-ab259.firebaseapp.com",
  databaseURL: "https://justcontrol-ab259.firebaseio.com",
  projectId: "justcontrol-ab259",
  storageBucket: "justcontrol-ab259.appspot.com",
  messagingSenderId: "426681299685"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    MainPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    MainPage
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
