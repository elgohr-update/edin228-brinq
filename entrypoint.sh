#!/bin/sh

echo "Check that we have env vars"
test -n "$NEXTAUTH_URL"
test -n "$NEXTAUTH_SECRET"
test -n "$FETCHBASE_URL"


find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXTAUTH_URL#$NEXTAUTH_URL#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXTAUTH_SECRET#$NEXTAUTH_SECRET#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#FETCHBASE_URL#$FETCHBASE_URL#g"

echo "Starting Nextjs"
exec "$@"