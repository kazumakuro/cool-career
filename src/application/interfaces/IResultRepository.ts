import { DiagnosisResult } from '../../domain/value-objects/DiagnosisResult'

/**
 * 結果リポジトリインターフェース
 */
export interface IResultRepository {
  /**
   * 診断結果を保存
   */
  save(result: DiagnosisResult): Promise<void>
  
  /**
   * IDから結果を取得
   */
  findById(id: string): Promise<DiagnosisResult | null>
  
  /**
   * セッションIDから結果を取得
   */
  findBySessionId(sessionId: string): Promise<DiagnosisResult | null>
  
  /**
   * 最近の結果を取得
   */
  getRecent(limit: number): Promise<DiagnosisResult[]>
  
  /**
   * すべての結果を取得
   */
  getAll(): Promise<DiagnosisResult[]>
  
  /**
   * 結果を削除
   */
  delete(id: string): Promise<void>
}