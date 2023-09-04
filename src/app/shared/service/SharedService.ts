import { Injectable } from '@angular/core';
import { Http , RequestOptions , Response , Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Constant } from '../constant/Contant';
import { AuthenticateModel } from 'src/app/login/model/authenticateModel';

@Injectable()
export class SharedService{
    private phpServicePoint;
    constructor(private http:Http){
        this.phpServicePoint = Constant.phpServiceURL;
    }

    
    public getAddressByLatLong(latlong : string) {
        return this.http.get(this.phpServicePoint+'getAddressByLatLong.php?latLong='+latlong)
                .map((response:Response) => response.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public authenticate(authModel:AuthenticateModel){
        let bodyString = JSON.stringify(authModel);
        return this.http.post(this.phpServicePoint+'authenticate.php',bodyString)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMenuListByRoleName(jsonData : any){
        return this.http.post(this.phpServicePoint+'getMenuByEmpRole.php',jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMenuTrasactions(jsonData : any){

        return this.http.post(this.phpServicePoint+'getMenuTrasactions.php',jsonData)
        .map((response:Response) => response.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMenuTrasactionsDet(jsonData : any){
        
        return this.http.post(this.phpServicePoint+'getMenuTrasactionsDet.php',jsonData)
        .map((response:Response) => response.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public changeTransactionStatus(jsonData : any){
        
        return this.http.post(this.phpServicePoint+'changeTransactionStatus.php',jsonData)
        .map((response:Response) => response.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getCategorySubcategoryByRole(jsonData:  any) {
        return this.http.post(this.phpServicePoint+'getCategorySubcategoryByRole.php',jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public sendOTP(jsonData: any) {
               return this.http.post(this.phpServicePoint+'sendOTPtoMobile.php',jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    public changePassword(jsonData: any) {
        
        return this.http.post(this.phpServicePoint+'changePassword.php',jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }


    public getAllList(searchType : string, tenentId : any) {
        return this.http.get(this.phpServicePoint+'assignToEmp.php?searchType='+searchType+'&tenentId='+tenentId)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    // common function
    public getAllListBySelectType(jsonData: any, selectType : string) {
        return this.http.post(this.phpServicePoint+'getAllList.php?selectType='+selectType,jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    public insertDataByInsertType(jsonData: any, insertType : string) {
        return this.http.post(this.phpServicePoint+'insertInTable.php?insertType='+insertType,jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    public updateDataByUpdateType(jsonData: any, updateType : any) {
        return this.http.post(this.phpServicePoint+'updateInTable.php?updateType='+updateType,jsonData)
               .map((response:Response) => response.json())
               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    

    public readyAnyFile(fileName : any){
        return this.http.get('assets/'+fileName);
    }
}