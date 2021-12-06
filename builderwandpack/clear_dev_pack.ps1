#replaces the contents of the development resource packs in the minecraft folder
#with these ones
Set-Location $PSScriptRoot

$pack = "builderwandpack";
$packFolderRoot =  $env:LOCALAPPDATA + "\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\$pack"
Remove-Item -Path "$packFolderRoot" -Recurse

$pack = "builderwandresourcepack";
$packFolderRoot =  $env:LOCALAPPDATA + "\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs\$pack"
Remove-Item  -Path "$packFolderRoot" -Recurse