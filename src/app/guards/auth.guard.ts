import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {AppService} from '@services/app.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private appService: AppService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.getProfile();
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }

    async getProfile() {
        if (this.appService.user) {
            return true;
        }

        try {
            await this.appService.getProfile();
            if (this.appService.user != null) {
                return true;
            } else {
                this.router.navigate(['login']);
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}
