import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Expense } from '../../app/models/expanse.model';
import { storage } from 'firebase';




@IonicPage()
@Component({
  selector: 'page-expense-details',
  templateUrl: 'expense-details.html',
})
export class ExpenseDetailsPage {

  expense: Expense;
  imgSrc: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    if (Object.keys(navParams.data).length > 0) {
      this.expense =  navParams.data as Expense;

      if (this.expense.exp_attachment != ""){
        const ref = storage().ref().child(this.expense.exp_attachment);
        ref.getDownloadURL().then(url => this.imgSrc = url);
      }
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseDetailsPage');
  }

}
