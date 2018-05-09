import { Component } from '@angular/core';
import { Globals } from '../../app/Globals';
import { AngularFireDatabase } from 'angularfire2/database';
import { Expense } from '../../app/models/expanse.model';

import { NavController } from 'ionic-angular';
import { ExpenseDetailsPage } from '../../pages/expense-details/expense-details';

/**
 * Generated class for the ExpensesListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'expenses-list',
  templateUrl: 'expenses-list.html'
})
export class ExpensesListComponent {

  expenses = [];

  constructor(public globals: Globals, public db: AngularFireDatabase, public navCtrl : NavController) {

    this.db.list('expenses/', ref => ref.orderByChild('exp_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(e => {
      this.expenses = [];
      e.forEach(exp => {
        var expense = new Expense;
        expense = exp.payload.val() as Expense;
        expense.$key = exp.key;
        this.expenses.push(expense);        
      });

      this.sortExpanses();
    });
  }
  
  sortExpanses() {
    this.expenses.sort((a: Expense, b: Expense) => {
      var aMin = new Date(Date.parse(a.exp_createdAt));
      var bMin = new Date(Date.parse(b.exp_createdAt));

      return (aMin < bMin) ? 1 : 0;
    });
  }

  showExpenseDetails(exp){
    this.navCtrl.push(ExpenseDetailsPage, exp)
  }

}
