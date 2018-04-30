import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Globals } from '../../app/Globals';
import { AngularFireDatabase } from 'angularfire2/database';
import { Flat } from '../../app/models/flat.model';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globals: Globals, public db : AngularFireDatabase) {

      
      

  }

  ionViewDidLoad() {
    this.globals.loading.dismiss();
    
  }

  

}
