import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box login-box-new';
    public loginForm: FormGroup;
    public isAuthLoading = false;
    public isGoogleLoading = false;
    public isFacebookLoading = false;
    passwordNew = 'password';
    show = false;
    loginResData: any;

    constructor(
        private router: Router,
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        // this.spinner.show();
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.loginForm = new FormGroup({
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }

    async hideShowPassNew() {
        if (this.passwordNew === 'password') {
            this.passwordNew = 'text';
            this.show = true;
        } else {
            this.passwordNew = 'password';
            this.show = false;
        }
    }

    // async loginByAuth() {
    // if(this.loginForm.valid) {
    //     this.isAuthLoading = true;
    //     await this.appService.loginByAuth(this.loginForm.value);
    //     this.isAuthLoading = false;
    // } else {
    // this.toastr.error('Form is not valid!');
    // }
    // }

    loginByAuth() {
        if (this.loginForm.valid) {
            this.spinner.show();
            this.isAuthLoading = true;
            this.appService.post('userSignIn', {
                'email': this.loginForm.value.email,
                'password': this.loginForm.value.password
            }, environment.authKey).subscribe((res: any) => {
                this.loginResData = res;
                this.toastr.success('Login Successful.');
                localStorage.setItem('userSessionMocaaAdmin', JSON.stringify(res));
                this.router.navigate(['/dashboard']);
                this.spinner.hide();
            }, (error: any) => {
                this.toastr.error(error.errorMessage);
                this.spinner.hide();
            });
            this.isAuthLoading = false;
        } else {
            this.toastr.error('Form is not valid!');
            this.spinner.hide();
        }
    }

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
