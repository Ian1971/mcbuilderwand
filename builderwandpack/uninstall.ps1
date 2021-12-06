#replaces the contents of the development resource packs in the minecraft folder
#with these ones
Set-Location $PSScriptRoot

$pack = "builderwan";
$packFolderRoot = $env:LOCALAPPDATA + "\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\behavior_packs\$pack"
Remove-Item -Path "$packFolderRoot" -Recurse   -ErrorAction Ignore

$pack = "builderwan";
$packFolderRoot = $env:LOCALAPPDATA + "\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\resource_packs\$pack"
Remove-Item  -Path "$packFolderRoot" -Recurse   -ErrorAction Ignore
