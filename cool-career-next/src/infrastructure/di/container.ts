import { IQuestionRepository } from '../../application/interfaces/IQuestionRepository'
import { ISessionRepository } from '../../application/interfaces/ISessionRepository'
import { IResultRepository } from '../../application/interfaces/IResultRepository'
import { StaticQuestionRepository } from '../repositories/StaticQuestionRepository'
import { LocalStorageSessionRepository } from '../repositories/LocalStorageSessionRepository'
import { LocalStorageResultRepository } from '../repositories/LocalStorageResultRepository'
import { StartDiagnosisUseCase } from '../../application/use-cases/StartDiagnosisUseCase'
import { AnswerQuestionUseCase } from '../../application/use-cases/AnswerQuestionUseCase'
import { CalculateResultUseCase } from '../../application/use-cases/CalculateResultUseCase'
import { GetSessionUseCase } from '../../application/use-cases/GetSessionUseCase'

/**
 * 依存性注入コンテナ
 */
export class DIContainer {
  private static instance: DIContainer
  
  // リポジトリのインスタンス
  private questionRepository: IQuestionRepository
  private sessionRepository: ISessionRepository
  private resultRepository: IResultRepository
  
  // ユースケースのインスタンス
  private startDiagnosisUseCase: StartDiagnosisUseCase
  private answerQuestionUseCase: AnswerQuestionUseCase
  private calculateResultUseCase: CalculateResultUseCase
  private getSessionUseCase: GetSessionUseCase

  private constructor() {
    // リポジトリを初期化
    this.questionRepository = new StaticQuestionRepository()
    this.sessionRepository = new LocalStorageSessionRepository()
    this.resultRepository = new LocalStorageResultRepository()
    
    // ユースケースを初期化
    this.startDiagnosisUseCase = new StartDiagnosisUseCase(
      this.questionRepository,
      this.sessionRepository
    )
    
    this.answerQuestionUseCase = new AnswerQuestionUseCase(
      this.sessionRepository
    )
    
    this.calculateResultUseCase = new CalculateResultUseCase(
      this.sessionRepository,
      this.resultRepository
    )
    
    this.getSessionUseCase = new GetSessionUseCase(
      this.sessionRepository
    )
  }

  /**
   * シングルトンインスタンスを取得
   */
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }
    return DIContainer.instance
  }

  // リポジトリのゲッター
  getQuestionRepository(): IQuestionRepository {
    return this.questionRepository
  }

  getSessionRepository(): ISessionRepository {
    return this.sessionRepository
  }

  getResultRepository(): IResultRepository {
    return this.resultRepository
  }

  // ユースケースのゲッター
  getStartDiagnosisUseCase(): StartDiagnosisUseCase {
    return this.startDiagnosisUseCase
  }

  getAnswerQuestionUseCase(): AnswerQuestionUseCase {
    return this.answerQuestionUseCase
  }

  getCalculateResultUseCase(): CalculateResultUseCase {
    return this.calculateResultUseCase
  }

  getGetSessionUseCase(): GetSessionUseCase {
    return this.getSessionUseCase
  }

  /**
   * テスト用：インスタンスをリセット
   */
  static reset(): void {
    DIContainer.instance = undefined as any
  }
}

// エクスポート用のヘルパー関数
export const getContainer = () => DIContainer.getInstance()

// ユースケースの直接エクスポート
export const getStartDiagnosisUseCase = () => getContainer().getStartDiagnosisUseCase()
export const getAnswerQuestionUseCase = () => getContainer().getAnswerQuestionUseCase()
export const getCalculateResultUseCase = () => getContainer().getCalculateResultUseCase()
export const getGetSessionUseCase = () => getContainer().getGetSessionUseCase()