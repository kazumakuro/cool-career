import { QuestionCategory, QuestionOption } from '../types'

/**
 * 質問エンティティ
 * 診断における各質問を表現するドメインモデル
 */
export class Question {
  private constructor(
    public readonly id: string,
    public readonly text: string,
    public readonly options: QuestionOption[],
    public readonly category: QuestionCategory,
    public readonly subcategory?: string,
    public readonly weight: number = 1.0
  ) {
    Object.freeze(this) // 不変性を保証
  }

  /**
   * 質問エンティティを作成
   */
  static create(params: {
    id: string
    text: string
    options: QuestionOption[]
    category: QuestionCategory
    subcategory?: string
    weight?: number
  }): Question {
    // バリデーション
    if (!params.id || params.id.trim() === '') {
      throw new Error('Question ID is required')
    }

    if (!params.text || params.text.trim() === '') {
      throw new Error('Question text is required')
    }

    if (!params.options || params.options.length < 2) {
      throw new Error('Question must have at least 2 options')
    }

    if (params.options.length > 6) {
      throw new Error('Question cannot have more than 6 options')
    }

    // 各選択肢のバリデーション
    params.options.forEach((option, index) => {
      if (!option.value || option.value.trim() === '') {
        throw new Error(`Option ${index + 1} must have a value`)
      }
      if (!option.text || option.text.trim() === '') {
        throw new Error(`Option ${index + 1} must have text`)
      }
    })

    if (params.weight !== undefined && (params.weight < 0 || params.weight > 2)) {
      throw new Error('Weight must be between 0 and 2')
    }

    return new Question(
      params.id,
      params.text,
      params.options,
      params.category,
      params.subcategory,
      params.weight || 1.0
    )
  }

  /**
   * 質問がMBTI関連かどうか
   */
  isMBTIQuestion(): boolean {
    return this.category === 'mbti'
  }

  /**
   * 質問がキャリアDNA関連かどうか
   */
  isDNAQuestion(): boolean {
    return this.category === 'dna'
  }

  /**
   * 選択肢のインデックスから選択肢を取得
   */
  getOptionByIndex(index: number): QuestionOption | undefined {
    return this.options[index]
  }

  /**
   * 選択肢の値から選択肢を取得
   */
  getOptionByValue(value: string): QuestionOption | undefined {
    return this.options.find(option => option.value === value)
  }
}