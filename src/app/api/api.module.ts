import { NgModule } from '@angular/core';
import { ApiRedirectInterceptor } from './api.redirector';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
	imports: [
		HttpClientModule
	],
	providers: [
		[
			{ provide: HTTP_INTERCEPTORS, useClass: ApiRedirectInterceptor, multi: true },
		],
	],
})
export class ApiModule {}