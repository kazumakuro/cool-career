'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  ChevronLeft,
  Loader2
} from 'lucide-react'
import { useDiagnosisStore } from '@/presentation/stores/useDiagnosisStore'

export default function DiagnosisPage() {
  const router = useRouter()
  const {
    session,
    isLoading,
    error,
    answerQuestion,
    goToPreviousQuestion,
    calculateResult,
    startResponseTimer,
    clearError
  } = useDiagnosisStore()

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // セッションがない場合はホームに戻る
  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/')
    }
  }, [session, isLoading, router])

  // 質問が変わったらタイマーをリセット
  useEffect(() => {
    if (session && !session.isCompleted()) {
      startResponseTimer()
      setSelectedAnswer(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.getCurrentIndex()])

  // エラーハンドリング
  useEffect(() => {
    if (error) {
      console.error('Diagnosis error:', error)
      // エラーを3秒後にクリア
      const timer = setTimeout(() => clearError(), 3000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleAnswer = async (value: string) => {
    if (!session || isSubmitting) return
    
    const currentQuestion = session.getCurrentQuestion()
    if (!currentQuestion) return

    setSelectedAnswer(value)
    setIsSubmitting(true)

    try {
      await answerQuestion(currentQuestion.id, value)
      
      // 最後の質問だった場合は結果画面へ
      if (session.getProgress().answered === session.questions.length - 1) {
        await calculateResult()
        router.push('/result')
      }
    } catch (err) {
      console.error('Failed to answer question:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = async () => {
    if (!session || session.getCurrentIndex() === 0 || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await goToPreviousQuestion()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const currentQuestion = session.getCurrentQuestion()
  const progress = session.getProgress()

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">質問の読み込みに失敗しました</p>
            <Button 
              onClick={() => router.push('/')}
              className="w-full mt-4"
            >
              ホームに戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 現在の回答を取得
  const currentAnswer = session.getAnswers().find(
    a => a.questionId === currentQuestion.id
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              診断を中断
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {session.type === 'quick' ? 'クイック診断' : 'フル診断'}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  質問 {progress.answered + 1} / {progress.total}
                </span>
              </div>
            </div>
          </div>
          
          {/* プログレスバー */}
          <Progress value={progress.percentage} className="h-2" />
        </div>

        {/* エラー表示 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <p className="text-red-600 text-sm">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 質問カード */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">
                      {currentQuestion.category === 'mbti' ? 'MBTI' : 'Career DNA'}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {currentQuestion.text}
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.value)}
                      disabled={isSubmitting}
                      className={`
                        w-full p-4 text-left rounded-lg border-2 transition-all
                        ${
                          currentAnswer?.value === option.value || selectedAnswer === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <p className="font-medium">{option.text}</p>
                    </motion.button>
                  ))}
                </div>

                {/* ナビゲーションボタン */}
                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={session.getCurrentIndex() === 0 || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    前の質問
                  </Button>

                  {currentAnswer && (
                    <Button
                      onClick={() => {
                        // 次の質問へ
                        if (progress.answered < progress.total - 1) {
                          session.goToNextQuestion()
                        } else {
                          // 最後の質問の場合は結果を計算
                          calculateResult()
                          router.push('/result')
                        }
                      }}
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {progress.answered === progress.total - 1 ? '結果を見る' : '次の質問'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* 進捗インジケーター */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-1">
            {Array.from({ length: Math.min(10, progress.total) }).map((_, i) => {
              const questionIndex = Math.floor((i / 10) * progress.total)
              const isAnswered = questionIndex < progress.answered
              const isCurrent = questionIndex === session.getCurrentIndex()
              
              return (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${
                      isAnswered
                        ? 'bg-blue-600'
                        : isCurrent
                        ? 'bg-blue-400'
                        : 'bg-gray-300'
                    }
                  `}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}