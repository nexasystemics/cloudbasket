# CloudBasket - Permanent Supabase null fix
# Creates get-client.ts wrapper + patches ALL service files in one pass
# Run: powershell -ExecutionPolicy Bypass -File ".\fix-supabase-permanent.ps1"
# CWD: F:\cloudbasket

Set-Location F:\cloudbasket

# ── STEP 1: Create permanent wrapper ─────────────────────────────────
New-Item -ItemType Directory -Force -Path "src\lib\supabase" | Out-Null

Set-Content -Path "src\lib\supabase\get-client.ts" -Encoding UTF8 -Value @'
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Returns a guaranteed non-null Supabase client.
 * Throws if env is missing so callers never need null checks.
 */
export async function getSupabase() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('[CloudBasket] Supabase client unavailable - check env vars');
  return supabase;
}
'@

Write-Host "Created: src/lib/supabase/get-client.ts" -ForegroundColor Green

# ── STEP 2: Patch ALL .ts and .tsx files that use createServerSupabaseClient ──
$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" |
         Where-Object { (Get-Content $_.FullName -Raw -Encoding UTF8) -match "createServerSupabaseClient" }

if ($files.Count -eq 0) {
  Write-Host "No files found using createServerSupabaseClient" -ForegroundColor Yellow
} else {
  foreach ($file in $files) {
    # Skip get-client.ts itself and server.ts
    if ($file.Name -eq "get-client.ts" -or $file.Name -eq "server.ts") {
      Write-Host "Skipped: $($file.FullName)"
      continue
    }

    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Replace import
    $content = $content -replace `
      "import \{ createServerSupabaseClient \} from '@/lib/supabase/server';", `
      "import { getSupabase } from '@/lib/supabase/get-client';"

    # Replace usage
    $content = $content -replace `
      "await createServerSupabaseClient\(\)", `
      "await getSupabase()"

    # Remove single-line null guards (safe regex - only matches our generated pattern)
    $content = $content -replace `
      "(\r?\n)[ \t]*if \(!supabase\) (return null|return \[\]|return false|\{ console\.warn\([^)]*\); return null; \});?[ \t]*", `
      ""

    Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Patched: $($file.FullName)" -ForegroundColor Cyan
  }
}

Write-Host ""
Write-Host "Done. Run: pnpm build" -ForegroundColor Green
