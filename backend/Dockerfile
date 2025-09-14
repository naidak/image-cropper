FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

ENV DOTNET_NOLOGO=true \
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE=true \
    DOTNET_CLI_TELEMETRY_OPTOUT=true \
    DOTNET_HOST_PATH=/usr/share/dotnet/dotnet \
    DOTNET_EnableWriteXorExecute=0 \
    DisableImplicitNuGetFallbackFolder=true

COPY ImageCropper.Api/ImageCropper.sln .
COPY ImageCropper.Api/NuGet.Config ./NuGet.Config
COPY ImageCropper.Api/*.csproj ImageCropper.Api/
COPY ImageCropper.Data/*.csproj ImageCropper.Data/
COPY ImageCropper.Models/*.csproj ImageCropper.Models/
COPY ImageCropper.Services/*.csproj ImageCropper.Services/

RUN dotnet nuget locals all --clear

RUN dotnet restore ImageCropper.Api/ImageCropper.Api.csproj

COPY . .

WORKDIR /src/ImageCropper.Api
RUN dotnet publish ImageCropper.Api.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .

EXPOSE 5000

ENTRYPOINT ["dotnet", "ImageCropper.Api.dll"]
