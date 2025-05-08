create table api_keys (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text not null check (type in ('production', 'development')),
  usage integer default 0 not null,
  key text not null,
  monthly_limit integer,
  user_id uuid not null,
  
  constraint api_keys_name_user_id_key unique (name, user_id)
); 