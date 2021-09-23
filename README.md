``` sql
SELECT DISTINCT A.*, ISNULL(C.MaxPage,0) AS  MaxPage FROM DBO.WebPage A
OUTER  APPLY ( SELECT TOP 1 B.Page AS MaxPage FROM DBO.Item B
WHERE B.WebPageID=A.ID
ORDER BY B.Page DESC 
)C(MaxPage)
ORDER BY MaxPage DESC
```
``` bash
# execute celery worker instance 
python3.9 -m celery -A tasks worker --loglevel=info  -E
# show celery tasks
python3.9 -m celery -A tasks events
# open flower celery monitor webiste
python3.9 -m celery -A tasks flower 


docker exec -it venus-wall_db_1 /opt/mssql-tools/bin/sqlcmd -U SA -P YourStrong!Passw0rd  -W -q "
USE [master]
GO
CREATE DATABASE [beauty_wall]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'beauty_wall', FILENAME = N'/var/opt/mssql/data/beauty_wall.mdf' , SIZE = 204800KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'beauty_wall_log', FILENAME = N'/var/opt/mssql/data/beauty_wall_log.ldf' , SIZE = 532480KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [beauty_wall] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [beauty_wall].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [beauty_wall] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [beauty_wall] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [beauty_wall] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [beauty_wall] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [beauty_wall] SET ARITHABORT OFF 
GO
ALTER DATABASE [beauty_wall] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [beauty_wall] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [beauty_wall] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [beauty_wall] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [beauty_wall] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [beauty_wall] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [beauty_wall] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [beauty_wall] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [beauty_wall] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [beauty_wall] SET  DISABLE_BROKER 
GO
ALTER DATABASE [beauty_wall] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [beauty_wall] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [beauty_wall] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [beauty_wall] SET ALLOW_SNAPSHOT_ISOLATION ON 
GO
ALTER DATABASE [beauty_wall] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [beauty_wall] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [beauty_wall] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [beauty_wall] SET RECOVERY FULL 
GO
ALTER DATABASE [beauty_wall] SET  MULTI_USER 
GO
ALTER DATABASE [beauty_wall] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [beauty_wall] SET DB_CHAINING OFF 
GO
ALTER DATABASE [beauty_wall] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [beauty_wall] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [beauty_wall] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [beauty_wall] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'beauty_wall', N'ON'
GO
ALTER DATABASE [beauty_wall] SET QUERY_STORE = OFF
GO
USE [beauty_wall]
GO
/****** Object:  Table [dbo].[Forum]    Script Date: 2021/9/23 下午 03:03:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Forum](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NULL,
	[WorkerName] [nvarchar](100) NULL,
	[CreatedTime] [datetime] NULL,
	[Enable] [bit] NULL,
	[Seq] [int] NULL,
 CONSTRAINT [PK_Forum] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Image]    Script Date: 2021/9/23 下午 03:03:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Image](
	[ID] [uniqueidentifier] NOT NULL,
	[ItemID] [uniqueidentifier] NOT NULL,
	[Url] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Image] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Item]    Script Date: 2021/9/23 下午 03:03:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Item](
	[ID] [uniqueidentifier] NOT NULL,
	[WebPageID] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[PageName] [nvarchar](max) NOT NULL,
	[Url] [nvarchar](max) NOT NULL,
	[Avator] [nvarchar](max) NULL,
	[ModifiedDateTime] [datetime] NULL,
	[Page] [int] NULL,
	[Seq] [int] NULL,
	[Enable] [bit] NULL,
 CONSTRAINT [PK_ContentList] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 2021/9/23 下午 03:03:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[ID] [uniqueidentifier] NOT NULL,
	[UserName] [nvarchar](50) NULL,
	[ModifiedUserID] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WebPage]    Script Date: 2021/9/23 下午 03:03:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebPage](
	[ID] [uniqueidentifier] NOT NULL,
	[ForumID] [uniqueidentifier] NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Url] [nvarchar](max) NOT NULL,
	[Seq] [int] NULL,
	[Enable] [bit] NULL,
 CONSTRAINT [PK_WebPage] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WebPageSimilarity]    Script Date: 2021/9/23 下午 03:03:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebPageSimilarity](
	[ID] [uniqueidentifier] NOT NULL,
	[WebPageID] [uniqueidentifier] NULL,
	[TargetItemID] [uniqueidentifier] NULL,
	[SimilarityItemID] [uniqueidentifier] NULL,
	[SimilarityItemTitle] [nvarchar](max) NULL,
	[SimilarityRation] [float] NULL,
 CONSTRAINT [PK_WebPageSimilarity] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WebPageTask]    Script Date: 2021/9/23 下午 03:03:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebPageTask](
	[ID] [uniqueidentifier] NOT NULL,
	[WebPageID] [uniqueidentifier] NULL,
	[TaskID] [uniqueidentifier] NULL,
 CONSTRAINT [PK_WebPageTask] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [NonClusteredIndex-20210910-103647]    Script Date: 2021/9/23 下午 03:03:35 ******/
CREATE UNIQUE NONCLUSTERED INDEX [NonClusteredIndex-20210910-103647] ON [dbo].[Image]
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [NonClusteredIndex-20210910-102227]    Script Date: 2021/9/23 下午 03:03:35 ******/
CREATE UNIQUE NONCLUSTERED INDEX [NonClusteredIndex-20210910-102227] ON [dbo].[Item]
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [ix_Users_ID]    Script Date: 2021/9/23 下午 03:03:35 ******/
CREATE NONCLUSTERED INDEX [ix_Users_ID] ON [dbo].[Users]
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Image]  WITH CHECK ADD  CONSTRAINT [FK_Image_Item] FOREIGN KEY([ItemID])
REFERENCES [dbo].[Item] ([ID])
GO
ALTER TABLE [dbo].[Image] CHECK CONSTRAINT [FK_Image_Item]
GO
ALTER TABLE [dbo].[Item]  WITH CHECK ADD  CONSTRAINT [FK_Item_WebPage] FOREIGN KEY([WebPageID])
REFERENCES [dbo].[WebPage] ([ID])
GO
ALTER TABLE [dbo].[Item] CHECK CONSTRAINT [FK_Item_WebPage]
GO
ALTER TABLE [dbo].[WebPage]  WITH CHECK ADD  CONSTRAINT [FK_WebPage_Forum] FOREIGN KEY([ForumID])
REFERENCES [dbo].[Forum] ([ID])
GO
ALTER TABLE [dbo].[WebPage] CHECK CONSTRAINT [FK_WebPage_Forum]
GO
ALTER TABLE [dbo].[WebPageSimilarity]  WITH CHECK ADD  CONSTRAINT [FK_WebPageSimilarity_Item] FOREIGN KEY([TargetItemID])
REFERENCES [dbo].[Item] ([ID])
GO
ALTER TABLE [dbo].[WebPageSimilarity] CHECK CONSTRAINT [FK_WebPageSimilarity_Item]
GO
ALTER TABLE [dbo].[WebPageSimilarity]  WITH CHECK ADD  CONSTRAINT [FK_WebPageSimilarity_WebPage] FOREIGN KEY([WebPageID])
REFERENCES [dbo].[WebPage] ([ID])
GO
ALTER TABLE [dbo].[WebPageSimilarity] CHECK CONSTRAINT [FK_WebPageSimilarity_WebPage]
GO
ALTER TABLE [dbo].[WebPageTask]  WITH CHECK ADD  CONSTRAINT [FK_WebPageTask_WebPage] FOREIGN KEY([WebPageID])
REFERENCES [dbo].[WebPage] ([ID])
GO
ALTER TABLE [dbo].[WebPageTask] CHECK CONSTRAINT [FK_WebPageTask_WebPage]
GO
USE [master]
GO
ALTER DATABASE [beauty_wall] SET  READ_WRITE 
GO


USE [beauty_wall]
GO
INSERT [dbo].[Forum] ([ID], [Name], [WorkerName], [CreatedTime], [Enable]) VALUES (N'0efd030c-2997-44f0-8f5e-fe6c9eed122e', N'JKF', N'jkf_worker', CAST(N'2021-09-11T08:33:01.000' AS DateTime), 1)
GO

INSERT [dbo].[WebPage] ([ID], [ForumID], [Name], [Url], [Seq], [Enable]) VALUES (N'3eba325e-7f65-4961-90f2-f8574df95129', N'0efd030c-2997-44f0-8f5e-fe6c9eed122e', N'網路美女', N'https://www.jkforum.net/forum-736-1.html', 1, 1)
GO

"
```
# css text animate 
- https://github.com/ngneat/cashew


