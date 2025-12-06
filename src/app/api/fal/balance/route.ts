import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.FAL_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { 
        error: 'FAL_API_KEY not configured',
        message: 'Please add FAL_API_KEY to your .env.local file'
      },
      { status: 200 } // Return 200 so dashboard doesn't show error
    );
  }

  // fal.ai doesn't provide a public API endpoint for balance
  // Try multiple possible endpoints anyway
  const endpoints = [
    'https://api.fal.ai/v1/account',
    'https://api.fal.ai/v1/billing',
    'https://api.fal.ai/v1/accounts/me',
    'https://api.fal.ai/v1/user',
    'https://api.fal.ai/v1/user/balance',
    'https://api.fal.ai/account',
    'https://api.fal.ai/billing',
    'https://fal.ai/api/v1/account',
    'https://fal.ai/api/v1/billing',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          balance: data.balance || data.available_balance || data.credits || 0,
          todayUsage: data.today_usage || data.daily_usage || 0,
          monthUsage: data.month_usage || data.monthly_usage || 0,
          currency: data.currency || 'USD',
          message: 'Balance fetched successfully',
          manualEntry: false
        }, { status: 200 });
      }
    } catch (error) {
      // Try next endpoint
      continue;
    }
  }

  // If all endpoints fail, return manual entry message
  return NextResponse.json({
    balance: 0,
    todayUsage: 0,
    monthUsage: 0,
    currency: 'USD',
    message: 'Balance API not available. Please check your balance at https://fal.ai/dashboard/billing and enter it manually.',
    manualEntry: true
  }, { status: 200 });
}

