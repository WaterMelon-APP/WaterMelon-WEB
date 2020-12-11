import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service'
import { Event } from '../../models/event.model'

@Component({
  selector: 'app-profile',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})

export class SearchResultComponent implements OnInit {

    constructor(private http: HttpClient, private auth: AuthService, private _snackBar: MatSnackBar) { }

    ngOnInit(){

    }
    


}
