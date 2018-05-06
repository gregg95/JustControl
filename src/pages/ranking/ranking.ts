import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {

    this.db.list('users/', ref => ref.orderByChild('usr_points')).snapshotChanges().subscribe(user => {
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankingPage');
  }

}
