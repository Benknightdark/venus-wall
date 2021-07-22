
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from . import base
from sqlalchemy.dialects.mssql import BIGINT, BINARY, BIT, CHAR, DATE, DATETIME, DATETIME2,     DATETIMEOFFSET, DECIMAL, FLOAT, IMAGE, INTEGER, JSON, MONEY,     NCHAR, NTEXT, NUMERIC, NVARCHAR, REAL, SMALLDATETIME,     SMALLINT, SMALLMONEY, SQL_VARIANT, TEXT, TIME,     TIMESTAMP, TINYINT, UNIQUEIDENTIFIER, VARBINARY, VARCHAR


class WebPage(base.Base):
    __tablename__ = "WebPage"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    Name = Column(NVARCHAR(50))

    Url = Column(NVARCHAR(None))

    # ForeignKey

    # collections
    Item = relationship("Item", back_populates="ItemWebPageID_U")


class Image(base.Base):
    __tablename__ = "Image"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    Url = Column(NVARCHAR(None))

    ItemID = Column(NVARCHAR(None), ForeignKey("Item.ID"))

    # ForeignKey
    ImageItemID_U = relationship("Item", back_populates="Image")

    # collections




    # ForeignKey

    # collections


class Item(base.Base):
    __tablename__ = "Item"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    Title = Column(NVARCHAR(None))

    PageName = Column(NVARCHAR(None))

    Url = Column(NVARCHAR(None))

    Avator = Column(NVARCHAR(None))

    ModifiedDateTime = Column(DATETIME())

    WebPageID = Column(NVARCHAR(None), ForeignKey("WebPage.ID"))

    # ForeignKey
    ItemWebPageID_U = relationship("WebPage", back_populates="Item")

    # collections
    Image = relationship("Image", back_populates="ImageItemID_U")
