import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://carnbqismaktzfjxvedp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcm5icWlzbWFrdHpmanh2ZWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDAxOTAsImV4cCI6MjA5MTYxNjE5MH0.QE9bPT8PQVPgeHndpekBzqfeIWwRNE-MyO9x8xuEpV4'

export const supabase = createClient(supabaseUrl, supabaseKey)