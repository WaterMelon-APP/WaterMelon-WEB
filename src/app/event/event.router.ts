import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { EventResolver } from './event.resolver';
// import { CreateEventComponent } from './component/create-event.component';
// import { EventDetailComponent } from './component/event-detail.component';
import { EventComponent } from './event.component';

const routes = [
	{ path: 'list-events', component: EventComponent },
	// { path: 'create-event', component: CreateEventComponent },
	// { path: ':id', component: EventDetailComponent, resolve: { destination: EventResolver }},
] as Routes;

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule,
	],
})
export class EventRoutingModule {}