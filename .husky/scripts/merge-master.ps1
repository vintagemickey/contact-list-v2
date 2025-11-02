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

Write-Host ">>> Merging $Master into $DevBranch ..."

Write-Host ">>> Checkout to $Master"
git checkout $Master | Out-Null

Write-Host ">>> Pulling latest $Master"
git pull $Origin $Master

Write-Host ">>> Checkout to $DevBranch"
git checkout $DevBranch | Out-Null

Write-Host ">>> Merging $Master into $DevBranch"
if (-not (git merge --no-edit $Master)) {
    git merge --abort | Out-Null
    exit 1
}
