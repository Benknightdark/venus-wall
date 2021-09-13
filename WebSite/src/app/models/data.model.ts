export interface WebPage {
  ID?: string
  Name?: string
  Url?: string
  Seq?: number
  ForumID?: string
  Enable?: Boolean
  TaskCount?:number|null
}

export interface Item {
  ID?: string

  Title?: string

  PageName?: string

  Url?: string

  Avator?: string

  ModifiedDateTime?: string

  Page?: number

  WebPageID?: string,
  Seq?: number

}

export interface Forum {
  CreatedTime?: string;
  Name?: string;
  ID?: string;
  WorkerName?: string;
  Expanded?: boolean;
  Enable?: boolean
}

export interface Image {
  ID: string;
  ItemID: string;
  Url: string;
}
export interface ForumWebPage {
  forum?: Forum;
  webPageList?: WebPage[];
}

export interface TaskInfo {
  uuid?: string;
  name?: string;
  state?: string;
  received?: number;
  sent?: null;
  started?: number;
  rejected?: null;
  succeeded?: number;
  failed?: null;
  retried?: null;
  revoked?: null;
  args?: string;
  kwargs?: string;
  eta?: null;
  expires?: null;
  retries?: number;
  worker?: string;
  result?: string;
  exception?: null;
  timestamp?: number;
  runtime?: number;
  traceback?: null;
  exchange?: null;
  routing_key?: null;
  clock?: number;
  client?: null;
  root?: string;
  root_id?: string;
  parent?: null;
  parent_id?: null;
  children?: any[];
}

export interface TaskResult {
  _id?:       string;
  status?:    string;
  result?:    string;
  traceback?: string;
  date_done?: Date;
  parent_id?: string;
}
