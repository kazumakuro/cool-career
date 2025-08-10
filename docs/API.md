# Cool Career API設計書

## 概要
Cool CareerのRESTful API設計書です。Next.js API RoutesとSupabaseを使用し、型安全性とパフォーマンスを重視した設計となっています。

## API設計原則

### 基本原則
- RESTfulな設計
- JSONでのリクエスト/レスポンス
- 適切なHTTPステータスコードの使用
- エラーレスポンスの統一
- ページネーション対応
- レート制限の実装

### 認証
- Supabase Authを使用したJWT認証
- Bearerトークンによる認証
- 公開APIと認証必須APIの明確な区別

## 共通仕様

### リクエストヘッダー
```
Content-Type: application/json
Authorization: Bearer {jwt_token}  // 認証必須APIのみ
X-Request-ID: {uuid}  // オプション：リクエスト追跡用
```

### レスポンス形式

#### 成功時
```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "meta": {
    "timestamp": "2025-07-29T10:00:00Z",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### エラー時
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "メールアドレスの形式が正しくありません",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "meta": {
    "timestamp": "2025-07-29T10:00:00Z",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### エラーコード
| コード | 説明 | HTTPステータス |
|--------|------|---------------|
| UNAUTHORIZED | 認証が必要です | 401 |
| FORBIDDEN | アクセス権限がありません | 403 |
| NOT_FOUND | リソースが見つかりません | 404 |
| VALIDATION_ERROR | 入力値が不正です | 400 |
| RATE_LIMIT_EXCEEDED | レート制限を超過しました | 429 |
| INTERNAL_ERROR | サーバーエラー | 500 |

## APIエンドポイント一覧

### 1. 診断関連API

#### POST /api/diagnosis/start
診断セッションの開始

**認証**: オプション（ゲストも可）

**リクエスト**
```json
{
  "user_info": {
    "age_group": "20s_early",
    "occupation": "student",
    "interests": ["tech", "creative"]
  }
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "expires_at": "2025-07-29T11:00:00Z",
    "questions": [
      {
        "id": 1,
        "text": "金曜日の夜、あなたは？",
        "options": [
          {"id": "a", "text": "友達と飲みに行く"},
          {"id": "b", "text": "家でゆっくり過ごす"}
        ],
        "category": "extraversion"
      }
      // ... 最初の10問
    ]
  }
}
```

#### POST /api/diagnosis/answer
診断の回答送信

**認証**: オプション

**リクエスト**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "answers": [
    {"question_id": 1, "answer": "a"},
    {"question_id": 2, "answer": "b"}
  ]
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "progress": 20,  // 進捗率（%）
    "next_questions": [
      // 次の10問
    ],
    "is_complete": false
  }
}
```

#### GET /api/diagnosis/result/{result_id}
診断結果の取得

**認証**: 結果の所有者のみ必須

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "mbti_type": "INTJ",
    "type_name": "戦略的な建築家",
    "description": "独創的な思考を持ち、計画を実行に移す決意を持った人物です。",
    "strengths": ["論理的思考", "戦略的計画", "独立性"],
    "weaknesses": ["感情表現", "柔軟性", "協調性"],
    "risk_score": 65,
    "risk_factors": {
      "overtime_resistance": 20,
      "rejection_ability": 15,
      "perfectionism": 85
    },
    "recommended_jobs": [
      {
        "title": "データサイエンティスト",
        "match_score": 95,
        "reasons": ["論理的思考力を活かせる", "独立して働ける", "継続的な学習が可能"]
      }
    ],
    "avoid_environments": [
      "過度に協調性を求められる環境",
      "ルーティンワークが中心の職場"
    ],
    "share_url": "https://coolcareer.jp/result/550e8400",
    "created_at": "2025-07-29T10:00:00Z"
  }
}
```

### 2. 哲学データベースAPI

#### GET /api/philosophies
哲学コンテンツ一覧の取得

**認証**: 不要

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| mbti_type | string | No | MBTIタイプでフィルター |
| age_group | string | No | 年代でフィルター |
| job_category | string | No | 職種でフィルター |
| tags | string[] | No | タグでフィルター（複数可） |
| sort | string | No | ソート順（latest/popular/relevant） |
| page | number | No | ページ番号（デフォルト: 1） |
| limit | number | No | 1ページの件数（デフォルト: 20、最大: 100） |

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "失敗から学んだ起業の道",
        "contributor": {
          "nickname": "起業家T",
          "mbti_type": "ENTP",
          "age_group": "30s"
        },
        "content_type": "video",
        "duration": 180,
        "thumbnail_url": "https://...",
        "summary": "3度の起業失敗を経て、4度目で成功。失敗は成長の糧だと学びました。",
        "tags": ["起業", "失敗", "成長", "ENTP"],
        "likes_count": 245,
        "views_count": 3420,
        "created_at": "2025-07-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8
    }
  }
}
```

