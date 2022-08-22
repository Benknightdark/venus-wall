FROM mcr.microsoft.com/dotnet/nightly/aspnet:6.0-jammy-chiseled AS base
WORKDIR /app
EXPOSE 5235
ENV ASPNETCORE_URLS=http://+:5235

FROM mcr.microsoft.com/dotnet/nightly/sdk:6.0-jammy AS build
WORKDIR /src
COPY ["data_processor.csproj", "./"]
RUN dotnet restore "data_processor.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "data_processor.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "data_processor.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1
ENV DDOTNET_SYSTEM_GLOBALIZATION_PREDEFINED_CULTURES_ONLY=1

ENTRYPOINT ["dotnet", "data_processor.dll"]

# FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal AS base
# WORKDIR /app
# EXPOSE 5235

# ENV ASPNETCORE_URLS=http://+:5235

# # Creates a non-root user with an explicit UID and adds permission to access the /app folder
# # For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
# RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
# USER appuser

# FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
# WORKDIR /src
# COPY ["data_processor.csproj", "./"]
# RUN dotnet restore "data_processor.csproj"
# COPY . .
# WORKDIR "/src/."
# RUN dotnet build "data_processor.csproj" -c Release -o /app/build

# FROM build AS publish
# RUN dotnet publish "data_processor.csproj" -c Release -o /app/publish

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "data_processor.dll"]







