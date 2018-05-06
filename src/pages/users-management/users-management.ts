import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../app/models/user.model';
import { Globals } from '../../app/Globals';

/**
 * Generated class for the UsersManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-management',
  templateUrl: 'users-management.html',
})


export class UsersManagementPage {

  users = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,
    public globals: Globals) {
    
    
    this.db.list('users/', ref => ref.orderByChild('usr_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(u => {
      this.users = [];
      u.forEach(usr => {
        
        var us = usr.payload.val() as User;
        us.$key = usr.key;

        if(us.$key != this.globals.user.$key){
          this.users.push(us);
        }
      })
    });



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersManagementPage');
  }

  setRights(user){

    this.db.object("users/" + user.$key)
      .update({ usr_rights: user.usr_rights }); 
  }

  removeUserFromFlat(user){
    this.db.object("users/" + user.$key)
      .update({ usr_fltId: "null", usr_rights: 0 });
  }

  rightsChange(value){
    this.globals.makeToast(value);
  }
}
