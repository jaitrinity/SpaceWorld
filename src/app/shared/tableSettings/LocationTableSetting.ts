export class LocationTableSetting{
    public static setting = {
        mode: 'external',
        //hideHeader : true,
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'editrecord', title: 'Edit'},
            { name: 'deactiveLocation', title: 'Deactive'},
            // { name: 'activerecord', title: 'Active' },
            // { name: 'deactiverecord', title: 'Deactive' },
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          locId: {
            title: 'Loc Id',
            // sort : false,
            width : '80px'
          },
          state:{
            title : 'State',
            width : '80px'
          },
          // city:{
          //   title : 'City'
          // },
          // area:{
          //   title : 'Area'
          // },
          locName: {
            title: 'Site name',
            width : '120px'
            // sort : false,
          },
          siteId: {
            title: 'Site Id',
            // sort : false,
            width : '120px'
          },
          siteType: {
            title: 'Site Type',
            width : '100px'
          },
          siteCategory: {
            title: 'Site Category',
            width : '100px'
          },
          airportMetro: {
            title: 'Airport/Metro',
            width : '120px'
          },
          rfiDate : {
            title : 'RFI date'
          },
          // isHighRevenue: {
          //   title: 'High Revenue',
          // },
          // isISQ: {
          //   title: 'ISQ',
          // },
          // isRetailsIBS: {
          //   title: 'Retails IBS',
          // },
          hir : {
            title: 'HR - ISQ - IBS',
          },
          
          geoCoordinate: {
            // title: 'Geo-coordingate ?',
            title: 'Lat-long',
            sort : false,
            // class : "info location_GeoCoordinate"
          },
          siteStatus :{
            title: 'Site Status',
          }
          // latitude: {
          //   title: 'Latitude'
          // },
          // longitude: {
          //   title: 'Longitude'
          // }
        }
    }
}