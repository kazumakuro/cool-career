import { DiagnosisSession } from '../../domain/entities/DiagnosisSession'

/**
 * セッションリポジトリインターフェース
 */
export interface ISessionRepository {
  /**
   * セッションを保存
   */
  save(session: DiagnosisSession): Promise<void>
  
  /**
   * セッションを更新
   */
  update(session: DiagnosisSession): Promise<void>
  
  /**
   * IDからセッションを取得
   */
  findById(id: string): Promise<DiagnosisSession | null>
  
  /**
   * アクティブなセッションを取得
   */
  findActive(): Promise<DiagnosisSession | null>
  
  /**
   * セッションを削除
   */
  delete(id: string): Promise<void>
  
  /**
   * 期限切れのセッションを削除
   */
  deleteExpired(): Promise<void>
}