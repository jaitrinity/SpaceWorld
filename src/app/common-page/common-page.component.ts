import { Component, OnInit, Renderer2 } from '@angular/core';
import { TrasanctionHdrTableSetting } from '../shared/tableSettings/TrasanctionHdrTableSetting';
import { TrasanctionDetTableSetting } from '../shared/tableSettings/TrasanctionDetTableSetting';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared/service/SharedService';
import { ToastrService } from 'ngx-toastr';
import { Constant } from '../shared/constant/Contant';
import { CommonFunction } from '../shared/service/CommonFunction';
import { MatDialog } from '@angular/material/dialog';
import { LayoutComponent } from '../layout/layout.component';
import * as alasql from 'alasql';
declare var $: any;

@Component({
  selector: 'app-common-page',
  templateUrl: './common-page.component.html',
  styleUrls: ['./common-page.component.css']
})
export class CommonPageComponent implements OnInit {
  
  isDoAnyChange : boolean = false;
  filterEmployeeId = "";
  filterTransactionId = "";
  filterStartDate = "";
  filterEndDate = "";
  categoryName = "";
  subCategoryName = "";
  captionName = "";
  public href: string = "";
  menuId = "";
  transactionHdrList = [];
  categoryList = [];
  selectedCategoryList = [];
  subcategoryList = [];
  selectedSubcategoryList = [];
  captionList = [];
  selectedCaptionList = [];
  multiSelectdropdownSettings = {};
  singleSelectdropdownSettings = {};
  blankTableSettings :any = {};
  newSetting = TrasanctionHdrTableSetting.setting;
  transactionHdrSettings;
  transactionDetSettings = TrasanctionDetTableSetting.setting;
  loginEmpId : any = "";
  loginEmpRole : any = "";
  tenentId : any = "";
  button = "";
  color1 = "";
  color2 = "";
  excelColumn = "";
  columnKeyArr = [];
  columnTitleArr = [];
  formatLabel(value: number) {
    // if (value >= 1000) {
    //   return Math.round(value / 1000) + 'k';
    // }

    return value;
  }
  
  constructor(private route: ActivatedRoute,private router : Router,
    private sharedService : SharedService, private layoutComponent : LayoutComponent,
    private toastr: ToastrService, private renderer: Renderer2,
    public dialog: MatDialog) {
      this.loginEmpId = localStorage.getItem("empId");
      this.loginEmpRole = localStorage.getItem("empRoleId");
      this.tenentId = localStorage.getItem("tenentId");
      this.button = localStorage.getItem("button");
      this.color1 = localStorage.getItem("color1");
      this.color2 = localStorage.getItem("color2");
    }
    

