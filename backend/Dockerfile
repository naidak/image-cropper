# ================= Build Stage =================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Disable NuGet fallback inside container
ENV DOTNET_NOLOGO=true \
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE=true \
    DOTNET_CLI_TELEMETRY_OPTOUT=true \
    DOTNET_HOST_PATH=/usr/share/dotnet/dotnet \
    DOTNET_EnableWriteXorExecute=0 \
    DisableImplicitNuGetFallbackFolder=true

# Copy the solution file
COPY ImageCropper.Api/ImageCropper.sln .
# Optional: Copy NuGet.Config if you have one
COPY ImageCropper.Api/NuGet.Config ./NuGet.Config
# Copy all project files individually (cache-friendly restore)
COPY ImageCropper.Api/*.csproj ImageCropper.Api/
COPY ImageCropper.Data/*.csproj ImageCropper.Data/
COPY ImageCropper.Models/*.csproj ImageCropper.Models/
COPY ImageCropper.Services/*.csproj ImageCropper.Services/

# Clear caches
RUN dotnet nuget locals all --clear

# Restore dependencies for the API project
RUN dotnet restore ImageCropper.Api/ImageCropper.Api.csproj

# Copy the rest of the source code
COPY . .

# Publish the API project (Release build)
WORKDIR /src/ImageCropper.Api
RUN dotnet publish ImageCropper.Api.csproj -c Release -o /app/out

# ================= Runtime Stage =================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/out .

# Expose the API port
EXPOSE 5000

# Run the API
ENTRYPOINT ["dotnet", "ImageCropper.Api.dll"]
