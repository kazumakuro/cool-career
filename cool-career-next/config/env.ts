// 環境変数の設定と検証

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません`)
  }
  return value
}

export const env = {
  // アプリケーション設定
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  
  // API設定
  API_URL: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
  
  // その他の設定（必要に応じて追加）
} as const

export type Env = typeof env