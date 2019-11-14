import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NavComponentComponent } from './components/nav-component.component';
import { LoginFormComponent } from './components/login-form.component';
import { RegisterFormComponent } from './components/register-form.component';

@NgModule({
	imports: [
		ReactiveFormsModule,
		CommonModule
	],
	declarations: [
		NavComponentComponent,
		LoginFormComponent,
		RegisterFormComponent
	],
	exports: [
		NavComponentComponent,
		LoginFormComponent,
		RegisterFormComponent
		]
})
export class NavModule {}
