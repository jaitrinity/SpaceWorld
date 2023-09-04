import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { CommonPageComponent } from './common-page/common-page.component';
// import { CheckpointComponent } from './checkpoint/checkpoint.component';
// import { ActivityComponent } from './activity/activity.component';
// import { ChecklistComponent } from './checklist/checklist.component';
// import { DeviceComponent } from './device/device.component';
import { EmployeeComponent } from './employee/employee.component';
import { LocationComponent } from './location/location.component';
// import { MappingComponent } from './mapping/mapping.component';
// import { RoleComponent } from './role/role.component';
import { WorkInProgressComponent } from './work-in-progress/work-in-progress.component';
import { ReportsComponent } from './reports/reports.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { RaiseSrComponent } from './raise-sr/raise-sr.component';
import { RaisePtwComponent } from './raise-ptw/raise-ptw.component';
import { CreateSupervisorComponent } from './create-supervisor/create-supervisor.component';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { CreatePtwRaiserComponent } from './create-ptw-raiser/create-ptw-raiser.component';
import { NbsLocationComponent } from './nbs-location/nbs-location.component';
import { MapViewComponent } from './map-view/map-view.component';


const routes: Routes = [
  {path : '' ,  redirectTo: '/login', pathMatch: 'full'},
  {path : 'login', component :LoginComponent},
  {path : 'layout', component :LayoutComponent,  canActivate: [AuthGuard],
  children: [
    // Prod
    {path: '', redirectTo: 'm2', pathMatch: 'full'},
    { path: 'menu-submenu/:menuId', component: CommonPageComponent },
    { path: 'dashboard', component: DashboardComponent },
    // { path: 'm1', component: DeviceComponent },
    { path: 'm2', component: EmployeeComponent },
    { path: 'm3', component: LocationComponent },
    { path: 'nbs', component: NbsLocationComponent },
    // { path: 'm4', component: MappingComponent },
    // { path: 'm5', component: CheckpointComponent },
    // { path: 'm6', component: AssignComponent },
    // { path: 'm7', component: ActivityComponent },
    // { path: 'm8', component: ChecklistComponent },
    // { path: 'm9', component: InputTypeComponent },
    // { path: 'm10', component: RoleComponent },
    { path: 'm11', component: ReportsComponent },
    { path: 'm12', component: RaiseSrComponent },
    { path: 'm13', component: RaisePtwComponent },
    { path: 'create-supervisor', component: CreateSupervisorComponent },
    { path: 'create-vendor', component: CreateVendorComponent },
    { path: 'create-ptw-raiser', component: CreatePtwRaiserComponent },
    { path: 'alarm', component: MapViewComponent },
    { path: '**', component: WorkInProgressComponent }

    // Test
    // { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    // { path: 'dashboard', component: DashboardComponent },
    // { path: 'menu-submenu/:menuId', component: CommonPageComponent },
    // { path: 'm3', component: LocationComponent },
    // { path: 'm11', component: ReportsComponent },
    // { path: '**', component: AccessDeniedComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
