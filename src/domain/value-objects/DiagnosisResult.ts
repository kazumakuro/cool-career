import { nanoid } from 'nanoid'
import { MBTIType } from './MBTIType'
import { CareerDNA } from './CareerDNA'
import { TypeDescription } from '../types'

/**
 * 診断結果値オブジェクト
 * 診断の最終結果を表現する不変オブジェクト
 */
export class DiagnosisResult {
  private constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly mbtiType: MBTIType,
    public readonly careerDNA: CareerDNA,
    public readonly combinedType: string,
    public readonly confidence: number,
    public readonly createdAt: Date
  ) {
    Object.freeze(this)
  }

  /**
   * 診断結果を作成
   */
  static create(params: {
    sessionId: string
    mbtiType: MBTIType
    careerDNA: CareerDNA
    confidence: number
  }): DiagnosisResult {
    // 信頼度の検証
    if (params.confidence < 0 || params.confidence > 100) {
      throw new Error('Confidence must be between 0 and 100')
    }

    const combinedType = `${params.mbtiType.toString()}-${params.careerDNA.getCode()}`
    
    return new DiagnosisResult(
      nanoid(),
      params.sessionId,
      params.mbtiType,
      params.careerDNA,
      combinedType,
      params.confidence,
      new Date()
    )
  }

  /**
   * 既存の結果を復元
   */
  static restore(params: {
    id: string
    sessionId: string
    mbtiType: MBTIType
    careerDNA: CareerDNA
    combinedType: string
    confidence: number
    createdAt: Date
  }): DiagnosisResult {
    return new DiagnosisResult(
      params.id,
      params.sessionId,
      params.mbtiType,
      params.careerDNA,
      params.combinedType,
      params.confidence,
      params.createdAt
    )
  }

  /**
   * タイプの説明を取得（暫定的な実装）
   */
  getTypeDescription(): TypeDescription {
    // 実際のアプリケーションでは、外部のデータソースから取得
    return {
      type: this.combinedType,
      title: this.generateTitle(),
      description: this.generateDescription(),
      strengths: this.generateStrengths(),
      challenges: this.generateChallenges(),
      careers: this.generateCareers(),
      workStyle: this.generateWorkStyle()
    }
  }

  /**
   * タイトルを生成
   */
  private generateTitle(): string {
    const mbtiTitles: Record<string, string> = {
      'INTJ': '戦略家',
      'INTP': '論理学者',
      'ENTJ': '指揮官',
      'ENTP': '討論者',
      'INFJ': '提唱者',
      'INFP': '仲介者',
      'ENFJ': '主人公',
      'ENFP': '広報運動家',
      'ISTJ': '管理者',
      'ISFJ': '擁護者',
      'ESTJ': '幹部',
      'ESFJ': '領事',
      'ISTP': '巨匠',
      'ISFP': '冒険家',
      'ESTP': '起業家',
      'ESFP': 'エンターテイナー'
    }

    const dnaAdjectives: Record<string, string> = {
      'Pioneer': '革新的な',
      'Builder': '構築的な',
      'Specialist': '専門的な',
      'Connector': '協調的な',
      'Guardian': '堅実な'
    }

    const mbtiTitle = mbtiTitles[this.mbtiType.toString()] || '探求者'
    const dnaAdjective = dnaAdjectives[this.careerDNA.primary] || '独自の'

    return `${dnaAdjective}${mbtiTitle}`
  }

  /**
   * 説明文を生成
   */
  private generateDescription(): string {
    const mbtiDesc = `${this.mbtiType.toString()}タイプとして、${this.getMBTICharacteristics()}を持ち、`
    const dnaDesc = `${this.careerDNA.getJapaneseName()}として${this.careerDNA.getDescription()}傾向があります。`
    
    return mbtiDesc + dnaDesc
  }

  /**
   * MBTIの特徴を取得
   */
  private getMBTICharacteristics(): string {
    const traits = this.mbtiType.getTraits()
    const characteristics = []

    if (traits.energy === 'E') {
      characteristics.push('外向的でエネルギッシュな性格')
    } else {
      characteristics.push('内省的で思慮深い性格')
    }

    if (traits.information === 'S') {
      characteristics.push('現実的で実践的な思考')
    } else {
      characteristics.push('創造的で概念的な思考')
    }

    return characteristics.join('と')
  }

  /**
   * 強みを生成
   */
  private generateStrengths(): string[] {
    const strengths: string[] = []

    // MBTIベースの強み
    if (this.mbtiType.isThinking()) {
      strengths.push('論理的な問題解決能力')
    } else {
      strengths.push('優れた対人関係スキル')
    }

    if (this.mbtiType.isJudging()) {
      strengths.push('計画的で組織的な実行力')
    } else {
      strengths.push('柔軟で適応力のある対応力')
    }

    // DNAベースの強み
    switch (this.careerDNA.primary) {
      case 'Pioneer':
        strengths.push('革新的なアイデアの創出')
        break
      case 'Builder':
        strengths.push('組織やシステムの構築力')
        break
      case 'Specialist':
        strengths.push('深い専門知識と技術力')
        break
      case 'Connector':
        strengths.push('人を結びつけるネットワーク力')
        break
      case 'Guardian':
        strengths.push('安定性と信頼性の維持')
        break
    }

    return strengths
  }

  /**
   * 課題を生成
   */
  private generateChallenges(): string[] {
    const challenges: string[] = []

    // MBTIベースの課題
    if (this.mbtiType.isIntroverted()) {
      challenges.push('大勢の前でのプレゼンテーション')
    }

    if (this.mbtiType.isPerceiving()) {
      challenges.push('締切の厳守や時間管理')
    }

    // DNAベースの課題
    if (this.careerDNA.primary === 'Pioneer') {
      challenges.push('既存のルールや慣習への適応')
    } else if (this.careerDNA.primary === 'Guardian') {
      challenges.push('急激な変化への対応')
    }

    return challenges
  }

  /**
   * 推奨キャリアを生成
   */
  private generateCareers(): string[] {
    const careers: string[] = []

    // DNAベースのキャリア
    switch (this.careerDNA.primary) {
      case 'Pioneer':
        careers.push('起業家', 'イノベーター', '研究開発')
        break
      case 'Builder':
        careers.push('プロジェクトマネージャー', '事業開発', 'コンサルタント')
        break
      case 'Specialist':
        careers.push('エンジニア', '研究者', '専門職')
        break
      case 'Connector':
        careers.push('人事', '営業', 'マーケティング')
        break
      case 'Guardian':
        careers.push('財務', '品質管理', '公務員')
        break
    }

    return careers
  }

  /**
   * 働き方スタイルを生成
   */
  private generateWorkStyle(): string {
    const introvertedStyle = this.mbtiType.isIntroverted() 
      ? '集中できる環境で深く考える時間を大切にし、' 
      : 'チームでの活発な議論やコラボレーションを通じて、'

    const dnaStyle = `${this.careerDNA.getJapaneseName()}として${this.careerDNA.getDescription()}ことで最高のパフォーマンスを発揮します。`

    return introvertedStyle + dnaStyle
  }

  /**
   * 信頼度レベルを取得
   */
  getConfidenceLevel(): 'high' | 'medium' | 'low' {
    if (this.confidence >= 80) return 'high'
    if (this.confidence >= 60) return 'medium'
    return 'low'
  }

  /**
   * 結果のサマリーを取得
   */
  getSummary(): string {
    return `あなたは${this.combinedType}タイプです。${this.getTypeDescription().title}として、${this.careerDNA.getDescription()}特性を持っています。`
  }
}