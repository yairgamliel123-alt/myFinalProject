import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Trips } from './trips/trips';
import { NotFound } from './not-found/not-found';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { AdminPannel } from './admin-pannel/admin-pannel';
import { TripDetails } from './trip-details/trip-details';
import { AdminGuard } from './guards/admin.guard';
export const routes: Routes = [
    { path: '', component: Home },
    { path: 'trips', component: Trips },   
    { path: 'about', component: About },
    {path:'signup',component: Signup},
    {path:'login',component: Login},
    {path:'admin-pannel',component: AdminPannel, canActivate: [AdminGuard]},
    { path: 'trips/:id', component: TripDetails },
    { path: '**', component: NotFound },
    
];
