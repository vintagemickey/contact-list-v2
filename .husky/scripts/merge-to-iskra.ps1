param
(
    [string]$Remote = "origin",
    [string]$MainBranch = "master",
    [string]$TestBranch = "iskra"
)

# Определяем текущую ветку
$CurrentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host ">>> Currently on $CurrentBranch"

# Проверяем чистоту рабочей директории
$gitStatus = git status --porcelain
Write-Host ">>> Git status: $gitStatus"
if ([string]::IsNullOrWhiteSpace($gitStatus) -eq $false)
{
    # Working tree is dirty — commit or stash changes before running this script.
    exit 1
}

Write-Host ">>> Merging $MainBranch and $CurrentBranch into $TestBranch ..."
Write-Host ">>> we were here"
# Подтягиваем свежие изменения
git fetch $Remote --prune

# Создаём временную ветку от iskra (или от master, если iskra нет)
$timestamp = [int][double]::Parse((Get-Date -UFormat %s))
$tmpBranch = "tmp/merge-$($CurrentBranch.Replace('/', '-'))-$timestamp"

Write-Host ">>> Trying to checkout temporary branch $tmpBranch from $Remote/$TestBranch ..."
try
{
    git checkout -b $tmpBranch "$Remote/$TestBranch"
    # Write-Host ">>> Successfully created temporary branch $tmpBranch"
}
catch
{
    # Write-Host "Remote $Remote/$TestBranch not found — creating from $Remote/$MainBranch"
    git checkout -b $tmpBranch "$Remote/$MainBranch"
    # Write-Host ">>> Successfully created temporary branch $tmpBranch from $MainBranch"
}

# Merge master
Write-Host ">>> Merging $Remote/$MainBranch..."
if (-not (git merge --no-edit "$Remote/$MainBranch")) {
    # Write-Host "Conflict with $MainBranch — aborting."
    git merge --abort | Out-Null
    git checkout $CurrentBranch | Out-Null
    git branch -D $tmpBranch | Out-Null
    exit 1
}

# Merge текущей ветки
Write-Host ">>> Merging $CurrentBranch..."
if (-not (git merge --no-edit $CurrentBranch)) {
    # Write-Host "Conflict with $CurrentBranch — aborting."
    git merge --abort | Out-Null
    git checkout $CurrentBranch | Out-Null
    git branch -D $tmpBranch | Out-Null
    exit 1
}

# Пушим в iskra
Write-Host ">>> Pushing to $Remote/$TestBranch..."
git push $Remote "HEAD:$TestBranch"

# Возвращаемся обратно и удаляем временную
git checkout $CurrentBranch | Out-Null
git branch -D $tmpBranch | Out-Null

Write-Host ">>> Done! Merged into $Remote/$TestBranch"
