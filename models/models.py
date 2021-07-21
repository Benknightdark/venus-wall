
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from . import base
from sqlalchemy.dialects.mssql import BIGINT, BINARY, BIT, CHAR, DATE, DATETIME, DATETIME2,     DATETIMEOFFSET, DECIMAL, FLOAT, IMAGE, INTEGER, JSON, MONEY,     NCHAR, NTEXT, NUMERIC, NVARCHAR, REAL, SMALLDATETIME,     SMALLINT, SMALLMONEY, SQL_VARIANT, TEXT, TIME,     TIMESTAMP, TINYINT, UNIQUEIDENTIFIER, VARBINARY, VARCHAR


class Product(base.Base):
    __tablename__ = "Product"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    ProductName = Column(NVARCHAR(None))

    # key

    # collections
    Cart = relationship("Cart", back_populates="CartProductID_U")


class User(base.Base):
    __tablename__ = "User"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    UserName = Column(NVARCHAR(50))

    DisplayName = Column(NVARCHAR(50))

    # key

    # collections
    Cart = relationship("Cart", back_populates="CartUserID_U")


class Cart(base.Base):
    __tablename__ = "Cart"

    ID = Column(UNIQUEIDENTIFIER, primary_key=True, index=True)

    CreateTime = Column(DATETIME)

    ProductID = Column(NVARCHAR(None), ForeignKey("Product.ID"))
    UserID = Column(NVARCHAR(None), ForeignKey("User.ID"))

    # key
    CartProductID_U = relationship("Product", back_populates="Cart")
    CartUserID_U = relationship("User", back_populates="Cart")

    # collections



