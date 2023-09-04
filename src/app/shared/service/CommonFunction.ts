export class CommonFunction{
    public static createCommaSeprate(listData : any):string{
        let commSeprateValue = "";
        for(let i=0;i<listData.length;i++){
            commSeprateValue += listData[i].paramCode;
            if(i != listData.length-1){
            commSeprateValue += ",";
            }
        }
        return commSeprateValue;
    }

    public static createCommaSeprateByParamDesc(listData : any):string{
        let commSeprateValue = "";
        for(let i=0;i<listData.length;i++){
            commSeprateValue += listData[i].paramDesc;
            if(i != listData.length-1){
            commSeprateValue += ",";
            }
        }
        return commSeprateValue;
    }

    public static getBooleanValue(bolValue : boolean) : number{
        let v = 0;
        if(bolValue){
          v = 1;
        }
        return v;
    }

    public static prepareCommaSeprateValue(listData : any):string{
        let commSeprateValue = "";
        for(let i=0;i<listData.length;i++){
            commSeprateValue += listData[i];
            if(i != listData.length-1){
                commSeprateValue += ",";
            }
        }
        return commSeprateValue;
    }

    public static getBrowserName() {
        const agent = window.navigator.userAgent.toLowerCase()
        switch (true) {
          case agent.indexOf('edge') > -1:
            return 'edge';
          case agent.indexOf('opr') > -1 && !!(<any>window).opr:
            return 'opera';
          case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
            return 'chrome';
          case agent.indexOf('trident') > -1:
            return 'ie';
          case agent.indexOf('firefox') > -1:
            return 'firefox';
          case agent.indexOf('safari') > -1:
            return 'safari';
          default:
            return 'other';
        }
    }
}