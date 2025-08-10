'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Clock, Target, Sparkles, Users } from 'lucide-react'
import { useDiagnosisStore } from '@/presentation/stores/useDiagnosisStore'

export default function HomePage() {
  const router = useRouter()
  const { startDiagnosis, loadActiveSession, session, isLoading } = useDiagnosisStore()

  useEffect(() => {
    // アクティブセッションをチェック
    loadActiveSession()
  }, [loadActiveSession])

  const handleStartQuick = async () => {
    await startDiagnosis('quick')
    router.push('/diagnosis')
  }

  const handleStartFull = async () => {
    await startDiagnosis('full')
    router.push('/diagnosis')
  }

  const handleResume = () => {
    router.push('/diagnosis')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cool Career 診断
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            あなたの価値観と性格から、理想のキャリアを見つけ出す
            <br />
            MBTI × Career DNA = 80タイプ診断システム
          </p>
        </motion.div>

        {/* 継続セッションの通知 */}
        {session && !session.isCompleted() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  未完了の診断があります
                </CardTitle>
                <CardDescription>
                  {session.type === 'quick' ? 'クイック診断' : 'フル診断'}を継続できます
                  （進捗: {session.getProgress().percentage}%）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleResume} className="w-full">
                  診断を再開する
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 診断選択カード */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* クイック診断 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Target className="h-8 w-8 text-blue-500" />
                  <Badge className="bg-blue-100 text-blue-700">おすすめ</Badge>
                </div>
                <CardTitle className="text-2xl">クイック診断</CardTitle>
                <CardDescription>まずは気軽に始めてみる</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>所要時間: 約5分</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="h-4 w-4" />
                    <span>質問数: 30問</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  基本的な性格タイプとキャリアDNAを診断します。
                  短時間であなたの傾向を把握できます。
                </p>
                <Button 
                  onClick={handleStartQuick}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  クイック診断を始める
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* フル診断 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Users className="h-8 w-8 text-purple-500" />
                  <Badge className="bg-purple-100 text-purple-700">詳細版</Badge>
                </div>
                <CardTitle className="text-2xl">フル診断</CardTitle>
                <CardDescription>より深く自己理解を深める</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>所要時間: 約15分</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="h-4 w-4" />
                    <span>質問数: 70問</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  詳細な分析により、より精度の高い診断結果を提供します。
                  500人の学生インタビューデータを基にした本格診断です。
                </p>
                <Button 
                  onClick={handleStartFull}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  フル診断を始める
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 特徴説明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">80タイプ分類</h3>
                <p className="text-sm text-gray-600">
                  MBTI 16タイプ × Career DNA 5タイプの組み合わせ
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">500人のデータ</h3>
                <p className="text-sm text-gray-600">
                  実際の学生インタビューに基づく信頼性の高い診断
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">価値観マッチング</h3>
                <p className="text-sm text-gray-600">
                  同じ価値観を持つ社会人のキャリアパスを参考に
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}