import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/Globals';
import { AngularFireDatabase } from 'angularfire2/database';
import { Flat } from '../../app/models/flat.model';
import { MainPage } from '../main/main';

/**
 * Generated class for the FlatConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flat-config',
  templateUrl: 'flat-config.html',
})
export class FlatConfigPage {

  flt_city : string;
  flt_address : string;
  flt_code : string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globals: Globals, public db: AngularFireDatabase) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlatConfigPage');
  }

  async commitFlat(){

    this.globals.flat = new Flat;
    this.globals.flat.flt_address = this.flt_address;
    this.globals.flat.flt_city = this.flt_city;
    this.globals.flat.flt_code = this.flt_code;
    
    this.globals.flat.$key = this.db.list('flats').push(this.globals.flat).key;

    //dopisanie uzytkonika do mieszkania
    this.db.list('users')
      .update(this.globals.user.$key, 
        { 
          usr_rights: 1,
          usr_fltId : this.globals.flat.$key 
        });

    var pageId = this.navCtrl.getActive().index;

    this.navCtrl.push(MainPage).then(() => {
      this.navCtrl.remove(pageId);
      this.navCtrl.remove(pageId-1);
    });
  }
}
