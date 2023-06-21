export interface WebPage {
  ID?: string
  Name?: string
  Url?: string
  Seq?: number
  ForumID?: string
  Enable?: Boolean
  TaskCount?: number | null
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
  Seq?: number,
  WebPageSimilarity?: WebPageSimilarity[],
  WebPageSimilarityCount?: number;
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
  _id?: string;
  status?: string;
  result?: string;
  traceback?: string;
  date_done?: Date;
  parent_id?: string;
}
export interface ForumWebpageList {
  CreatedTime?: string;
  Name?: string;
  ID?: string;
  WorkerName?: string;
  Enable?: boolean;
  WebPageList?: WebPage[]
}


export interface WebPageSimilarity {
  SimilarityItemID?: string;
  SimilarityRation?: number;
  WebPageID?: string;
  SimilarityItemTitle?: string;
  ID?: string;
  TargetItemID?: string;
}



export interface AdminForumCount {
  forumName?: string;
  data?: Datum[];
}

export interface Datum {
  ID?: string;
  ForumID?: string;
  Name?: string;
  Url?: string;
  Seq?: number;
  Enable?: boolean;
  ForumName?: string;
  TotalCount?: number;
}

// Generated by https://quicktype.io

export interface CrawlTaskCountModel {
  TotalCount?: number;
  ForumName?:  string;
  Seq?:        number;
}