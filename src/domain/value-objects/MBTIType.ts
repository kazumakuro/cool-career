import { MBTIScores } from '../types'

/**
 * MBTIタイプ値オブジェクト
 * 16種類のMBTIタイプを表現する不変オブジェクト
 */
export class MBTIType {
  private static readonly VALID_TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ]

  private constructor(
    private readonly value: string
  ) {
    Object.freeze(this)
  }

  /**
   * スコアからMBTIタイプを作成
   */
  static fromScores(scores: MBTIScores): MBTIType {
    const type = 
      (scores.E_I > 0 ? 'E' : 'I') +
      (scores.S_N > 0 ? 'S' : 'N') +
      (scores.T_F > 0 ? 'T' : 'F') +
      (scores.J_P > 0 ? 'J' : 'P')
    
    return new MBTIType(type)
  }

  /**
   * 文字列からMBTIタイプを作成
   */
  static fromString(type: string): MBTIType {
    const upperType = type.toUpperCase()
    
    if (!this.VALID_TYPES.includes(upperType)) {
      throw new Error(`Invalid MBTI type: ${type}`)
    }

    return new MBTIType(upperType)
  }

  /**
   * 文字列表現を取得
   */
  toString(): string {
    return this.value
  }

  /**
   * 他のMBTIタイプと等しいかどうか
   */
  equals(other: MBTIType): boolean {
    return this.value === other.value
  }

  /**
   * 各軸の傾向を取得
   */
  getTraits(): {
    energy: 'E' | 'I'
    information: 'S' | 'N'
    decision: 'T' | 'F'
    lifestyle: 'J' | 'P'
  } {
    return {
      energy: this.value[0] as 'E' | 'I',
      information: this.value[1] as 'S' | 'N',
      decision: this.value[2] as 'T' | 'F',
      lifestyle: this.value[3] as 'J' | 'P'
    }
  }

  /**
   * 外向的かどうか
   */
  isExtraverted(): boolean {
    return this.value[0] === 'E'
  }

  /**
   * 内向的かどうか
   */
  isIntroverted(): boolean {
    return this.value[0] === 'I'
  }

  /**
   * 感覚型かどうか
   */
  isSensing(): boolean {
    return this.value[1] === 'S'
  }

  /**
   * 直観型かどうか
   */
  isIntuitive(): boolean {
    return this.value[1] === 'N'
  }

  /**
   * 思考型かどうか
   */
  isThinking(): boolean {
    return this.value[2] === 'T'
  }

  /**
   * 感情型かどうか
   */
  isFeeling(): boolean {
    return this.value[2] === 'F'
  }

  /**
   * 判断型かどうか
   */
  isJudging(): boolean {
    return this.value[3] === 'J'
  }

  /**
   * 知覚型かどうか
   */
  isPerceiving(): boolean {
    return this.value[3] === 'P'
  }

  /**
   * タイプのカテゴリを取得
   */
  getCategory(): string {
    const nt = this.isIntuitive() && this.isThinking()
    const nf = this.isIntuitive() && this.isFeeling()
    const sj = this.isSensing() && this.isJudging()
    const sp = this.isSensing() && this.isPerceiving()

    if (nt) return '分析家'
    if (nf) return '外交官'
    if (sj) return '番人'
    if (sp) return '探検家'
    
    return '不明'
  }
}