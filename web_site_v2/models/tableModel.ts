import { ColumnModel } from "./columnModel";
/**
 *
 * table model for server-side fetch data
 * @export
 * @class TableModel
 */
export class TableModel {
    /**
     *
     * Current Page
     * @type {number}
     * @memberof TableModel
     */
    page: number = 1;

    /**
     *
     * Key word for filter data 
     * @type {string}
     * @memberof TableModel
     */
    keyWord: string = '';
    /**
     *
     * sorting data (DESC/ASC)
     * @type {string}
     * @memberof TableModel
     */
    sortMode: string = '';
    /**
     *
     * sorting column name
     * @type {string}
     * @memberof TableModel
     */
    sortColumn: string = '';
    /**
     *
     * column list data
     * @type {Array<ColumnModel>}
     * @memberof TableModel
     */
    columnList: Array<ColumnModel> = [];
    /**
     *
     * fetch data api url
     * @type {string}
     * @memberof TableModel
     */
    fetchUrl: string = '';
    /**
     *
     * create page url
     * @type {string}
     * @memberof TableModel
     */
    createUrl: string = '';
    /**
     *
     * edit page url
     * @type {string}
     * @memberof TableModel
     */
    editUrl: string = '';
    /**
     *
     * detail page url
     * @type {string}
     * @memberof TableModel
     */
    detailurl: string = '';
    /**
     *
     * delete page url
     * @type {string}
     * @memberof TableModel
     */
    deleteUrl: string = '';
    /**
     *
     * limit data count
     * @type {number}
     * @memberof TableModel
     */
    limit: number = 5;
    /**
     *
     * per page list option
     * @type {number[]}
     * @memberof TableModel
     */
    pageList: number[] = [1, 2, 3, 4, 5];

}