import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  monthList = [];
  // selectedMonthList = [];
  monthYear = "";
  fromDate = "";
  toDate = "";
  currentYear = "";
  mgmtVisit = "311";
  alertFadeoutTime = 0;
  loginEmpId = "";
  loginEmpRole = "";
  tenentId = "";
  button = "";
  color1 = "";
  color2 = "";
  singleSelectdropdownSettings = {};
  isSpaceAdmin : boolean = false;
  isOnMTeam : boolean = false;
  isCBHTeam : boolean = false;
  constructor(private datePipe : DatePipe, private toastr: ToastrService, 
    private layoutComponent : LayoutComponent, private sharedService : SharedService) { 
    this.loginEmpId = localStorage.getItem("empId");
    this.loginEmpRole = localStorage.getItem("loginEmpRole");
    let empRoleId = localStorage.getItem("empRoleId");
    if(empRoleId == "50"){
      this.isSpaceAdmin = true;
      this.isOnMTeam = true;
    }
    else if(empRoleId == "43" || empRoleId == "44" || empRoleId == "45" || empRoleId == "51" || empRoleId == "52" || empRoleId == "57"){
      this.isOnMTeam = true;
    }
    else if(empRoleId == "46" || empRoleId == "48"){
      this.isCBHTeam = true;
    }
    this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
    this.tenentId = localStorage.getItem("tenentId");
    this.button = localStorage.getItem("button");
    this.color1 = localStorage.getItem("color1");
    this.color2 = localStorage.getItem("color2");
    this.layoutComponent.setPageTitle("Report");

    // let json = {};
    // this.sharedService.getAllListBySelectType(json, "configration").
    // subscribe(
    //   (result)=>{
    //     
    //   },
    //   (error)=>{

    //   }
    // )
  }

  ngOnInit(): void {
    this.singleSelectdropdownSettings = {
      singleSelection: true,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection : true
    };

    this.currentYear = this.datePipe.transform(new Date(),'yyyy');
    // let currentMonth = this.datePipe.transform(new Date(),'MMM');
    let previousYear = parseInt(this.currentYear) - 1;
    let nextYear = parseInt(this.currentYear) + 1;
   
    this.monthList  = [
      {"paramCode" : "4-"+previousYear,"paramDesc":"Apr-"+previousYear},
      {"paramCode" : "5-"+previousYear,"paramDesc":"May-"+previousYear},
      {"paramCode" : "6-"+previousYear,"paramDesc":"Jun-"+previousYear},
      {"paramCode" : "7-"+previousYear,"paramDesc":"Jul-"+previousYear},
      {"paramCode" : "8-"+previousYear,"paramDesc":"Aug-"+previousYear},
      {"paramCode" : "9-"+previousYear,"paramDesc":"Sep-"+previousYear},
      {"paramCode" : "10-"+previousYear,"paramDesc":"Oct-"+previousYear},
      {"paramCode" : "11-"+previousYear,"paramDesc":"Nov-"+previousYear},
      {"paramCode" : "12-"+previousYear,"paramDesc":"Dec-"+previousYear},
      {"paramCode" : "1-"+this.currentYear,"paramDesc":"Jan-"+this.currentYear},
      {"paramCode" : "2-"+this.currentYear,"paramDesc":"Feb-"+this.currentYear},
      {"paramCode" : "3-"+this.currentYear,"paramDesc":"Mar-"+this.currentYear},
      {"paramCode" : "4-"+this.currentYear,"paramDesc":"Apr-"+this.currentYear},
      {"paramCode" : "5-"+this.currentYear,"paramDesc":"May-"+this.currentYear},
      {"paramCode" : "6-"+this.currentYear,"paramDesc":"Jun-"+this.currentYear},
      {"paramCode" : "7-"+this.currentYear,"paramDesc":"Jul-"+this.currentYear},
      {"paramCode" : "8-"+this.currentYear,"paramDesc":"Aug-"+this.currentYear},
      {"paramCode" : "9-"+this.currentYear,"paramDesc":"Sep-"+this.currentYear},
      {"paramCode" : "10-"+this.currentYear,"paramDesc":"Oct-"+this.currentYear},
      {"paramCode" : "11-"+this.currentYear,"paramDesc":"Nov-"+this.currentYear},
      {"paramCode" : "12-"+this.currentYear,"paramDesc":"Dec-"+this.currentYear},
      {"paramCode" : "1-"+nextYear,"paramDesc":"Jan-"+nextYear},
      {"paramCode" : "2-"+nextYear,"paramDesc":"Feb-"+nextYear},
      {"paramCode" : "3-"+nextYear,"paramDesc":"Mar-"+nextYear}
    ]
  }

  downloadReport(reportType : number){
    var time = new Date();
    let millisecond = Math.round(time.getTime()/1000);
    if(reportType == 0 && this.monthYear == ""){
      this.toastr.warning("please select month","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    let localRole = this.loginEmpRole;
    if(localRole == 'O&M Lead') localRole = 'OnM Lead';
    let jsonData = {
      loginEmpId : this.loginEmpId,
      // loginEmpRole : this.loginEmpRole,
      loginEmpRole : localRole,
      monthYear : this.monthYear,
      fromDate : this.fromDate,
      toDate : this.toDate,
      reportType : reportType,
      millisecond : millisecond
    }
    window.open(Constant.phpServiceURL+'downloadReport.php?jsonData='+JSON.stringify(jsonData));
  }

  downloadMgmtReport(reportType){
    if(this.mgmtVisit == ""){
      alert("Select Management Visit type");
      return;
    }

    var time = new Date();
    let millisecond = Math.round(time.getTime()/1000);

    let localRole = this.loginEmpRole;
    if(localRole == 'O&M Lead') localRole = 'OnM Lead';
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : localRole,
      menuId : this.mgmtVisit,
      fromDate : this.fromDate,
      toDate : this.toDate,
      reportType : reportType,
      millisecond : millisecond
    }
    window.open(Constant.phpServiceURL+'downloadReport.php?jsonData='+JSON.stringify(jsonData));

  }

}
