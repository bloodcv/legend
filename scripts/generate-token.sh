#!/usr/bin/env bash

#
# JWT Encoder Bash Script
#

secret=$1
iss_domain=$3

# Static header fields.
header='{
	"typ": "JWT",
	"alg": "HS256"
}'


payload="{\"iss\": \"${iss_domain}\"}"

# Use jq to set the dynamic `iat` and `exp`
# fields on the header using the current time.
# `iat` is set to now, and `exp` is now + 1 second.
payload=$(
        	echo "${payload}" | jq --arg time_str "$(date +%s)" --arg expire_days_str "$2" \
        	'
        	($time_str | tonumber) as $time_num
        	| ($expire_days_str | tonumber) as $expire_days
        	| .nbf=$time_num
        	| .iat=$time_num
        	| .exp=($time_num + 86400 * $expire_days)
        	'
        )

base64_encode()
{
	declare input=${1:-$(</dev/stdin)}
	# Use `tr` to URL encode the output from base64.
	printf '%s' "${input}" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n'
}

json() {
	declare input=${1:-$(</dev/stdin)}
	printf '%s' "${input}" | jq -c .
}

hmacsha256_sign()
{
	declare input=${1:-$(</dev/stdin)}
	printf '%s' "${input}" | openssl dgst -binary -sha256 -hmac "${secret}"
}

#echo "${header}"
#echo "${payload}"

header_base64=$(echo "${header}" | json | base64_encode)
payload_base64=$(echo "${payload}" | json | base64_encode)

header_payload=$(echo "${header_base64}.${payload_base64}")
signature=$(echo "${header_payload}" | hmacsha256_sign | base64_encode)

echo "${header_payload}.${signature}"