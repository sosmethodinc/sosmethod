﻿import {Component, ElementRef} from '@angular/core';
import {LayoutService} from '../services/layout';
import {AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Observable';


@Component({
    selector: 'bc-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    public sidebarOpen: boolean;

    public anonymous: Observable<boolean> = Observable.of(true);

    constructor(public layout: LayoutService, public af: AngularFire) {
        this.layout.sidebarOpen$.subscribe((o) => this.sidebarOpen = o);
        this.layout.focusElement.subscribe(f => this.onScrollTo(f));
        this.anonymous = this.af.auth.flatMap(u => {
            return Observable.of(u == null);
        });
    }

    openSidenav() {
        if (this.sidebarOpen) {
            this.layout.sidebarOpen$.next(false);
        } else {
            this.layout.sidebarOpen$.next(true);
        }
    }

    onScrollTo(el: ElementRef) {
        if (el) {
            const discovery = $(el.nativeElement);
            const wrapper = discovery.parents('.mat-sidenav-content');
            wrapper.stop().animate({
                scrollTop: discovery.offset().top + wrapper.scrollTop() - (wrapper.outerHeight() / 2 - discovery.outerHeight(false) / 2),
                scrollLeft: discovery.offset().left + wrapper.scrollLeft() - (wrapper.outerWidth() / 2 - discovery.outerWidth(false) / 2)
            }, 350);
        } else {
            $(window.document).find('.mat-sidenav-content').stop().animate({
                scrollTop: 0,
                scrollLeft: 0
            }, 350);
        }
    }

}
