import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals } from '../../app/Globals';
import { Task } from '../../app/models/task.model';

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
  onlyMyTasks : boolean = false;

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
    });

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
