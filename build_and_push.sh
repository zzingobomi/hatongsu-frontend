#!/bin/bash
set -e

# -- 인자 확인 및 할당 --
if [[ $# -lt 2 ]]; then
  echo "Usage: $0 DOCKER_USERNAME DOCKER_PASSWORD"
  exit 1
fi

DOCKER_USERNAME="$1"
DOCKER_PASSWORD="$2"

echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin
echo "Docker Hub 로그인 성공!"

# -- 타임스탬프 생성 --
# UTC 기준 타임스탬프를 생성합니다.
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%S")
echo "생성된 타임스탬프: $TIMESTAMP"

# -- Docker 이미지 빌드 및 푸시 --
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t zzingo5/hatongsu-front:$TIMESTAMP \
  -f ./Dockerfile \
  --push .

echo "이미지 빌드 및 푸시 완료!"
