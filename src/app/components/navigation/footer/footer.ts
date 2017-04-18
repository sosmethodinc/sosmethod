import { Component, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import {LayoutService} from '../../../services/layout';
import {ContactDialogComponent} from '../../contact/contact';
import {MdDialog} from '@angular/material';
import {FaqDialogComponent} from '../../faq/faq';


@Component({
    selector: 'bc-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss']
})
export class FooterComponent {

    public isOpen: boolean;

    constructor(public layout: LayoutService, public dialog: MdDialog) {
        this.layout.sidebarOpen$.subscribe(o => this.isOpen = o);
    }

    showFAQDialog() {
        this.dialog.open(FaqDialogComponent);
    }

    showContactDialog() {
        this.dialog.open(ContactDialogComponent);
    }

    toggleSidenav() {
        this.layout.sidebarOpen$.next(!this.isOpen);
    }

}
