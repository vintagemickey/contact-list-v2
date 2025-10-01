param
(
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
Write-Host ">>> Git status: $gitStatus"
if ([string]::IsNullOrWhiteSpace($gitStatus) -eq $false)
{
    exit 1
}

# Write-Host ">>> Merging $MainBranch and $CurrentBranch into $TestBranch ..."
Write-Host ">>> Merging $Master into $DevBranch ..."

# Подтягиваем свежие изменения из master в текущую ветку
git fetch $Origin --prune

# Пушим текущую ветку
Write-Host ">>> Pushing to $Remote/$DevBranch..."
git push $Remote "HEAD:$DevBranch"

# Переключаемся на ветку iskra
git checkout $Iskra | Out-Null

# Подтягиваем свежие изменения из origin/iskra на локальную
git fetch $Origin --prune

Write-Host ">>> Merging $DevBranch into $Iskra ..."
# Подтягиваем изменения из нашей ветки в iskra
git merge --no-edit $DevBranch

# Merge master в текущую ветку
# Write-Host ">>> Merging $Remote/$MainBranch..."
# if (-not (git merge --no-edit "$Remote/$MainBranch")) {
#     # Write-Host "Conflict with $MainBranch — aborting."
#     git merge --abort | Out-Null
#     git checkout $CurrentBranch | Out-Null
#     exit 1
# }

# # Merge текущей ветки
# Write-Host ">>> Merging $CurrentBranch..."
# if (-not (git merge --no-edit $CurrentBranch)) {
#     # Write-Host "Conflict with $CurrentBranch — aborting."
#     git merge --abort | Out-Null
#     git checkout $CurrentBranch | Out-Null
#     exit 1
# }

# Пушим изменения в iskra
Write-Host ">>> Pushing to $Remote/$Iskra..."
git push $Remote "HEAD:$Iskra"

# Возвращаемся обратно
git checkout $DevBranch | Out-Null

Write-Host ">>> Done! $DevBranch merged into $Remote/$Iskra"
