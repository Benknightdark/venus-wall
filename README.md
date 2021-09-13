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



docker exec -it venus-wall_db_1 /opt/mssql-tools/bin/sqlcmd -U SA -P YourStrong!Passw0rd  -W -q 'USE [master]
GO
CREATE DATABASE [beauty_wall]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'beauty_wall', FILENAME = N'/var/opt/mssql/data/beauty_wall.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'beauty_wall_log', FILENAME = N'/var/opt/mssql/data/beauty_wall_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
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

ALTER DATABASE [beauty_wall] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [beauty_wall] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [beauty_wall] SET READ_COMMITTED_SNAPSHOT OFF 
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

ALTER DATABASE [beauty_wall] SET QUERY_STORE = OFF
GO

ALTER DATABASE [beauty_wall] SET  READ_WRITE 
GO

'
```
# css text animate 
- https://codepen.io/caseycallow/pen/yMNqPY

d9c7dd54-162e-41f4-8f1b-6ac0aa21d430


