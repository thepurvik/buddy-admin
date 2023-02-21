import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { environment } from "../../../environments/environment";
import {DateTime} from 'luxon';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    user: any;
    userData: any;
    urlUserId: string;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.user = this.appService.user;
        var paramMap = this.route.snapshot.paramMap;
        this.urlUserId = paramMap.get('id');
        this.userDetailAPI();
    }

    userDetailAPI() {
        this.spinner.show();
        this.appService.getPrivateWeb('userProfile?userId=' + this.urlUserId, environment.authKey).subscribe((res: any) => {
            this.userData = res;
            this.spinner.hide();
        }, (error: any) => {
            this.toastr.error(error.errorMessage);
            this.spinner.hide();
        });
    }

    formatDate(date) {
        return DateTime.fromISO(date).toFormat('dd LLL yyyy');
    }
}
