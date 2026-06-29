-- A. email

-- 1. Safely rename any remaining case-insensitive duplicates (keeping the oldest one)
WITH RankedUsers AS (
    SELECT 
        id,
        ROW_NUMBER() OVER(
            PARTITION BY lower(email) 
            ORDER BY created_at ASC
        ) as rn
    FROM auth.users
)
UPDATE auth.users
SET email = email || '-duplicate-' || id 
WHERE id IN (
    SELECT id 
    FROM RankedUsers 
    WHERE rn > 1
);

-- 2. lowercase rest of emails
UPDATE auth.users 
SET email = lower(email)
WHERE email != lower(email);

-- B. username

-- 1. Rename the newer username duplicates with a sequential number
WITH RankedUsers AS (
    SELECT 
        id,
        ROW_NUMBER() OVER(
            PARTITION BY lower(username) 
            ORDER BY created_at ASC
        ) as rn
    FROM auth.users
)
UPDATE auth.users AS u
SET username = substring(u.username from 1 for 25) || '-' || (r.rn - 1)::text
FROM RankedUsers AS r
WHERE u.id = r.id AND r.rn > 1;

