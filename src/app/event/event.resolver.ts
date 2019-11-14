import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

// import { IEvent } from './event';
import { EventService } from './event.service';

// @Injectable() 
// export class EventResolver implements Resolve<IEvent> {
// 	constructor(
// 		protected destinationService: EventService,
// 	) {}
// 	resolve(route: ActivatedRouteSnapshot) {
// 		const id = route.paramMap.get('id');
// 		return this.destinationService.getEventById(id);
// 	}
// }
