import { User } from "./models/user.model";
import { Injectable } from '@angular/core';
import { Flat } from "./models/flat.model";
import { ToastController } from "ionic-angular";

@Injectable()
export class Globals {
    user : User;
    usr_name : string = "";
    flat : Flat;

    constructor(public toastCtrl: ToastController){

    }

    makeToast(message) {
        this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'top'
        }).present();    
      }
}