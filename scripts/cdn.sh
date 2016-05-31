#!/usr/bin/env bash
aws s3 sync $CIRCLE_ARTIFACTS s3://bogie-cdn/$CIRCLE_SHA1/
