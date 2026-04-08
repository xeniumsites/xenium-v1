
CREATE TABLE public.xenium_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  occasion TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_relation TEXT,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  mood TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  story TEXT NOT NULL,
  deadline TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.xenium_requests ENABLE ROW LEVEL SECURITY;

-- Allow the edge function (using service role) to insert. No public read access.
CREATE POLICY "Allow insert via service role" ON public.xenium_requests
  FOR INSERT WITH CHECK (true);
