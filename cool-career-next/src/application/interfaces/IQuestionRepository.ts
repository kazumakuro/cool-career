import { Question } from '../../domain/entities/Question'
import { DiagnosisType } from '../../domain/types'

/**
 * 質問リポジトリインターフェース
 */
export interface IQuestionRepository {
  /**
   * 診断タイプに応じた質問リストを取得
   */
  getQuestions(type: DiagnosisType): Promise<Question[]>
  
  /**
   * IDから質問を取得
   */
  findById(id: string): Promise<Question | null>
  
  /**
   * すべての質問を取得
   */
  getAllQuestions(): Promise<Question[]>
}