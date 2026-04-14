-- Create function to trigger Discord notification
CREATE OR REPLACE FUNCTION trigger_discord_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the edge function
  PERFORM
    net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/on_application_submitted',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := json_build_object('record', row_to_json(NEW))::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new applications
CREATE TRIGGER on_application_insert
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION trigger_discord_notification();

-- Enable the http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS http;
