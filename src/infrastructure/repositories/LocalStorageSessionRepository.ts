import { ISessionRepository } from '../../application/interfaces/ISessionRepository'
import { DiagnosisSession } from '../../domain/entities/DiagnosisSession'
import { Question } from '../../domain/entities/Question'
import { Answer } from '../../domain/entities/Answer'
import { DiagnosisType } from '../../domain/types'

/**
 * LocalStorageベースのセッションリポジトリ実装
 */
export class LocalStorageSessionRepository implements ISessionRepository {
  private readonly STORAGE_KEY = 'cool_career_sessions'
  private readonly ACTIVE_SESSION_KEY = 'cool_career_active_session'
  private readonly SESSION_TTL = 24 * 60 * 60 * 1000 // 24時間

  /**
   * セッションを保存
   */
  async save(session: DiagnosisSession): Promise<void> {
    const sessions = this.getAllSessions()
    sessions[session.id] = this.serialize(session)
    this.saveSessions(sessions)
    
    // アクティブセッションとして記録
    this.setActiveSessionId(session.id)
  }

  /**
   * セッションを更新
   */
  async update(session: DiagnosisSession): Promise<void> {
    await this.save(session)
  }

  /**
   * IDからセッションを取得
   */
  async findById(id: string): Promise<DiagnosisSession | null> {
    const sessions = this.getAllSessions()
    const data = sessions[id]
    
    if (!data) return null
    
    // 期限切れチェック
    if (this.isExpired(data.startedAt)) {
      await this.delete(id)
      return null
    }
    
    return this.deserialize(data)
  }

  /**
   * アクティブなセッションを取得
   */
  async findActive(): Promise<DiagnosisSession | null> {
    const activeId = this.getActiveSessionId()
    if (!activeId) return null
    
    return this.findById(activeId)
  }

  /**
   * セッションを削除
   */
  async delete(id: string): Promise<void> {
    const sessions = this.getAllSessions()
    delete sessions[id]
    this.saveSessions(sessions)
    
    // アクティブセッションの場合はクリア
    if (this.getActiveSessionId() === id) {
      this.clearActiveSessionId()
    }
  }

  /**
   * 期限切れのセッションを削除
   */
  async deleteExpired(): Promise<void> {
    const sessions = this.getAllSessions()
    const now = Date.now()
    
    Object.keys(sessions).forEach(id => {
      if (this.isExpired(sessions[id].startedAt)) {
        delete sessions[id]
      }
    })
    
    this.saveSessions(sessions)
  }

  /**
   * セッションデータのシリアライズ
   */
  private serialize(session: DiagnosisSession): any {
    return {
      id: session.id,
      type: session.type,
      startedAt: session.startedAt.toISOString(),
      questions: session.questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
        category: q.category,
        subcategory: q.subcategory,
        weight: q.weight
      })),
      answers: session.getAnswers().map(a => ({
        questionId: a.questionId,
        value: a.value,
        answeredAt: a.answeredAt.toISOString(),
        responseTime: a.responseTime
      })),
      currentQuestionIndex: session.getCurrentIndex()
    }
  }

  /**
   * セッションデータのデシリアライズ
   */
  private deserialize(data: any): DiagnosisSession {
    // 質問を復元
    const questions = data.questions.map((q: any) => 
      Question.create({
        id: q.id,
        text: q.text,
        options: q.options,
        category: q.category,
        subcategory: q.subcategory,
        weight: q.weight
      })
    )

    // 回答を復元
    const answers = data.answers.map((a: any) =>
      Answer.create({
        questionId: a.questionId,
        value: a.value,
        answeredAt: new Date(a.answeredAt),
        responseTime: a.responseTime
      })
    )

    // セッションを復元
    return DiagnosisSession.restore({
      id: data.id,
      type: data.type as DiagnosisType,
      questions,
      answers,
      currentQuestionIndex: data.currentQuestionIndex,
      startedAt: new Date(data.startedAt)
    })
  }

  /**
   * すべてのセッションを取得
   */
  private getAllSessions(): Record<string, any> {
    if (typeof window === 'undefined') return {}
    
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  }

  /**
   * セッションを保存
   */
  private saveSessions(sessions: Record<string, any>): void {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions))
  }

  /**
   * アクティブセッションIDを取得
   */
  private getActiveSessionId(): string | null {
    if (typeof window === 'undefined') return null
    
    return localStorage.getItem(this.ACTIVE_SESSION_KEY)
  }

  /**
   * アクティブセッションIDを設定
   */
  private setActiveSessionId(id: string): void {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.ACTIVE_SESSION_KEY, id)
  }

  /**
   * アクティブセッションIDをクリア
   */
  private clearActiveSessionId(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.ACTIVE_SESSION_KEY)
  }

  /**
   * セッションが期限切れかどうか
   */
  private isExpired(startedAt: string | Date): boolean {
    const started = typeof startedAt === 'string' 
      ? new Date(startedAt).getTime() 
      : startedAt.getTime()
    
    return Date.now() - started > this.SESSION_TTL
  }
}