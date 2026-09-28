param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidateSet('start', 'stop', 'status', 'ensure')]
  [string]$Action
)

# Locate pg_ctl executable (check PATH first, then standard PostgreSQL installation directories)
$pgCtl = if (Get-Command pg_ctl -ErrorAction SilentlyContinue) {
  (Get-Command pg_ctl).Source
} elseif (Test-Path "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe") {
  "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe"
} else {
  $candidate = Get-Item "C:\Program Files\PostgreSQL\*\bin\pg_ctl.exe" -ErrorAction SilentlyContinue | Select-Object -Last 1
  if ($candidate) { $candidate.FullName } else { $null }
}

if (-not $pgCtl) {
  Write-Error "PostgreSQL 'pg_ctl' executable was not found. Please verify PostgreSQL is installed."
  exit 1
}

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$pgData = Join-Path $repoRoot ".pgdata"
$logFile = Join-Path $pgData "server.log"

switch ($Action) {
  'start' {
    $pidFile = Join-Path $pgData "postmaster.pid"
    if (Test-Path $pidFile) {
      $lines = Get-Content $pidFile
      if ($lines -and $lines.Length -gt 0) {
        $oldPid = 0
        if ([int]::TryParse($lines[0].Trim(), [ref]$oldPid) -and $oldPid -gt 0) {
          $proc = Get-Process -Id $oldPid -ErrorAction SilentlyContinue
          if (-not $proc) {
            Write-Host "Cleaning up stale postmaster.pid (PID $oldPid is no longer running)..."
            Remove-Item -Force $pidFile
          }
        }
      }
    }
    Write-Host "Starting PostgreSQL cluster on port 5433 from $pgData using $pgCtl..."
    & $pgCtl -D $pgData -l $logFile -o "-p 5433" start
  }
  'stop' {
    Write-Host "Stopping PostgreSQL cluster in $pgData..."
    & $pgCtl -D $pgData stop -m fast
  }
  'status' {
    & $pgCtl -D $pgData status
  }
  'ensure' {
    $conn = Get-NetTCPConnection -LocalPort 5433 -ErrorAction SilentlyContinue
    if (-not $conn) {
      Write-Host "PostgreSQL is not running on port 5433. Starting cluster..."
      & $PSCommandPath start
    } else {
      Write-Host "PostgreSQL is already active on port 5433."
    }
  }
}
