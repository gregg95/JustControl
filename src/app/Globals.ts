import { User } from "./models/user.model";
import { Injectable } from '@angular/core';
import { Flat } from "./models/flat.model";
import { ToastController, Loading, LoadingController, NavController, Platform } from "ionic-angular";

@Injectable()
export class Globals {
    user : User;
    usr_name : string = "";
    flat : Flat;
    loading : Loading;
    errors = [];
    manageTasksMode: boolean = false;
    navCtrl : NavController;

    constructor(public toastCtrl: ToastController, public loadingCtrl : LoadingController,  public platform: Platform){
      this.errors.push({required_tsk_title : "Tytuł jest wymagany"})
      this.user = new User; 

    }

    makeToast(message) {
        this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'top'
        }).present();    
      }

      makeLongToast(message) {
        this.toastCtrl.create({
          message: message,
          duration: 10000,
          position: 'top'
        }).present();    
      }

    showLoading(){
      if (!this.loading) {
        this.loading = this.loadingCtrl.create({
          content: 'Proszę czekać...'
        });
        this.loading.present();
      }
    }

    dismissLoading(){
      if (this.loading) {
        this.loading.dismiss();
        this.loading = null;
      }
    }

    clearGlobals(){
      this.user = new User;
      this.flat = new Flat;
      this.manageTasksMode = false;
    }

    deletePreviousView(){
      if(this.navCtrl && this.navCtrl.getPrevious().name != "MainPage"){
        this.navCtrl.removeView(this.navCtrl.getPrevious());
      }
    }
}