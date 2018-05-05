import { NgModule } from '@angular/core';
import { RankingListComponent } from './ranking-list/ranking-list';
import { TasksListComponent } from './tasks-list/tasks-list';
import { HistoryListComponent } from './history-list/history-list';
import { ExpensesListComponent } from './expenses-list/expenses-list';

@NgModule({
	declarations: [
		RankingListComponent, 
		TasksListComponent,
    HistoryListComponent,
    ExpensesListComponent],
	imports: [],
	exports: [
		RankingListComponent,
		TasksListComponent,
    HistoryListComponent,
    ExpensesListComponent
	]
})
export class ComponentsModule {}
