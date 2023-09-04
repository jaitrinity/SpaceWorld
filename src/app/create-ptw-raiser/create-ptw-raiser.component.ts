import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';
import { RaiserTableSetting } from '../shared/tableSettings/RaiserTableSetting';
declare var $: any;

@Component({
  selector: 'app-create-ptw-raiser',
  templateUrl: './create-ptw-raiser.component.html',
  styleUrls: ['./create-ptw-raiser.component.scss','./create-ptw-raiser.component.css']
})
export class CreatePtwRaiserComponent implements OnInit {

  raiserTableSettings = RaiserTableSetting.setting;
  raiserName : any = "";
  mobile : any = "";
  whatsappNumber : any = "";
  aadharNumber : any = "";
  raiserList = [];
  tenentId = "";
  loginEmpId = "";
  loginEmpRole = "";
  loginEmpRoleId = "";
  rmId = "";
  alertFadeoutTime = 0;
  button = "";
  color1 = "";
  color2 = "";
  constructor(private router: Router,private sharedService : SharedService,
    private toastr: ToastrService, private layoutComponent : LayoutComponent) { 
      this.loginEmpId = localStorage.getItem("empId");
      this.loginEmpRole = localStorage.getItem("loginEmpRole");
      this.loginEmpRoleId = localStorage.getItem("empRoleId");
      this.rmId = localStorage.getItem("rmId");
      this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
      this.tenentId = localStorage.getItem("tenentId");
      this.button = localStorage.getItem("button");
      this.color1 = localStorage.getItem("color1");
      this.color2 = localStorage.getItem("color2");
      this.layoutComponent.setPageTitle("Create Raiser");
    }

  ngOnInit(): void {
    setTimeout(() => {
      $("ng2-smart-table thead").css('background-color',this.color1);
    }, 100);
    this.getAllRaiserList();
  }

  getAllRaiserList(){
    this.raiserList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      rmId : this.rmId,
      tenentId : this.tenentId,
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData, 'raiser')
    .subscribe((response) =>{
      this.raiserList = response.raiserList;
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllRaiserList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  submitRaiserData(){
    
    if(this.raiserName == ""){
      this.toastr.warning("please enter name value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.mobile == ""){
      this.toastr.warning("please enter mobile value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.mobile.length != 10){
      this.toastr.warning("mobile length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.whatsappNumber == ""){
      this.toastr.warning("please enter whatsappNumber value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.whatsappNumber.length != 10){
      this.toastr.warning("whatsappNumber length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.aadharNumber == ""){
      this.toastr.warning("please enter aadharNumber value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.aadharNumber.length != 12){
      this.toastr.warning("aadharNumber length should be 12 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }

    let jsonData = {
      loginEmpId : this.loginEmpId,
      employeeName : this.raiserName,
      mobile : this.mobile,
      whatsappNumber : this.whatsappNumber,
      aadharNumber : this.aadharNumber,
      tenentId : this.tenentId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "createRaiser")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultAllField();
        this.getAllRaiserList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submitSupervisorData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  onCustomAction(event){
    switch ( event.action) {
      case 'editrecord':
        this.editRaiser(event);
        break;
      case 'activerecord':
        this.actionOnRaiser(event,1);
        break;
      case 'deactiverecord':
        this.actionOnRaiser(event,0);
        break;
    }
  }

  actionOnRaiser(event,action){
    let actionType = action == 1 ? "Activate" : "Deactivate";
    let isConfirm = confirm("Do you want to "+actionType+" this?");
    if(isConfirm){
      let id = event.data.id;
      let jsonData = {
        loginEmpId : this.loginEmpId,
        id : id,
        action : action
      }
      this.layoutComponent.ShowLoading = true;
      this.sharedService.updateDataByUpdateType(jsonData,"employee")
      .subscribe((response) =>{
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          this.getAllRaiserList();
        }
        else{
          this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
        
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("actionOnRaiser"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      });
    }
  }

  isDoAnyChange : boolean = false;
  editId = "";
  editRaiserName = "";
  editMobile = "";
  editWhatsappNumber = "";
  editAadharNumber = "";
  editRaiser(event){
    this.isDoAnyChange = false;
    this.editId = event.data.id;
    this.editRaiserName = event.data.name;
    this.editMobile = event.data.mobile;
    this.editWhatsappNumber = event.data.whatsapp;
    this.editAadharNumber = event.data.aadharCard;

    $("#editRaiserModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  updateRaiserData(){
    if(this.editRaiserName == ""){
      this.toastr.warning("please enter name value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editMobile == ""){
      this.toastr.warning("please enter mobile value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editMobile.length != 10){
      this.toastr.warning("mobile length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editWhatsappNumber == ""){
      this.toastr.warning("please enter whatsappNumber value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editWhatsappNumber.length != 10){
      this.toastr.warning("whatsappNumber length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editAadharNumber == ""){
      this.toastr.warning("please enter aadharNumber value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editAadharNumber.length != 12){
      this.toastr.warning("aadharNumber length should be 12 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }

    let jsonData = {
      loginEmpId : this.loginEmpId,
      id : this.editId,
      employeeName : this.editRaiserName,
      mobile : this.editMobile,
      whatsappNumber : this.editWhatsappNumber,
      aadharNumber : this.editAadharNumber,
      tenentId : this.tenentId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.updateDataByUpdateType(jsonData, "updateRaiser")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultAllField();
        this.closeAnyModal("editRaiserModal");
        this.getAllRaiserList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("updateSupervisorData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  setDefaultAllField(){
    this.raiserName = "";
    this.mobile = "";
    this.whatsappNumber = "";
    this.aadharNumber = "";
    this.isDoAnyChange = false; 
    this.editRaiserName = "";
    this.editMobile = "";
    this.editWhatsappNumber = "";
    this.editAadharNumber = "";
  }

  exportData(reportType : any){
    var time = new Date();
    let millisecond = Math.round(time.getTime()/1000);

    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      rmId : this.rmId,
      reportType : reportType,
      millisecond : millisecond
    }
    window.open(Constant.phpServiceURL+'downloadReport.php?jsonData='+JSON.stringify(jsonData));
  }

  closeAnyModal(modalName){
    $("#"+modalName).modal("hide");
  }

  changeSelected(e){
    $("#createRaiserModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

}
