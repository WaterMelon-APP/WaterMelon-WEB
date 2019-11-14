import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.router';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [
		HomeRoutingModule,
		ReactiveFormsModule,
        CommonModule
    	],
	declarations: [
		HomeComponent,
	],
})
export class HomeModule {}