  ngOnInit() {
    this.multiSelectdropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
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
      $("ng2-smart-table thead, .myTable thead").css('background-color',this.color1);
    }, 100);

    this.route.paramMap.subscribe(params => {
      // this.transactionHdrSettings = Object.assign({}, this.blankTableSettings);
      this.newSetting.columns = Object.assign({}, this.blankTableSettings);
      this.subcategoryList = [];
      this.selectedSubcategoryList = [];
      this.captionList = [];
      this.selectedCaptionList = [];
      this.filterStartDate = "";
      this.filterEndDate = "";
      this.subCategoryName = "";
      this.transactionHdrList = [];
      this.menuId = params.get('menuId');
      this.categoryName = localStorage.getItem(this.menuId);
      this.layoutComponent.setPageTitle(this.categoryName);
      this.getDynamicColumn();
      this.getCategorySubcategoryByRole();
    });
  }

  getDynamicColumn(){
    let dynCol = [];
    this.excelColumn = "";
    this.columnKeyArr = [];
    this.columnTitleArr = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId,
      menuId : this.menuId
    }
    this.sharedService.getAllListBySelectType(jsonData,"dynamicColumn")
    .subscribe((response) =>{
      //console.log(response);
      dynCol = response.dynamicColumn;
      if(dynCol.length == 0){
        dynCol = [
          {columnKey : "transactionId",columnTitle:"Activity Id",columnWidth:"85px"},
          {columnKey : "fillingBy",columnTitle:"Employee Name",columnWidth:"85px"},
          {columnKey : "dateTime",columnTitle:"Date",columnWidth:"85px"},
        ];
      }
      for(let i=0;i<dynCol.length;i++){
        this.newSetting.columns[dynCol[i].columnKey] = {title:dynCol[i].columnTitle,width:dynCol[i].columnWidth};
        this.excelColumn += dynCol[i].columnKey+" as `"+dynCol[i].columnTitle+"`";
        this.columnKeyArr.push(dynCol[i].columnKey);
        this.columnTitleArr.push(dynCol[i].columnTitle);
        if(i < (dynCol.length-1)){
          this.excelColumn += ",";
        }
      }
      this.transactionHdrSettings = Object.assign({}, this.newSetting);
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getDynamicColumn"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });

    
  }

  reloadPage(){
    alert("Hello");
  }

  onSelectOrDeselectCategory(item: any) {}

  onSelectAllOrDeselectAllCategory(item: any) {
    this.selectedCategoryList = item;
  }

  onSelectOrDeselectSubcategory(item: any) {
    this.createCaptionList();
  }

  onSelectAllOrDeselectAllSubcategory(item: any) {
    this.selectedSubcategoryList = item;
  }

  actionType : any = 0;
  level : any = 1;
  getCategorySubcategoryByRole(){
    let jsonData = {
      tenentId : this.tenentId,
      loginEmpRole : this.loginEmpRole,
      categoryName : this.categoryName
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getCategorySubcategoryByRole(jsonData)
    .subscribe((response) =>{
      this.level = response.count;
      if(this.level == 2 || this.level == 3){
        this.subcategoryList = response.wrappedList;
        this.layoutComponent.ShowLoading = false;
      }
      else {
        // this.getMenuTrasactions(0);
      }
      this.getMenuTrasactions(this.actionType);
      // this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getCategorySubcategoryByRole"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });

  }

  createCaptionList(){
    let subCatName = CommonFunction.createCommaSeprateByParamDesc(this.selectedSubcategoryList);
    this.subCategoryName = subCatName;
    // if(this.level == 1 || this.level == 2){
    //   return ;
    // }
    // if(this.selectedSubcategoryList.length == 0){
    //   return ;
    // }
    // this.captionList = [];
    // this.selectedCaptionList = [];
    // let subCatName = CommonFunction.createCommaSeprateByParamDesc(this.selectedSubcategoryList);
    // let jsonData = {
    //   loginEmpRole : this.loginEmpRole,
    //   categoryName : this.categoryName,
    //   subCategoryName : subCatName
    // }
    // this.sharedService.getAllListBySelectType(jsonData,"caption")
    // .subscribe((response) =>{
    //   this.captionList = response.captionList;
    // },
    // (error)=>{
    //   this.toastr.warning(Constant.returnServerErrorMessage("createCaptionList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    //   this.layoutComponent.ShowLoading = false;
    // });
  }
  
  getMenuTrasactions(type : any){
    this.actionType = type;
    if(type == 1 && (this.level == 2 || this.level == 3) && this.selectedSubcategoryList.length == 0){
      alert("select atleast one sub category");
      return;
    }
    else if(type == 1 && this.level == 3 && this.selectedCaptionList.length == 0){
      alert("select atleast one caption");
      return;
    }
    
    let subCatMenuIds = CommonFunction.createCommaSeprate(this.selectedSubcategoryList);
    let captionMenuIds = CommonFunction.createCommaSeprate(this.selectedCaptionList);
    this.transactionHdrList = [];
    // if(type == 1)
      this.layoutComponent.ShowLoading = true;
    let json = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      menuId : this.menuId,
      subCatMenuId : subCatMenuIds,
      captionMenuId : captionMenuIds,
      filterEmployeeId : this.filterEmployeeId,
      filterTransactionId : this.filterTransactionId,
      filterStartDate : this.filterStartDate,
      filterEndDate : this.filterEndDate,
      level : this.level
    }
    this.sharedService.getMenuTrasactions(json)
    .subscribe((response) =>{
     
      this.transactionHdrList = response.wrappedList;
      if(this.transactionHdrList.length == 0){
        this.toastr.info("No record found","Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      }
      this.layoutComponent.ShowLoading = false;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getMenuTrasactions"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  isVerifyRequired : boolean = false;
  isApprovalRequired : boolean = false;
  isPTW : boolean = false;
  ptwType : any = "";
  transactionId : any = "";
  viewMenuId : any = "";
  viewLocationId : any = "";
  viewVerifiedDate : any = "";
  viewVerifiedBy : any = "";
  viewApprovedDate : any = "";
  viewApprovedBy : any = "";
  ptwStatus : any = "";

  thirdByDate : any = "";
  thirdByEmpName : any = "";

  fourthByDate : any = "";
  fourthByEmpName : any = "";

  fifthByDate : any = "";
  fifthByEmpName : any = "";
  
  sixthByDate : any = "";
  sixthByEmpName : any = "";

  transactionDetList = [];
  actionCheckpointList = [];
  verifyDetList = [];
  approveDetList = [];
  thirdDetList = [];
  auditDetList = [];
  fourthDetList = [];
  fifthDetList = [];
  sixthDetList = [];
  transactionStatus = "";
  myRoleForTask = "";
  viewState : any = "";
  // viewArea : any = "";
  // viewNoOfOpco : any = "";
  viewSiteName : any = "";
  // viewNoOfBTS_Indoor : any = "";
  // viewNoOfBTS_Outdoor : any = "";
  dateOfVisit : any = "";
  area : any = "";
  technicianName : any = "";
  vendorName : any = "";
  siteSurveyStatus = "";
  siteSurveyRemark = "";
  nominalLatlong = "";
  viewDetails(event){
    this.isDoAnyChange = false;
    this.isVerifyRequired = false;
    this.isApprovalRequired = false;
    this.viewState = "N/A";
    this.viewSiteName = "N/A";
    this.technicianName = "N/A";
    this.vendorName = "N/A";
    this.myRoleForTask = "";
    this.transactionStatus = "";
    this.transactionDetList = [];
    this.actionCheckpointList = [];
    this.verifyDetList = [];
    this.approveDetList = [];
    this.thirdDetList = [];
    this.auditDetList = [];
    this.fourthDetList = [];
    this.fifthDetList = [];
    this.transactionId = event.data.transactionId;
    this.viewMenuId = event.data.menuId;
    this.isPTW = false;
    if(this.viewMenuId == 303 || this.viewMenuId == 304 || this.viewMenuId == 305 || this.viewMenuId == 306 || this.viewMenuId == 307 || this.viewMenuId == 308 || this.viewMenuId == 309 || this.viewMenuId == 310){
      this.isPTW = true;
      this.ptwType = event.data.subName;
    }
    let verifierTId = event.data.verifierTId;
    let approvedTId = event.data.approvedTId;
    let thirdActivityId = event.data.thirdActivityId;
    let fourthActivityId = event.data.fourthActivityId;
    let fifthActivityId = event.data.fifthActivityId;
    let sixthActivityId = event.data.sixthActivityId;
    this.transactionStatus = event.data.status;
    this.myRoleForTask = event.data.myRoleForTask;
    this.viewVerifiedDate = event.data.verifiedDate;
    this.viewVerifiedBy = event.data.verifiedBy;
    this.viewApprovedDate = event.data.approvedDate;
    this.viewApprovedBy = event.data.approvedBy;
    this.ptwStatus = event.data.ptwStatus;

    this.thirdByDate = event.data.thirdByDate;
    this.thirdByEmpName = event.data.thirdByEmpName;

    this.fourthByDate = event.data.fourthByDate;
    this.fourthByEmpName = event.data.fourthByEmpName;

    this.fifthByDate = event.data.fifthByDate;
    this.fifthByEmpName = event.data.fifthByEmpName;

    this.sixthByDate = event.data.sixthByDate;
    this.sixthByEmpName = event.data.sixthByEmpName;

    this.dateOfVisit = event.data.dateTime;
    this.viewState = event.data.fillingByState;
    // this.viewArea = event.data.fillingByArea;
    this.technicianName = event.data.fillingBy;
    let fillingByEmpId = event.data.fillingByEmpId;
    this.siteSurveyStatus = event.data.siteSurveyStatus;
    this.siteSurveyRemark = event.data.siteSurveyRemark;
    this.nominalLatlong = event.data.nominalLatlong;
    let jsonData = {
      loginEmpId : this.loginEmpId,
      fillingByEmpId : fillingByEmpId,
      menuId : this.viewMenuId,
      transactionId : this.transactionId,
      verifierTId : verifierTId,
      approvedTId : approvedTId,
      thirdActivityId : thirdActivityId,
      fourthActivityId : fourthActivityId,
      fifthActivityId : fifthActivityId,
      sixthActivityId : sixthActivityId,
      status : this.transactionStatus
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getMenuTrasactionsDet(jsonData)
    .subscribe((response) =>{
      this.transactionDetList = response.wrappedList[0].transactionDetList; 
      this.actionCheckpointList = response.wrappedList[0].actionCheckpointList; 
      this.verifyDetList = response.wrappedList[0].verifyDetList; 
      this.approveDetList = response.wrappedList[0].approveDetList; 
      this.thirdDetList = response.wrappedList[0].thirdDetList; 
      this.auditDetList = response.wrappedList[0].auditDetList; 
      this.fourthDetList = response.wrappedList[0].fourthDetList; 
      this.fifthDetList = response.wrappedList[0].fifthDetList; 
      this.sixthDetList = response.wrappedList[0].sixthDetList; 
      this.viewLocationId = response.wrappedList[0].locationId; 
      this.vendorName = response.wrappedList[0].vendorName;

      for(let i=0;i<this.transactionDetList.length;i++){
        let forVerifier = this.transactionDetList[i].forVerifier;
        let forApprover = this.transactionDetList[i].forApprover;
        if(forVerifier == "Yes"){
          this.isVerifyRequired = true;
        }
        if(forApprover == "Yes"){
          this.isApprovalRequired = true;
        }

        let checkpointId = this.transactionDetList[i].checkpointId;
        let value = this.transactionDetList[i].value;
        // if(checkpointId == 4715) this.viewNoOfOpco = value;
        if(checkpointId == 4717 || checkpointId == 4726) this.viewSiteName = value;
        // if(checkpointId == 4718) this.viewNoOfBTS_Outdoor = value;
        // if(checkpointId == 4719) this.viewNoOfBTS_Indoor = value;
        // if(checkpointId == 4720) this.technicianName = value;
      }
      $("#viewDetailsModal").modal({
        backdrop : 'static',
        keyboard : false
      });
      setTimeout(() => {
        $("ng2-smart-table thead, .myTable thead").css('background-color',this.color1);
      }, 100);
      this.layoutComponent.ShowLoading = false;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("transactionDetList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });

  }

  validatedData = [];
  validateChangeStatus() : any{
    this.validatedData = [];
    for(var i=0;i<this.actionCheckpointList.length;i++){
      var typeId = this.actionCheckpointList[i].typeId;
      var checkpointId = this.actionCheckpointList[i].checkpointId;
      var size = this.actionCheckpointList[i].size;
      if(typeId == 1 || typeId == 2 || typeId == 3 || typeId == 7){
        var textObj = $("#action-"+checkpointId);
        if(textObj.val().trim()!=""){
          let filledJson = {
            checkpointId : checkpointId,
            checkpointValue : textObj.val().trim(),
            typeId : typeId,
            size : size,
            dependChpId : 0
          }
          this.validatedData.push(filledJson);
        }
        else{
          alert("please enter "+checkpointId+" value ");
          return false;
        }
      }
      else if(typeId == 10){
        var textObj = $("#action-"+checkpointId);
        if(textObj.val().trim()!=""){
          let filledJson = {
            checkpointId : checkpointId,
            checkpointValue : textObj.val().trim(),
            typeId : typeId,
            size : size,
            dependChpId : 0
          }
          this.validatedData.push(filledJson);
        }
        else{
          alert("please select "+checkpointId+" option ");
          return false;
        }
      }
      else if(typeId == 4){
        let isChecked = false;
        let answer = "";
        $(".action-"+checkpointId).each(function(){
          if($(this).prop("checked")){
            answer = $(this).val();
            isChecked = true;
          }
        });

        if(isChecked){
          let filledJson = {
            checkpointId : checkpointId,
            checkpointValue : answer,
            typeId : typeId,
            size : size,
            dependChpId : 0
          }
          this.validatedData.push(filledJson);
        }
        else{
          alert("please select atlease one option of "+checkpointId);
          return false;
        }
      }
      else if(typeId == 5 || typeId == 6){
        var textObj = $("#hidden-"+checkpointId);
        if(textObj.val().trim()!=""){
          let filledJson = {
            checkpointId : checkpointId,
            checkpointValue : textObj.val().trim(),
            typeId : typeId,
            size : size,
            dependChpId : 0
          }
          this.validatedData.push(filledJson);
        }
        else{
          alert("please brower an image in "+checkpointId);
          return false;
        }
        
      }
      else if(typeId == 12){
        var textObj = $("#hidden-"+checkpointId);
        if(textObj.val().trim()!=""){
          let filledJson = {
            checkpointId : checkpointId,
            checkpointValue : textObj.val().trim(),
            typeId : typeId,
            size : size,
            dependChpId : 0
          }
          this.validatedData.push(filledJson);
        }
        else{
          alert("please brower a video in "+checkpointId);
          return false;
        }
        
      }
      
    }
    return true;
  }

  remark : any = "";
  reasonOfCancel : any = "";
  otherReason : any = "";
  changeTransactionStatus(status){
    if(!this.validateChangeStatus()){
      return false;
    }

    let isAllOk = false;
    let cpId = "";
    for(let i=0;i<$(".dependentQues:visible").length;i++){
      let obj = $(".dependentQues:visible")[i];
      let typeId = $(obj).attr("typeId");
      let checkpointId = $(obj).attr("checkpointId");
      let dependChpId = $(obj).attr("dependChpId");
      // alert($(this +" input[type='text']").val());
      let v = $(obj).children("input[type='text']").val();
      if(v == undefined) v = $(obj).children("select").val();
      // alert(v);
      if(v == ""){
        cpId = checkpointId;
        isAllOk = false;
        break;
      }
      else{
        cpId = "";
        isAllOk = true;
      }

      let filledJson = {
        checkpointId : checkpointId,
        checkpointValue : v,
        typeId : typeId,
        dependChpId : dependChpId
      }
      this.validatedData.push(filledJson);
    }

    if(!isAllOk && cpId != ""){
      alert("Checkpoint id "+cpId+" should be filled.");
      return;
    }

    this.layoutComponent.ShowLoading = true;
    let json = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      transactionId : this.transactionId,
      menuId : this.viewMenuId,
      locationId : this.viewLocationId,
      status : status,
      validatedDataList : this.validatedData
    }
    this.sharedService.changeTransactionStatus(json)
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success("Update successfully","Alert",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        $("#viewDetailsModal").modal("hide");
        this.remark = "";
        this.layoutComponent.ShowLoading = false;
        this.getMenuTrasactions(this.actionType);
      }
      else{
        this.toastr.error('Something went wrong', 'Alert',{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      }

    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("changeTransactionStatus"),"Alert",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  actionOnTransaction(actionType : any, status : any){
    // Status : 1=Activate, 0=Deactivate
    if(actionType == "ssr" && this.remark == ""){
      alert("Please enter remark");
      return;
    }
    else if(actionType == "ptw" && this.reasonOfCancel == ""){
      alert("Please select Reason of cancel");
      return;
    }
    else if(actionType == "ptw" && this.reasonOfCancel == "Other" && this.otherReason == ""){
      alert("Please enter other reason ");
      return;
    }
    let msg = "Do u want to "+(actionType == "ptw" ? "reject" : "deactive")+" this transaction";
    let isConfirm = confirm(msg);
    if(!isConfirm)
      return;

    let jsonData = {
      actionType : actionType,
      remark : this.remark,
      reasonOfCancel : this.reasonOfCancel,
      otherReason : this.otherReason,
      transactionId : this.transactionId,
      currentStatus : this.transactionStatus,
      status : status
    };

    this.sharedService.updateDataByUpdateType(jsonData, "actionOnTransaction")
    .subscribe(
      (response)=>{
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(response.responseDesc,"Alert !");
          this.closeAnyModal("viewDetailsModal");
          this.getMenuTrasactions(this.actionType);
        }
        else{
          this.toastr.warning(response.responseDesc,"Alert !");
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("actionOnTransaction"),"Alert",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      });
  }

  closeModal(){
    if(this.isDoAnyChange){
      let isConfirm = confirm("Do you want to close?");
      if(isConfirm){
        $("#viewDetailsModal").modal("hide");
        this.isVerifyRequired = false;
        this.isApprovalRequired = false;
        this.remark = "";
      }
    }
    else{
      $("#viewDetailsModal").modal("hide");
      this.isVerifyRequired = false;
      this.isApprovalRequired = false;
      this.remark = "";
    }
    
  }

  changeListener($event,chkId): void {
    this.readThis($event.target,chkId);
    this.isDoAnyChange = true;
  }

  readThis(inputValue: any,chkId): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      $("#hidden-"+chkId).val(image);
    }
    myReader.readAsDataURL(file);
  }

  openImgURL = "";
  openMedia(v){
    // alert(v);
    window.open(v);
    // this.openImgURL = v;
    // this.openAnyModal("bigImgModal");
  }

  degree = 90;
  rotateImg(type){
    const image = document.getElementById('image');
    if(type == "R")
      this.degree += 90;
    else
      this.degree -= 90;
    
    if(this.degree == 0)
      this.degree = 270;
    else if(this.degree == 360)
      this.degree = 0;
    
    this.renderer.setStyle(image, 'transform', `rotate(${this.degree}deg)`);
    // this.renderer.setStyle(image, 'position', `absolute`);
    // this.renderer.setStyle(image, 'top', `0px`);
    // if(this.degree == 360)
    //   this.degree = 0
    // else
    //   this.degree += 90;
  }

  showDependent(event, cpId, logicCp,typeId){
    $(".dependentQues_"+cpId).hide();
    let depCp = logicCp.split(":");
    if(typeId == 10){
      let selectedIndex = event.target.selectedIndex;
      let depLogic = depCp[selectedIndex-1].split(",");
      for(let i=0;i<depLogic.length;i++){
        $("#dep_"+cpId+"_"+depLogic[i]).show();
      }
    }
    else if(typeId == 4){
      let checked = event.target.checked;
      let defaultValue = event.target.defaultValue;
      let selectedIndex = 1;
      if(defaultValue == "No" || defaultValue == "Reject") selectedIndex = 2;
      if(checked){
        let depLogic = depCp[selectedIndex-1].split(",");
        for(let i=0;i<depLogic.length;i++){
          $("#dep_"+cpId+"_"+depLogic[i]).show();
        }
      }
    }    
  }

  exportData(){
    // if(this.transactionHdrList.length != 0 ){
    //   let sql = "";
    //   if(this.menuId == '274'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, dateTime as `Date`, topFirstCheckpointValue as `Site Name`, okCount as `OK`, notOkCount as `Not OK`, pendingForVerify as `Verified`, pendingForApprove as `Approved` ";
    //     sql += 'INTO XLSXML("Site_PM_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '276'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, dateTime as `Date`, topFirstCheckpointValue as `Site Name`, pendingForVerify as `Verified`, pendingForApprove as `Approved` ";
    //     sql += 'INTO XLSXML("Incident_Mgt_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '277'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, dateTime as `Date`, topFirstCheckpointValue as `Site Name` ";
    //     sql += 'INTO XLSXML("Network_Outage_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '279'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, customerSiteId as `Customer Site Id`, dateTime as `Date`, siteSurveyStatus as `Status` ";
    //     sql += 'INTO XLSXML("Site_Survey_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '282'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, dateTime as `Date` ";
    //     sql += 'INTO XLSXML("Meter_Reading_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '283'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, dateTime as `Date`, notOkCount as `Percentage`, status as `Result` ";
    //     sql += 'INTO XLSXML("Training_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '288'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, dateTime as `Date` ";
    //     sql += 'INTO XLSXML("Management_Visit_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '300'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, topFirstCheckpointValue as `Site Name`, dateTime as `Date`, pendingForVerify as `Verified`, pendingForApprove as `Approved` ";
    //     sql += 'INTO XLSXML("Mount_Checklist_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '301'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, topFirstCheckpointValue as `Site Name`, dateTime as `Date`, pendingForVerify as `Verified`, pendingForApprove as `Approved` ";
    //     sql += 'INTO XLSXML("Electrical_n_Fiber_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else if(this.menuId == '289' || this.menuId == '290' || this.menuId == '291' || this.menuId == '292' || this.menuId == '293' ||
    //   this.menuId == '294' || this.menuId == '295' || this.menuId == '296'){
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, topFirstCheckpointValue as `Site Name`, dateTime as `Date`, ptwStatus as `Status` ";
    //     sql += 'INTO XLSXML("PTW_Report.xls",{headers:true}) FROM ?';
    //   }
    //   else{
    //     sql = "SELECT transactionId as `Activity Id`, fillingBy as `Employee Name`, dateTime as `Date` ";
    //     sql += 'INTO XLSXML("Exported_Report.xls",{headers:true}) FROM ?';
    //   }
    //   alasql(sql,[this.transactionHdrList]);
    // }
    // else{
    //   alert("No data for export");
    // }

    if(this.transactionHdrList.length != 0 ){
      let subCat = "";
      if(this.subCategoryName != ""){
        subCat += " - "+this.subCategoryName;
      }
      // let sql = "SELECT "+this.excelColumn;
      // sql += ' INTO XLSXML("'+this.categoryName+subCat+'_Report.xls",{headers:true}) FROM ?';
      // alasql(sql,[this.transactionHdrList]);
      this.downloadFile(this.transactionHdrList,this.categoryName+subCat+'_Report.csv');
    }
    else{
      alert("No data for export");
    }
  }

  downloadFile(data, filename) {
    let arrHeader = this.columnKeyArr;
    let csvData = this.convertToCSV(data, arrHeader);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  convertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';

    let newHeaders = this.columnTitleArr;

    for (let index in newHeaders) {
      row += newHeaders[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];

        line += this.strRep(array[i][head])+',';
      }
      str += line + '\r\n';
    }
    return str;
  }

  strRep(data) {
    if(typeof data == "string") {
      let newData = data.replace(/,/g, " ");
       return newData.trim();
    }
    else if(typeof data == "undefined") {
      return "-";
    }
    else if(typeof data == "number") {
      return  data.toString();
    }
    else {
      return data;
    }
  }

  exportTransactionDet(){
    let exportDataList = [];
    let circleJson = {
      srNumber : "",
      checkpoint : "Circle",
      filledValue : this.viewState
    }
    exportDataList.push(circleJson);
    let dateOfVisitJson = {
      srNumber : "",
      checkpoint : "Date Of Visit",
      filledValue : this.dateOfVisit
    }
    exportDataList.push(dateOfVisitJson);
    let techNameJson = {
      srNumber : "",
      checkpoint : "Employee Name",
      filledValue : this.technicianName
    }
    exportDataList.push(techNameJson);

    // for blank row in excel
    let blankJson = {
      srNumber : "",
      checkpoint : "",
      filledValue : ""
    }
    exportDataList.push(blankJson);
    for(let i=0;i<this.transactionDetList.length;i++){
      let exportJson = {
        srNumber : this.transactionDetList[i].srNumber,
        checkpoint : this.transactionDetList[i].checkpoint,
        filledValue : this.transactionDetList[i].value
      }
      exportDataList.push(exportJson);
    }
    
    exportDataList.push(blankJson);

    for(let i=0;i<this.verifyDetList.length;i++){
      let exportJson = {
        srNumber : this.verifyDetList[i].srNumber,
        checkpoint : this.verifyDetList[i].checkpoint,
        filledValue : this.verifyDetList[i].value
      }
      exportDataList.push(exportJson);
    }

    let sql = "SELECT srNumber as `SR No`, checkpoint as `Checkpoint`, filledValue as `Value` ";
      sql += 'INTO XLSXML("Site_Survey_Report.xls",{headers:true}) FROM ?';
      alasql(sql,[exportDataList]);
  }

  // generateDetPDF(){
  //   let url = Constant.phpServiceURL;
  //   url+="generatePtwPdf.php?activityId="+this.transactionId;
  //   window.open(url);
  // }
  generateDetPDF(){
    this.sharedService.readyAnyFile("test.css").subscribe(data => {
      var divContents = $("#content").html();
      var printWindow = window.open('', '', 'height=400,width=800');
      printWindow.document.write('<html><head><title>PTW - '+this.transactionId+'</title>');
      printWindow.document.write("<style>"+data.text()+"</style>");
      printWindow.document.write('</head><body>');
      printWindow.document.write(divContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    })
    
  }

  openAnyModal(modalName : string){
    $("#"+modalName).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modlalName : string){
    this.remark = "";
    this.reasonOfCancel = "";
    this.otherReason = "";
    $("#"+modlalName).modal("hide");
  }
}