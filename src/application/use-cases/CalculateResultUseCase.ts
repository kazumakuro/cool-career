import { DiagnosisResult } from '../../domain/value-objects/DiagnosisResult'
import { DiagnosisCalculator } from '../../domain/services/DiagnosisCalculator'
import { ISessionRepository } from '../interfaces/ISessionRepository'
import { IResultRepository } from '../interfaces/IResultRepository'

/**
 * 診断結果を計算するユースケース
 */
export class CalculateResultUseCase {
  private readonly calculator: DiagnosisCalculator

  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly resultRepository: IResultRepository
  ) {
    this.calculator = new DiagnosisCalculator()
  }

  /**
   * 診断結果を計算して保存
   * @param sessionId セッションID
   * @returns 診断結果
   */
  async execute(sessionId: string): Promise<DiagnosisResult> {
    // セッションを取得
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // セッションが完了していない場合はエラー
    if (!session.isCompleted()) {
      const progress = session.getProgress()
      throw new Error(
        `Session is not completed. Progress: ${progress.answered}/${progress.total} questions answered`
      )
    }

    // 既に結果が存在する場合は返す
    const existingResult = await this.resultRepository.findBySessionId(sessionId)
    if (existingResult) {
      return existingResult
    }

    // 結果を計算
    const result = this.calculator.calculateResult(
      sessionId,
      session.getAnswers(),
      session.questions
    )

    // 結果を保存
    await this.resultRepository.save(result)

    // セッションを削除（完了したセッションは不要）
    await this.sessionRepository.delete(sessionId)

    return result
  }

  /**
   * 結果を再計算（デバッグ用）
   * @param sessionId セッションID
   * @param force 強制的に再計算するか
   * @returns 診断結果
   */
  async recalculate(sessionId: string, force: boolean = false): Promise<DiagnosisResult> {
    // セッションを取得
    const session = await this.sessionRepository.findById(sessionId)
    
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // 既存の結果を削除（強制再計算の場合）
    if (force) {
      const existingResult = await this.resultRepository.findBySessionId(sessionId)
      if (existingResult) {
        await this.resultRepository.delete(existingResult.id)
      }
    }

    // 結果を計算
    const result = this.calculator.calculateResult(
      sessionId,
      session.getAnswers(),
      session.questions
    )

    // 結果を保存
    await this.resultRepository.save(result)

    return result
  }

  /**
   * 結果を取得
   * @param resultId 結果ID
   * @returns 診断結果
   */
  async getResult(resultId: string): Promise<DiagnosisResult | null> {
    return await this.resultRepository.findById(resultId)
  }

  /**
   * セッションIDから結果を取得
   * @param sessionId セッションID
   * @returns 診断結果
   */
  async getResultBySessionId(sessionId: string): Promise<DiagnosisResult | null> {
    return await this.resultRepository.findBySessionId(sessionId)
  }

  /**
   * 最近の結果を取得
   * @param limit 取得件数
   * @returns 診断結果のリスト
   */
  async getRecentResults(limit: number = 10): Promise<DiagnosisResult[]> {
    return await this.resultRepository.getRecent(limit)
  }

  /**
   * すべての結果を取得
   * @returns 診断結果のリスト
   */
  async getAllResults(): Promise<DiagnosisResult[]> {
    return await this.resultRepository.getAll()
  }

  /**
   * 結果を削除
   * @param resultId 結果ID
   */
  async deleteResult(resultId: string): Promise<void> {
    await this.resultRepository.delete(resultId)
  }
}