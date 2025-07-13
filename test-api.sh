#!/bin/bash

# 色付きログ出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== 外部API連携テストスクリプト ===${NC}"

# メインAPIサーバー
MAIN_API_URL="http://localhost:3008"
# 外部APIモックサーバー
EXTERNAL_API_URL="http://localhost:4000"

echo -e "${YELLOW}1. メインAPIサーバーのヘルスチェック${NC}"
curl -s "${MAIN_API_URL}/health" | jq .
echo ""

echo -e "${YELLOW}2. 外部APIモックサーバーのヘルスチェック${NC}"
curl -s "${EXTERNAL_API_URL}/health" | jq .
echo ""

echo -e "${YELLOW}3. 日別ジャンル投稿数統計を取得${NC}"
curl -s "${MAIN_API_URL}/stats/posts-by-genre-daily" | jq .
echo ""

echo -e "${YELLOW}4. 外部APIに日別ジャンル統計データを送信${NC}"
curl -X POST "${MAIN_API_URL}/stats/send-to-external-api" \
  -H "Content-Type: application/json" \
  -s | jq .
echo ""

echo -e "${YELLOW}5. 外部APIで受信した統計データを確認${NC}"
curl -s "${EXTERNAL_API_URL}/api/v1/stats/daily-genre" | jq .
echo ""

echo -e "${YELLOW}6. 外部APIの統計サマリーを確認${NC}"
curl -s "${EXTERNAL_API_URL}/api/v1/stats/summary" | jq .
echo ""

echo -e "${GREEN}テスト完了！${NC}"
