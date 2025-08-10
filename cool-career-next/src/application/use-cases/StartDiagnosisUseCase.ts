import { DiagnosisSession } from '../../domain/entities/DiagnosisSession'
import { DiagnosisType } from '../../domain/types'
import { IQuestionRepository } from '../interfaces/IQuestionRepository'
import { ISessionRepository } from '../interfaces/ISessionRepository'

/**
 * 診断開始ユースケース
 */
export class StartDiagnosisUseCase {
  constructor(
    private readonly questionRepository: IQuestionRepository,
    private readonly sessionRepository: ISessionRepository
  ) {}

  /**
   * 診断を開始する
   * @param type 診断タイプ（quick/full）
   * @returns 作成されたセッション
   */
  async execute(type: DiagnosisType): Promise<DiagnosisSession> {
    // 既存のアクティブセッションをチェック
    const existingSession = await this.sessionRepository.findActive()
    if (existingSession && existingSession.type === type && !existingSession.isCompleted()) {
      // 同じタイプの未完了セッションがある場合は継続
      return existingSession
    }

    // 既存セッションがある場合は削除
    if (existingSession) {
      await this.sessionRepository.delete(existingSession.id)
    }

    // 質問を取得
    const questions = await this.questionRepository.getByType(type)
    
    if (questions.length === 0) {
      throw new Error(`No questions found for diagnosis type: ${type}`)
    }

    // 新しいセッションを作成
    const session = DiagnosisSession.create(type, questions)

    // セッションを保存
    await this.sessionRepository.save(session)

    return session
  }

  /**
   * 既存のセッションを再開する
   * @param sessionId セッションID
   * @returns セッション（見つからない場合はnull）
   */
  async resume(sessionId: string): Promise<DiagnosisSession | null> {
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      return null
    }

    // アクティブセッションとして設定
    await this.sessionRepository.save(session)
    
    return session
  }

  /**
   * アクティブなセッションを取得
   * @returns アクティブセッション（ない場合はnull）
   */
  async getActive(): Promise<DiagnosisSession | null> {
    return await this.sessionRepository.findActive()
  }
}