import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { environment } from "../../../environments/environment";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
    urlData: any;
    urlDataNew: any;
    userData: any;
    dataApi: { pageNumber: any; pageSize: number; sortBy: string; type: any; };
    pageNumber: number = 1;
    initialCount: any = 10;
    pageSize: number = 10;
    startCount: any = 1;
    extraCount: any;
    pagingLength: any;
    public user;

    constructor(
        private router: Router,
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.user = this.appService.user;
        if (this.router.url == '/user-list') {
            this.urlData = '';
            this.urlDataNew = '';
        } else if (this.router.url == '/consultant-list') {
            this.urlData = 'consultant';
            this.urlDataNew = 'consultant';
        } else if (this.router.url == '/student-list') {
            this.urlData = 'student';
            this.urlDataNew = 'student';
        }
        this.dataApi = {
            pageNumber: this.pageNumber,
            pageSize: 10,
            sortBy: 'profileStrengthCount',
            type: this.urlData
        }
        this.userListAPI()
    }

    userListAPI() {
        this.spinner.show();
        this.appService.postPrivate('userProfile/list', this.dataApi, environment.authKey).subscribe((res: any) => {
            this.userData = res;
            this.pagingLength = Math.ceil(res.profileTotalCount / 10);
            if (this.pagingLength == 0) {
                this.pagingLength = 1;
            }
            this.spinner.hide();
        }, (error: any) => {
            this.toastr.error(error.errorMessage);
            this.spinner.hide();
        });
    }

    pageIncrease() {
        this.pageNumber += 1;
        this.dataApi['pageNumber'] = this.pageNumber;
        this.userListAPI();
        this.initialCount += 10;
        this.startCount += 10;
        if (this.initialCount > this.userData.profileTotalCount) {
            this.extraCount = this.initialCount - this.userData.profileTotalCount;
            this.initialCount = this.userData.profileTotalCount;
        }
    }

    pageDecrease() {
        this.pageNumber -= 1;
        this.dataApi['pageNumber'] = this.pageNumber;
        this.userListAPI();
        this.startCount -= 10;
        if (this.initialCount == this.userData.profileTotalCount) {
            this.initialCount = this.extraCount + this.initialCount;
            this.initialCount -= 10;
        } else {
            this.initialCount -= 10;
        }
    }

    updateAccountStatus(index, userId, status) {
        this.spinner.show();
        let data: any;
        data = {
            'userId': userId,
            'deactivateAccount': status
        };
        this.appService.postPrivateWeb('userAccount', data, this.user.token).subscribe((res: any) => {
            this.spinner.hide();
            this.toastr.success('Account status updated successfully.');
            this.userData.profiles[index].deactivateAccount = res.deactivateAccount;
        }, (error: any) => {
            this.toastr.error(error.errorMessage);
            this.spinner.hide();
        });
    }

}
