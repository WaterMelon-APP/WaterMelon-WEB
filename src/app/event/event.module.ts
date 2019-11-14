import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiModule } from './../api/api.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatInputModule, MatNativeDateModule, MatDialogRef } from '@angular/material';

import { EventService } from './event.service';
// import { EventResolver } from './event.resolver';
import { EventRoutingModule } from './event.router';
import { EventComponent } from './event.component';
import { CreateEventComponent } from './components/create-event.component';
// import { EventDetailComponent } from './components/event-detail.component';
// import { EventThumbnailComponent } from './components/event-thumbnail.component';

@NgModule({
	imports: [
		EventRoutingModule,
		CommonModule,
		HttpClientModule,
		ApiModule,
		FormsModule,
		ReactiveFormsModule,
		MatDatepickerModule, MatInputModule, MatNativeDateModule
	],
	providers: [
		EventService,
		// EventResolver,
		MatDatepickerModule,
		{
			provide: MatDialogRef,
			useValue: {
			  close: (dialogResult: any) => { }
			}
		}
	],
	declarations: [
		EventComponent,
		CreateEventComponent
		// EventDetailComponent,
		// EventThumbnailComponent
	],
	exports: [
		EventComponent,
		CreateEventComponent
		// EventDetailComponent,
		// EventThumbnailComponent
	]
})
export class EventModule {}