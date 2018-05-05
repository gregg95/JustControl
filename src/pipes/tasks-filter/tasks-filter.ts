import { Pipe, PipeTransform } from '@angular/core';
import { Globals } from '../../app/Globals';
/**
 * Generated class for the TasksFilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'tasksFilter',
})
export class TasksFilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */

  constructor(public glob: Globals) {

  }

  transform(tasks: any, task: any) {
    
    var title = (task.tsk_title === undefined) ? "" : task.tsk_title;
    var onlyMy = (task.tsk_onlyMy === undefined) ? false : task.tsk_onlyMy;
    
    console.log(this.glob.user.usr_id);

    if (title == "" && onlyMy == false) return tasks;

    var it = this;
    return tasks.filter(function(tsk){
      return (tsk.tsk_title.toLowerCase().includes(title.toLowerCase()) && tsk.tsk_userId == it.glob.user.usr_id);
    })
  }
}
