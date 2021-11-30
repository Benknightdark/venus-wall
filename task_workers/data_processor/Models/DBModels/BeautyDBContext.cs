using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace data_processor.Models.DBModels
{
    public partial class BeautyDBContext : DbContext
    {
        public BeautyDBContext()
        {
        }

        public BeautyDBContext(DbContextOptions<BeautyDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CrawlerLog> CrawlerLogs { get; set; } = null!;
        public virtual DbSet<Forum> Forums { get; set; } = null!;
        public virtual DbSet<Image> Images { get; set; } = null!;
        public virtual DbSet<Item> Items { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<WebPage> WebPages { get; set; } = null!;
        public virtual DbSet<WebPageSimilarity> WebPageSimilarities { get; set; } = null!;
        public virtual DbSet<WebPageTask> WebPageTasks { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=.,9487;Database=beauty_wall;user id=sa;password=YourStrong!Passw0rd");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CrawlerLog>(entity =>
            {
                entity.ToTable("CrawlerLog");

                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            });

            modelBuilder.Entity<Forum>(entity =>
            {
                entity.ToTable("Forum");

                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.CreatedTime).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.WorkerName).HasMaxLength(100);
            });

            modelBuilder.Entity<Image>(entity =>
            {
                entity.ToTable("Image");

                entity.HasIndex(e => e.ID, "NonClusteredIndex-20210910-103647")
                    .IsUnique();

                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.HasOne(d => d.Item)
                    .WithMany(p => p.Images)
                    .HasForeignKey(d => d.ItemID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Image_Item");
            });

            modelBuilder.Entity<Item>(entity =>
            {
                entity.ToTable("Item");

                entity.HasIndex(e => e.ID, "NonClusteredIndex-20210910-102227")
                    .IsUnique();

                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.ModifiedDateTime).HasColumnType("datetime");

                entity.HasOne(d => d.WebPage)
                    .WithMany(p => p.Items)
                    .HasForeignKey(d => d.WebPageID)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Item_WebPage");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.ID, "ix_Users_ID");

                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.UserName).HasMaxLength(50);
            });

            modelBuilder.Entity<WebPage>(entity =>
            {
                entity.ToTable("WebPage");

                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.HasOne(d => d.Forum)
                    .WithMany(p => p.WebPages)
                    .HasForeignKey(d => d.ForumID)
                    .HasConstraintName("FK_WebPage_Forum");
            });

            modelBuilder.Entity<WebPageSimilarity>(entity =>
            {
                entity.ToTable("WebPageSimilarity");

                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.HasOne(d => d.TargetItem)
                    .WithMany(p => p.WebPageSimilarities)
                    .HasForeignKey(d => d.TargetItemID)
                    .HasConstraintName("FK_WebPageSimilarity_Item");

                entity.HasOne(d => d.WebPage)
                    .WithMany(p => p.WebPageSimilarities)
                    .HasForeignKey(d => d.WebPageID)
                    .HasConstraintName("FK_WebPageSimilarity_WebPage");
            });

            modelBuilder.Entity<WebPageTask>(entity =>
            {
                entity.ToTable("WebPageTask");

                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.HasOne(d => d.WebPage)
                    .WithMany(p => p.WebPageTasks)
                    .HasForeignKey(d => d.WebPageID)
                    .HasConstraintName("FK_WebPageTask_WebPage");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
