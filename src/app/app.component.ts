import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { MainPage } from '../pages/main/main';
import { TasksHistoryPage } from '../pages/tasks-history/tasks-history';
import { CommonExpensesPage } from '../pages/common-expenses/common-expenses';
import { RankingPage } from '../pages/ranking/ranking';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl;
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

  goToMain(){
    this.navCtrl.popTo(MainPage);
  }
  
  goToTasksHistory(){
    this.navCtrl.push(TasksHistoryPage);
  }
  
  goToCommonExpanses(){
    this.navCtrl.push(CommonExpensesPage);
  }
  
  goToRanking(){
    this.navCtrl.push(RankingPage);
  }
  
  goToSettings(){
    this.navCtrl.push(SettingsPage);
  }
  
  goToAbout(){
    this.navCtrl.push(AboutPage);
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

