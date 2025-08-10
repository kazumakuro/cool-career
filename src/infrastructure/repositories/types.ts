/**
 * リポジトリ層の型定義
 */

import { DNAScores } from '../../domain/types'

/**
 * シリアライズされた診断結果
 */
export interface SerializedDiagnosisResult {
  id: string
  sessionId: string
  mbtiType: string
  careerDNA: {
    primary: string
    secondary: string | null
    scores: DNAScores
  }
  combinedType: string
  confidence: number
  createdAt: string
}

/**
 * シリアライズされたセッション
 */
export interface SerializedSession {
  id: string
  type: string
  startedAt: string
  questions: Array<{
    id: string
    text: string
    options: Array<{
      value: string
      text: string
      score: number
      mbtiAxis?: string
      dna?: string
    }>
    category: string
    subcategory: string
    weight: number
  }>
  answers: Array<{
    questionId: string
    value: string
    answeredAt: string
    responseTime: number
  }>
  currentQuestionIndex: number
}