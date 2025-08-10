import { IResultRepository } from '../../application/interfaces/IResultRepository'
import { DiagnosisResult } from '../../domain/value-objects/DiagnosisResult'
import { MBTIType } from '../../domain/value-objects/MBTIType'
import { CareerDNA } from '../../domain/value-objects/CareerDNA'
import { DNAScores } from '../../domain/types'

/**
 * LocalStorageベースの結果リポジトリ実装
 */
export class LocalStorageResultRepository implements IResultRepository {
  private readonly STORAGE_KEY = 'cool_career_results'
  private readonly MAX_RESULTS = 50 // 最大保存件数

  /**
   * 診断結果を保存
   */
  async save(result: DiagnosisResult): Promise<void> {
    const results = this.getAllResults()
    
    // 最大件数を超える場合は古いものから削除
    const resultsArray = Object.entries(results)
    if (resultsArray.length >= this.MAX_RESULTS) {
      resultsArray
        .sort(([, a], [, b]) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .slice(0, resultsArray.length - this.MAX_RESULTS + 1)
        .forEach(([id]) => delete results[id])
    }
    
    results[result.id] = this.serialize(result)
    this.saveResults(results)
  }

  /**
   * IDから結果を取得
   */
  async findById(id: string): Promise<DiagnosisResult | null> {
    const results = this.getAllResults()
    const data = results[id]
    
    if (!data) return null
    
    return this.deserialize(data)
  }

  /**
   * セッションIDから結果を取得
   */
  async findBySessionId(sessionId: string): Promise<DiagnosisResult | null> {
    const results = this.getAllResults()
    
    const entry = Object.entries(results).find(
      ([, data]) => data.sessionId === sessionId
    )
    
    if (!entry) return null
    
    return this.deserialize(entry[1])
  }

  /**
   * 最近の結果を取得
   */
  async getRecent(limit: number): Promise<DiagnosisResult[]> {
    const results = this.getAllResults()
    
    return Object.values(results)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit)
      .map(data => this.deserialize(data))
  }

  /**
   * すべての結果を取得
   */
  async getAll(): Promise<DiagnosisResult[]> {
    const results = this.getAllResults()
    
    return Object.values(results)
      .map(data => this.deserialize(data))
      .sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      )
  }

  /**
   * 結果を削除
   */
  async delete(id: string): Promise<void> {
    const results = this.getAllResults()
    delete results[id]
    this.saveResults(results)
  }

  /**
   * 結果データのシリアライズ
   */
  private serialize(result: DiagnosisResult): any {
    return {
      id: result.id,
      sessionId: result.sessionId,
      mbtiType: result.mbtiType.toString(),
      careerDNA: {
        primary: result.careerDNA.primary,
        secondary: result.careerDNA.secondary,
        scores: result.careerDNA.scores
      },
      combinedType: result.combinedType,
      confidence: result.confidence,
      createdAt: result.createdAt.toISOString()
    }
  }

  /**
   * 結果データのデシリアライズ
   */
  private deserialize(data: any): DiagnosisResult {
    const mbtiType = MBTIType.fromString(data.mbtiType)
    const careerDNA = CareerDNA.fromScores(data.careerDNA.scores as DNAScores)
    
    return DiagnosisResult.restore({
      id: data.id,
      sessionId: data.sessionId,
      mbtiType,
      careerDNA,
      combinedType: data.combinedType,
      confidence: data.confidence,
      createdAt: new Date(data.createdAt)
    })
  }

  /**
   * すべての結果を取得
   */
  private getAllResults(): Record<string, any> {
    if (typeof window === 'undefined') return {}
    
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  }

  /**
   * 結果を保存
   */
  private saveResults(results: Record<string, any>): void {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(results))
  }
}