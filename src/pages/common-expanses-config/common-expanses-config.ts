import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Globals } from '../../app/Globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Expense } from '../../app/models/expanse.model';
import { storage } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the CommonExpansesConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-common-expanses-config',
  templateUrl: 'common-expanses-config.html',
})
export class CommonExpansesConfigPage {

  expanseForm : FormGroup;
  imgSrc : string =  "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder : FormBuilder, public globals: Globals,public platform: Platform,
    public db : AngularFireDatabase, private camera : Camera) {
      this.expanseForm = this.formBuilder.group({
        exp_description: ['', Validators.required],
        exp_amount: ['', Validators.required],
        exp_attachment: ['']
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonExpansesConfigPage');
  }

   isAmountInteger(){
    if (this.expanseForm){
      var amount = this.expanseForm.controls.exp_amount.value;

      try {

        if(isNaN(parseFloat(amount))) return false;
      } catch (e)  {
        console.log(e);
        return false;
      }
 
    }
    
    return true;
  }

  addCommonExpanse(){
    var expense = new Expense;

    if (!this.expanseForm.valid){
      this.globals.makeToast("Formularz jest niepoprawnie wypełniony");
      return;
    }

    if (!this.isAmountInteger()){
      this.globals.makeToast("Kwota przyjmuje tylko wartości numeryczne.");
      return;
    }

    expense.exp_description = this.expanseForm.controls.exp_description.value;
    expense.exp_amount = this.expanseForm.controls.exp_amount.value;
    expense.exp_attachment = this.expanseForm.controls.exp_attachment.value;
    expense.exp_createdAt = new Date().toString();    
    expense.exp_createdBy = this.globals.user.usr_name;
    expense.exp_fltId = this.globals.flat.$key;

console.log("am i here?");
    this.db.list('expenses').push(expense).then(res => {
      console.log(res);

      if (this.imgSrc.length > 0){ 
        const image = this.imgSrc;

        const pictures = storage().ref(this.expanseForm.controls.exp_attachment.value);
  
        pictures.putString(image, 'data_url');
      }
      this.navCtrl.removeView(this.navCtrl.getActive());
    }, err => {
      this.globals.makeToast(err);
    });



    
  }

  async takePhoto(){
    try {
      
      const options : CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }


      await this.camera.getPicture(options).then(d => {
        this.imgSrc= "data:image/jpeg;base64," + d;
        this.expanseForm.controls.exp_attachment
          .setValue('pictures/expenses/'+this.globals.flat.$key+'/'+ (new Date()).toISOString() + 'usr:' + this.globals.user.$key);
      });



      
    } catch (error) {
     this.globals.makeToast(error); 
    }
  }
}
