/**
 * 回答エンティティ
 * ユーザーの各質問への回答を表現するドメインモデル
 */
export class Answer {
  private constructor(
    public readonly questionId: string,
    public readonly value: string,
    public readonly answeredAt: Date,
    public readonly responseTime: number // ミリ秒単位
  ) {
    Object.freeze(this) // 不変性を保証
  }

  /**
   * 回答エンティティを作成
   */
  static create(params: {
    questionId: string
    value: string
    responseTime: number
    answeredAt?: Date
  }): Answer {
    // バリデーション
    if (!params.questionId || params.questionId.trim() === '') {
      throw new Error('Question ID is required for answer')
    }

    if (!params.value || params.value.trim() === '') {
      throw new Error('Answer value is required')
    }

    if (params.responseTime < 0) {
      throw new Error('Response time cannot be negative')
    }

    // 回答時間が異常に長い場合（30分以上）は警告
    if (params.responseTime > 30 * 60 * 1000) {
      console.warn(`Response time is unusually long: ${params.responseTime}ms`)
    }

    return new Answer(
      params.questionId,
      params.value,
      params.answeredAt || new Date(),
      params.responseTime
    )
  }

  /**
   * 回答が即座に行われたかどうか（1秒未満）
   */
  isInstantAnswer(): boolean {
    return this.responseTime < 1000
  }

  /**
   * 回答に時間がかかったかどうか（20秒以上）
   */
  isSlowAnswer(): boolean {
    return this.responseTime >= 20000
  }

  /**
   * 理想的な回答時間かどうか（3-10秒）
   */
  isIdealResponseTime(): boolean {
    return this.responseTime >= 3000 && this.responseTime <= 10000
  }

  /**
   * 回答の信頼度スコアを計算（0-1）
   */
  getReliabilityScore(): number {
    if (this.isInstantAnswer()) {
      return 0.7 // 即答は信頼度を下げる
    }
    if (this.isIdealResponseTime()) {
      return 1.0 // 理想的な時間は信頼度最大
    }
    if (this.isSlowAnswer()) {
      return 0.85 // 考えすぎも若干信頼度を下げる
    }
    return 0.9
  }
}