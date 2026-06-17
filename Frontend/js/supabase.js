
const SUPABASE_URL =
    "https://zrgnzcnqjkxhnnmmkqva.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZ256Y25xamt4aG5ubW1rcXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzUyMDMsImV4cCI6MjA5NzI1MTIwM30.TtBMmOtep4g39vBm_aO4vs8k0QvXSf8GNAgLeGF2Sgs";

window.supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
