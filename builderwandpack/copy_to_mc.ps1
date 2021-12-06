#replaces the contents of the development resource packs in the minecraft folder
#with these ones
Set-Location $PSScriptRoot


$pack = "builderwandpack";
$sourceRoot = "development_behavior_packs"
$destinationRoot = $env:LOCALAPPDATA + "\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang"
$packFolderRoot = $env:LOCALAPPDATA + "\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs"
Remove-Item -Path "$packFolderRoot\$pack" -Recurse -ErrorAction SilentlyContinue 

Copy-Item -Path $sourceRoot -Recurse -Destination $destinationRoot -Container -ErrorAction SilentlyContinue 

$pack = "builderwandresourcepack";
$sourceRoot = "development_resource_packs"
$destinationRoot = $env:LOCALAPPDATA + "\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\"
$packFolderRoot = $env:LOCALAPPDATA + "\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs"
Remove-Item  -Path "$packFolderRoot\$pack" -Recurse -ErrorAction SilentlyContinue 
Copy-Item -Path $sourceRoot -Recurse -Destination $destinationRoot -Container  -ErrorAction SilentlyContinue 