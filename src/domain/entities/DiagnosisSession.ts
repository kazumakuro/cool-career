import { DiagnosisType } from '../types'
import { Question } from './Question'
import { Answer } from './Answer'
import { nanoid } from 'nanoid'

/**
 * 診断セッションエンティティ
 * 一連の診断プロセスを管理するドメインモデル
 */
export class DiagnosisSession {
  private answers: Answer[] = []
  private currentQuestionIndex: number = 0
  public readonly startedAt: Date

  constructor(
    public readonly id: string,
    public readonly type: DiagnosisType,
    public readonly questions: Question[],
    startedAt?: Date
  ) {
    this.startedAt = startedAt || new Date()
  }

  /**
   * 新しい診断セッションを作成
   */
  static create(type: DiagnosisType, questions: Question[]): DiagnosisSession {
    if (!questions || questions.length === 0) {
      throw new Error('Questions are required for diagnosis session')
    }

    // 質問数のバリデーションを緩和（フル診断はまだ開発中のため）
    const minQuestionCount = type === 'quick' ? 30 : 5  // フル診断は最低5問から
    if (questions.length < minQuestionCount) {
      throw new Error(
        `Invalid question count for ${type} diagnosis. Expected at least ${minQuestionCount}, got ${questions.length}`
      )
    }

    return new DiagnosisSession(nanoid(), type, questions)
  }

  /**
   * 既存のセッションを復元
   */
  static restore(params: {
    id: string
    type: DiagnosisType
    questions: Question[]
    answers: Answer[]
    currentQuestionIndex: number
    startedAt: Date
  }): DiagnosisSession {
    const session = new DiagnosisSession(
      params.id,
      params.type,
      params.questions,
      params.startedAt
    )
    session.answers = params.answers
    session.currentQuestionIndex = params.currentQuestionIndex
    return session
  }

  /**
   * 質問に回答を追加
   */
  addAnswer(questionId: string, value: string, responseTime: number): void {
    const question = this.questions.find(q => q.id === questionId)
    if (!question) {
      throw new Error(`Question with ID ${questionId} not found in session`)
    }

    // 既に回答済みの質問かチェック
    const existingAnswerIndex = this.answers.findIndex(a => a.questionId === questionId)
    
    const answer = Answer.create({
      questionId,
      value,
      responseTime
    })

    if (existingAnswerIndex >= 0) {
      // 既存の回答を更新
      this.answers[existingAnswerIndex] = answer
    } else {
      // 新しい回答を追加
      this.answers.push(answer)
    }

    // 次の質問へ進む
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++
    }
  }

  /**
   * 現在の質問を取得
   */
  getCurrentQuestion(): Question | undefined {
    return this.questions[this.currentQuestionIndex]
  }

  /**
   * 前の質問に戻る
   */
  goToPreviousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--
    }
  }

  /**
   * 次の質問に進む
   */
  goToNextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++
    }
  }

  /**
   * 特定の質問に移動
   */
  goToQuestion(index: number): void {
    if (index < 0 || index >= this.questions.length) {
      throw new Error('Invalid question index')
    }
    this.currentQuestionIndex = index
  }

  /**
   * 進捗情報を取得
   */
  getProgress(): { total: number; answered: number; percentage: number } {
    const answered = this.answers.length
    const total = this.questions.length
    const percentage = Math.round((answered / total) * 100)
    
    return { total, answered, percentage }
  }

  /**
   * 診断が完了しているかどうか
   */
  isCompleted(): boolean {
    return this.answers.length === this.questions.length
  }

  /**
   * 旧メソッド（後方互換性のため）
   * @deprecated Use isCompleted() instead
   */
  isComplete(): boolean {
    return this.isCompleted()
  }

  /**
   * 回答を取得（読み取り専用）
   */
  getAnswers(): ReadonlyArray<Answer> {
    return [...this.answers]
  }

  /**
   * 特定の質問への回答を取得
   */
  getAnswerForQuestion(questionId: string): Answer | undefined {
    return this.answers.find(a => a.questionId === questionId)
  }

  /**
   * 経過時間を取得（ミリ秒）
   */
  getElapsedTime(): number {
    return Date.now() - this.startedAt.getTime()
  }

  /**
   * セッションの信頼度スコアを計算
   */
  getReliabilityScore(): number {
    if (this.answers.length === 0) return 0

    const totalScore = this.answers.reduce(
      (sum, answer) => sum + answer.getReliabilityScore(),
      0
    )
    return totalScore / this.answers.length
  }

  /**
   * 現在の質問インデックス
   */
  getCurrentIndex(): number {
    return this.currentQuestionIndex
  }

  /**
   * 総質問数
   */
  getTotalQuestions(): number {
    return this.questions.length
  }
}