#### GET /api/philosophies/{id}
哲学コンテンツの詳細取得

**認証**: 不要

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "失敗から学んだ起業の道",
    "contributor": {
      "id": "contributor-uuid",
      "nickname": "起業家T",
      "mbti_type": "ENTP",
      "age_group": "30s",
      "job_category": "経営者"
    },
    "content_type": "video",
    "content_url": "https://...",
    "transcript": "私が最初に起業したのは25歳の時でした...",
    "metadata": {
      "duration": 180,
      "career_changes": 3,
      "key_message": "失敗を恐れずチャレンジすることの大切さ"
    },
    "tags": ["起業", "失敗", "成長", "ENTP"],
    "likes_count": 245,
    "views_count": 3421,
    "user_liked": false,
    "user_saved": false,
    "related_philosophies": [
      // 関連する哲学コンテンツ3件
    ]
  }
}
```

#### POST /api/philosophies/{id}/like
哲学コンテンツへのいいね

**認証**: 必須

**レスポンス**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likes_count": 246
  }
}
```

#### DELETE /api/philosophies/{id}/like
いいねの取り消し

**認証**: 必須

### 3. キャリアビジョンAPI

#### POST /api/vision
キャリアビジョンの作成

**認証**: 必須

**リクエスト**
```json
{
  "title": "技術で社会に貢献するINTJの道",
  "statement": "私は技術を通じて社会課題を解決し、人々の生活を豊かにすることを目指します。",
  "action_guidelines": [
    {
      "guideline": "最新技術を常に学び続ける",
      "description": "週に10時間は新しい技術の学習に充てる"
    }
  ],
  "inspired_philosophies": [
    "123e4567-e89b-12d3-a456-426614174000"
  ],
  "goals": {
    "short_term": ["AWS認定資格の取得"],
    "mid_term": ["テックリードとして活躍"],
    "long_term": ["社会課題を解決するサービスの立ち上げ"]
  }
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "vision-uuid",
    "created_at": "2025-07-29T10:00:00Z",
    "share_url": "https://coolcareer.jp/vision/vision-uuid"
  }
}
```

#### GET /api/vision/{id}
キャリアビジョンの取得

**認証**: 公開設定の場合は不要、非公開は所有者のみ

#### PUT /api/vision/{id}
キャリアビジョンの更新

**認証**: 所有者のみ

#### GET /api/vision/{id}/pdf
キャリアビジョンのPDF生成

**認証**: 所有者のみ

**レスポンス**
```json
{
  "success": true,
  "data": {
    "pdf_url": "https://...",
    "expires_at": "2025-07-29T11:00:00Z"
  }
}
```

### 4. ユーザー関連API

#### GET /api/user/profile
ユーザープロフィールの取得

