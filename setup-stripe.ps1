# Setup Script for Stripe Integration
# This script helps configure Stripe CLI and environment variables

Write-Host "=== OASYS BSG Stripe Integration Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Stripe CLI is installed
Write-Host "Checking Stripe CLI installation..." -ForegroundColor Yellow
$stripeInstalled = Get-Command stripe -ErrorAction SilentlyContinue

if ($stripeInstalled) {
    Write-Host "✓ Stripe CLI is already installed" -ForegroundColor Green
    stripe --version
} else {
    Write-Host "✗ Stripe CLI not found" -ForegroundColor Red
    Write-Host "Please install Stripe CLI first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://github.com/stripe/stripe-cli/releases/latest" -ForegroundColor White
    Write-Host "2. Or install via: choco install stripe-cli" -ForegroundColor White
    Write-Host "3. Or install via: scoop install stripe" -ForegroundColor White
    exit 1
}

Write-Host ""

# Check if .env file exists
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled. Using existing .env file." -ForegroundColor Yellow
        exit 0
    }
}

# Create .env file
Write-Host "Creating .env file..." -ForegroundColor Yellow
Copy-Item ".env.example" $envFile

# Get Stripe credentials
Write-Host ""
Write-Host "=== Stripe Configuration ===" -ForegroundColor Cyan
Write-Host "Please enter your Stripe credentials:" -ForegroundColor Yellow
Write-Host "You can find these in: https://dashboard.stripe.com/apikeys" -ForegroundColor Gray

$stripeSecretKey = Read-Host "Enter your Stripe Secret Key (sk_test_...)"
$stripePublishableKey = Read-Host "Enter your Stripe Publishable Key (pk_test_...)"

# Update .env file
$envContent = Get-Content $envFile -Raw
$envContent = $envContent -replace "STRIPE_SECRET_KEY=.*", "STRIPE_SECRET_KEY=$stripeSecretKey"
$envContent = $envContent -replace "STRIPE_PUBLISHABLE_KEY=.*", "STRIPE_PUBLISHABLE_KEY=$stripePublishableKey"
Set-Content $envFile $envContent

Write-Host "✓ Stripe keys configured" -ForegroundColor Green

# Get Supabase credentials
Write-Host ""
Write-Host "=== Supabase Configuration ===" -ForegroundColor Cyan
Write-Host "Please enter your Supabase credentials:" -ForegroundColor Yellow
Write-Host "You can find these in: https://app.supabase.com/project/_/settings/api" -ForegroundColor Gray

$supabaseUrl = Read-Host "Enter your Supabase URL"
$supabaseServiceKey = Read-Host "Enter your Supabase Service Role Key"
$supabaseAnonKey = Read-Host "Enter your Supabase Anon Key"

# Update .env file
$envContent = Get-Content $envFile -Raw
$envContent = $envContent -replace "SUPABASE_URL=.*", "SUPABASE_URL=$supabaseUrl"
$envContent = $envContent -replace "SUPABASE_SERVICE_ROLE_KEY=.*", "SUPABASE_SERVICE_ROLE_KEY=$supabaseServiceKey"
$envContent = $envContent -replace "SUPABASE_ANON_KEY=.*", "SUPABASE_ANON_KEY=$supabaseAnonKey"
Set-Content $envFile $envContent

Write-Host "✓ Supabase keys configured" -ForegroundColor Green

# Configure site URL
Write-Host ""
Write-Host "=== Site Configuration ===" -ForegroundColor Cyan
$siteUrl = Read-Host "Enter your site URL (default: https://oasys.earth)"
if ([string]::IsNullOrWhiteSpace($siteUrl)) {
    $siteUrl = "https://oasys.earth"
}

$envContent = Get-Content $envFile -Raw
$envContent = $envContent -replace "SITE_URL=.*", "SITE_URL=$siteUrl"
Set-Content $envFile $envContent

Write-Host "✓ Site URL configured" -ForegroundColor Green

# Install npm dependencies
Write-Host ""
Write-Host "=== Installing Dependencies ===" -ForegroundColor Cyan
Write-Host "Installing required npm packages..." -ForegroundColor Yellow

npm install stripe @supabase/supabase-js

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Setup Stripe webhook
Write-Host ""
Write-Host "=== Stripe Webhook Setup ===" -ForegroundColor Cyan
Write-Host "To setup webhooks locally, you'll need to:" -ForegroundColor Yellow
Write-Host "1. Start your local development server" -ForegroundColor White
Write-Host "2. Run: stripe login" -ForegroundColor White
Write-Host "3. Run: stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook" -ForegroundColor White
Write-Host "4. Copy the webhook signing secret and add it to .env" -ForegroundColor White

$setupWebhook = Read-Host "Do you want to setup webhooks now? (y/N)"
if ($setupWebhook -eq "y" -or $setupWebhook -eq "Y") {
    Write-Host ""
    Write-Host "Starting Stripe login..." -ForegroundColor Yellow
    stripe login

    Write-Host ""
    Write-Host "Starting webhook listener..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the listener" -ForegroundColor Gray
    stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host "Your Stripe integration is now configured!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the checkout flow: npm run dev" -ForegroundColor White
Write-Host "2. Create a test checkout session" -ForegroundColor White
Write-Host "3. Monitor webhooks: stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook" -ForegroundColor White
Write-Host "4. Deploy to Netlify: netlify deploy --prod" -ForegroundColor White
Write-Host ""
Write-Host "For production, update your Stripe keys to live keys in .env" -ForegroundColor Yellow