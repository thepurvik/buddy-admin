import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse
} from "@angular/common/http";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Gatekeeper } from 'gatekeeper-client-sdk';
import { environment } from "../../environments/environment";
import { throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;

    constructor(private router: Router, private toastr: ToastrService, private http: HttpClient) { }

    async loginByAuth({ email, password }) {
        try {
            const token = await Gatekeeper.loginByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    post(url, data, token) {
        const headers = new HttpHeaders().set("Authorization", token);
        return this.http
            .post(environment.APiURL + url, data, {
                headers: headers
            })
            .pipe(catchError(this.handleError));
    }

    postPrivate(url, data, token) {
        const headers = new HttpHeaders().set("Authorization", token);
        return this.http
            .post(environment.APIPRIVATEURL + url, data, {
                headers: headers
            })
            .pipe(catchError(this.handleError));
    }

    postPrivateWeb(url, data, token) {
        const headers = new HttpHeaders().set("Authorization", token);
        return this.http
            .post(environment.APIPRIVATEURLWEB + url, data, {
                headers: headers
            })
            .pipe(catchError(this.handleError));
    }

    postPublic(url, data) {
        return this.http
            .post(environment.APIPUBLICURL + url, data)
            .pipe(catchError(this.handleError));
    }

    getPrivate(url, token) {
        const headers = new HttpHeaders().set("Authorization", token);
        return this.http
            .get(environment.APIPRIVATEURL + url, {
                headers: headers
            })
            .pipe(catchError(this.handleError));
    }

    getPrivateWeb(url, token) {
        const headers = new HttpHeaders().set("Authorization", token);
        return this.http
            .get(environment.APIPRIVATEURLWEB + url, {
                headers: headers
            })
            .pipe(catchError(this.handleError));
    }

    getPublic(url) {
        return this.http
            .get(environment.APIPUBLICURL + url)
            .pipe(catchError(this.handleError));
    }

    async registerByAuth({ email, password }) {
        try {
            const token = await Gatekeeper.registerByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async loginByGoogle() {
        try {
            const token = await Gatekeeper.loginByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async registerByGoogle() {
        try {
            const token = await Gatekeeper.registerByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async loginByFacebook() {
        try {
            const token = await Gatekeeper.loginByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async registerByFacebook() {
        try {
            const token = await Gatekeeper.registerByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.response.data.message);
        }
    }

    async getProfile() {
        try {
            // this.user = await Gatekeeper.getProfile();
            this.user = await JSON.parse(localStorage.getItem('userSessionMocaaAdmin'));
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('userSessionMocaaAdmin');
        // localStorage.removeItem('gatekeeper_token');
        this.user = null;
        this.router.navigate(['/login']);
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error("An error occurred:", error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
        }

        return throwError(error.error);
    }
}
