Set-Location F:\cloudbasket
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Green
Write-Host "PATCH: D52-D61 Supabase Pattern Fix" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$filesToPatch = @(
    'src\services\orders\order-manager.ts',
    'src\services\orders\order-tracking.ts',
    'src\services\payments\wallet-system.ts',
    'src\services\invoices\invoice-generator.ts',
    'src\services\payouts\payout-engine.ts'
)

foreach ($file in $filesToPatch) {
    Write-Host ""
    Write-Host "Patching: $file" -ForegroundColor Cyan
    
    if (-not (Test-Path $file)) {
        Write-Host "ERROR: File not found - $file" -ForegroundColor Red
        exit 1
    }
    
    $content = Get-Content $file -Raw
    
    # Pattern 1: Replace import statement
    $content = $content -replace `
        'import \{ createServerSupabaseClient \} from [''"]@/lib/supabase/server[''"];', `
        'import { getSupabase } from ''@/lib/supabase/get-client'';'
    
    Write-Host "  - Updated import" -ForegroundColor Yellow
    
    # Pattern 2: Replace function call
    $content = $content -replace `
        'const supabase = await createServerSupabaseClient\(\);', `
        'const supabase = await getSupabase();'
    
    Write-Host "  - Updated function call" -ForegroundColor Yellow
    
    # Pattern 3: Remove null check block (if (!supabase) { ... return null; })
    $content = $content -replace `
        'if \(!supabase\) \{\s*return null;\s*\}', `
        ''
    
    Write-Host "  - Removed null checks" -ForegroundColor Yellow
    
    Set-Content $file -Value $content -Force
    Write-Host "  - File written successfully" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "PATCH COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
