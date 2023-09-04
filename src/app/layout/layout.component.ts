import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { SharedService } from '../shared/service/SharedService';
import { Constant } from '../shared/constant/Contant';
import { Title } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  // templateUrl: './layout.component.alarm.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('100ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('100ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class LayoutComponent implements OnInit {
  //Toogle Variable for the sidenav.
  ToggleVariable = true;
  //Toogle variable for searchbar.
  ToggledSearch = false;

  ShowLoading = false;
  loginEmpId : string = "";
  empName : string;
  loginEmpRole : string = "";
  empRoleId : string;
  tenentId = "";
  button = "";
  public isDashMenuShow : boolean = false;
  public isReportMenuShow : boolean = false;
  public menuTopList = [];
  public menuList = [];
  constructor(private router : Router,private sharedService : SharedService,
    private titleService : Title) { 
    this.loginEmpId = localStorage.getItem("empId");
    this.empName = localStorage.getItem("empName");
    this.empRoleId = localStorage.getItem("empRoleId");
    this.button = localStorage.getItem("button");
    this.loginEmpRole = localStorage.getItem("loginEmpRole");
    this.tenentId = localStorage.getItem("tenentId");
  }

  ngOnInit(): void {
    // CDH, O&M Lead, Admin, SpaceWorld, Management, CB, CBH, Corporate OnM lead
    if(this.empRoleId == '44' || this.empRoleId == '45' || this.empRoleId == '10' || this.empRoleId == '50' || 
    this.empRoleId == '51' || this.empRoleId == '52' || this.empRoleId == '46' || this.empRoleId == '57'){
      this.isDashMenuShow = true;
      this.isReportMenuShow = true;
    }
    this.loadMenuList();
    this.loadTopMenuList();
    setTimeout(() => {
      if(this.loginEmpRole != 'Admin' && this.loginEmpRole != 'SpaceWorld'){
        let firstMenuId = localStorage.getItem("firstMenuId");
        this.router.navigate(['/layout/menu-submenu/'+firstMenuId]);
      }
    }, 100);
  }

  setPageTitle(pageTitle : string){
    this.titleService.setTitle("Crest Digitel | "+pageTitle);
  }

  Logout() {
    let isConfirm = confirm("Do you want to logout ?");
    if(isConfirm){
      // localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  loadTopMenuList(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId
    }
    this.sharedService.getAllListBySelectType(jsonData,"headerMenu")
    .subscribe( (response) =>{
      this.menuTopList = response.headerMenuList;
  },
    (error)=>{
      
    })
  }

  loadMenuList(){
    var jsonStr = {
      loginEmpId:this.loginEmpId,
      empRoleId:this.empRoleId,
      loginEmpRole:this.loginEmpRole,
      tenentId:this.tenentId
    }
    this.menuList = [];
    this.sharedService.getMenuListByRoleName(jsonStr)
    .subscribe( (response) =>{
        if(response.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          this.menuList = response.wrappedList;
          for(let i=0;i<this.menuList.length;i++){
            let catId = this.menuList[i].menuId;
            let catName = this.menuList[i].menuName;
            if(i==0){
              localStorage.setItem("firstMenuId",catId);
            }
            localStorage.setItem(catId,catName);
          }
        }
        else{
         
        }
  },
    (error)=>{
      
    })

  }

  openAnyModal(modalId){
    $("#"+modalId).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalName){
    $("#"+modalName).modal("hide");
  }

  openDashboard(){
    // let url = Constant.phpServiceURL+"Graphv1/#/layout/dashboard?empId="+this.loginEmpId
    let url = Constant.phpServiceURL+"Graphv1/#/dashboard?empId="+this.loginEmpId
    window.open(url,"","width="+screen.availWidth+",height="+screen.availHeight)
  }

}
