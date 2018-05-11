import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals } from '../../app/Globals';
import { Task } from '../../app/models/task.model';
import { User } from '../../app/models/user.model';
import * as _ from 'lodash';

/**
 * Generated class for the HistoryListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'history-list',
  templateUrl: 'history-list.html'
})
export class HistoryListComponent {


  tasks = [];
  filteredTasks = [];
  users = [];
  filters = {};


  constructor(public db : AngularFireDatabase,
    public globals: Globals) {
      
    console.log('Hello HistoryListComponent Component');
    

    this.db.list('tasks/', ref => ref.orderByChild('tsk_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(t => {
      t.forEach(tsk => {
        var task = new Task;
        task = tsk.payload.val() as Task;
        task.$key = tsk.key;
        this.tasks.push(task);
      });

      this.applyFilters();
    });


    this.tasks.sort((a: Task, b: Task) => {
      var aDate = new Date(Date.parse(a.tsk_createdAt));
      var bDate = new Date(Date.parse(b.tsk_createdAt));

      return (aDate > bDate) ? 1 : 0;
    });

    
    this.db.list('users/', ref => ref.orderByChild('usr_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(u => {
      this.users = [];
      u.forEach(usr => {
        var us = usr.payload.val() as User;
        us.$key = usr.key;
        this.users.push(us);
      })
    });
  }


  applyFilters() {
    this.filteredTasks = _.filter(this.tasks, _.conforms(this.filters))
  }


  filterExact(property: string, rule: any){ 
    if (rule == "Oczekujące na akceptacje"){
      rule = 0;
    }
    this.filters[property] = val => val == rule; 
    this.applyFilters();
  }

  removeFilter(property: string) {
    delete this.filters[property];
    this[property] = null;
    this.applyFilters();
  }

  filterList(){
    console.log("??");
    this.tasks.filter(t => {
      var tsk = t as Task;
      if (tsk.tsk_usrId == this.globals.user.$key){
        return tsk;
      }
    });
  }

}
