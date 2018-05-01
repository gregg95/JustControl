import { NgModule } from '@angular/core';
import { RankingListComponent } from './ranking-list/ranking-list';
import { TasksListComponent } from './tasks-list/tasks-list';
import { HistoryListComponent } from './history-list/history-list';
@NgModule({
	declarations: [
		RankingListComponent, 
		TasksListComponent,
    HistoryListComponent],
	imports: [],
	exports: [
		RankingListComponent,
		TasksListComponent,
    HistoryListComponent
	]
})
export class ComponentsModule {}
