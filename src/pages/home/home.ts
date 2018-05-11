import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Globals } from '../../app/Globals';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../app/models/user.model';
import { MainPage } from '../main/main';
import { UserConfigPage } from '../user-config/user-config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  flag = false;
  constructor(public navCtrl: NavController, public globals: Globals, public db: AngularFireDatabase) {

    this.globals.dismissLoading();

    let sub = this.db.object('users/' + this.globals.user.$key).snapshotChanges().subscribe(u => {
      var user = u.payload.val() as User;
      user.$key = u.key;

      if(user.usr_rights == 2) {
        this.globals.user = user;
        sub.unsubscribe();
        this.navCtrl.push(MainPage).then(() => {
          this.navCtrl.removeView(this.navCtrl.getPrevious());
        });
      }else if (user.usr_rights == 0) {
        if (!this.flag) this.globals.makeToast("Prośba o dołączenie została odrzucona.");
        if (this.flag) this.globals.makeToast("Prośba o dołączenie została anulowana.");
        sub.unsubscribe();
        this.navCtrl.push(UserConfigPage).then(() => {
          this.navCtrl.remove(this.navCtrl.getPrevious().index);
        });
      }
    });
  }

  ionViewDidLoad(){
    this.globals.dismissLoading();
  }

  cancelRequest(){
    this.flag = true;
    this.db.object("users/" + this.globals.user.$key)
      .update({ usr_rights: 0, usr_fltId: "null" });
  }
}
