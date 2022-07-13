import { ColumnModel } from "./columnModel";

export class TableModel{
    page:number=1
    keyWord:string=''
    sortMode:string=''
    sortColumn:string=''
    columnList:Array<ColumnModel> =[];
    fetchUrl:string=''
 }