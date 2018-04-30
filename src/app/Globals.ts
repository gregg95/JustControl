import { User } from "./models/user.model";
import { Injectable } from '@angular/core';
import { Flat } from "./models/flat.model";
import { ToastController, Loading, LoadingController } from "ionic-angular";

@Injectable()
export class Globals {
    user : User;
    usr_name : string = "";
    flat : Flat;
    loading : Loading;

    constructor(public toastCtrl: ToastController, public loadingCtrl : LoadingController){
      
    }

    makeToast(message) {
        this.toastCtrl.create({
          message: message,
          duration: 3000,
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
}