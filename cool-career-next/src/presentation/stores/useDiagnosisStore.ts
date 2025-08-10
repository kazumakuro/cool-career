import { create } from 'zustand'
import { DiagnosisSession } from '../../domain/entities/DiagnosisSession'
import { DiagnosisResult } from '../../domain/value-objects/DiagnosisResult'
import { DiagnosisType } from '../../domain/types'
import {
  getStartDiagnosisUseCase,
  getAnswerQuestionUseCase,
  getCalculateResultUseCase,
  getGetSessionUseCase
} from '../../infrastructure/di/container'

interface DiagnosisState {
  // 状態
  session: DiagnosisSession | null
  result: DiagnosisResult | null
  isLoading: boolean
  error: string | null
  responseStartTime: number | null

  // アクション
  startDiagnosis: (type: DiagnosisType) => Promise<void>
  resumeDiagnosis: (sessionId: string) => Promise<void>
  loadActiveSession: () => Promise<void>
  answerQuestion: (questionId: string, value: string) => Promise<void>
  goToPreviousQuestion: () => Promise<void>
  goToQuestion: (index: number) => Promise<void>
  calculateResult: () => Promise<void>
  clearSession: () => Promise<void>
  clearError: () => void
  startResponseTimer: () => void
  getResponseTime: () => number
}

/**
 * 診断ストア
 */
export const useDiagnosisStore = create<DiagnosisState>((set, get) => ({
  // 初期状態
  session: null,
  result: null,
  isLoading: false,
  error: null,
  responseStartTime: null,

  /**
   * 診断を開始
   */
  startDiagnosis: async (type: DiagnosisType) => {
    set({ isLoading: true, error: null })
    
    try {
      const useCase = getStartDiagnosisUseCase()
      const session = await useCase.execute(type)
      
      set({ 
        session, 
        result: null,
        isLoading: false,
        responseStartTime: Date.now()
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '診断の開始に失敗しました',
        isLoading: false 
      })
    }
  },

  /**
   * 診断を再開
   */
  resumeDiagnosis: async (sessionId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const useCase = getStartDiagnosisUseCase()
      const session = await useCase.resume(sessionId)
      
      if (!session) {
        throw new Error('セッションが見つかりません')
      }
      
      set({ 
        session,
        result: null,
        isLoading: false,
        responseStartTime: Date.now()
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '診断の再開に失敗しました',
        isLoading: false 
      })
    }
  },

  /**
   * アクティブセッションを読み込み
   */
  loadActiveSession: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const useCase = getGetSessionUseCase()
      const session = await useCase.getActive()
      
      set({ 
        session,
        isLoading: false,
        responseStartTime: session ? Date.now() : null
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'セッションの読み込みに失敗しました',
        isLoading: false 
      })
    }
  },

  /**
   * 質問に回答
   */
  answerQuestion: async (questionId: string, value: string) => {
    const { session, responseStartTime } = get()
    
    if (!session) {
      set({ error: 'セッションが開始されていません' })
      return
    }
    
    set({ isLoading: true, error: null })
    
    try {
      const responseTime = responseStartTime 
        ? Date.now() - responseStartTime 
        : 0
      
      const useCase = getAnswerQuestionUseCase()
      const updatedSession = await useCase.execute(
        session.id,
        questionId,
        value,
        responseTime
      )
      
      set({ 
        session: updatedSession,
        isLoading: false,
        responseStartTime: Date.now() // 次の質問のタイマーを開始
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '回答の保存に失敗しました',
        isLoading: false 
      })
    }
  },

  /**
   * 前の質問に戻る
   */
  goToPreviousQuestion: async () => {
    const { session } = get()
    
    if (!session) {
      set({ error: 'セッションが開始されていません' })
      return
    }
    
    set({ isLoading: true, error: null })
    
    try {
      const useCase = getAnswerQuestionUseCase()
      const updatedSession = await useCase.goBack(session.id)
      
      set({ 
        session: updatedSession,
        isLoading: false,
        responseStartTime: Date.now()
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '前の質問に戻れませんでした',
        isLoading: false 
      })
    }
  },

  /**
   * 特定の質問に移動
   */
  goToQuestion: async (index: number) => {
    const { session } = get()
    
    if (!session) {
      set({ error: 'セッションが開始されていません' })
      return
    }
    
    set({ isLoading: true, error: null })
    
    try {
      const useCase = getAnswerQuestionUseCase()
      const updatedSession = await useCase.goToQuestion(session.id, index)
      
      set({ 
        session: updatedSession,
        isLoading: false,
        responseStartTime: Date.now()
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '質問への移動に失敗しました',
        isLoading: false 
      })
    }
  },

  /**
   * 結果を計算
   */
  calculateResult: async () => {
    const { session } = get()
    
    if (!session) {
      set({ error: 'セッションが開始されていません' })
      return
    }
    
    set({ isLoading: true, error: null })
    
    try {
      const useCase = getCalculateResultUseCase()
      const result = await useCase.execute(session.id)
      
      set({ 
        result,
        session: null, // セッションは削除される
        isLoading: false,
        responseStartTime: null
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '結果の計算に失敗しました',
        isLoading: false 
      })
    }
  },

  /**
   * セッションをクリア
   */
  clearSession: async () => {
    const { session } = get()
    
    if (session) {
      try {
        const useCase = getGetSessionUseCase()
        await useCase.delete(session.id)
      } catch (error) {
        console.error('Failed to delete session:', error)
      }
    }
    
    set({ 
      session: null,
      result: null,
      error: null,
      responseStartTime: null
    })
  },

  /**
   * エラーをクリア
   */
  clearError: () => {
    set({ error: null })
  },

  /**
   * 回答タイマーを開始
   */
  startResponseTimer: () => {
    set({ responseStartTime: Date.now() })
  },

  /**
   * 回答時間を取得
   */
  getResponseTime: () => {
    const { responseStartTime } = get()
    return responseStartTime ? Date.now() - responseStartTime : 0
  }
}))