import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../app/models/user.model';
import { Globals } from '../../app/Globals';

/**
 * Generated class for the RankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
})
export class RankingPage {

  users = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,
      public globals: Globals) {

    this.globals.showLoading();

    this.db.list('users/', ref => ref.orderByChild('usr_points')).snapshotChanges().subscribe(u => {      
      this.users = [];
     
      u.forEach(user => {
        var us = user.payload.val() as User;
        us.$key = user.key;
        
        this.users.push(us);
        
      });

      this.users.sort((userA: User, userB: User)  => {
        if (userA.usr_points < userB.usr_points) return 1;
        if (userA.usr_points > userB.usr_points) return 0;
        return 0;
      });
      var i = 1;
      this.users.forEach(u => {
        u.usr_lp = i;
        i++;
      });
      this.globals.dismissLoading();
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankingPage');
  }

}
