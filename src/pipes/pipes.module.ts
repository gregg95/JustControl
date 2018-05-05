import { NgModule } from '@angular/core';
import { TasksFilterPipe } from './tasks-filter/tasks-filter';
@NgModule({
	declarations: [TasksFilterPipe],
	imports: [],
	exports: [TasksFilterPipe]
})
export class PipesModule {}
