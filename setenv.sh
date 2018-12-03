#!/bin/sh
#
#
export ACE_HOST_NAME=cRushbills.com
export ACE_HOST_IP=0.0.0.0
export ACE_HOST_HTTP_PORT=48080
# HTTP -> HTTPS
export ACE_HTTP_REDIRECT_TO=https://127.0.0.1:48443
# Logging
export ACE_WBR_LOG_LEVEL=silly
export ACE_WBR_LOG_CONSOLE=true
export ACE_WBR_LOG_FILE=true
export ACE_WBR_LOG_HTTP=true
export ACE_WBR_LOG_FILE_PATH=./logs
export ACE_WBR_LOG_MAX_SIZE=5m
export ACE_WBR_LOG_MAX_FILES=14d
#
export ACE_HOST_HTTPS_PORT=48443
export ACE_HOST_NAME=cushybills.com
