import { DNAType, DNAScores } from '../types'

/**
 * キャリアDNA値オブジェクト
 * 5つのキャリアDNAタイプを表現する不変オブジェクト
 */
export class CareerDNA {
  private constructor(
    public readonly primary: DNAType,
    public readonly secondary: DNAType | undefined,
    public readonly scores: DNAScores
  ) {
    Object.freeze(this)
    Object.freeze(this.scores)
  }

  /**
   * スコアからキャリアDNAを作成
   */
  static fromScores(scores: DNAScores): CareerDNA {
    // スコアの検証
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    if (Math.abs(totalScore - 100) > 0.01) {
      // 正規化
      const normalizedScores: DNAScores = {
        Pioneer: (scores.Pioneer / totalScore) * 100,
        Builder: (scores.Builder / totalScore) * 100,
        Specialist: (scores.Specialist / totalScore) * 100,
        Connector: (scores.Connector / totalScore) * 100,
        Guardian: (scores.Guardian / totalScore) * 100
      }
      scores = normalizedScores
    }

    // スコアを降順でソート
    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
    
    const primary = sorted[0][0] as DNAType
    
    // セカンダリDNAの判定（プライマリの50%以上のスコアを持つ場合）
    const secondary = sorted[1][1] >= sorted[0][1] * 0.5 
      ? sorted[1][0] as DNAType 
      : undefined
    
    return new CareerDNA(primary, secondary, scores)
  }

  /**
   * DNAコードを取得（例: "P", "B", "S", "C", "G"）
   */
  getCode(): string {
    return this.primary.charAt(0).toUpperCase()
  }

  /**
   * フルコードを取得（セカンダリ含む、例: "P-B"）
   */
  getFullCode(): string {
    if (this.secondary) {
      return `${this.getCode()}-${this.secondary.charAt(0).toUpperCase()}`
    }
    return this.getCode()
  }

  /**
   * 日本語名を取得
   */
  getJapaneseName(): string {
    const names: Record<DNAType, string> = {
      Pioneer: '開拓者',
      Builder: '構築者',
      Specialist: '専門家',
      Connector: '連結者',
      Guardian: '守護者'
    }
    return names[this.primary]
  }

  /**
   * DNAの説明を取得
   */
  getDescription(): string {
    const descriptions: Record<DNAType, string> = {
      Pioneer: '新しい価値を創造し、未踏の領域を切り開く',
      Builder: 'システムを構築し、組織を成長させる',
      Specialist: '専門性を極め、深い知識と技術を追求する',
      Connector: '人と人をつなぎ、コミュニティを活性化させる',
      Guardian: '安定を維持し、品質と信頼を守る'
    }
    return descriptions[this.primary]
  }

  /**
   * DNAカラーを取得
   */
  getColor(): string {
    const colors: Record<DNAType, string> = {
      Pioneer: '#f59e0b',    // オレンジ
      Builder: '#3b82f6',     // ブルー
      Specialist: '#8b5cf6',  // パープル
      Connector: '#10b981',   // グリーン
      Guardian: '#6b7280'     // グレー
    }
    return colors[this.primary]
  }

  /**
   * 特定のDNAタイプのスコアを取得
   */
  getScore(type: DNAType): number {
    return this.scores[type]
  }

  /**
   * 最も強いDNAタイプ3つを取得
   */
  getTop3DNAs(): Array<{ type: DNAType; score: number }> {
    return Object.entries(this.scores)
      .map(([type, score]) => ({ type: type as DNAType, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }

  /**
   * ハイブリッドタイプかどうか（複数のDNAが拮抗している）
   */
  isHybrid(): boolean {
    return this.secondary !== undefined
  }

  /**
   * 特定のDNAタイプが優位かどうか
   */
  isDominant(type: DNAType, threshold: number = 30): boolean {
    return this.scores[type] >= threshold
  }

  /**
   * バランス型かどうか（全てのスコアが近い）
   */
  isBalanced(): boolean {
    const scoreValues = Object.values(this.scores)
    const max = Math.max(...scoreValues)
    const min = Math.min(...scoreValues)
    return (max - min) < 20
  }
}