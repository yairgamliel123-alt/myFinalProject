import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Trips } from './trips/trips';
import { NotFound } from './not-found/not-found';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { AdminPannel } from './admin-pannel/admin-pannel';
export const routes: Routes = [
    { path: '', component: Home },
    { path: 'trips', component: Trips },   
    { path: 'about', component: About },
    {path:'signup',component: Signup},
    {path:'login',component: Login},
    {path:'admib-pannel',component: AdminPannel},
    { path: '**', component: NotFound },
    
];
