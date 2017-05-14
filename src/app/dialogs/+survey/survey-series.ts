import {Component, Optional} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';


@Component({
    selector: 'bc-survey-series',
    templateUrl: './survey-series.html',
    styleUrls: ['./survey-series.scss']
})
export class SurveySeriesComponent {
    public tool: Observable<string>;

    constructor(public dialog: MdDialog,
                public route: ActivatedRoute,
                @Optional() public dialogRef?: MdDialogRef<SurveySeriesComponent>) {
        if (this.dialogRef) {
            this.tool = Observable
                .of((<ActivatedRouteSnapshot>this.dialogRef._containerInstance.dialogConfig.data).params.series);
        } else {
            this.tool = this.route.params.map(params => {
                return params['series'];
            });
        }

    }

}

