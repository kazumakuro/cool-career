'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Target, 
  Users, 
  Sparkles,
  Download,
  Share2,
  Home,
  RefreshCw,
  Brain,
  Briefcase
} from 'lucide-react'
import { useDiagnosisStore } from '@/presentation/stores/useDiagnosisStore'

export default function ResultPage() {
  const router = useRouter()
  const { result, clearSession } = useDiagnosisStore()

  // 結果がない場合はホームに戻る
  useEffect(() => {
    if (!result) {
      router.push('/')
    }
  }, [result, router])

  const handleStartNew = () => {
    clearSession()
    router.push('/')
  }

  const handleShare = () => {
    // シェア機能の実装（後で実装）
    console.log('Share result')
  }

  const handleDownload = () => {
    // ダウンロード機能の実装（後で実装）
    console.log('Download result')
  }

  if (!result) {
    return null
  }

  const typeDescription = result.getTypeDescription()
  const mbtiTraits = `${result.mbtiType.getCategory()}として、${result.mbtiType.toString()}の特性を持っています`
  const careerTraits = `${result.careerDNA.getJapaneseName()}として${result.careerDNA.getDescription()}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4" variant="secondary">診断完了</Badge>
          <h1 className="text-4xl font-bold mb-4">
            あなたの診断結果
          </h1>
          <p className="text-gray-600">
            MBTI × Career DNA による詳細な分析結果をお届けします
          </p>
        </motion.div>

        {/* メイン結果カード */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="text-center pb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 mx-auto">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-4">
                {typeDescription.title}
              </CardTitle>
              <div className="flex justify-center gap-3 flex-wrap">
                <Badge className="px-4 py-2 text-lg" variant="default">
                  {result.mbtiType.toString()}
                </Badge>
                <Badge className="px-4 py-2 text-lg" variant="secondary">
                  {result.careerDNA.primary} DNA
                </Badge>
                {result.careerDNA.isHybrid() && (
                  <Badge className="px-4 py-2 text-lg" variant="outline">
                    × {result.careerDNA.secondary}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-lg text-gray-700 leading-relaxed">
                {typeDescription.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 詳細分析 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* MBTI詳細 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <CardTitle>MBTI性格タイプ</CardTitle>
                </div>
                <CardDescription>
                  {result.mbtiType.getCategory()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-700 mb-2">
                      {result.mbtiType.toString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mbtiTraits}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(result.mbtiType.getTraits()).map(([axis, value]) => {
                      const [left, right] = axis.split('_')
                      const percentage = value === left ? 25 : 75
                      
                      return (
                        <div key={axis} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className={value === left ? 'font-semibold' : 'text-gray-400'}>
                              {left === 'E' ? '外向型' : left === 'S' ? '感覚型' : left === 'T' ? '思考型' : '判断型'}
                            </span>
                            <span className={value === right ? 'font-semibold' : 'text-gray-400'}>
                              {right === 'I' ? '内向型' : right === 'N' ? '直感型' : right === 'F' ? '感情型' : '知覚型'}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Career DNA詳細 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <CardTitle>Career DNA</CardTitle>
                </div>
                <CardDescription>
                  あなたのキャリア価値観
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-700 mb-2">
                      {result.careerDNA.primary}
                    </p>
                    {result.careerDNA.isHybrid() && (
                      <p className="text-lg text-blue-600">
                        × {result.careerDNA.secondary}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      {careerTraits}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(result.careerDNA.scores).map(([dna, score]) => (
                      <div key={dna} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dna}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={score * 10} className="w-24 h-2" />
                          <span className="text-sm text-gray-600 w-8">{score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 信頼度スコア */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                診断の信頼度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={result.confidence * 100} className="flex-1" />
                <span className="text-2xl font-bold">
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                回答の一貫性と回答時間に基づく信頼度スコアです
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* マッチする社会人（仮） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                あなたと同じタイプの社会人
              </CardTitle>
              <CardDescription>
                同じ価値観を持つ社会人のキャリアパス例
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>この機能は現在開発中です</p>
                <p className="text-sm mt-2">
                  同じタイプの社会人のインタビューや
                  <br />
                  キャリアストーリーが表示される予定です
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* アクションボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleStartNew}
            size="lg"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            新しい診断を始める
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            結果をシェア
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDFでダウンロード
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="lg"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            ホームへ戻る
          </Button>
        </motion.div>
      </div>
    </div>
  )
}