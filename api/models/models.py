
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from . import base
from sqlalchemy.dialects.mssql import BIGINT, BINARY, BIT, CHAR, DATE, DATETIME, DATETIME2,     DATETIMEOFFSET, DECIMAL, FLOAT, IMAGE, INTEGER, JSON, MONEY,     NCHAR, NTEXT, NUMERIC, NVARCHAR, REAL, SMALLDATETIME,     SMALLINT, SMALLMONEY, SQL_VARIANT, TEXT, TIME,     TIMESTAMP, TINYINT, UNIQUEIDENTIFIER, VARBINARY, VARCHAR


class WebPageSimilarity(base.Base):
    __tablename__ = "WebPageSimilarity"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    SimilarityItemID = Column(UNIQUEIDENTIFIER)

    SimilarityItemTitle = Column(NVARCHAR(None))

    SimilarityRation = Column(FLOAT)

    TargetItemID = Column(UNIQUEIDENTIFIER, ForeignKey("Item.ID"))
    WebPageID = Column(UNIQUEIDENTIFIER, ForeignKey("WebPage.ID"))

    # ForeignKey
    WebPageSimilarityTargetItemID_U = relationship(
        "Item", back_populates="WebPageSimilarity")
    WebPageSimilarityWebPageID_U = relationship(
        "WebPage", back_populates="WebPageSimilarity")

    # collections


class Image(base.Base):
    __tablename__ = "Image"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    Url = Column(NVARCHAR(None))

    ItemID = Column(UNIQUEIDENTIFIER, ForeignKey("Item.ID"))

    # ForeignKey
    ImageItemID_U = relationship("Item", back_populates="Image")

    # collections


class Item(base.Base):
    __tablename__ = "Item"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    Title = Column(NVARCHAR(None))

    PageName = Column(NVARCHAR(None))

    Url = Column(NVARCHAR(None))

    Avator = Column(NVARCHAR(None))

    ModifiedDateTime = Column(DATETIME)

    Page = Column(TINYINT)

    Seq = Column(TINYINT)

    Enable = Column(BIT)

    WebPageID = Column(UNIQUEIDENTIFIER, ForeignKey("WebPage.ID"))

    # ForeignKey
    ItemWebPageID_U = relationship("WebPage", back_populates="Item")

    # collections
    Image = relationship("Image", back_populates="ImageItemID_U")
    WebPageSimilarity = relationship(
        "WebPageSimilarity", back_populates="WebPageSimilarityTargetItemID_U")


class Users(base.Base):
    __tablename__ = "Users"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    UserName = Column(NVARCHAR(50))

    ModifiedUserID = Column(UNIQUEIDENTIFIER)

    # ForeignKey

    # collections


class WebPage(base.Base):
    __tablename__ = "WebPage"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    Name = Column(NVARCHAR(50))

    Url = Column(NVARCHAR(None))

    Seq = Column(TINYINT)

    Enable = Column(BIT)

    ForumID = Column(UNIQUEIDENTIFIER, ForeignKey("Forum.ID"))

    # ForeignKey
    WebPageForumID_U = relationship("Forum", back_populates="WebPage")

    # collections
    WebPageSimilarity = relationship(
        "WebPageSimilarity", back_populates="WebPageSimilarityWebPageID_U")
    Item = relationship("Item", back_populates="ItemWebPageID_U")
    WebPageTask = relationship(
        "WebPageTask", back_populates="WebPageTaskWebPageID_U")


class WebPageTask(base.Base):
    __tablename__ = "WebPageTask"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    TaskID = Column(UNIQUEIDENTIFIER)

    WebPageID = Column(UNIQUEIDENTIFIER, ForeignKey("WebPage.ID"))

    # ForeignKey
    WebPageTaskWebPageID_U = relationship(
        "WebPage", back_populates="WebPageTask")

    # collections





class Forum(base.Base):
    __tablename__ = "Forum"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    Name = Column(NVARCHAR(50))

    WorkerName = Column(NVARCHAR(100))

    CreatedTime = Column(DATETIME)

    Enable = Column(BIT)

    Seq = Column(TINYINT)

    # ForeignKey

    # collections
    WebPage = relationship("WebPage", back_populates="WebPageForumID_U")
