param(
    [string]$Origin = "origin",
    [string]$Master = "master",
    [string]$Iskra = "iskra"
)

# Определяем текущую ветку
$DevBranch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host ">>> Currently on $DevBranch"

# Если мы на ветке iskra или master — не делаем ничего
if ($DevBranch -eq $Iskra -or $DevBranch -eq $Master) {
    exit 0
}

# Проверяем чистоту рабочей директории
$gitStatus = git status --porcelain
Write-Host ">>> Git status: '$gitStatus'"
if ([string]::IsNullOrWhiteSpace($gitStatus) -eq $false) {
    exit 1
}

Write-Host ">>> Merging $Master into $Iskra ..."

Write-Host ">>> Checkout to $Master"
git checkout $Master | Out-Null

Write-Host ">>> Pulling latest $Master"
git pull $Origin $Master

Write-Host ">>> Checkout to $Iskra"
git checkout $Iskra | Out-Null

Write-Host ">>> Merging $Master into $Iskra"
if (-not (git merge --no-edit $Master)) {
    git merge --abort | Out-Null
    exit 1
}

Write-Host ">>> Merging $DevBranch into $Iskra... "

Write-Host ">>> Checkout to $Iskra"
git checkout $Iskra | Out-Null

Write-Host ">>> Pulling latest $Iskra"
git pull $Origin $Iskra

Write-Host ">>> Merging $DevBranch into $Iskra"
if (-not (git merge --no-edit $DevBranch)) {
    git merge --abort | Out-Null
    git checkout $DevBranch | Out-Null
    exit 1
}

Write-Host ">>> Pushing $Iskra to $Origin"
git push $Origin $Iskra

# Возвращаемся обратно на dev-ветку
git checkout $DevBranch | Out-Null

Write-Host ">>> Done! $DevBranch merged into $Origin/$Iskra"
