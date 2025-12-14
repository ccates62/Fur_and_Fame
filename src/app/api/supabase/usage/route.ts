import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use modern key formats
  const secretKey = 
    process.env.SUPABASE_SECRET_KEY || 
    (process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith("sb_secret_") 
      ? process.env.SUPABASE_SERVICE_ROLE_KEY 
      : null) || undefined;
  
  const publishableKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith("sb_publishable_") 
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      : null) || undefined;
  
  const serviceRoleKeyFinal = secretKey;
  const anonKeyFinal = publishableKey;

  if (!supabaseUrl) {
    return NextResponse.json({
      database: 0,
      storage: 0,
      bandwidth: 0,
      message: 'NEXT_PUBLIC_SUPABASE_URL not configured',
      manualEntry: true
    }, { status: 200 });
  }

  // Use service role key if available (has more permissions), otherwise use publishable key
  const apiKey = serviceRoleKeyFinal || anonKeyFinal;
  
  if (!apiKey) {
    return NextResponse.json({
      database: 0,
      storage: 0,
      bandwidth: 0,
      message: 'Supabase API keys not configured. Please add SUPABASE_SECRET_KEY (sb_secret_...) and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (sb_publishable_...) to .env.local',
      manualEntry: true
    }, { status: 200 });
  }

  try {
    // Try to query database size using REST API with RPC call
    // Note: This requires a function to be created in Supabase, but we'll try direct SQL via REST
    let databaseMB = 0;
    let storageMB = 0;

    // Method 1: Try to get database size via REST API (if we have service role key)
    if (serviceRoleKeyFinal) {
      try {
        // Query database size using PostgreSQL function via REST API
        const dbSizeResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_database_size`, {
          method: 'POST',
          headers: {
            'apikey': serviceRoleKeyFinal,
            'Authorization': `Bearer ${serviceRoleKeyFinal}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ database_name: 'postgres' })
        });

        if (dbSizeResponse.ok) {
          const dbSizeData = await dbSizeResponse.json();
          // Parse the size (could be bytes or formatted string)
          if (typeof dbSizeData === 'number') {
            databaseMB = dbSizeData / (1024 * 1024); // Convert bytes to MB
          } else if (typeof dbSizeData === 'string') {
            const match = dbSizeData.match(/(\d+\.?\d*)\s*(MB|GB|KB|bytes?)/i);
            if (match) {
              const value = parseFloat(match[1]);
              const unit = match[2].toUpperCase();
              if (unit === 'GB') databaseMB = value * 1024;
              else if (unit === 'KB') databaseMB = value / 1024;
              else if (unit === 'MB') databaseMB = value;
              else if (unit.includes('BYTE')) databaseMB = value / (1024 * 1024);
            }
          }
        }
      } catch (dbError) {
        console.log('Database size query failed:', dbError);
      }

      // Method 2: Try to get storage size from storage API
      try {
        const storageResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
          method: 'GET',
          headers: {
            'apikey': serviceRoleKeyFinal,
            'Authorization': `Bearer ${serviceRoleKeyFinal}`,
            'Content-Type': 'application/json'
          }
        });

        if (storageResponse.ok) {
          const buckets = await storageResponse.json();
          if (Array.isArray(buckets)) {
            // Try to get file sizes from each bucket
            for (const bucket of buckets) {
              try {
                const filesResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucket.name}/objects`, {
                  method: 'GET',
                  headers: {
                    'apikey': serviceRoleKeyFinal,
                    'Authorization': `Bearer ${serviceRoleKeyFinal}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (filesResponse.ok) {
                  const files = await filesResponse.json();
                  if (Array.isArray(files)) {
                    const bucketSize = files.reduce((sum: number, file: any) => {
                      return sum + (file.metadata?.size || 0);
                    }, 0);
                    storageMB += bucketSize / (1024 * 1024); // Convert bytes to MB
                  }
                }
              } catch (fileError) {
                // Skip this bucket if we can't get files
                continue;
              }
            }
          }
        }
      } catch (storageError) {
        console.log('Storage size query failed:', storageError);
      }
    }

    // Bandwidth is not available via API - must be checked manually
    const hasData = databaseMB > 0 || storageMB > 0;
    
    return NextResponse.json({
      database: Math.round(databaseMB * 10) / 10, // Round to 1 decimal
      storage: Math.round(storageMB * 10) / 10,
      bandwidth: 0, // Not available via API
      message: hasData
        ? `Fetched: Database ${databaseMB.toFixed(1)} MB, Storage ${storageMB.toFixed(1)} MB. Bandwidth must be checked manually.`
        : 'Could not automatically fetch usage. Please check your usage at https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/usage and enter it manually.',
      manualEntry: !hasData,
      dashboardUrl: 'https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/usage'
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching Supabase usage:', error);
    return NextResponse.json({
      database: 0,
      storage: 0,
      bandwidth: 0,
      message: 'Could not fetch usage automatically. Please check your usage at https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/usage and enter it manually.',
      manualEntry: true,
      dashboardUrl: 'https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/usage'
    }, { status: 200 });
  }
}
