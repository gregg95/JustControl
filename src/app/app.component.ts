import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  
  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private afAuth: AngularFireAuth, private gplus: GooglePlus, private toastCtrl: ToastController,
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });



  }

  logout(){

    this.afAuth.auth.signOut();

    if (this.platform.is('cordova')) {
      this.gplus.logout();      
    }
  }

  makeToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();    
  }
}

