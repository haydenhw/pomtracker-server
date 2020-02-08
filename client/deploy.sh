#!/usr/bin/env bash
bucket_name=pomtracker.haydenhw.com

npm run build
aws2 s3 sync build s3://$bucket_name 
#aws2 s3 rm s3://$bucket_name --recursive
#aws2 s3 cp build  s3://$bucket_name --recursive
