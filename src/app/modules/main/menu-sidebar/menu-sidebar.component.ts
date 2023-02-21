import {Component, OnInit} from '@angular/core';
import {AppService} from '@services/app.service';

@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    public user;
    public menu = MENU;

    constructor(public appService: AppService) {}

    ngOnInit() {
        this.user = this.appService.user;
    }
}

export const MENU = [
    {
        nameuser: 'Dashboard',
        path: ['/dashboard'],
        icon: 'nav-icon fas fa-home'
    },
    {
        nameuser: 'Blank',
        path: ['/blank'],
        icon: 'nav-icon fas fa-users'
    },
    {
        nameuser: 'User Managemant',
        icon: 'nav-icon fas fa-user-friends',
        children: [
            {
                name: 'Consultant List',
                path: ['/consultant-list'],
                icon: 'nav-icon fas fa-user-tie'
            },
            {
                name: 'Student List',
                path: ['student-list'],
                icon: 'nav-icon fas fa-user-graduate'
            }
        ]
    }
];
