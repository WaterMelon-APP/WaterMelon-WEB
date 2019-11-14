import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { HomePageComponent } from './home-page.component';
import { HomeRoutingModule } from './home.router';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [
		HomeRoutingModule,
		ReactiveFormsModule,
        CommonModule
    	],
	declarations: [
		HomePageComponent,
	],
})
export class HomeModule {}