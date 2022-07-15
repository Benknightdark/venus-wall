import { ColumnModel } from "./columnModel";

export class TableModel{
    page:number =1;
    keyWord:string='';
    sortMode:string='';
    sortColumn:string='';
    columnList:Array<ColumnModel> =[];
    fetchUrl:string='';
    createUrl:string='';
    editUrl:string='';
    detailurl:string='';
    deleteUrl:string='';
    limit:number=5;
    pageList:number[]=[1, 2, 3, 4, 5];
 }