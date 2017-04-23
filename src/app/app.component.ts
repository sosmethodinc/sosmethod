﻿import 'rxjs/add/operator/let';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {LayoutService} from './services/layout';
import {NavigationStart, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AudioService} from "./services/audio";
import {AngularFire} from "angularfire2";


@Component({
  selector: 'bc-app',
  providers: [TranslateService, AudioService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {

    public route: Subject<string> = new Subject();

    constructor(
        public af: AngularFire,
        public layout: LayoutService,
        public router: Router) {
    }

    ngOnInit() {
        const that = this;
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationStart) {
                that.route.next(e.url.split('/')[1] || 'home');
            }
        });
    }

    closeSidenav() {
      this.layout.sidebarOpen$.next(false);
    }

    openSidenav() {
      this.layout.sidebarOpen$.next(true);
    }

}