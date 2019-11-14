import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import * as Parse from 'parse';
// import { IEvent } from './event';

@Injectable()
export class EventService {
  // listofEvents: IEvent[] = [];

  // constructor(protected http: HttpClient) {
    //Parse.initialize('MY APP ID', 'MY MASTER KEY ID');
    //(Parse as any).serverURL = "https://watermelondashboard.herokuapp.com/parse";

  //   const elem1: IEvent = { id : "1", creatorId: "", eventName: "petit test 1", dateEvent: new Date(Date.now()), updatedAt: new Date(Date.now()), itemList: null,
  // address: "", createdAt: new Date(Date.now()), image: "" }
  // const elem2: IEvent = { id : "2", creatorId: "", eventName: "petit test 2", dateEvent: new Date(Date.now()), updatedAt: new Date(Date.now()), itemList: null,
  // address: "", createdAt: new Date(Date.now()), image: "" }
  //   this.listofEvents[0] = elem1;
  //   this.listofEvents[1] = elem2;
  // }
  
  // getAllEvents() { 
  //   return this.listofEvents;
  // }

  // retrieveEventById(id: string) {
  //   if (id == "1")
  //     return this.listofEvents[1];
  //   else
  //     return this.listofEvents[2];
  // }

  // retrieve events by name
  // searchDestinations(clue: string = ''): Observable<IEvent[]> {
	// 	const params = {} as any;
	// 	params.orderBy = 'name';
	// 	if (!!clue) {
	// 		params['name$like'] = clue;
	// 	}
	// 	return this.http.get<IEvent[]>(`/api/event`, { params: params });
	// }

  // retrieve events by id
  // getEventById(id: string): Observable<IEvent> {
  //   var event = Parse.Object.extend("Event");
  //   var query = new Parse.Query(event);
  //   query.get(id)
  //   .then((result) => {
  //     // The object was retrieved successfully.
  //     const res: IEvent = {
  //       id: result.get("id"),
  //       creatorId: result.get("creatorId"),
  //       eventName: result.get("eventName"),
  //       dateEvent: result.get("dateEvent"),
  //       updatedAt: result.get("updatedAt"),
  //       itemList: result.get("itemList"),
  //       address: result.get("address"),
  //       createdAt: result.get("createdAt"),
  //       image: "/src/app/assets/watermelon-flat.png"
  //     }
  //     return res;
  //     }, (error) => {
  //       console.error(error);
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
//     });
//     return null;
// 	}

}