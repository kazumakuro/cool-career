import { DiagnosisSession } from '../../domain/entities/DiagnosisSession'
import { ISessionRepository } from '../interfaces/ISessionRepository'

/**
 * 質問に回答するユースケース
 */
export class AnswerQuestionUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository
  ) {}

  /**
   * 質問に回答する
   * @param sessionId セッションID
   * @param questionId 質問ID
   * @param value 回答値
   * @param responseTime 回答時間（ミリ秒）
   * @returns 更新されたセッション
   */
  async execute(
    sessionId: string,
    questionId: string,
    value: string,
    responseTime: number
  ): Promise<DiagnosisSession> {
    // セッションを取得
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // すでに完了している場合はエラー
    if (session.isCompleted()) {
      throw new Error('Session is already completed')
    }

    // 回答を追加
    session.addAnswer(questionId, value, responseTime)

    // セッションを更新
    await this.sessionRepository.update(session)

    return session
  }

  /**
   * 前の質問に戻る
   * @param sessionId セッションID
   * @returns 更新されたセッション
   */
  async goBack(sessionId: string): Promise<DiagnosisSession> {
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // 前の質問に戻る
    session.goToPreviousQuestion()

    // セッションを更新
    await this.sessionRepository.update(session)

    return session
  }

  /**
   * 特定の質問にジャンプ
   * @param sessionId セッションID
   * @param questionIndex 質問インデックス
   * @returns 更新されたセッション
   */
  async goToQuestion(sessionId: string, questionIndex: number): Promise<DiagnosisSession> {
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // 特定の質問にジャンプ
    session.goToQuestion(questionIndex)

    // セッションを更新
    await this.sessionRepository.update(session)

    return session
  }

  /**
   * 回答をクリア
   * @param sessionId セッションID
   * @param questionId 質問ID
   * @returns 更新されたセッション
   */
  async clearAnswer(sessionId: string, questionId: string): Promise<DiagnosisSession> {
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // 回答をクリア（この機能はエンティティに追加する必要がある）
    const answers = session.getAnswers()
    const filteredAnswers = answers.filter(a => a.questionId !== questionId)
    
    // 新しいセッションを作成（回答をリセット）
    const newSession = DiagnosisSession.restore({
      id: session.id,
      type: session.type,
      questions: session.questions,
      answers: filteredAnswers,
      currentQuestionIndex: session.getCurrentIndex(),
      startedAt: session.startedAt
    })

    // セッションを更新
    await this.sessionRepository.update(newSession)

    return newSession
  }
}