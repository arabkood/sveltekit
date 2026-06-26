-- Custom SQL migration file, put your code below! --
UPDATE auth.users 
SET email = lower(email)
WHERE email != lower(email);