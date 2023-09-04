import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { CommonFunction } from '../shared/service/CommonFunction';
import { SharedService } from '../shared/service/SharedService';
import { VendorTableSetting } from '../shared/tableSettings/VendorTableSetting';
declare var $: any;

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.css']
})
export class CreateVendorComponent implements OnInit {

  vendorName = "";
  vendorCode = "";
  vendorTypeList = [];
  selectedVendorTypeList = [];
  stateList = [];
  selectedStateList = [];
  vendorMobile = "";
  vendorList = [];
  vendorTableSettings = VendorTableSetting.setting;
  multiSelectdropdownSettings = {};
  singleSelectdropdownSettings = {};
  tenentId = "";
  loginEmpId = "";
  loginEmpRole = "";
  alertFadeoutTime = 0;
  button = "";
  color1 = "";
  color2 = "";
  constructor(private router: Router,private sharedService : SharedService,
    private toastr: ToastrService, private layoutComponent : LayoutComponent) { 
    this.loginEmpId = localStorage.getItem("empId");
    this.loginEmpRole = localStorage.getItem("loginEmpRole");
    this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
    this.tenentId = localStorage.getItem("tenentId");
    this.button = localStorage.getItem("button");
    this.color1 = localStorage.getItem("color1");
    this.color2 = localStorage.getItem("color2");
    this.layoutComponent.setPageTitle("Create Vendor");
  }

  ngOnInit(): void {
    this.multiSelectdropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true
    };
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
    setTimeout(() => {
      $("ng2-smart-table thead").css('background-color',this.color1);
    }, 100);

    this.getDataForVendorCreation();
    this.getAllVendorList();
  }

  getDataForVendorCreation(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      tenentId : this.tenentId,
    }
    this.sharedService.getAllListBySelectType(jsonData,"vendorCreation")
    .subscribe((response) =>{
      this.stateList = response.stateList;
      this.vendorTypeList = response.vendorTypeList;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getDataForVendorCreation"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }

  getAllVendorList(){
    this.vendorList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId,
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData, 'vendor')
    .subscribe((response) =>{
      this.vendorList = response.vendorList;
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllVendorList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  submitVendorData(){
    if(this.vendorName == ""){
      alert("Please enter name");
      return;
    }
    else if(this.vendorCode == ""){
      alert("please enter code");
      return;
    }
    else if(this.selectedVendorTypeList.length == 0){
      alert("plese select a vendor type");
      return;
    }
    else if(this.selectedStateList.length == 0){
      alert("please select a state");
      return;
    }
    else if(this.vendorMobile == ""){
      alert("please enter mobile");
      return;
    }
    else if(this.vendorMobile.length != 10){
      alert("mobile length should be equal to 10");
      return;
    }

    let vendorType = CommonFunction.createCommaSeprate(this.selectedVendorTypeList);
    let state = CommonFunction.createCommaSeprate(this.selectedStateList);
    let jsonData = {
      loginEmpId : this.loginEmpId,
      vendorName : this.vendorName,
      vendorCode : this.vendorCode.toUpperCase(),
      vendorType : vendorType,
      state: state,
      vendorMobile : this.vendorMobile,
      tenentId : this.tenentId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "createVendor")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultAllField();
        this.getAllVendorList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submitVendorData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  onCustomAction(event){
    switch ( event.action) {
      case 'editrecord':
        this.editVendor(event);
        break;
      case 'activerecord':
        this.actionOnVendor(event,1);
        break;
      case 'deactiverecord':
        this.actionOnVendor(event,0);
        break;
    }
  }

  actionOnVendor(event,action){
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
          this.getAllVendorList();
        }
        else{
          this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
        
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("actionOnVendor"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      });
    }
  }

  isDoAnyChange : boolean = false;
  editId = "";
  editVendorName = "";
  editVendorCode = "";
  editSelectedVendorTypeList = [];
  editSelectedStateList = [];
  editVendorMobile = "";
  editVendor(event){
    this.isDoAnyChange = false;
    this.editId = event.data.id;
    this.editVendorName = event.data.vendorName;
    this.editVendorCode = event.data.vendorCode;
    let vendorType = event.data.vendorType;
    let vendorTypeList = vendorType.split(",");
    let tmpVendorTypeList = [];
    for(let i = 0;i<vendorTypeList.length;i++){
      let tmpJson = {
        paramCode : vendorTypeList[i],
        paramDesc : vendorTypeList[i]+' '
      }
      tmpVendorTypeList.push(tmpJson);
    }
    this.editSelectedVendorTypeList = tmpVendorTypeList;
    let state = event.data.vendorState;
    let stateList = state.split(",");
    let tmpStateList = [];
    for(let i=0;i<stateList.length;i++){
      let tmpJson = {
        paramCode : stateList[i],
        paramDesc : stateList[i]+' '
      }
      tmpStateList.push(tmpJson);
    }
    this.editSelectedStateList = tmpStateList;
    this.editVendorMobile = event.data.vendorMobile;

    $("#editVendorModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  updateVendorData(){
    if(this.editVendorName == ""){
      alert("Please enter name");
      return;
    }
    else if(this.editVendorCode == ""){
      alert("please enter code");
      return;
    }
    else if(this.editSelectedVendorTypeList.length == 0){
      alert("plese select a vendor type");
      return;
    }
    else if(this.editSelectedStateList.length == 0){
      alert("please select a state");
      return;
    }
    else if(this.editVendorMobile == ""){
      alert("please enter mobile");
      return;
    }
    else if(this.editVendorMobile.length != 10){
      alert("mobile length should be equal to 10");
      return;
    }

    let vendorType = CommonFunction.createCommaSeprate(this.editSelectedVendorTypeList);
    let state = CommonFunction.createCommaSeprate(this.editSelectedStateList);
    let jsonData = {
      loginEmpId : this.loginEmpId,
      id : this.editId,
      vendorName : this.editVendorName,
      vendorCode : this.editVendorCode.toUpperCase(),
      vendorType : vendorType,
      state: state,
      vendorMobile : this.editVendorMobile,
      tenentId : this.tenentId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.updateDataByUpdateType(jsonData, "updateVendor")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.closeAnyModal("editVendorModal")
        this.setDefaultAllField();
        this.getAllVendorList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submitVendorData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  setDefaultAllField(){
    this.vendorName = "";
    this.vendorCode = "";
    this.selectedVendorTypeList = [];
    this.selectedStateList = [];
    this.vendorMobile = "";
    this.isDoAnyChange = false;
    this.editId = "";
    this.editVendorName = "";
    this.editVendorCode = "";
    this.editSelectedVendorTypeList = [];
    this.editSelectedStateList = [];
    this.editVendorMobile = "";
  }

  exportData(reportType : any){
    var time = new Date();
    let millisecond = Math.round(time.getTime()/1000);

    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      reportType : reportType,
      millisecond : millisecond
    }
    window.open(Constant.phpServiceURL+'downloadReport.php?jsonData='+JSON.stringify(jsonData));
  }

  closeAnyModal(modalName){
    $("#"+modalName).modal("hide");
  }

  changeSelected(e){
    $("#createVendorModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

}
