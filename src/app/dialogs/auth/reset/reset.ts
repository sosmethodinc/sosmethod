﻿import {Component, OnInit, OnDestroy, Optional} from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {AngularFire, _getFirebase} from 'angularfire2';
import * as firebase from 'firebase';
import {environment} from '../../../../../config/environment';
import {MdDialog, MdDialogRef} from "@angular/material";

@Component({
    selector: 'bc-reset',
    templateUrl: './reset.html'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    actionCode: string;
    email: string;
    password: string;
    private firebase: firebase.app.App;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public af: AngularFire,
        public dialog: MdDialog,
        @Optional() public dialogRef?: MdDialogRef<ResetPasswordComponent>) {
        this.firebase = _getFirebase(environment.firebase);
    }

    ngOnInit() {
        const params = (<ActivatedRouteSnapshot>this.dialogRef._containerInstance.dialogConfig.data);
        console.log(params);
        this.actionCode = params.queryParams['oobCode'];
        switch (params.queryParams['mode']) {
            case 'resetPassword':
                // Display reset password handler and UI.
                this.handleResetPassword();
                break;
            case 'recoverEmail':
                // Display email recovery handler and UI.
                this.handleRecoverEmail();
                break;
            case 'verifyEmail':
                // Display email verification handler and UI.
                this.handleVerifyEmail();
                break;
            default:
            // Error: invalid mode.
        }
    }

    ngOnDestroy() {
    }

    resetPassword() {
        const auth = this.firebase.auth();
        auth.confirmPasswordReset(this.actionCode, this.password).then(function(resp) {
            // Password reset has been confirmed and new password updated.
            this.dialog.closeAll();
            // TODO: Display a link back to the app, or sign-in the user directly
            // if the page belongs to the same domain as the app:
            // auth.signInWithEmailAndPassword(accountEmail, newPassword);

        });
    }

    handleResetPassword() {
        const auth = this.firebase.auth();
        // Verify the password reset code is valid.
        auth.verifyPasswordResetCode(this.actionCode).then(function(accountEmail) {
            this.email = accountEmail;

            // TODO: Show the reset screen with the user's email and ask the user for
            // the new password.

            // Save the new password.
        }).catch(function(error) {
            // Invalid or expired action code. Ask user to try to reset the password
            // again.
        });
    }

    handleRecoverEmail() {
        const auth = this.firebase.auth();
        // Confirm the action code is valid.
        auth.checkActionCode(this.actionCode).then(function (info: any) {
            // Get the restored email address.
            this.email = info['data']['email'];

            // Revert to the old email.
            return auth.applyActionCode(this.actionCode);
        });
    }

    handleVerifyEmail() {
        const auth = this.firebase.auth();
        // Try to apply the email verification code.
        auth.applyActionCode(this.actionCode).then(function (resp) {
            // Email address has been verified.

            // TODO: Display a confirmation message to the user.
            // You could also provide the user with a link back to the app.
        });
    }
}
