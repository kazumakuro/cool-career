import { DiagnosisSession } from '../../domain/entities/DiagnosisSession'
import { Question } from '../../domain/entities/Question'
import { ISessionRepository } from '../interfaces/ISessionRepository'

/**
 * セッション情報取得ユースケース
 */
export class GetSessionUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository
  ) {}

  /**
   * セッションを取得
   * @param sessionId セッションID
   * @returns セッション
   */
  async execute(sessionId: string): Promise<DiagnosisSession | null> {
    return await this.sessionRepository.findById(sessionId)
  }

  /**
   * アクティブなセッションを取得
   * @returns アクティブセッション
   */
  async getActive(): Promise<DiagnosisSession | null> {
    return await this.sessionRepository.findActive()
  }

  /**
   * セッションの進捗を取得
   * @param sessionId セッションID
   * @returns 進捗情報
   */
  async getProgress(sessionId: string): Promise<{
    total: number
    answered: number
    percentage: number
    currentQuestionIndex: number
    isCompleted: boolean
  } | null> {
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      return null
    }

    const progress = session.getProgress()
    
    return {
      total: progress.total,
      answered: progress.answered,
      percentage: progress.percentage,
      currentQuestionIndex: session.getCurrentIndex(),
      isCompleted: session.isCompleted()
    }
  }

  /**
   * 現在の質問を取得
   * @param sessionId セッションID
   * @returns 現在の質問
   */
  async getCurrentQuestion(sessionId: string): Promise<Question | null> {
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      return null
    }

    return session.getCurrentQuestion()
  }

  /**
   * セッションの要約を取得
   * @param sessionId セッションID
   * @returns セッション要約
   */
  async getSummary(sessionId: string): Promise<{
    id: string
    type: string
    startedAt: Date
    questionsCount: number
    answeredCount: number
    isCompleted: boolean
    estimatedTimeRemaining: number
  } | null> {
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      return null
    }

    const progress = session.getProgress()
    const avgTimePerQuestion = 15000 // 15秒と仮定
    const remainingQuestions = progress.total - progress.answered
    const estimatedTimeRemaining = remainingQuestions * avgTimePerQuestion

    return {
      id: session.id,
      type: session.type,
      startedAt: session.startedAt,
      questionsCount: progress.total,
      answeredCount: progress.answered,
      isCompleted: session.isCompleted(),
      estimatedTimeRemaining
    }
  }

  /**
   * 回答履歴を取得
   * @param sessionId セッションID
   * @returns 回答履歴
   */
  async getAnswerHistory(sessionId: string): Promise<Array<{
    questionId: string
    questionText: string
    answer: string
    answeredAt: Date
    responseTime: number
  }> | null> {
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      return null
    }

    const answers = session.getAnswers()
    const history = answers.map(answer => {
      const question = session.questions.find(q => q.id === answer.questionId)
      const selectedOption = question?.options.find(opt => opt.value === answer.value)
      
      return {
        questionId: answer.questionId,
        questionText: question?.text || '',
        answer: selectedOption?.text || answer.value,
        answeredAt: answer.answeredAt,
        responseTime: answer.responseTime
      }
    })

    return history
  }

  /**
   * セッションを削除
   * @param sessionId セッションID
   */
  async delete(sessionId: string): Promise<void> {
    await this.sessionRepository.delete(sessionId)
  }

  /**
   * 期限切れセッションをクリーンアップ
   */
  async cleanupExpired(): Promise<void> {
    await this.sessionRepository.deleteExpired()
  }
}