**認証**: 必須

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "profile": {
      "nickname": "キャリア太郎",
      "age_group": "20s_late",
      "occupation": "working",
      "industry": "IT",
      "avatar_url": "https://..."
    },
    "stats": {
      "diagnosis_count": 5,
      "last_diagnosis_at": "2025-07-20T10:00:00Z",
      "saved_philosophies": 12,
      "vision_count": 2
    }
  }
}
```

#### PUT /api/user/profile
プロフィールの更新

**認証**: 必須

**リクエスト**
```json
{
  "profile": {
    "nickname": "新しいニックネーム",
    "age_group": "30s",
    "occupation": "working",
    "industry": "金融"
  }
}
```

#### GET /api/user/history
アクティビティ履歴の取得

**認証**: 必須

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| type | string | No | アクティビティタイプでフィルター |
| from | datetime | No | 開始日時 |
| to | datetime | No | 終了日時 |
| page | number | No | ページ番号 |

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "activity-uuid",
        "action_type": "diagnosis_complete",
        "target": {
          "type": "diagnosis",
          "id": "diagnosis-uuid",
          "title": "INTJ - 戦略的な建築家"
        },
        "created_at": "2025-07-29T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

### 5. 統計・分析API

#### GET /api/stats/diagnosis
診断統計の取得

**認証**: 不要

**レスポンス**
```json
{
  "success": true,
  "data": {
    "total_diagnoses": 125430,
    "mbti_distribution": {
      "INTJ": 8.2,
      "ENTP": 6.5,
      // ... 全16タイプ
    },
    "average_risk_score": 52.3,
    "popular_jobs": [
      {"title": "エンジニア", "percentage": 23.5},
      {"title": "デザイナー", "percentage": 15.2}
    ],
    "updated_at": "2025-07-29T09:00:00Z"
  }
}
```

## WebSocket API（将来実装）

### リアルタイム通知
```javascript
// 接続
const ws = new WebSocket('wss://api.coolcareer.jp/ws');

// 認証
ws.send(JSON.stringify({
  type: 'auth',
  token: 'jwt_token'
}));

// イベント受信
ws.on('message', (data) => {
  const event = JSON.parse(data);
  switch(event.type) {
    case 'philosophy_liked':
      // あなたの投稿にいいねがつきました
      break;
    case 'new_philosophy':
      // 新しい哲学が投稿されました
      break;
  }
});
```

## レート制限

### 制限値
| エンドポイント | 制限 | 期間 |
|---------------|------|------|
| 診断開始 | 10回 | 1時間 |
| 診断結果取得 | 100回 | 1時間 |
| 哲学一覧 | 200回 | 1時間 |
| いいね | 50回 | 1分 |
| その他 | 1000回 | 1時間 |

### レート制限ヘッダー
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1627814400
```

## セキュリティ

### CORS設定
```javascript
// next.config.js
const allowedOrigins = [
  'https://coolcareer.jp',
  'https://www.coolcareer.jp',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000'
].filter(Boolean);
```

### 入力検証
- すべての入力値はZodでバリデーション
- SQLインジェクション対策（Supabaseのプリペアドステートメント）
- XSS対策（React/Next.jsの自動エスケープ）

### 認証・認可
- JWT有効期限: 24時間
- リフレッシュトークン: 7日間
- セッション管理: Supabase Auth

## API実装例

### Next.js API Route
```typescript
// app/api/diagnosis/start/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const requestSchema = z.object({
  user_info: z.object({
    age_group: z.enum(['10s', '20s_early', '20s_late', '30s', '40s', '50s_plus']).optional(),
    occupation: z.enum(['student', 'working', 'job_hunting', 'other']).optional(),
    interests: z.array(z.string()).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = requestSchema.parse(body)
    
    const supabase = createClient()
    
    // セッション作成
    const sessionId = crypto.randomUUID()
    const questions = getInitialQuestions()
    
    // レスポンス
    return NextResponse.json({
      success: true,
      data: {
        session_id: sessionId,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        questions
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: crypto.randomUUID()
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '入力値が不正です',
          details: error.errors
        }
      }, { status: 400 })
    }
    
    // その他のエラー処理
  }
}
```

## テスト

### APIテストの例
```typescript
// __tests__/api/diagnosis.test.ts
describe('Diagnosis API', () => {
  it('should start diagnosis session', async () => {
    const response = await fetch('/api/diagnosis/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_info: { age_group: '20s_early' }
      })
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.session_id).toBeDefined()
    expect(data.data.questions).toHaveLength(10)
  })
})
```

## ドキュメント生成

OpenAPI（Swagger）仕様書の自動生成を検討中。