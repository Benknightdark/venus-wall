export interface WebPage {
  ID?: string

  Name?: string

  Url?: string

  Seq?: number

  ForumID?: string
}

export interface Item {
  ID?: string

  Title?: string

  PageName?: string

  Url?: string

  Avator?: string

  ModifiedDateTime?: string

  Page?: number

  WebPageID?: string
}

export interface Forum {
  CreatedTime?: string;
  Name?: string;
  ID?: string;
  Expanded?:Boolean;
}

export interface Image {
  ID: string;
  ItemID: string;
  Url: string;
}
