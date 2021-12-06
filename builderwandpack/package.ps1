#replaces the contents of the development resource packs in the minecraft folder
#with these ones
Set-Location $PSScriptRoot

$pack = "builderwand";
$bpack = "builderwandpack";
Remove-Item -Path "$pack.mcaddon"  -ErrorAction Ignore
$compress = @{
    Path =  ".\development_behavior_packs\$bpack\"
    DestinationPath = "$pack.zip"
  }
  Compress-Archive @compress
  
$respack = "builderwandresourcepack";
$compress = @{
  Path =  ".\development_resource_packs\$respack\"
  DestinationPath = "$pack.zip"

}
Compress-Archive @compress -Update
Rename-Item -Path  "$pack.zip" -NewName  "$pack.mcaddon"