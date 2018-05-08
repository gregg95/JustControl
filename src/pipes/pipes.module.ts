import { NgModule } from '@angular/core';
import { TasksFilterPipe } from './tasks-filter/tasks-filter';
import { OrderTaskPipe } from './order-task/order-task';
@NgModule({
	declarations: [TasksFilterPipe,
    OrderTaskPipe],
	imports: [],
	exports: [TasksFilterPipe,
    OrderTaskPipe]
})
export class PipesModule {}
