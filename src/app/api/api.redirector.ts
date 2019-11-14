import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiRedirectInterceptor implements HttpInterceptor {

	constructor() { }
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (req.url.startsWith('/api/')) {
			const clonedRequest = req.clone({
				url: `${environment.serverUrl}${req.url}`,
				headers: req.headers,
			});
			return next.handle(clonedRequest);
		} else {
			return next.handle(req);
		}
	}
}