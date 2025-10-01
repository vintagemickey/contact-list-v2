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
if ([string]::IsNullOrWhiteSpace($gitStatus) -eq $false)
{
    exit 1
}

# Подтягиваем свежие изменения из master в текущую ветку
Write-Host ">>> Merging $Master into $DevBranch ..."

Write-Host ">>> Checkout to $Master"
git checkout $Master | Out-Null

Write-Host ">>> Pulling to $Master"
git pull

Write-Host ">>> Checkout to $DevBranch"
git checkout $DevBranch | Out-Null

Write-Host ">>> Merging $Master to $DevBranch"
git merge --no-edit $Master

# Пушим текущую ветку
Write-Host ">>> Pushing to $Remote/$DevBranch"
git push $Remote "HEAD:$DevBranch"

Write-Host ">>> Merging $DevBranch into $Iskra..."

# Переключаемся на ветку iskra
Write-Host ">>> Checkout to $Iskra"
git checkout $Iskra | Out-Null

# Подтягиваем свежие изменения из origin/iskra на локальную
Write-Host ">>> Pulling to $Iskra"
git pull

# Подтягиваем изменения из нашей ветки в iskra
Write-Host ">>> Merging $DevBranch into $Iskra"
git merge --no-edit $DevBranch

# Пушим изменения в iskra
Write-Host ">>> Pushing to $Remote/$Iskra..."
git push $Remote "HEAD:$Iskra"

# Возвращаемся обратно
git checkout $DevBranch | Out-Null

Write-Host ">>> Done! $DevBranch merged into $Remote/$Iskra"
