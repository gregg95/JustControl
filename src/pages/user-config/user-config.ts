import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { Globals } from '../../app/Globals';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { Flat } from '../../app/models/flat.model';
import { FlatConfigPage } from '../flat-config/flat-config';
import { MainPage } from '../main/main';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';

/**
 * Generated class for the UserConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-config',
  templateUrl: 'user-config.html',
})
export class UserConfigPage {

  flt_code : string;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globals : Globals, public db: AngularFireDatabase, public toastCtrl: ToastController,
    public afAuth: AngularFireAuth, public platform : Platform, public gplus : GooglePlus) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserConfigPage');
  }

  async joinFlat() {
    //sprawdzam czy jest takie mieszkanie i do niego dolaczam
    var query = await this.db.list('flats', ref => ref.orderByChild('flt_code').equalTo(this.flt_code));
    
    await new Promise(resolve => {
      query.snapshotChanges().subscribe(f => {  
        if(f.length > 0) {
          this.globals.flat = f[0].payload.val() as Flat;            
          this.globals.flat.$key = f[0].key;             
        }
        resolve();
      });
    });

    query = null;

    if(!this.globals.flat){
      this.globals.makeToast("Mieszkanie o podanum numerze nie istnieje !!");
    } else {
      //przypisz mieszkanie do globalnej i idz do glownego okna
      this.db.list('users')
      .update(this.globals.user.$key, 
        { 
          usr_rights: 1,
          usr_fltId : this.globals.flat.$key 
        });

      var pageId = this.navCtrl.getActive().index;

      this.navCtrl.push(MainPage).then(() => {
        this.navCtrl.remove(pageId);
      });
    }
  }
  
  createNewFlat(){
    this.navCtrl.push(FlatConfigPage);
  }

  cancel(){
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout();      
    }

  }
}
