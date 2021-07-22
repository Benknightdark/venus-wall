USE [master]
GO
/****** Object:  Database [jkf]    Script Date: 2021/7/22 上午 09:17:32 ******/
CREATE DATABASE [jkf]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'jkf', FILENAME = N'/var/opt/mssql/data/jkf.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'jkf_log', FILENAME = N'/var/opt/mssql/data/jkf_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [jkf] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [jkf].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [jkf] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [jkf] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [jkf] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [jkf] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [jkf] SET ARITHABORT OFF 
GO
ALTER DATABASE [jkf] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [jkf] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [jkf] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [jkf] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [jkf] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [jkf] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [jkf] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [jkf] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [jkf] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [jkf] SET  DISABLE_BROKER 
GO
ALTER DATABASE [jkf] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [jkf] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [jkf] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [jkf] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [jkf] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [jkf] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [jkf] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [jkf] SET RECOVERY FULL 
GO
ALTER DATABASE [jkf] SET  MULTI_USER 
GO
ALTER DATABASE [jkf] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [jkf] SET DB_CHAINING OFF 
GO
ALTER DATABASE [jkf] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [jkf] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [jkf] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [jkf] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'jkf', N'ON'
GO
ALTER DATABASE [jkf] SET QUERY_STORE = OFF
GO
USE [jkf]
GO
/****** Object:  Table [dbo].[Image]    Script Date: 2021/7/22 上午 09:17:33 ******/
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
/****** Object:  Table [dbo].[Item]    Script Date: 2021/7/22 上午 09:17:33 ******/
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
 CONSTRAINT [PK_ContentList] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WebPage]    Script Date: 2021/7/22 上午 09:17:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebPage](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Url] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_WebPage] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'58a4fc40-a4d7-4e2a-8bbf-170d4281ef4f', N'素人正妹', N'https://www.jkforum.net/forum-574-1.html')
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'8891d9db-7a51-4b59-b76b-55aa82e3a44b', N'美女圖', N'https://www.jkforum.net/forum-520-1.html')
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'edb7dcf0-ff4e-433b-8ad2-57454859b9f9', N'JKF女郎', N'https://www.jkforum.net/forum-1112-1.html')
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'd63926e6-3a84-4d09-a13b-61d3635c9ec5', N'夜店辣妹', N'https://www.jkforum.net/forum-611-1.html')
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'4b373e01-93e2-42e3-be22-977b56df0bf6', N'AV女優', N'https://www.jkforum.net/forum-535-1.html')
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'eb614dcb-08cd-430d-ba1d-a320fa94237b', N'亞洲美女', N'https://www.jkforum.net/forum-393-1.html')
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'b040f8a0-6959-4c30-97c2-a35bf23adbfd', N'歐美美女', N'https://www.jkforum.net/forum-522-1.html')
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'faa4d1c5-35a4-4deb-897e-b8add9333729', N'COSPLAY', N'https://www.jkforum.net/forum-640-1.html')
GO
INSERT [dbo].[WebPage] ([ID], [Name], [Url]) VALUES (N'3eba325e-7f65-4961-90f2-f8574df95129', N'網路美女', N'https://www.jkforum.net/forum-736-1.html')
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
USE [master]
GO
ALTER DATABASE [jkf] SET  READ_WRITE 
GO
